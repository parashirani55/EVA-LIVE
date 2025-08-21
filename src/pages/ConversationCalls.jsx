import React, { useEffect, useState } from "react";
import axios from "axios";
import ConversationTranscript from "../components/ConversationTranscript";

export default function ConversationCalls() {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    fetchCalls();
    const interval = setInterval(fetchCalls, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  async function fetchCalls() {
    const res = await axios.get("/twilio/calls"); // you already have GET calls
    // Filter only those that came from /conversation routes
    setCalls(res.data || []);
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Conversational Calls</h2>
      {calls.map((call) => (
        <div key={call.id} className="mb-6 border p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg">
            {call.customer || call.phone} – {call.status}
          </h3>
          <p className="text-sm text-gray-500">Started: {call.started_at}</p>
          <ConversationTranscript transcript={call.transcript} />
        </div>
      ))}
    </div>
  );
}
