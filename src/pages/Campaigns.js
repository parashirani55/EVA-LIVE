import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Upload, Eye, Play, Calendar, Pause, Clock, Megaphone } from 'lucide-react';
import { generateScript } from '../utils/generateScript';
import { createTrelloCard } from '../utils/trello';

function Campaigns() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        voice: '',
        script: '',
        file: null,
        startTime: '',
        service: '',
        customService: '',
    });

    const [generating, setGenerating] = useState(false);

    const [campaigns, setCampaigns] = useState([
        {
            id: 1,
            name: 'Q3 Renewal Campaign',
            voice: 'female-1',
            service: 'Automated Appointment Reminders',
            startTime: '2025-08-06 09:00',
            status: 'Active',
        },
        {
            id: 2,
            name: 'Welcome New Customers',
            voice: 'ai-neural',
            service: 'Customer Feedback Calls',
            startTime: '2025-08-07 14:00',
            status: 'Scheduled',
        },
    ]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };
    // console.log(process.env.REACT_APP_OPENAI_API_KEY);
    // Campaigns.js (update handleGenerateScript)
    const handleGenerateScript = async () => {
        if (!formData.description || formData.description.trim().length < 3) {
            return alert("Please enter a valid campaign description (at least 3 characters).");
        }
        setGenerating(true);
        try {
            const prompt = `Generate a 60-second voice call script for this campaign: ${formData.description}`;
            console.log('Generated prompt:', prompt);
            const generated = await generateScript(prompt);
            setFormData((prev) => ({ ...prev, script: generated }));
        } catch (error) {
            console.error('HandleGenerateScript Error:', error);
            alert(`❌ ${error.message || 'Error generating script.'}`);
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedService =
            formData.service === 'other' ? formData.customService : formData.service;

        const newCampaign = {
            id: Date.now(),
            name: formData.name,
            voice: formData.voice,
            service: selectedService,
            startTime: formData.startTime,
            status: 'Scheduled',
        };

        setCampaigns((prev) => [...prev, newCampaign]);

        try {
            await createTrelloCard(
                formData.name,
                `Service: ${selectedService}\nVoice: ${formData.voice}\nStart: ${formData.startTime}\nScript:\n${formData.script}`
            );
            alert('✅ Campaign and Trello card created successfully!');
        } catch (err) {
            alert('⚠️ Campaign created, but Trello card failed.');
        }

        setFormData({
            name: '',
            description: '',
            voice: '',
            script: '',
            file: null,
            startTime: '',
            service: '',
            customService: '',
        });
    };


    const getStatusConfig = (status) => {
        switch (status) {
            case 'Active':
                return { color: 'bg-emerald-100 text-emerald-700', icon: Play };
            case 'Scheduled':
                return { color: 'bg-blue-100 text-blue-700', icon: Calendar };
            case 'Paused':
                return { color: 'bg-amber-100 text-amber-700', icon: Pause };
            default:
                return { color: 'bg-slate-100 text-slate-700', icon: Clock };
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Campaign Management</h1>
                <p className="text-slate-600 mt-1">Create and manage your AI voice campaigns</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                        <Plus className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900">Create New Campaign</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Campaign Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter campaign name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Voice Type
                            </label>
                            <select
                                name="voice"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.voice}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select voice...</option>
                                <option value="female-1">Female - Friendly</option>
                                <option value="male-1">Male - Calm</option>
                                <option value="ai-neural">AI Neural Voice</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Service Type
                        </label>
                        <select
                            name="service"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.service}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a service...</option>
                            <option value="automated-reminder">Automated Appointment Reminders</option>
                            <option value="feedback-calls">Customer Feedback Calls</option>
                            <option value="promo-outreach">Promotional Outreach Calls</option>
                            <option value="debt-collection">Debt Collection Voice Calls</option>
                            <option value="other">Other</option>
                        </select>
                        {formData.service === 'other' && (
                            <input
                                type="text"
                                name="customService"
                                className="mt-3 w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.customService}
                                onChange={handleChange}
                                placeholder="Enter your service type"
                                required
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows="3"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your campaign objectives"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
                            Call Script
                            <button
                                type="button"
                                onClick={handleGenerateScript}
                                className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                                disabled={generating || !formData.description}
                            >
                                {generating ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </label>
                        <textarea
                            name="script"
                            rows="4"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.script}
                            onChange={handleChange}
                            placeholder="Enter your call script or generate with AI"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Upload Leads (CSV)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    name="file"
                                    accept=".csv"
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                                />
                                <Upload className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Start Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                name="startTime"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50"
                        >
                            Save Draft
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg"
                        >
                            Create Campaign
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">Campaign History</h2>
                </div>

                {campaigns.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Megaphone className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500">No campaigns created yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Voice Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Service</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Start Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {campaigns.map((campaign) => {
                                    const statusConfig = getStatusConfig(campaign.status);
                                    const StatusIcon = statusConfig.icon;
                                    return (
                                        <tr key={campaign.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-900">{campaign.name}</td>
                                            <td className="px-6 py-4 text-slate-600">{campaign.voice}</td>
                                            <td className="px-6 py-4 text-slate-600">{campaign.service}</td>
                                            <td className="px-6 py-4 text-slate-600">{campaign.startTime}</td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    <span>{campaign.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
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
                )}
            </div>
        </div>
    );
}

export default Campaigns;