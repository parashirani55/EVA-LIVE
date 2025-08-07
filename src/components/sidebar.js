import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, BarChart3, Megaphone, Monitor, Settings, PhoneCall } from 'lucide-react';

function Sidebar() {
    const { pathname } = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
        { path: '/calls', label: 'Call Logs', icon: Phone },
        { path: '/campaigns', label: 'Campaigns', icon: Megaphone },
        { path: '/live', label: 'Live Monitor', icon: Monitor },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-72 h-screen bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 shadow-2xl">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <PhoneCall className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">VoiceAI Pro</h2>
                        <p className="text-xs text-slate-400">Admin Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${pathname === path
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                            }`}
                    >
                        <Icon className={`w-5 h-5 ${pathname === path ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                        <span className="font-medium">{label}</span>
                    </Link>
                ))}
            </nav>

            {/* User Section */}
            <div className="w-[15rem] mx-4 px-4 py-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">JD</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-white truncate">John Doe</p>
                        <p className="text-xs text-slate-400">Administrator</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Sidebar;
