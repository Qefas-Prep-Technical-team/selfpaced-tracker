'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area
} from 'recharts'
import { 
  ArrowLeft, BarChart2, TrendingUp, Users, 
  MessageCircle, Target, Zap, Loader2, Calendar
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../channel/components/ui/Button'

function RecentInquiries({ channel, from, to, studentClass, status }: { channel: string; from: string; to: string; studentClass: string; status: string }) {
    const { data: inquiries = [], isLoading } = useQuery({
        queryKey: ['channel-inquiries-list', channel, from, to, studentClass, status],
        queryFn: () => {
            const params = new URLSearchParams();
            params.append('channel', channel);
            if (from) params.append('from', from);
            if (to) params.append('to', to);
            if (studentClass && studentClass !== 'all') params.append('class', studentClass);
            if (status && status !== 'all') params.append('status', status);
            params.append('limit', '3');
            return fetch(`/api/analytics/channels/inquiries?${params.toString()}`).then(res => res.json());
        }
    });

    if (isLoading) return <div className="space-y-2 mt-4"><div className="h-8 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" /></div>;

    if (inquiries.length === 0) return <p className="mt-4 text-[10px] text-slate-400 font-bold italic">No inquiries in this period</p>;

    return (
        <div className="mt-6 space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Recent Leads</h4>
            {inquiries.map((inq: any, i: number) => (
                <div key={inq._id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all group/inq">
                    <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover/inq:bg-indigo-500 group-hover/inq:text-white transition-colors shadow-sm">
                        <Users size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-black text-slate-800 dark:text-slate-200 truncate">{inq.parentName || inq.studentName}</div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{inq.studentClass || 'N/A'}</span>
                            <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                inq.status === 'new' ? 'bg-blue-500 text-white' :
                                inq.status === 'contacted' ? 'bg-amber-500 text-white' :
                                'bg-emerald-500 text-white'
                            }`}>{inq.status}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ChannelAnalyticsPage() {
    const [range, setRange] = useState('30d')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [showCustom, setShowCustom] = useState(false)
    const [selectedClass, setSelectedClass] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')

    const buildUrl = (baseUrl: string) => {
        const params = new URLSearchParams();
        if (showCustom && startDate) {
            params.append('from', startDate);
            if (endDate) params.append('to', endDate);
        } else {
            params.append('range', range);
        }
        if (selectedClass !== 'all') params.append('class', selectedClass);
        if (selectedStatus !== 'all') params.append('status', selectedStatus);
        return `${baseUrl}?${params.toString()}`;
    }

    const { data: trendData = [], isLoading: isLoadingTrends } = useQuery({
        queryKey: ['channel-trends-detailed', range, startDate, endDate, showCustom, selectedClass, selectedStatus],
        queryFn: () => fetch(buildUrl('/api/analytics/channel-trends')).then(res => res.json())
    });

    const { data: channelStats = [], isLoading: isLoadingStats } = useQuery({
        queryKey: ['channel-performance-detailed', range, startDate, endDate, showCustom, selectedClass, selectedStatus],
        queryFn: () => fetch(buildUrl('/api/analytics/channels')).then(res => res.json())
    });

    if (isLoadingTrends || isLoadingStats) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-12 animate-spin text-primary" />
                    <p className="text-sm font-bold text-slate-500 animate-pulse">Aggregating Channel Intelligence...</p>
                </div>
            </div>
        )
    }

    // Extract all unique channels from ALL trend data points
    const channels = Array.from(new Set(
        trendData.flatMap((item: any) => 
            Object.keys(item).filter(k => k !== 'name')
        )
    )) as string[];

    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']

    return (
        <main className="flex-1 flex justify-center py-6 md:py-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen">
            <div className="w-full max-w-[1400px] px-4 md:px-6">

                {/* Header */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10 md:mb-12">
                    <div className="flex flex-col gap-1 w-full lg:w-auto">
                        <Link href="/dashboard/analytics" className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-2 group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Overview
                        </Link>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            Channel Analytics
                        </h1>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Deep-dive performance profiles and conversion metrics</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                        <div className="flex items-center gap-1 bg-white/50 backdrop-blur-md dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto no-scrollbar">
                            {['7d', '30d', '90d', 'all'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => { setRange(r); setShowCustom(false); }}
                                    className={`whitespace-nowrap px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${!showCustom && range === r ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-white dark:hover:bg-white/5'}`}
                                >
                                    {r === 'all' ? 'All' : r.toUpperCase()}
                                </button>
                            ))}
                            <button
                                onClick={() => setShowCustom(!showCustom)}
                                className={`whitespace-nowrap px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${showCustom ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-white dark:hover:bg-white/5'}`}
                            >
                                Custom
                            </button>
                        </div>

                        {showCustom && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="flex-1 min-w-0 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <span className="text-slate-400 font-bold text-[10px] uppercase">to</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="flex-1 min-w-0 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                             <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="flex-1 sm:flex-none bg-white/70 backdrop-blur-md dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3 sm:px-4 py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 shadow-sm transition-all"
                            >
                                <option value="all">Every Student</option>
                                <option value="JSS1">JSS1</option>
                                <option value="JSS2">JSS2</option>
                                <option value="JSS3">JSS3</option>
                                <option value="SS1">SS1</option>
                                <option value="SS2">SS2</option>
                                <option value="SS3">SS3</option>
                            </select>

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="flex-1 sm:flex-none bg-white/70 backdrop-blur-md dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3 sm:px-4 py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 shadow-sm transition-all"
                            >
                                <option value="all">Any Status</option>
                                <option value="new">Fresh Lead</option>
                                <option value="contacted">In Progress</option>
                                <option value="enrolled">Converted</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Channel Profile Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {channelStats.map((stat: any, idx: number) => (
                        <div key={idx} className="group relative bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
                                        <Target size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{stat.name}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Channel Profile</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-tighter">
                                    Active
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Leads</div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.leads}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Engaged</div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.messages}</div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[10px] font-black uppercase text-slate-500">Acquisition Efficiency</span>
                                    <span className="text-xs font-black text-indigo-500">{Math.round((stat.messages / Math.max(stat.leads, 1)) * 100)}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 shadow-sm shadow-indigo-500/50 rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.min((stat.messages / Math.max(stat.leads, 1)) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Granular Inquiry List */}
                            <RecentInquiries 
                                channel={stat.name} 
                                from={showCustom ? startDate : ''} 
                                to={showCustom ? endDate : ''} 
                                studentClass={selectedClass}
                                status={selectedStatus}
                            />

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                        <MessageCircle size={14} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black uppercase text-slate-400 leading-none">Status</div>
                                        <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Processing</div>
                                    </div>
                                </div>
                                <Link 
                                    href={`/dashboard/inquiries?channel=${stat.name}`} 
                                    className="text-[10px] font-black uppercase text-primary hover:underline hover:scale-105 transition-transform"
                                >
                                    Audit All Records
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

        {/* Primary Acquisition Trend */}
        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-4 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Acquisition Velocity</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Monthly inquiries grouped by source channel</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {channels.map((ch, i) => (
                        <div key={ch} className="flex items-center gap-1.5">
                            <div className="size-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{ch}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="h-[300px] sm:h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            {channels.map((ch, i) => (
                                <linearGradient key={`grad-${ch}`} id={`color-${ch}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                            dy={10}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                        <Tooltip 
                            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            contentStyle={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                backdropFilter: 'blur(12px)',
                                border: 'none', 
                                borderRadius: '16px',
                                color: '#fff',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                        />
                        {channels.map((ch, i) => (
                            <Area 
                                key={ch}
                                type="monotone" 
                                dataKey={ch} 
                                stroke={colors[i % colors.length]} 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill={`url(#color-${ch})`}
                                stackId="1"
                                animationDuration={1500}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Detailed Performance Table */}
        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Statistical Audit</h3>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Month-by-month performance matrix</p>
            </div>
            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-white/5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <th className="px-4 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-white/5">Period</th>
                            {channels.map(ch => (
                                <th key={ch} className="px-4 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-white/5">{ch}</th>
                            ))}
                            <th className="px-4 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-white/5 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {[...trendData].reverse().map((month: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                <td className="px-4 sm:px-8 py-4 sm:py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="p-1.5 sm:p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500">
                                            <Calendar size={12} />
                                        </div>
                                        <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                            {month.name}
                                        </span>
                                    </div>
                                </td>
                                {channels.map(ch => (
                                    <td key={ch} className="px-4 sm:px-8 py-4 sm:py-5 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                                                {month[ch] || 0}
                                            </span>
                                        </div>
                                    </td>
                                ))}
                                <td className="px-4 sm:px-8 py-4 sm:py-5 whitespace-nowrap text-right">
                                    <span className="px-2 sm:px-3 py-1 bg-primary text-white text-[9px] sm:text-[10px] font-black rounded-lg shadow-lg shadow-primary/20">
                                        {channels.reduce((sum, ch) => sum + (month[ch] || 0), 0)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </main>
  )
}
