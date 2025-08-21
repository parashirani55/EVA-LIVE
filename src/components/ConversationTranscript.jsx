import React from "react";

export default function ConversationTranscript({ transcript }) {
  if (!transcript || transcript.length === 0) {
    return <p className="text-gray-400">No conversation yet.</p>;
  }

  return (
    <div className="space-y-2 p-3 border rounded-md bg-gray-50 max-h-96 overflow-y-auto">
      {transcript.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.from === "User" ? "justify-start" : "justify-end"
          }`}
        >
          <span
            className={`px-3 py-2 rounded-lg text-sm ${
              msg.from === "User"
                ? "bg-blue-100 text-blue-900"
                : "bg-green-100 text-green-900"
            }`}
          >
            <strong>{msg.from}:</strong> {msg.text}
          </span>
        </div>
      ))}
    </div>
  );
}
