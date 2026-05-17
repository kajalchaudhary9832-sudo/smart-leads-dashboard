 import { Request, Response } from "express";
import Lead from "../models/Lead";
import { AuthRequest } from "../middleware/authMiddleware";

export const createLead = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      assignedTo: req.user?.id
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Failed to create lead", error });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const { status, source, search, sort = "latest", page = "1" } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (source) query.source = source;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const limit = 10;
    const currentPage = Number(page);
    const skip = (currentPage - 1) * limit;

    const sortOrder = sort === "oldest" ? 1 : -1;

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email role")
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalLeads = await Lead.countDocuments(query);

    res.status(200).json({
      leads,
      pagination: {
        totalLeads,
        currentPage,
        totalPages: Math.ceil(totalLeads / limit),
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leads", error });
  }
};

export const getSingleLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "assignedTo",
      "name email role"
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lead", error });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Failed to update lead", error });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete lead", error });
  }
};
