import React from 'react';
import { Phone, CheckCircle, XCircle, Clock } from 'lucide-react';
import CallForm from '../components/CallForm';

function Dashboard() {
    const stats = [
        {
            title: 'Total Calls Today',
            value: 152,
            change: '+12%',
            icon: Phone,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
        },
        {
            title: 'Answered Calls',
            value: 89,
            change: '+8%',
            icon: CheckCircle,
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-700'
        },
        {
            title: 'Failed Calls',
            value: 34,
            change: '-5%',
            icon: XCircle,
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700'
        },
        {
            title: 'Avg Duration',
            value: '3m 21s',
            change: '+2%',
            icon: Clock,
            color: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-600 mt-1">Monitor your AI voice campaigns performance</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                        Export Report
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow">
                        New Campaign
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-slate-600">{stat.title}</h3>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Call Volume Trends</h3>
                    <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-xl flex items-end justify-center">
                        <p className="text-slate-500">Chart visualization would go here</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Success Rate</h3>
                    <div className="h-64 bg-gradient-to-t from-emerald-50 to-transparent rounded-xl flex items-center justify-center">
                        <p className="text-slate-500">Success rate visualization</p>
                    </div>
                </div>
            </div>
            {/* Testing only */}
            {/* <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <CallForm />
            </div> */}
        </div>



    );
}

export default Dashboard;