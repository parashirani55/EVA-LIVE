import React, { useState } from 'react';
import { Settings, Mic, Globe, Clock, FileText, Save, Bot, Volume2, Timer, MapPin, CheckCircle } from 'lucide-react';

function SettingsPage() {
    const [settings, setSettings] = useState({
        voiceModel: 'gpt-4o',
        language: 'en-US',
        scriptTemplate: 'Hello, this is an automated call from Royal Aire...',
        timezone: 'America/Los_Angeles',
        callDuration: 120,
        voiceSpeed: '1.0',
        voicePitch: 'normal',
        retryAttempts: 3,
        callbackDelay: 30,
    });

    const [activeTab, setActiveTab] = useState('voice');
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log('Saved settings:', settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        // Optional: send to backend via API
    };

    const tabs = [
        { id: 'voice', label: 'Voice & AI', icon: Mic },
        { id: 'script', label: 'Scripts', icon: FileText },
        { id: 'system', label: 'System', icon: Settings },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-600 mt-1">Configure your AI voice calling system</p>
            </div>

            {/* Success Message */}
            {saved && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="text-emerald-800 font-medium">Settings saved successfully!</span>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                {/* Tab Navigation */}
                <div className="border-b border-slate-200">
                    <div className="flex space-x-8 px-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6">
                    {/* Voice & AI Settings */}
                    {activeTab === 'voice' && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-slate-900">Voice & AI Configuration</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        AI Voice Model
                                    </label>
                                    <select
                                        name="voiceModel"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        value={settings.voiceModel}
                                        onChange={handleChange}
                                    >
                                        <option value="gpt-4o">OpenAI GPT-4o</option>
                                        <option value="elevenlabs">ElevenLabs</option>
                                        <option value="google-voice">Google Cloud Voice</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Language & Accent
                                    </label>
                                    <select
                                        name="language"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        value={settings.language}
                                        onChange={handleChange}
                                    >
                                        <option value="en-US">English (US)</option>
                                        <option value="en-UK">English (UK)</option>
                                        <option value="es-ES">Spanish</option>
                                        <option value="hi-IN">Hindi</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Voice Speed
                                    </label>
                                    <select
                                        name="voiceSpeed"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        value={settings.voiceSpeed}
                                        onChange={handleChange}
                                    >
                                        <option value="0.8">Slow (0.8x)</option>
                                        <option value="1.0">Normal (1.0x)</option>
                                        <option value="1.2">Fast (1.2x)</option>
                                        <option value="1.5">Very Fast (1.5x)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Voice Pitch
                                    </label>
                                    <select
                                        name="voicePitch"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        value={settings.voicePitch}
                                        onChange={handleChange}
                                    >
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Script Settings */}
                    {activeTab === 'script' && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-slate-900">Script Templates</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Default Script Template
                                </label>
                                <textarea
                                    name="scriptTemplate"
                                    rows="6"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    value={settings.scriptTemplate}
                                    onChange={handleChange}
                                    placeholder="Enter your default call script template..."
                                />
                                <p className="text-sm text-slate-500 mt-2">
                                    This template will be used as the default for new campaigns.
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4">
                                <h3 className="font-medium text-slate-900 mb-2">Available Variables</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    <code className="bg-white px-2 py-1 rounded border">{'{customer_name}'}</code>
                                    <code className="bg-white px-2 py-1 rounded border">{'{company_name}'}</code>
                                    <code className="bg-white px-2 py-1 rounded border">{'{phone_number}'}</code>
                                    <code className="bg-white px-2 py-1 rounded border">{'{date}'}</code>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Settings */}
                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                                    <Settings className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-slate-900">System Configuration</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>Timezone</span>
                                        </div>
                                    </label>
                                    <select
                                        name="timezone"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        value={settings.timezone}
                                        onChange={handleChange}
                                    >
                                        <option value="America/Los_Angeles">PST (Los Angeles)</option>
                                        <option value="America/New_York">EST (New York)</option>
                                        <option value="Asia/Kolkata">IST (India)</option>
                                        <option value="Europe/London">GMT (London)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Timer className="w-4 h-4" />
                                            <span>Max Call Duration (seconds)</span>
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        name="callDuration"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        value={settings.callDuration}
                                        onChange={handleChange}
                                        min="30"
                                        max="600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Retry Attempts
                                    </label>
                                    <select
                                        name="retryAttempts"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        value={settings.retryAttempts}
                                        onChange={handleChange}
                                    >
                                        <option value="1">1 attempt</option>
                                        <option value="2">2 attempts</option>
                                        <option value="3">3 attempts</option>
                                        <option value="5">5 attempts</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4" />
                                            <span>Callback Delay (minutes)</span>
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        name="callbackDelay"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        value={settings.callbackDelay}
                                        onChange={handleChange}
                                        min="5"
                                        max="120"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
                        <button
                            type="button"
                            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Reset to Defaults
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Settings</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;