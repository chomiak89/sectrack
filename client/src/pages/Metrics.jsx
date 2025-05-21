import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const COLORS = ["#f87171", "#facc15", "#4ade80", "#60a5fa", "#a78bfa", "#f472b6"];

const Metrics = () => {
  const [data, setData] = useState({ bySeverity: [], byTactic: [] });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await API.get("/alerts/metrics");
        const bySeverity = res.data.bySeverity.map((item) => ({
          ...item,
          count: parseInt(item.count)
        }));
        const byTactic = res.data.byTactic.map((item) => ({
          ...item,
          count: parseInt(item.count)
        }));
        setData({ bySeverity, byTactic });
      } catch (err) {
        toast.error("Failed to load metrics");
      }
    };

    fetchMetrics();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Alert Metrics</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Alerts by Severity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.bySeverity}>
              <XAxis dataKey="severity" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Alerts by MITRE Tactic</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.byTactic}
                dataKey="count"
                nameKey="tactic"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.byTactic.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default Metrics;
