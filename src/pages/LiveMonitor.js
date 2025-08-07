import React, { useEffect, useState } from 'react';
import { Phone, Clock, User, MessageSquare, Activity, PhoneCall, Headphones, Volume2 } from 'lucide-react';

const initialLiveCalls = [
    {
        id: 1,
        customer: 'Samantha Rose',
        phone: '+1 555-111-2233',
        startedAt: new Date(),
        aiMessage: 'Hi Samantha, this is Royal Aire AI calling about your plan renewal.',
        status: 'Speaking',
        campaign: 'Q3 Renewal Campaign',
    },
    {
        id: 2,
        customer: 'Marcus Lin',
        phone: '+1 555-444-8899',
        startedAt: new Date(Date.now() - 180000), // 3 minutes ago
        aiMessage: 'Hello Marcus, I\'d like to check in on your recent service experience.',
        status: 'Listening',
        campaign: 'Customer Feedback',
    },
];

function LiveMonitor() {
    const [liveCalls, setLiveCalls] = useState(initialLiveCalls);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTick((t) => t + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getElapsedTime = (startTime) => {
        const now = new Date();
        const seconds = Math.floor((now - new Date(startTime)) / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Speaking':
                return {
                    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                    icon: Volume2,
                    pulse: true
                };
            case 'Listening':
                return {
                    color: 'bg-blue-100 text-blue-700 border-blue-200',
                    icon: Headphones,
                    pulse: false
                };
            default:
                return {
                    color: 'bg-slate-100 text-slate-700 border-slate-200',
                    icon: Phone,
                    pulse: false
                };
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Live Call Monitoring</h1>
                <p className="text-slate-600 mt-1">Monitor active AI voice calls in real-time</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                            <PhoneCall className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600">Active Calls</p>
                            <p className="text-2xl font-bold text-slate-900">{liveCalls.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600">Avg Duration</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {liveCalls.length > 0 ?
                                    Math.floor(liveCalls.reduce((acc, call) =>
                                        acc + (Date.now() - new Date(call.startedAt)) / 1000, 0
                                    ) / liveCalls.length / 60) + 'm'
                                    : '0m'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600">Queue</p>
                            <p className="text-2xl font-bold text-slate-900">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Calls */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">Active Calls</h2>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-slate-500">Live</span>
                        </div>
                    </div>
                </div>

                {liveCalls.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500">No active calls right now</p>
                        <p className="text-sm text-slate-400 mt-1">New calls will appear here automatically</p>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {liveCalls.map((call) => {
                                const statusConfig = getStatusConfig(call.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <div key={call.id} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-all duration-200">
                                        {/* Call Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <User className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{call.customer}</h3>
                                                    <p className="text-sm text-slate-500">{call.phone}</p>
                                                </div>
                                            </div>

                                            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                <span>{call.status}</span>
                                            </div>
                                        </div>

                                        {/* Call Details */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-white rounded-xl p-3 border border-slate-100">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    <span className="text-xs font-medium text-slate-600">Duration</span>
                                                </div>
                                                <p className="text-lg font-bold text-slate-900 font-mono">
                                                    {getElapsedTime(call.startedAt)}
                                                </p>
                                            </div>

                                            <div className="bg-white rounded-xl p-3 border border-slate-100">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <Activity className="w-4 h-4 text-slate-400" />
                                                    <span className="text-xs font-medium text-slate-600">Campaign</span>
                                                </div>
                                                <p className="text-sm font-semibold text-slate-700 truncate">
                                                    {call.campaign}
                                                </p>
                                            </div>
                                        </div>

                                        {/* AI Message */}
                                        <div className="bg-white rounded-xl p-4 border border-slate-100">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <MessageSquare className="w-4 h-4 text-slate-400" />
                                                <span className="text-xs font-medium text-slate-600">Current AI Message</span>
                                            </div>
                                            <p className="text-sm text-slate-700 italic leading-relaxed">
                                                "{call.aiMessage}"
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-2 mt-4">
                                            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-shadow">
                                                Listen In
                                            </button>
                                            <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LiveMonitor;