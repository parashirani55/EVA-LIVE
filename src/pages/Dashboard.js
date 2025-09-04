import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Phone, Clock, CheckCircle, XCircle } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [callData, setCallData] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = { Phone, Clock, CheckCircle, XCircle };

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard-stats`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data = await res.json();
        console.log("API Response:", data);

        // If backend sends { stats: [], callData: [] }
        if (data.stats && Array.isArray(data.stats)) {
          setStats(data.stats);
          setCallData(data.callData && data.callData.length > 0
            ? data.callData
            : getDummyChartData());
        }
        // If backend sends just an array of stats
        else if (Array.isArray(data)) {
          setStats(data);
          setCallData(getDummyChartData());
        }
        else {
          console.warn("Unexpected API format:", data);
          setStats([]);
          setCallData(getDummyChartData());
        }

      } catch (error) {
        console.error("Error fetching dashboard:", error);
        setStats([]);
        setCallData(getDummyChartData());
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  // Fallback dummy chart
  const getDummyChartData = () => ([
    { name: "Mon", calls: 80 },
    { name: "Tue", calls: 110 },
    { name: "Wed", calls: 95 },
    { name: "Thu", calls: 130 },
    { name: "Fri", calls: 120 },
    { name: "Sat", calls: 90 },
    { name: "Sun", calls: 70 }
  ]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!stats.length) return <p className="p-6">No data found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Eva Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.icon] || Phone;
          return (
            <div key={index} className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color || "from-blue-500 to-blue-600"} text-white`}>
                  <Icon size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
                  <p className={`text-sm ${stat.change?.includes("+") ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      {callData.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Call Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={callData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
