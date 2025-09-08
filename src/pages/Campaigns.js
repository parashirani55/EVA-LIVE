// src/pages/Campaigns.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import {
  Plus,
  Upload,
  Play,
  Calendar,
  Pause,
  Clock,
  Megaphone,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { generateScript } from "../utils/generateScript";

// Axios default
axios.defaults.baseURL = "http://135.237.127.43:5000";

// Axios interceptor for Authorization
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const serviceSuggestions = {
  "service-reminder": [
    "Your car is due for its regular maintenance service. Would you like to schedule now?",
    "Reminder: Your vehicle's oil change is coming up.",
    "It’s time for your periodic inspection and service.",
  ],
  "insurance-renewal": [
    "Your car insurance is expiring soon. Renew today to avoid disruption.",
    "Reminder: Renew your insurance before the deadline.",
    "Exclusive deal: Save more by renewing your vehicle insurance early.",
  ],
  "warranty-expiry": [
    "Your car warranty is expiring soon. Would you like to extend coverage?",
    "Reminder: Vehicle warranty ends next month.",
    "Protect your car with an extended warranty package.",
  ],
  "loan-payment": [
    "Reminder: Your car loan installment is due this week.",
    "Please arrange your EMI payment to avoid late fees.",
    "Would you like to set up auto-debit for your loan?",
  ],
  "promo-service": [
    "Special offer: Discounted car wash and detailing this week.",
    "Enjoy seasonal discounts on brake and tire services.",
    "Exclusive: Save on engine diagnostics packages.",
  ],
  "tire-replacement": [
    "Your tires are nearing replacement. Book an appointment today.",
    "Special promo: Buy 3 tires, get 1 free.",
    "Ensure safety – replace worn-out tires now.",
  ],
  "battery-check": [
    "Reminder: Time for a battery health checkup.",
    "Exclusive deal: Free battery check with service.",
    "Avoid breakdowns – book your battery replacement today.",
  ],
  "recall-notice": [
    "Important: Your vehicle may have a recall. Please contact us.",
    "Recall alert: Safety check needed for your vehicle.",
    "Schedule your free recall service appointment.",
  ],
  "roadside-assistance": [
    "Do you want to enroll in our roadside assistance plan?",
    "We offer 24/7 roadside help – subscribe today.",
    "Stay safe – add roadside coverage for emergencies.",
  ],
  "registration-renewal": [
    "Reminder: Your vehicle registration expires soon.",
    "Avoid penalties – renew your car registration today.",
    "Your registration renewal window is open now.",
  ],
  "accessories-offer": [
    "Special promo: Discounts on seat covers and car mats.",
    "Upgrade your ride with premium accessories.",
    "Exclusive offer: Free installation with accessory purchase.",
  ],
  "test-drive-invite": [
    "Book a test drive for our latest car models.",
    "Exclusive invite: Experience the all-new SUV.",
    "Would you like to schedule a test drive at your convenience?",
  ],
  feedback: [
    "How was your recent car servicing experience?",
    "We’d love your feedback about our automotive service.",
    "Would you recommend our workshop to friends?",
  ],
  "vip-customers": [
    "Exclusive loyalty offer just for you.",
    "As our VIP customer, you get special discounts on services.",
    "Enjoy free checkup this month as part of our loyalty program.",
  ],
  other: ["Custom automotive service – describe your own use case."],
};

function Campaigns() {
  const token = localStorage.getItem("accessToken");

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    voice: "",
    script: "",
    file: null,
    startTime: "",
    service: "",
    customService: "",
  });

  // Fetch campaigns
  useEffect(() => {
    if (!token) return;
    fetchCampaigns();
  }, [token]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/campaigns");
      setCampaigns(res.data || []);
    } catch (err) {
      console.error("Fetch campaigns error", err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  // AI Script generation
  const handleGenerateScript = async () => {
    if (!formData.description.trim())
      return alert("Enter a description first.");
    try {
      setGenerating(true);
      const script = await generateScript(formData.description);
      setFormData((prev) => ({ ...prev, script }));
    } catch (err) {
      console.error("Script generation error:", err);
      alert("Failed to generate script.");
    } finally {
      setGenerating(false);
    }
  };

  // Create campaign
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in.");

    const selectedService =
      formData.service === "other" ? formData.customService : formData.service;

    const data = new FormData();
    Object.entries({
      ...formData,
      service: selectedService,
    }).forEach(([key, value]) => value && data.append(key, value));

    setSubmitting(true);
    try {
      await axios.post("/api/campaigns", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchCampaigns();
      setFormData({
        name: "",
        description: "",
        voice: "",
        script: "",
        file: null,
        startTime: "",
        service: "",
        customService: "",
      });
      alert("✅ Campaign created!");
    } catch (err) {
      console.error("Create campaign error", err);
      alert("❌ Failed to create campaign.");
    } finally {
      setSubmitting(false);
    }
  };

  // Bulk call
  const handleBulkCall = async (campaignId) => {
    if (!window.confirm("Call all leads for this campaign?")) return;
    try {
      const res = await axios.post(`/api/campaigns/${campaignId}/call-bulk`);
      console.log("Bulk call response:", res.data);
      alert("✅ Bulk call initiated! Check console for details.");
    } catch (err) {
      console.error("Bulk call error", err);
      alert("❌ Bulk call failed. See console.");
    }
  };

  // Map status to style
  const getStatusConfig = (status) => {
    switch (status) {
      case "Active":
        return { className: "bg-emerald-100 text-emerald-700", icon: Play };
      case "Answered":
        return { className: "bg-green-100 text-green-700", icon: CheckCircle };
      case "Failed":
        return { className: "bg-red-100 text-red-700", icon: XCircle };
      case "Scheduled":
        return { className: "bg-blue-100 text-blue-700", icon: Calendar };
      case "Paused":
        return { className: "bg-amber-100 text-amber-700", icon: Pause };
      default:
        return { className: "bg-gray-100 text-gray-700", icon: Clock };
    }
  };

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Campaign Management
        </h1>
        <p className="text-slate-600 mt-1">
          Create and manage your AI voice campaigns
        </p>
      </div>

      {/* Create Campaign Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
            Create New Campaign
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Voice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter campaign name"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Voice Type
              </label>
              <select
                name="voice"
                value={formData.voice}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select voice...</option>
                <option value="female-1">Female</option>
                {/* <option value="male-1">Male - Calm</option> */}
                {/* <option value="ai-neural">AI Neural Voice</option> */}
              </select>
            </div>
          </div>

          {/* Service & Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Service Type
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an automotive service...</option>
              <option value="service-reminder">Service Reminders</option>
              <option value="insurance-renewal">Insurance Renewal</option>
              <option value="warranty-expiry">Warranty Expiry</option>
              <option value="loan-payment">Loan Payment Reminders</option>
              <option value="promo-service">Promotional Service Offers</option>
              <option value="tire-replacement">Tire Replacement Offers</option>
              <option value="battery-check">Battery Check / Replacement</option>
              <option value="recall-notice">Recall Notice Calls</option>
              <option value="roadside-assistance">
                Roadside Assistance Enrollment
              </option>
              <option value="registration-renewal">Registration Renewal</option>
              <option value="accessories-offer">
                Accessories & Upgrade Offers
              </option>
              <option value="test-drive-invite">Test Drive Invitations</option>
              <option value="feedback">Customer Feedback Calls</option>
              <option value="vip-customers">
                VIP / Loyalty Customer Offers
              </option>
              <option value="other">Other</option>
            </select>

            {formData.service === "other" && (
              <input
                type="text"
                name="customService"
                value={formData.customService}
                onChange={handleChange}
                placeholder="Enter your service type"
                className="mt-3 w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your campaign objectives"
            />
          </div>

          {/* Suggestions */}
          {formData.service && (
            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Suggestions for this service:
              </p>
              <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                {serviceSuggestions[formData.service]?.map((s, idx) => (
                  <li
                    key={idx}
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        description: prev.description
                          ? prev.description + " " + s
                          : s,
                      }))
                    }
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Script */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
              Call Script
              <button
                type="button"
                onClick={handleGenerateScript}
                disabled={generating || !formData.description}
                className="text-xs text-blue-600 hover:underline disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate with AI"}
              </button>
            </label>
            <textarea
              name="script"
              rows="4"
              value={formData.script}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your call script or generate with AI"
            />
          </div>

          {/* File & Start Time */}
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
              {formData.file && (
                <p className="text-sm mt-2">Selected: {formData.file.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50"
              onClick={() => {
                localStorage.setItem(
                  "campaignDraft",
                  JSON.stringify({
                    ...formData,
                    savedAt: new Date().toISOString(),
                  })
                );
                alert("Draft saved locally");
              }}
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg"
            >
              {submitting ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>

      {/* Campaign History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            Campaign History
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Voice
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Start Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((c) => {
                  const statusConfig = getStatusConfig(c.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {c.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{c.voice}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {c.service || c.custom_service}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {c.start_time}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{c.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 flex items-center space-x-2">
                        <button
                          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          onClick={() => handleBulkCall(c.id)}
                        >
                          <Play className="w-4 h-4" />
                          <span>Call All Leads</span>
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
