import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [severity, setSeverity] = useState("");
  const [tactic, setTactic] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  //   get role from token
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : {};
  const isAdmin = decoded.role === "admin";

  const fetchAlerts = async () => {
    try {
      const res = await API.get("/alerts", {
        params: {
          severity,
          tactic,
          q: search
        }
      });
      setAlerts(res.data.data || res.data); // supports both paginated and plain array
    } catch (err) {
      if (err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;
    await API.delete(`/alerts/${id}`);
    fetchAlerts();
    toast.success("Alert deleted!");
  };

  useEffect(() => {
    fetchAlerts();
  }, [severity, tactic, search]);

  return (
    <Layout>
    <div className="min-h-screen bg-gray-900 text-white p-4">
{/* APP NAME and LOGOUT BUTTON          */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Alert Dashboard</h1>
            <button
                onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
                Logout
            </button>
        </div>

{/* GENERATE RANDOM ALERT BUTTON */}

        <button
            onClick={async () => {
                try {
                await API.post("/alerts/generate");
                toast.success("Random alert generated");
                fetchAlerts(); // Refresh list
                } catch (err) {
                toast.error("Failed to generate alert");
                }
            }}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
            Generate Random Alert
        </button>
        

{/* ADD NEW ALERT BUTTON and FORM */}
        <div className="mb-6">
            <button
                onClick={() => setShowForm((prev) => !prev)}
                className="mb-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
                {showForm ? "Cancel" : "Add New Alert"}
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showForm ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="bg-gray-800 p-4 rounded mt-2">
                <h2 className="text-xl font-semibold mb-2">Create New Alert</h2>
                <form
                    onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target;
                    const alert = {
                        type: form.type.value,
                        message: form.message.value,
                        severity: form.severity.value,
                        tactic: form.tactic.value,
                    };
                    try {
                        await API.post("/alerts", alert);
                        form.reset();
                        setShowForm(false);
                        fetchAlerts();
                        toast.success("Alert created");
                    } catch (err) {
                        toast.error("Failed to create alert");
                    }
                    }}
                    className="flex flex-col gap-2"
                >
                    <input name="type" required placeholder="Type" className="p-2 rounded bg-gray-700" />
                    <input name="message" required placeholder="Message" className="p-2 rounded bg-gray-700" />
                    <select name="severity" required className="p-2 rounded bg-gray-700">
                    <option value="">Select Severity</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                    </select>
                    <select name="tactic" className="p-2 rounded bg-gray-700">
                    <option value="">Optional: MITRE Tactic</option>
                    <option value="Initial Access">Initial Access</option>
                    <option value="Persistence">Persistence</option>
                    <option value="Privilege Escalation">Privilege Escalation</option>
                    <option value="Exfiltration">Exfiltration</option>
                    </select>
                    <button type="submit" className="bg-blue-600 p-2 rounded hover:bg-blue-700">
                    Submit
                    </button>
                </form>
                </div>
            </div>
        </div>


        <div className="flex flex-wrap gap-4 mb-4 items-center">
            <input
                type="text"
                placeholder="Search by message"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 bg-gray-700 rounded w-60"
            />
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="p-2 bg-gray-800 rounded">
                <option value="">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
            </select>
            <select value={tactic} onChange={(e) => setTactic(e.target.value)} className="p-2 bg-gray-800 rounded">
                <option value="">All Tactics</option>
                <option value="Initial Access">Initial Access</option>
                <option value="Persistence">Persistence</option>
                <option value="Privilege Escalation">Privilege Escalation</option>
                <option value="Exfiltration">Exfiltration</option>
            </select>
            <button
                onClick={() => {
                setSeverity("");
                setTactic("");
                setSearch("");
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
                Reset Filters
            </button>
        </div>


      {loading ? (
        <p>Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p>No alerts found.</p>
      ) : (
        <table className="w-full bg-gray-800 rounded">
          <thead>
            <tr className="text-left bg-gray-700">
              <th className="p-2">Type</th>
              <th className="p-2">Message</th>
              <th className="p-2">Severity</th>
              <th className="p-2">Tactic</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-t border-gray-700">
                <td className="p-2">{alert.type}</td>
                <td className="p-2">{alert.message}</td>
                <td className="p-2"><span className={`px-2 py-1 rounded text-sm font-medium
                        ${
                        alert.severity === "Critical" ? "bg-red-600" :
                        alert.severity === "High" ? "bg-orange-500" :
                        alert.severity === "Medium" ? "bg-yellow-500 text-black" :
                        "bg-green-600"
                        }`}>
                        {alert.severity}
                    </span></td>
                <td className="p-2">{alert.tactic ? (
                        <span className="px-2 py-1 bg-gray-700 rounded text-sm">{alert.tactic}</span>
                        ) : "-"}</td>
                <td className="p-2">
                {isAdmin && (
                    <button
                        onClick={() => handleDelete(alert.id)}
                        className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </Layout>
  );
};

export default Dashboard;
