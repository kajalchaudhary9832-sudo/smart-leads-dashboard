 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

type Lead = {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
};

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("New");
  const [source, setSource] = useState("Website");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchLeads = async () => {
    const res = await API.get(
      `/leads?search=${search}&status=${filterStatus}&source=${filterSource}&sort=${sort}&page=${page}`
    );

    setLeads(res.data.leads || []);
    setTotalPages(res.data.pagination?.totalPages || 1);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchLeads();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, filterStatus, filterSource, sort, page]);

  const addLead = async (e: React.FormEvent) => {
    e.preventDefault();

    await API.post("/leads", { name, email, status, source });

    setName("");
    setEmail("");
    setStatus("New");
    setSource("Website");
    fetchLeads();
  };

  const deleteLead = async (id: string) => {
    await API.delete(`/leads/${id}`);
    fetchLeads();
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await API.put(`/leads/${id}`, { status: newStatus });
    fetchLeads();
  };

  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Status", "Source"],
      ...leads.map((lead) => [lead.name, lead.email, lead.status, lead.source]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-cyan-400 mb-10">Smart Leads</h2>

        <nav className="space-y-3">
          <div className="bg-cyan-500/20 text-cyan-300 p-3 rounded-xl">
            Dashboard
          </div>
          <div className="text-gray-400 p-3 rounded-xl hover:bg-gray-800">
            Leads
          </div>
          <div className="text-gray-400 p-3 rounded-xl hover:bg-gray-800">
            Analytics
          </div>
          <div className="text-gray-400 p-3 rounded-xl hover:bg-gray-800">
            Settings
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-x-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400">
              Smart Leads Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Manage leads, filters, search and sales status.
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-bold"
          >
            Logout
          </button>
        </div>

        <form
          onSubmit={addLead}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 grid md:grid-cols-5 gap-4"
        >
          <input
            required
            className="bg-gray-800 p-3 rounded-xl outline-none"
            placeholder="Lead Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            required
            type="email"
            className="bg-gray-800 p-3 rounded-xl outline-none"
            placeholder="Lead Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="bg-gray-800 p-3 rounded-xl outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Lost</option>
          </select>

          <select
            className="bg-gray-800 p-3 rounded-xl outline-none"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option>Website</option>
            <option>Instagram</option>
            <option>Referral</option>
          </select>

          <button className="bg-cyan-500 hover:bg-cyan-600 rounded-xl font-bold">
            Add Lead
          </button>
        </form>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400">Total Leads</p>
            <h2 className="text-3xl font-bold">{leads.length}</h2>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400">New</p>
            <h2 className="text-3xl font-bold text-yellow-400">
              {leads.filter((l) => l.status === "New").length}
            </h2>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400">Qualified</p>
            <h2 className="text-3xl font-bold text-green-400">
              {leads.filter((l) => l.status === "Qualified").length}
            </h2>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400">Lost</p>
            <h2 className="text-3xl font-bold text-red-400">
              {leads.filter((l) => l.status === "Lost").length}
            </h2>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 grid md:grid-cols-5 gap-4">
          <input
            className="bg-gray-800 p-3 rounded-xl outline-none"
            placeholder="Search name/email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="bg-gray-800 p-3 rounded-xl outline-none"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Lost</option>
          </select>

          <select
            className="bg-gray-800 p-3 rounded-xl outline-none"
            value={filterSource}
            onChange={(e) => {
              setFilterSource(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Sources</option>
            <option>Website</option>
            <option>Instagram</option>
            <option>Referral</option>
          </select>

          <select
            className="bg-gray-800 p-3 rounded-xl outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>

          <button
            onClick={exportCSV}
            className="bg-green-500 hover:bg-green-600 rounded-xl font-bold"
          >
            Export CSV
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Source</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td className="p-6 text-gray-400" colSpan={5}>
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="border-t border-gray-800">
                    <td className="p-4">{lead.name}</td>
                    <td className="p-4 text-gray-400">{lead.email}</td>

                    <td className="p-4">
                      <select
                        className="bg-gray-800 p-2 rounded-lg"
                        value={lead.status}
                        onChange={(e) =>
                          updateStatus(lead._id, e.target.value)
                        }
                      >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Qualified</option>
                        <option>Lost</option>
                      </select>
                    </td>

                    <td className="p-4">{lead.source}</td>

                    <td className="p-4">
                      <button
                        onClick={() => deleteLead(lead._id)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-gray-800 disabled:opacity-40 px-4 py-2 rounded-lg"
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-gray-800 disabled:opacity-40 px-4 py-2 rounded-lg"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;