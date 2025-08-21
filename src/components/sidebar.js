import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, BarChart3, Megaphone, Monitor, Settings, PhoneCall, LogOut, User } from 'lucide-react';
import { toast } from 'react-toastify';

function Sidebar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', role: '', initials: '' });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('userData'));
        if (storedUser) {
            const initials = storedUser.name
                ? storedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
                : 'U';
            setUser({
                name: storedUser.name || 'Unknown User',
                role: storedUser.role || 'User',
                initials
            });
        } else {
            toast.error("No user data found. Please log in.", { theme: "colored" });
            navigate('/login');
        }
    }, [navigate]);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
        { path: '/calls', label: 'Call Logs', icon: Phone },
        { path: '/campaigns', label: 'Campaigns', icon: Megaphone },
        // { path: '/live', label: 'Live Monitor', icon: Monitor },
        { path: '/profile', label: 'Profile', icon: User },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        toast.success("Logged out successfully!", { theme: "colored" });
        navigate('/login');
    };

    return (
        <div className="w-72 h-screen sticky top-0 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 shadow-2xl flex flex-col justify-between">
            <div>
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <PhoneCall className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Eva - AI Voice Caller</h2>
                            <p className="text-xs text-slate-400">Admin Dashboard</p>
                        </div>
                    </div>
                </div>

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
            </div>

            <div className="p-4 space-y-4">
                <Link
                    to="/profile"
                    className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 group ${pathname === '/profile'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        }`}
                >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{user.initials}</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.role}</p>
                    </div>
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;