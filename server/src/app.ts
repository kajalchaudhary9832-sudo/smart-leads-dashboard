 import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import leadRoutes from "./routes/leadRoutes";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Leads API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
export default app;