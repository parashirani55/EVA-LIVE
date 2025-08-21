import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ConversationCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    const res = await axios.get("/api/campaigns"); // same table, no change
    setCampaigns(res.data);
  }

  async function startBulk(id) {
    setLoading(true);
    try {
      const res = await axios.post(`/conversationCampaign/${id}/call-bulk`);
      alert("Bulk conversational calls started!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error starting bulk calls");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Conversational Campaigns</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Script</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id}>
              <td className="p-2 border">{c.id}</td>
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.script}</td>
              <td className="p-2 border">
                <button
                  onClick={() => startBulk(c.id)}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {loading ? "Calling..." : "Start Bulk Calls"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
