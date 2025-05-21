import { Link, useNavigate } from "react-router-dom";
import { LogOut, AlertCircle, LayoutDashboard, BarChart } from "lucide-react";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen text-white bg-gray-900">
      <aside className="w-64 bg-gray-800 p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">SecTrack</h1>
        <nav className="space-y-2">
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-green-400">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/alerts" className="flex items-center gap-2 hover:text-green-400">
            <AlertCircle size={18} /> Alerts
          </Link>
          <Link to="/metrics" className="flex items-center gap-2 hover:text-green-400">
            <BarChart size={18} /> Metrics
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-500 mt-10"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Layout;
