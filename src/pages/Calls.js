import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye, X, Phone } from 'lucide-react';

const mockCalls = [
    {
        id: 1,
        customer: 'Alice Johnson',
        phone: '+1 555-123-4567',
        time: '2025-08-05 10:15 AM',
        duration: '2m 34s',
        status: 'Answered',
        transcript: [
            { from: 'AI', text: 'Hi Alice, this is an automated call about your service.' },
            { from: 'Alice', text: "Okay, I'm listening." },
            { from: 'AI', text: 'Would you like to renew your plan today?' },
        ],
    },
    {
        id: 2,
        customer: 'Bob Smith',
        phone: '+1 555-987-6543',
        time: '2025-08-05 10:22 AM',
        duration: '0m 00s',
        status: 'No Answer',
        transcript: [],
    },
    {
        id: 3,
        customer: 'Carol White',
        phone: '+1 555-456-7890',
        time: '2025-08-05 10:30 AM',
        duration: '4m 12s',
        status: 'Answered',
        transcript: [
            { from: 'AI', text: "Hello Carol, I'm calling regarding your recent inquiry." },
            { from: 'Carol', text: "Yes, I'm interested in learning more." },
        ],
    },
];

function Calls() {
    const [selectedCall, setSelectedCall] = useState(null);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Answered':
                return { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle };
            case 'No Answer':
                return { color: 'bg-amber-100 text-amber-700', icon: Clock };
            case 'Failed':
                return { color: 'bg-red-100 text-red-700', icon: XCircle };
            default:
                return { color: 'bg-slate-100 text-slate-700', icon: Clock };
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Call Logs</h1>
                    <p className="text-slate-600 mt-1">View and analyze your call history</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                        Export
                    </button>
                </div>
            </div>

            {/* Calls Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
                            {mockCalls.map((call) => {
                                const { color, icon: StatusIcon } = getStatusConfig(call.status);
                                return (
                                    <tr key={call.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{call.customer}</td>
                                        <td className="px-6 py-4 text-slate-600">{call.phone}</td>
                                        <td className="px-6 py-4 text-slate-600">{call.time}</td>
                                        <td className="px-6 py-4 text-slate-600">{call.duration}</td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${color}`}>
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
                                    {selectedCall.customer} • {selectedCall.time}
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
                            {selectedCall.transcript.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedCall.transcript.map((line, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${line.from === 'AI' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${line.from === 'AI'
                                                        ? 'bg-blue-100 text-blue-900'
                                                        : 'bg-slate-100 text-slate-900'
                                                    }`}
                                            >
                                                <div className="text-xs font-medium mb-1 opacity-70">{line.from}</div>
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
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calls;
