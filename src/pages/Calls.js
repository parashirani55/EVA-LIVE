import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, X, Phone, Activity } from 'lucide-react';

function Calls() {
    const [calls, setCalls] = useState([]); // past call history
    const [liveCalls, setLiveCalls] = useState([]); // ongoing calls
    const [selectedCall, setSelectedCall] = useState(null);

    // Fetch call history
    const fetchCallHistory = async () => {
        try {
            const res = await fetch('/api/call-history');
            const data = await res.json();
            setCalls(data);
        } catch (err) {
            console.error('Error fetching call history', err);
        }
    };

    // Fetch live calls
    const fetchLiveCalls = async () => {
        try {
            const res = await fetch('/api/active-calls');
            const data = await res.json();
            setLiveCalls(data);
        } catch (err) {
            console.error('Error fetching live calls', err);
        }
    };

    // Fetch both on mount
    useEffect(() => {
        fetchCallHistory();
        fetchLiveCalls();
        const interval = setInterval(fetchLiveCalls, 5000); // update live calls every 5s
        return () => clearInterval(interval);
    }, []);

    // Map Twilio status → UI config
    const getStatusConfig = (status) => {
        switch (status) {
            case 'queued':
            case 'ringing':
                return { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock };
            case 'in-progress':
                return { bg: 'bg-blue-100', text: 'text-blue-700', icon: Activity };
            case 'completed' || 'Answered':
                return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle };
            case 'failed':
            case 'busy':
            case 'no-answer':
                return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle };
            default:
                return { bg: 'bg-slate-100', text: 'text-slate-700', icon: Clock };
        }
    };

    // Format duration as mm:ss
    const formatDuration = (seconds) => {
        if (!seconds || seconds <= 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Live elapsed time (mm:ss)
    const getElapsedTime = (startTime) => {
        const seconds = Math.floor((Date.now() - new Date(startTime)) / 1000);
        return formatDuration(seconds);
    };

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Call Logs & Live Monitor</h1>
                    <p className="text-slate-600 mt-1">View past calls and monitor active calls in real-time</p>
                </div>
                {/* <button
                    onClick={() => { fetchCallHistory(); fetchLiveCalls(); }}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    Refresh
                </button> */}
            </div>

            {/* Live Calls Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Active Calls</h2>
                {liveCalls.length === 0 ? (
                    <p className="text-slate-500">No active calls right now</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {liveCalls.map((call) => {
                            const { bg, text, icon: StatusIcon } = getStatusConfig(call.status);
                            return (
                                <div key={call.id} className={`p-4 rounded-2xl border ${bg} ${text}`}>
                                    <div className="flex justify-between mb-2">
                                        <div>
                                            <p className="font-semibold">{call.customer}</p>
                                            <p className="text-sm">{call.phone}</p>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <StatusIcon className="w-4 h-4" />
                                            <span className="text-xs">{call.status}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm">Campaign: {call.campaign}</p>
                                    <p className="text-sm">Duration: {getElapsedTime(call.started_at)}</p>
                                    <p className="text-sm italic mt-2">AI Message: "{call.ai_message}"</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Past Calls Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">Call History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Customer</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Phone</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Time</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Duration</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {calls.map((call) => {
                                const { bg, text, icon: StatusIcon } = getStatusConfig(call.status);
                                return (
                                    <tr key={call.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{call.customer}</td>
                                        <td className="px-6 py-4 text-slate-600">{call.phone}</td>
                                        <td className="px-6 py-4 text-slate-600">{new Date(call.started_at).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-slate-600">{formatDuration(call.duration)}</td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                <span>{call.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedCall(call)}
                                                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transcript Modal */}
            {selectedCall && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Call Transcript</h2>
                                <p className="text-slate-600 mt-1">
                                    {selectedCall.customer} • {new Date(selectedCall.started_at).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedCall(null)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6 max-h-96 overflow-y-auto">
                            {selectedCall.transcript ? (
                                (() => {
                                    let transcriptArray;
                                    try { transcriptArray = JSON.parse(selectedCall.transcript); } 
                                    catch { transcriptArray = []; }
                                    return transcriptArray.length > 0 ? (
                                        <div className="space-y-4">
                                            {transcriptArray.map((line, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex ${line.from === 'AI' ? 'justify-start' : 'justify-end'}`}
                                                >
                                                    <div
                                                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                                                            line.from === 'AI'
                                                                ? 'bg-blue-100 text-blue-900'
                                                                : 'bg-slate-100 text-slate-900'
                                                        }`}
                                                    >
                                                        <div className="text-xs font-medium mb-1 opacity-70">
                                                            {line.from}
                                                        </div>
                                                        <div className="text-sm">{line.text}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Phone className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-500">No transcript available for this call</p>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Phone className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500">No transcript available for this call</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calls;
