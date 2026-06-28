"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, ChevronLeft, ChevronRight, BarChart3, PieChart as PieChartIcon, Trash2, Eye, X, Send, MailPlus, CheckCircle } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function EngagementDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Email Distribution State
  const [recipients, setRecipients] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [isSendingSummary, setIsSendingSummary] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Summary Date Filters
  const [summaryStartDate, setSummaryStartDate] = useState("");
  const [summaryEndDate, setSummaryEndDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReportsAndRecipients = async () => {
      try {
        const [reportsRes, recipientsRes] = await Promise.all([
          fetch("/api/engagements"),
          fetch("/api/engagements/recipients")
        ]);
        
        const reportsData = await reportsRes.json();
        if (reportsData.success) setReports(reportsData.data);

        const recipientsData = await recipientsRes.json();
        if (recipientsData.success) setRecipients(recipientsData.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsAndRecipients();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = reports.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const executeDelete = async (id: string) => {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      const response = await fetch(`/api/engagements/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setReports(prev => prev.filter(r => r._id !== id));
        if (currentReports.length === 1 && currentPage > 1) {
          setCurrentPage(p => p - 1);
        }
      } else {
        alert(data.error || "Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Failed to delete report");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  // Email Handlers
  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setIsAddingEmail(true);
    try {
      const res = await fetch("/api/engagements/recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setRecipients([data.data, ...recipients]);
        setNewEmail("");
      } else {
        alert(data.error || "Failed to add email");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding email");
    } finally {
      setIsAddingEmail(false);
    }
  };

  const handleDeleteEmail = async (id: string) => {
    try {
      const res = await fetch(`/api/engagements/recipients/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRecipients(recipients.filter(r => r._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendSummary = async () => {
    if (recipients.length === 0) {
      alert("Please add at least one recipient email first.");
      return;
    }
    setIsSendingSummary(true);
    try {
      const res = await fetch("/api/engagements/send-summary", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: summaryStartDate || undefined,
          endDate: summaryEndDate || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowSuccessModal(true);
        // Auto-close after 4 seconds
        setTimeout(() => setShowSuccessModal(false), 4000);
      } else {
        alert(data.error || "Failed to send summary");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending summary");
    } finally {
      setIsSendingSummary(false);
    }
  };

  // Prepare data for charts
  const prepareChartData = () => {
    // Bar Chart Data (Leads vs Conversions by Date)
    const dateMap: Record<string, { date: string; leads: number; converted: number }> = {};
    reports.forEach(r => {
      if (!r.date) return;
      const dateStr = format(new Date(r.date), "MMM d");
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = { date: dateStr, leads: 0, converted: 0 };
      }
      dateMap[dateStr].leads += (r.hotLeads || 0);
      dateMap[dateStr].converted += (r.convertedStudents || 0);
    });
    const barData = Object.values(dateMap).slice(0, 10); // Last 10 days

    // Pie Chart Data (Engagement by Channel)
    const normalizeName = (name: string) => {
      let clean = name.trim().toLowerCase().replace(/\s+/g, ' ');
      
      // Normalize Abdulai Olaide variations
      if (clean.includes("abdukai olaide") || 
          clean.includes("olaide abdulai") || 
          clean.includes("abdulai olaidw") || 
          clean.includes("bello olaide abdulai") ||
          clean === "abdulai olaide") {
        clean = "abdulai olaide";
      }

      // Normalize Olanso Adelola variations
      if (clean.includes("adelola olanso") || 
          clean.includes("olanso adeola") || 
          clean === "olanso adelola") {
        clean = "olanso adelola";
      }

      if (clean === "facebook") return "Facebook";

      // Capitalize for display
      return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const channelMap: Record<string, number> = {};
    reports.forEach(r => {
      const channel = r.nameChannel ? normalizeName(r.nameChannel) : "Unknown";
      channelMap[channel] = (channelMap[channel] || 0) + 1;
    });
    const pieData = Object.keys(channelMap)
      .map(key => ({ name: key, value: channelMap[key] }))
      .sort((a, b) => b.value - a.value); // Sort to make pie look nicer

    return { barData, pieData };
  };

  const { barData, pieData } = prepareChartData();
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Engagement Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track and monitor daily engagement activities and lead conversions.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2 whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Report
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">#</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Channel</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Leads</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Converted</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Flyers</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
                    <p className="text-slate-500 mt-4">Loading reports...</p>
                  </td>
                </tr>
              ) : currentReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No engagement reports found.
                  </td>
                </tr>
              ) : (
                currentReports.map((report, index) => (
                  <tr key={report._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 dark:text-slate-500 font-medium">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                      {report.date ? format(new Date(report.date), "MMM d, yyyy") : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-400">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {report.nameChannel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-400">
                      {report.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-300 text-right">
                      {report.hotLeads || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400 text-right">
                      {report.convertedStudents || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 text-right">
                      {report.flyersDistributed || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(report._id)}
                          disabled={deletingId === report._id}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50"
                          title="Delete Report"
                        >
                          {deletingId === report._id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!loading && reports.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
              Showing <span className="font-medium text-slate-900 dark:text-white">{startIndex + 1}</span> to{" "}
              <span className="font-medium text-slate-900 dark:text-white">
                {Math.min(startIndex + itemsPerPage, reports.length)}
              </span>{" "}
              of <span className="font-medium text-slate-900 dark:text-white">{reports.length}</span> reports
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 px-2">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      {!loading && reports.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          
          {/* Bar Chart: Leads vs Conversions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Leads vs Conversions</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="leads" name="Hot Leads" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="converted" name="Converted" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Channels */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                <PieChartIcon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Activity by Channel</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Email Distribution Section */}
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MailPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Automated Summaries
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Filter dates and manage who receives the AI-generated engagement summaries via email.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 w-full lg:w-auto">
            <div className="flex flex-row items-center justify-between gap-2 w-full sm:w-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col flex-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 px-1">Start Date</label>
                <input 
                  type="date" 
                  value={summaryStartDate}
                  onChange={(e) => setSummaryStartDate(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-900 dark:text-white outline-none cursor-pointer w-full max-w-[130px]"
                />
              </div>
              <div className="text-slate-300 px-1">-</div>
              <div className="flex flex-col flex-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 px-1">End Date</label>
                <input 
                  type="date" 
                  value={summaryEndDate}
                  onChange={(e) => setSummaryEndDate(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-900 dark:text-white outline-none cursor-pointer w-full max-w-[130px]"
                />
              </div>
            </div>

            <button 
              onClick={handleSendSummary}
              disabled={isSendingSummary || recipients.length === 0}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
            >
              {isSendingSummary ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {isSendingSummary ? "Generating..." : "Send AI Summary"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Email Form */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Add Recipient</h3>
            <form onSubmit={handleAddEmail} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                required
                placeholder="colleague@company.com" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
              />
              <button 
                type="submit" 
                disabled={isAddingEmail || !newEmail}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
              >
                {isAddingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
            </form>
          </div>

          {/* Email List */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Saved Recipients ({recipients.length})</h3>
            {recipients.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm text-slate-500 dark:text-slate-400">
                No emails added yet.
              </div>
            ) : (
              <ul className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                {recipients.map((r) => (
                  <li key={r._id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm">
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{r.email}</span>
                    <button 
                      onClick={() => handleDeleteEmail(r._id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Report</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Are you sure you want to permanently delete this engagement report? This action cannot be undone.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => executeDelete(confirmDeleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-lg shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Engagement Details</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {selectedReport.date ? format(new Date(selectedReport.date), "MMMM d, yyyy") : "N/A"}
                </p>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Channel</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedReport.nameChannel}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Location</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedReport.location}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Hot Leads</p>
                  <p className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedReport.hotLeads || 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Converted</p>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedReport.convertedStudents || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Flyers Distributed</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedReport.flyersDistributed || 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Gifts Distributed</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedReport.giftsDistributed || 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Contacts Uploaded</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedReport.contactsUploaded || 0}</p>
                </div>
              </div>

              {selectedReport.challenges && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Challenges</h4>
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-sm text-slate-700 dark:text-slate-300">
                    {selectedReport.challenges}
                  </div>
                </div>
              )}

              {selectedReport.suggestions && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Suggestions</h4>
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-sm text-slate-700 dark:text-slate-300">
                    {selectedReport.suggestions}
                  </div>
                </div>
              )}

              {selectedReport.comments && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Comments</h4>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    {selectedReport.comments}
                  </div>
                </div>
              )}

              {selectedReport.dataCollected && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Data Collected Details</h4>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    {selectedReport.dataCollected}
                  </div>
                </div>
              )}

              {selectedReport.objections && selectedReport.objections.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Objections & Feedback</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.objections.map((obj: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium">
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedReport.supportNeeded && selectedReport.supportNeeded.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Support Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.supportNeeded.map((sup: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20 rounded-lg text-xs font-medium">
                        {sup}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Summary Sent!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
              The AI-generated engagement summary has been successfully sent to all recipients.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors shadow-lg shadow-green-500/20"
            >
              Awesome
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
