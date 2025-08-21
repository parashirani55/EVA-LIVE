// src/pages/ConversationTester.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ConversationTranscript from "../components/ConversationTranscript";

const API_BASE =  "http://localhost:5000";

export default function ConversationTester() {
  const [phone, setPhone] = useState("");
  const [script, setScript] = useState("Hello, this is Eva. How are you?");
  const [customer, setCustomer] = useState("");
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Poll transcript if we have an active call
  useEffect(() => {
    if (!call?.sid) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE}/calls/${call.sid}`);
        setCall((prev) => ({ ...prev, transcript: res.data.transcript || [] }));
      } catch (err) {
        console.error("Transcript poll error:", err);
      }
    }, 4000); // poll every 4s

    return () => clearInterval(interval);
  }, [call?.sid]);

  async function startCall(e) {
    e.preventDefault();
    setLoading(true);
    setCall(null);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/conversation/start`, {
        phone,
        script,
        customer,
        campaign: null,
      });
      setCall({ sid: res.data.sid, transcript: [] });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📞 Test Conversational Call</h2>

      <form onSubmit={startCall} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Customer Name</label>
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="John Doe"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Script</label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={3}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Calling..." : "Start Call"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-3">⚠️ {error}</p>}

      {call && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Transcript (Live)</h3>
          <ConversationTranscript transcript={call.transcript} />
          <p className="text-gray-500 text-sm mt-2">
            Call SID: {call.sid} <br />
            (Auto-refreshing transcript every 4s)
          </p>
        </div>
      )}
    </div>
  );
}
