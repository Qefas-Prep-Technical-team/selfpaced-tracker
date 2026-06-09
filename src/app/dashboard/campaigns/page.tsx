/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { StickyFooter } from './components/StickyFooter';
import SmsMain from './components/SmsMain';
import Link from 'next/link';
import { Button } from '../channel/components/ui/Button';
import { Phone, Mail, BarChart3, Send, Users, CheckCircle, XCircle, Clock, Activity, Search, Eye, ShieldCheck, Smartphone, Globe, AlertTriangle, ListTodo, Calendar, RefreshCw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

const fetchCampaigns = async () => {
    const res = await fetch('/api/campaigns');
    if (!res.ok) throw new Error('Failed to fetch campaigns');
    return res.json();
};

const fetchBalance = async () => {
    const res = await fetch('/api/campaigns/balance');
    if (!res.ok) throw new Error('Failed to fetch balance');
    return res.json();
};

const fetchSenderIds = async () => {
    const res = await fetch('/api/campaigns/sender-id');
    if (!res.ok) throw new Error('Failed to fetch Sender IDs');
    return res.json();
};

const fetchTermiiInbox = async () => {
    const res = await fetch('/api/campaigns/inbox');
    if (!res.ok) throw new Error('Failed to fetch Termii Inbox');
    return res.json();
};

const fetchTermiiCampaigns = async () => {
    const res = await fetch('/api/campaigns/termii-campaigns');
    if (!res.ok) throw new Error('Failed to fetch Termii Campaigns');
    return res.json();
};

export default function MessagingCenterPage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('sms');
    const [isSending, setIsSending] = useState(false);

    // States for Single SMS (manual entries)
    const [selectedRoute, setSelectedRoute] = useState('dnd');
    const [message, setMessage] = useState('');
    const [recipients, setRecipients] = useState<string[]>([]);
    const [sandboxEnabled, setSandboxEnabled] = useState(false);
    const [selectedSenderId, setSelectedSenderId] = useState('');

    // States for Phonebook Campaigns (Termii campaigns/send endpoint)
    const [phonebookId, setPhonebookId] = useState('');
    const [phonebookMessage, setPhonebookMessage] = useState('');
    const [phonebookRoute, setPhonebookRoute] = useState('generic');
    const [messageType, setMessageType] = useState('Plain');
    const [campaignType, setCampaignType] = useState('regular');
    const [linkTracking, setLinkTracking] = useState(false);
    const [scheduleStatus, setScheduleStatus] = useState('regular');
    const [scheduleTime, setScheduleTime] = useState('');
    const [isSendingPhonebookCampaign, setIsSendingPhonebookCampaign] = useState(false);

    // Sub-tab toggles within History tab
    const [historySubTab, setHistorySubTab] = useState('local'); // 'local' or 'termii'

    // Search query for live logs and history
    const [searchLogQuery, setSearchLogQuery] = useState('');
    const [searchHistoryQuery, setSearchHistoryQuery] = useState('');

    // Pagination for live logs
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 5;

    // Pagination for campaign history
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
    const historyItemsPerPage = 10;

    // Pop-up details preview state
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [selectedTermiiCampaign, setSelectedTermiiCampaign] = useState<any>(null);
    const [selectedLocalCampaign, setSelectedLocalCampaign] = useState<any>(null);
    const [isFetchingCampaignDetail, setIsFetchingCampaignDetail] = useState(false);
    const [campaignDetailResult, setCampaignDetailResult] = useState<any>(null);

    // States for Number Portability Lookup
    const [lookupPhoneNumber, setLookupPhoneNumber] = useState('');
    const [lookupCountryCode, setLookupCountryCode] = useState('NG');
    const [lookupResult, setLookupResult] = useState<any>(null);
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [lookupError, setLookupError] = useState('');

    // Custom popup alert state
    const [popupAlert, setPopupAlert] = useState<{
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
    } | null>(null);

    const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
        setPopupAlert({ type, title, message });
    };

    // Retrieve historical campaigns
    const { data: campaignHistory, isLoading: isLoadingHistory } = useQuery({
        queryKey: ['campaigns'],
        queryFn: fetchCampaigns,
    });

    // Retrieve Termii balance
    const { data: balanceData } = useQuery({
        queryKey: ['termii-balance'],
        queryFn: fetchBalance,
        refetchInterval: 15000 // auto-refresh balance every 15 seconds
    });

    // Retrieve Sender IDs
    const { data: senderIdsData, refetch: refetchSenderIds } = useQuery({
        queryKey: ['sender-ids'],
        queryFn: fetchSenderIds,
    });

    // Retrieve Termii Inbox live logs
    const { data: termiiInboxData, isLoading: isLoadingInbox } = useQuery({
        queryKey: ['termii-inbox'],
        queryFn: fetchTermiiInbox,
        refetchInterval: 30000 // auto-refresh inbox logs every 30 seconds
    });

    // Retrieve Termii Campaigns List
    const { data: termiiCampaignsData, isLoading: isLoadingTermiiCampaigns } = useQuery({
        queryKey: ['termii-campaigns'],
        queryFn: fetchTermiiCampaigns,
    });

    // Reset pagination page on search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchLogQuery]);

    // Reset pagination for campaign history on subtab or search change
    useEffect(() => {
        setHistoryCurrentPage(1);
    }, [historySubTab, searchHistoryQuery]);

    // Set default Sender ID when options are fetched
    useEffect(() => {
        if (senderIdsData?.content && senderIdsData.content.length > 0 && !selectedSenderId) {
            const activeSender = senderIdsData.content.find((item: any) => item.status === 'active');
            if (activeSender) {
                setSelectedSenderId(activeSender.sender_id);
            } else {
                setSelectedSenderId(senderIdsData.content[0].sender_id);
            }
        }
    }, [senderIdsData, selectedSenderId]);

    // Calculate estimated cost for Single SMS Broadcast
    const calculateSmsMetrics = () => {
        const totalRecipientsCount = recipients.length;
        if (totalRecipientsCount === 0 || !message) {
            return {
                costStr: '₦0.00',
                deliveryStr: 'No recipients selected',
                count: 0
            };
        }

        const specialCharRegex = /[;\/\^\\\{\}\[\]~\|€'”]/;
        const hasSpecialChar = specialCharRegex.test(message);
        const limitPerPage = hasSpecialChar ? 70 : 160;
        const smsUnits = Math.ceil(message.length / limitPerPage) || 1;

        // Default prices fallback if prices list is missing
        const defaultPrices: Record<string, number> = {
            dnd: 4.0,
            generic: 2.5,
            whatsapp: 12.0,
            voice: 15.0
        };

        const prices = balanceData?.prices || defaultPrices;
        const pricePerUnit = prices[selectedRoute] || 4.0;
        const currencySymbol = balanceData?.currency === 'USD' ? '$' : '₦';

        const totalCost = totalRecipientsCount * smsUnits * pricePerUnit;
        
        let deliveryStr = 'Instant Delivery';
        if (selectedRoute === 'dnd') {
            deliveryStr = 'Priority DND Bypass (Instant)';
        } else if (selectedRoute === 'generic') {
            deliveryStr = 'Standard SMS Route';
        } else if (selectedRoute === 'whatsapp') {
            deliveryStr = 'WhatsApp Channel (Instant)';
        } else if (selectedRoute === 'voice') {
            deliveryStr = 'Voice Call Broadcast';
        }

        return {
            costStr: `${currencySymbol}${totalCost.toFixed(2)}`,
            deliveryStr,
            count: totalRecipientsCount
        };
    };

    const smsMetrics = calculateSmsMetrics();

    const tabs = [
        { id: 'sms', label: 'Single SMS', icon: Phone },
        { id: 'phonebookCampaign', label: 'Phonebook Campaign', icon: ListTodo },
        { id: 'email', label: 'Email Newsletter', icon: Mail },
        { id: 'history', label: 'Campaign History', icon: BarChart3 },
        { id: 'termiiLogs', label: 'Termii Live Logs', icon: Activity },
        { id: 'numberStatus', label: 'Number Status', icon: ShieldCheck },
    ];

    const handleSendBroadcast = async () => {
        if (!message.trim()) {
            showAlert('warning', 'Validation Error', 'Please enter a message to broadcast.');
            return;
        }
        if (!recipients.length) {
            showAlert('warning', 'Validation Error', 'Please enter or upload at least one recipient phone number.');
            return;
        }
        if (!selectedSenderId) {
            showAlert('warning', 'Validation Error', 'Please select or register a sender identity before broadcasting.');
            return;
        }

        setIsSending(true);
        try {
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: sandboxEnabled 
                        ? `Sandbox Broadcast - ${selectedRoute.toUpperCase()}`
                        : `Broadcast - ${selectedRoute.toUpperCase()}`,
                    channel: selectedRoute,
                    message,
                    recipients,
                    sandbox: sandboxEnabled,
                    sender_id: selectedSenderId
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to dispatch broadcast');
            }

            showAlert('success', 
                sandboxEnabled ? 'Sandbox Simulation Successful' : 'Broadcast Dispatched',
                sandboxEnabled 
                    ? 'Sandbox broadcast simulated successfully!'
                    : 'Campaign broadcast dispatched successfully!'
            );

            // Reset Composer state
            setMessage('');
            
            // Refresh history, wallet balance, and inbox logs
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['termii-balance'] });
            queryClient.invalidateQueries({ queryKey: ['termii-inbox'] });
        } catch (err: any) {
            showAlert('error', 'Broadcasting Error', err.message);
        } finally {
            setIsSending(false);
        }
    };

    const handleSendTest = async (testPhone: string) => {
        if (!message.trim()) {
            showAlert('warning', 'Validation Error', 'Please type a test message in the composer first.');
            return;
        }
        if (!selectedSenderId) {
            showAlert('warning', 'Validation Error', 'Please select or register a sender identity first.');
            return;
        }
        try {
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Test Message - ${selectedRoute.toUpperCase()}`,
                    channel: selectedRoute,
                    message,
                    recipients: [testPhone],
                    sandbox: sandboxEnabled,
                    sender_id: selectedSenderId
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to dispatch test message');
            }

            showAlert('success', 'Test Message Sent', 'Test message dispatched successfully!');
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['termii-balance'] });
            queryClient.invalidateQueries({ queryKey: ['termii-inbox'] });
        } catch (err: any) {
            showAlert('error', 'Test Send Error', err.message);
        }
    };

    const handleSendPhonebookCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phonebookId.trim()) {
            showAlert('warning', 'Validation Error', 'Please enter a valid Termii Phonebook ID.');
            return;
        }
        if (!phonebookMessage.trim()) {
            showAlert('warning', 'Validation Error', 'Please enter the campaign message body.');
            return;
        }
        if (!selectedSenderId) {
            showAlert('warning', 'Validation Error', 'Please select or register a sender identity.');
            return;
        }
        if (scheduleStatus === 'scheduled' && !scheduleTime) {
            showAlert('warning', 'Validation Error', 'Please specify a schedule time for this campaign.');
            return;
        }

        setIsSendingPhonebookCampaign(true);
        try {
            const res = await fetch('/api/campaigns/termii-campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_id: selectedSenderId,
                    message: phonebookMessage,
                    channel: phonebookRoute,
                    phonebook_id: phonebookId,
                    campaign_type: campaignType,
                    schedule_sms_status: scheduleStatus,
                    schedule_time: scheduleTime ? format(new Date(scheduleTime), 'dd-MM-yyyy HH:mm') : undefined,
                    enable_link_tracking: linkTracking,
                    message_type: messageType
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to dispatch Phonebook campaign');
            }

            showAlert('success', 'Campaign Dispatched', data.message || 'Phonebook campaign dispatched successfully!');
            setPhonebookId('');
            setPhonebookMessage('');
            setScheduleTime('');
            
            // Refresh queries
            queryClient.invalidateQueries({ queryKey: ['termii-campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['termii-balance'] });
        } catch (err: any) {
            showAlert('error', 'Campaign Error', err.message);
        } finally {
            setIsSendingPhonebookCampaign(false);
        }
    };

    const handleRetryTermiiCampaign = async (campaignId: string) => {
        try {
            const res = await fetch(`/api/campaigns/termii-campaigns?campaign_id=${campaignId}`, {
                method: 'PATCH'
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to retry campaign');
            }

            showAlert('success', 'Campaign Retried', data.message || 'Campaign retry successfully triggered!');
            queryClient.invalidateQueries({ queryKey: ['termii-campaigns'] });
        } catch (err: any) {
            showAlert('error', 'Retry Error', err.message);
        }
    };

    const handleViewTermiiCampaignDetails = async (campaignId: string) => {
        setIsFetchingCampaignDetail(true);
        setCampaignDetailResult(null);
        setSelectedTermiiCampaign(campaignId);
        try {
            const res = await fetch(`/api/campaigns/termii-campaigns?campaign_id=${campaignId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch details');
            setCampaignDetailResult(data);
        } catch (err: any) {
            showAlert('error', 'Detail Fetch Error', err.message);
            setSelectedTermiiCampaign(null);
        } finally {
            setIsFetchingCampaignDetail(false);
        }
    };

    const handleNumberLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lookupPhoneNumber.trim()) return;

        setIsLookingUp(true);
        setLookupError('');
        setLookupResult(null);

        try {
            const res = await fetch(`/api/campaigns/status?phone_number=${encodeURIComponent(lookupPhoneNumber)}&country_code=${lookupCountryCode}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to look up number status');
            }

            if (data.result && data.result.length > 0) {
                setLookupResult(data.result[0]);
            } else {
                throw new Error('No portability details found for this phone number.');
            }
        } catch (err: any) {
            setLookupError(err.message || 'An error occurred during lookup.');
        } finally {
            setIsLookingUp(false);
        }
    };

    // Calculate total campaign reach in historical data
    const totalCampaignReach = campaignHistory?.reduce((acc: number, curr: any) => acc + (curr.recipientsCount || 0), 0) || 0;

    // Filtered Termii Live Logs
    const filteredTermiiLogs = termiiInboxData?.filter((log: any) => {
        if (!searchLogQuery) return true;
        const q = searchLogQuery.toLowerCase();
        return (
            log.receiver?.toLowerCase().includes(q) ||
            log.message_id?.toLowerCase().includes(q) ||
            log.message?.toLowerCase().includes(q) ||
            log.sms_type?.toLowerCase().includes(q)
        );
    }) || [];

    // Paginated logs
    const totalPages = Math.ceil(filteredTermiiLogs.length / logsPerPage);
    const startIndex = (currentPage - 1) * logsPerPage;
    const currentLogs = filteredTermiiLogs.slice(startIndex, startIndex + logsPerPage);

    // Paginated Campaign History (Local)
    const localHistoryLogs = (campaignHistory || []).filter((camp: any) => {
        if (!searchHistoryQuery) return true;
        const q = searchHistoryQuery.toLowerCase();
        return (
            camp.title?.toLowerCase().includes(q) ||
            camp.message?.toLowerCase().includes(q) ||
            camp.channel?.toLowerCase().includes(q) ||
            camp.status?.toLowerCase().includes(q) ||
            camp.recipientsCount?.toString().includes(q)
        );
    });
    const localHistoryTotalPages = Math.ceil(localHistoryLogs.length / historyItemsPerPage);
    const localHistoryStartIndex = (historyCurrentPage - 1) * historyItemsPerPage;
    const currentLocalHistory = localHistoryLogs.slice(localHistoryStartIndex, localHistoryStartIndex + historyItemsPerPage);

    // Paginated Campaign History (Termii)
    const termiiHistoryLogs = (termiiCampaignsData?.content || []).filter((camp: any) => {
        if (!searchHistoryQuery) return true;
        const q = searchHistoryQuery.toLowerCase();
        return (
            camp.campaign_id?.toLowerCase().includes(q) ||
            camp.phone_book?.toLowerCase().includes(q) ||
            camp.camp_type?.toLowerCase().includes(q) ||
            camp.status?.toLowerCase().includes(q) ||
            camp.total_recipients?.toString().includes(q)
        );
    });
    const termiiHistoryTotalPages = Math.ceil(termiiHistoryLogs.length / historyItemsPerPage);
    const termiiHistoryStartIndex = (historyCurrentPage - 1) * historyItemsPerPage;
    const currentTermiiHistory = termiiHistoryLogs.slice(termiiHistoryStartIndex, termiiHistoryStartIndex + historyItemsPerPage);

    return (
        <main className="flex-1 flex justify-center py-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen">
            <div className="w-full max-w-[1200px] px-6">
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="size-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Outreach Center</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            Marketing <span className="text-primary italic">Campaigns</span>
                        </h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Multi-channel communication hub for student engagement</p>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Termii Wallet Balance */}
                        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-4 px-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl min-w-[200px]">
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black uppercase text-slate-400">Termii Account Balance</span>
                                <span className="text-xl font-black text-primary">
                                    {balanceData?.currency || 'NGN'} {balanceData?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? '0.00'}
                                </span>
                            </div>
                        </div>

                        {/* Reach Stats Card */}
                        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-4 px-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl min-w-[180px]">
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black uppercase text-slate-400">Total Campaign Reach</span>
                                <span className="text-xl font-black text-slate-900 dark:text-white">{totalCampaignReach.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs.Root
                    className="flex flex-col"
                    defaultValue="sms"
                    onValueChange={(value) => setActiveTab(value)}
                >
                    <Tabs.List className="flex items-center gap-1.5 bg-white/50 backdrop-blur-md dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm mb-10 w-full sm:w-fit overflow-x-auto no-scrollbar whitespace-nowrap">
                        {tabs.map((tab) => (
                            <Tabs.Trigger
                                key={tab.id}
                                value={tab.id}
                                className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 cursor-pointer
                                    ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 z-10'
                                        : 'text-slate-500 hover:bg-white dark:hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon className="size-3.5 sm:size-4" />
                                <span className="inline">{tab.label}</span>
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>

                    {/* Tab 1: Single SMS */}
                    <Tabs.Content value="sms" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl">
                            <SmsMain 
                                selectedRoute={selectedRoute}
                                onRouteSelect={setSelectedRoute}
                                message={message}
                                onMessageChange={setMessage}
                                recipients={recipients}
                                onRecipientsChange={setRecipients}
                                sandboxEnabled={sandboxEnabled}
                                onSandboxToggle={setSandboxEnabled}
                                onSendTest={handleSendTest}
                                balance={balanceData?.balance}
                                currency={balanceData?.currency}
                                accountUser={balanceData?.user}
                                prices={balanceData?.prices}
                                senderIds={senderIdsData?.content}
                                selectedSenderId={selectedSenderId}
                                onSenderIdSelect={setSelectedSenderId}
                                onRefreshSenderIds={refetchSenderIds}
                            />
                        </div>
                    </Tabs.Content>

                    {/* Tab 2: Phonebook Campaigns */}
                    <Tabs.Content value="phonebookCampaign" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                                    <ListTodo className="w-5 h-5" />
                                </div>
                                Send Phonebook Campaign
                            </h3>

                            <form onSubmit={handleSendPhonebookCampaign} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Configuration Options */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Sender ID / Identity</label>
                                        <select
                                            value={selectedSenderId}
                                            onChange={(e) => setSelectedSenderId(e.target.value)}
                                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold focus:border-primary focus:ring-primary cursor-pointer"
                                            required
                                        >
                                            <option value="" disabled>Select Sender ID</option>
                                            {senderIdsData?.content?.map((item: any) => (
                                                <option key={item.sender_id} value={item.sender_id}>
                                                    {item.sender_id} ({item.status})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Phonebook Unique ID</label>
                                        <input
                                            type="text"
                                            value={phonebookId}
                                            onChange={(e) => setPhonebookId(e.target.value)}
                                            placeholder="e.g. 2d9f4a02-85b8-45e5-9f5b-30f93ef472e2"
                                            className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold focus:border-primary focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Route Channel</label>
                                            <select
                                                value={phonebookRoute}
                                                onChange={(e) => setPhonebookRoute(e.target.value)}
                                                className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold focus:border-primary"
                                            >
                                                <option value="generic">Generic (Promotional)</option>
                                                <option value="dnd">DND (Transactional)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Message Encoding</label>
                                            <select
                                                value={messageType}
                                                onChange={(e) => setMessageType(e.target.value)}
                                                className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold focus:border-primary"
                                            >
                                                <option value="Plain">Plain Text</option>
                                                <option value="Unicode">Unicode (Special Characters)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Campaign Type</label>
                                            <select
                                                value={campaignType}
                                                onChange={(e) => setCampaignType(e.target.value)}
                                                className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold focus:border-primary"
                                            >
                                                <option value="regular">Regular</option>
                                                <option value="personalized">Personalized</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col justify-end pb-1.5">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={linkTracking}
                                                    onChange={(e) => setLinkTracking(e.target.checked)}
                                                    className="rounded border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-primary focus:ring-primary size-4"
                                                />
                                                <span className="text-xs font-black uppercase text-slate-500 tracking-tight">Link Tracking</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/5">
                                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Campaign Scheduling</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="scheduleStatus"
                                                    value="regular"
                                                    checked={scheduleStatus === 'regular'}
                                                    onChange={() => setScheduleStatus('regular')}
                                                    className="text-primary focus:ring-primary"
                                                />
                                                Send Immediately
                                            </label>
                                            <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="scheduleStatus"
                                                    value="scheduled"
                                                    checked={scheduleStatus === 'scheduled'}
                                                    onChange={() => setScheduleStatus('scheduled')}
                                                    className="text-primary focus:ring-primary"
                                                />
                                                Schedule Send
                                            </label>
                                        </div>

                                        {scheduleStatus === 'scheduled' && (
                                            <div className="space-y-1 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                                    <Calendar size={12} /> Schedule Date & Time
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={scheduleTime}
                                                    onChange={(e) => setScheduleTime(e.target.value)}
                                                    className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold focus:border-primary"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Message Composition */}
                                <div className="lg:col-span-7 flex flex-col space-y-4">
                                    <div className="flex-1 flex flex-col space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Campaign Message Content</label>
                                        <textarea
                                            value={phonebookMessage}
                                            onChange={(e) => setPhonebookMessage(e.target.value)}
                                            placeholder="Write your message here..."
                                            className="w-full flex-1 min-h-[200px] text-sm rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-medium focus:border-primary focus:ring-primary p-4"
                                            required
                                        />
                                    </div>

                                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-2xl text-xs flex gap-3">
                                        <AlertTriangle className="size-5 shrink-0" />
                                        <div>
                                            <span className="font-bold block uppercase mb-0.5 tracking-wider text-[10px]">Promotional route delivery restrictions</span>
                                            Promotional messages sent via the generic route are subject to time restrictions in Nigeria (no delivery between 8:00 PM and 8:00 AM).
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSendingPhonebookCampaign}
                                        className="py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary/95 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <Send size={14} />
                                        {isSendingPhonebookCampaign ? 'Dispatching Campaign...' : 'Send Phonebook Campaign'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="email" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl min-h-[600px] flex flex-col items-center justify-center text-center">
                            <div className="size-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-500 mb-6">
                                <Mail size={40} />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Newsletter Builder</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 text-sm">Design and broadcast premium newsletters to your subscribers.</p>
                            <Link href="/dashboard/campaigns/newsletter">
                                <Button variant="primary" icon={Send} className="px-10 py-4 text-xs font-black uppercase tracking-widest cursor-pointer">
                                    Open Designer
                                </Button>
                            </Link>
                        </div>
                    </Tabs.Content>

                    {/* Tab 4: Campaign History */}
                    <Tabs.Content value="history" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <h3 className="text-xl font-black flex items-center gap-3 w-full sm:w-auto">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <BarChart3 className="w-5 h-5" />
                                    </div>
                                    Campaign History
                                </h3>

                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-64">
                                        <input
                                            type="text"
                                            value={searchHistoryQuery}
                                            onChange={(e) => setSearchHistoryQuery(e.target.value)}
                                            placeholder="Search title, ID, or number..."
                                            className="w-full text-xs pl-8 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl font-bold focus:border-primary focus:ring-primary"
                                        />
                                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>


                                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                                    <button
                                        onClick={() => setHistorySubTab('local')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            historySubTab === 'local' 
                                                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' 
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                                        }`}
                                    >
                                        Local Broadcasts
                                    </button>
                                    <button
                                        onClick={() => setHistorySubTab('termii')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            historySubTab === 'termii' 
                                                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' 
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                                        }`}
                                    >
                                        Termii API Campaigns
                                    </button>
                                </div>
                                </div>
                            </div>

                            {historySubTab === 'local' ? (
                                isLoadingHistory ? (
                                    <div className="p-10 text-center text-slate-500 animate-pulse">Loading broadcast history...</div>
                                ) : campaignHistory && campaignHistory.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                    <th className="py-4 px-4 w-12 text-center">S/N</th>
                                                    <th className="py-4 px-4">Campaign Title</th>
                                                    <th className="py-4 px-4">Channel</th>
                                                    <th className="py-4 px-4">Message</th>
                                                    <th className="py-4 px-4">Recipients</th>
                                                    <th className="py-4 px-4">Units Cost</th>
                                                    <th className="py-4 px-4">Status</th>
                                                    <th className="py-4 px-4">Sent At</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                                {currentLocalHistory.map((camp: any, idx: number) => (
                                                    <tr 
                                                        key={camp._id} 
                                                        onClick={() => setSelectedLocalCampaign(camp)}
                                                        className="text-sm font-medium hover:bg-slate-50/55 dark:hover:bg-slate-800/20 cursor-pointer transition-colors"
                                                    >
                                                        <td className="py-4 px-4 text-center font-black text-slate-400 text-xs">
                                                            {localHistoryStartIndex + idx + 1}
                                                        </td>
                                                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-100 max-w-[180px] truncate">
                                                            {camp.title}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider border ${
                                                                camp.channel === 'dnd' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40' :
                                                                camp.channel === 'whatsapp' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40' :
                                                                camp.channel === 'voice' ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800/40' :
                                                                'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                                            }`}>
                                                                {camp.channel}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 max-w-[250px] truncate text-slate-500 dark:text-slate-400 font-mono text-xs" title={camp.message}>
                                                            {camp.message}
                                                        </td>
                                                        <td className="py-4 px-4 font-bold">
                                                            {camp.recipientsCount}
                                                        </td>
                                                        <td className="py-4 px-4 text-slate-500">
                                                            {camp.costUnits} units
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-1.5">
                                                                {camp.status === 'sent' ? (
                                                                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                                                        <CheckCircle size={14} /> Sent
                                                                    </span>
                                                                ) : camp.status === 'failed' ? (
                                                                    <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                                                                        <XCircle size={14} /> Failed
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                                                        <Clock size={14} /> Pending
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-xs text-slate-400 dark:text-slate-500">
                                                            {format(new Date(camp.sentAt), 'dd MMM yyyy, h:mm a')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {/* Pagination Controls */}
                                    {localHistoryTotalPages > 1 && (
                                        <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                                            <span className="text-xs text-slate-500 font-bold">
                                                Showing {localHistoryStartIndex + 1} to {Math.min(localHistoryStartIndex + historyItemsPerPage, localHistoryLogs.length)} of {localHistoryLogs.length} broadcasts
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setHistoryCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={historyCurrentPage === 1}
                                                    className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                >
                                                    Prev
                                                </button>
                                                <span className="text-xs text-slate-600 dark:text-slate-400 font-black">
                                                    Page {historyCurrentPage} of {localHistoryTotalPages}
                                                </span>
                                                <button
                                                    onClick={() => setHistoryCurrentPage(prev => Math.min(prev + 1, localHistoryTotalPages))}
                                                    disabled={historyCurrentPage === localHistoryTotalPages}
                                                    className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                ) : (
                                    <div className="p-20 text-center">
                                        <div className="size-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <BarChart3 size={32} className="text-slate-400" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">No Local History</h3>
                                        <p className="text-sm text-slate-500 max-w-xs mx-auto">Local campaign history is empty. Send your first broadcast to see analytics!</p>
                                    </div>
                                )
                            ) : (
                                isLoadingTermiiCampaigns ? (
                                    <div className="p-10 text-center text-slate-500 animate-pulse">Loading Termii API campaigns...</div>
                                ) : termiiCampaignsData?.content && termiiCampaignsData.content.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                    <th className="py-4 px-4 w-12 text-center">S/N</th>
                                                    <th className="py-4 px-4">Campaign ID</th>
                                                    <th className="py-4 px-4">Phone Book</th>
                                                    <th className="py-4 px-4">Type</th>
                                                    <th className="py-4 px-4">Recipients</th>
                                                    <th className="py-4 px-4">Status</th>
                                                    <th className="py-4 px-4">Run At</th>
                                                    <th className="py-4 px-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                                {currentTermiiHistory.map((camp: any, idx: number) => (
                                                    <tr 
                                                        key={camp.campaign_id} 
                                                        onClick={() => handleViewTermiiCampaignDetails(camp.campaign_id)}
                                                        className="text-sm font-medium hover:bg-slate-50/55 dark:hover:bg-slate-800/20 cursor-pointer transition-colors"
                                                    >
                                                        <td className="py-4 px-4 text-center font-black text-slate-400 text-xs">
                                                            {termiiHistoryStartIndex + idx + 1}
                                                        </td>
                                                        <td className="py-4 px-4 font-mono font-bold text-slate-800 dark:text-slate-100">
                                                            {camp.campaign_id}
                                                        </td>
                                                        <td className="py-4 px-4 font-bold">
                                                            {camp.phone_book}
                                                        </td>
                                                        <td className="py-4 px-4 text-xs uppercase text-slate-400">
                                                            {camp.camp_type || 'regular'}
                                                        </td>
                                                        <td className="py-4 px-4 font-bold">
                                                            {camp.total_recipients}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider border ${
                                                                camp.status === 'DELIVERED' 
                                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40' 
                                                                    : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/40'
                                                            }`}>
                                                                {camp.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-xs text-slate-400 dark:text-slate-500">
                                                            {camp.run_at}
                                                        </td>
                                                        <td className="py-4 px-4 text-right flex items-center justify-end gap-1.5">
                                                            {camp.status !== 'DELIVERED' && (
                                                                <button
                                                                    onClick={() => handleRetryTermiiCampaign(camp.campaign_id)}
                                                                    title="Retry Failed Campaign"
                                                                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                                                >
                                                                    <RefreshCw size={14} />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleViewTermiiCampaignDetails(camp.campaign_id)}
                                                                title="View Details"
                                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                                            >
                                                                <Eye size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {/* Pagination Controls */}
                                    {termiiHistoryTotalPages > 1 && (
                                        <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                                            <span className="text-xs text-slate-500 font-bold">
                                                Showing {termiiHistoryStartIndex + 1} to {Math.min(termiiHistoryStartIndex + historyItemsPerPage, termiiHistoryLogs.length)} of {termiiHistoryLogs.length} campaigns
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setHistoryCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={historyCurrentPage === 1}
                                                    className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                >
                                                    Prev
                                                </button>
                                                <span className="text-xs text-slate-600 dark:text-slate-400 font-black">
                                                    Page {historyCurrentPage} of {termiiHistoryTotalPages}
                                                </span>
                                                <button
                                                    onClick={() => setHistoryCurrentPage(prev => Math.min(prev + 1, termiiHistoryTotalPages))}
                                                    disabled={historyCurrentPage === termiiHistoryTotalPages}
                                                    className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                ) : (
                                    <div className="p-20 text-center">
                                        <div className="size-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <ListTodo size={32} className="text-slate-400" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">No Phonebook Campaigns</h3>
                                        <p className="text-sm text-slate-500 max-w-xs mx-auto">No campaigns have been fetched from your Termii account registry.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </Tabs.Content>

                    {/* Tab 5: Live Logs */}
                    <Tabs.Content value="termiiLogs" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h3 className="text-xl font-black flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    Termii Live Transmission Logs
                                </h3>

                                <div className="relative w-full sm:w-72">
                                    <input
                                        type="text"
                                        value={searchLogQuery}
                                        onChange={(e) => setSearchLogQuery(e.target.value)}
                                        placeholder="Search message, recipient, or ID..."
                                        className="w-full text-xs pl-8 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl font-bold focus:border-primary focus:ring-primary"
                                    />
                                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            {isLoadingInbox ? (
                                <div className="p-10 text-center text-slate-500 animate-pulse">Loading live message logs...</div>
                            ) : filteredTermiiLogs.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                    <th className="py-4 px-4 w-12 text-center">S/N</th>
                                                    <th className="py-4 px-4">Recipient</th>
                                                    <th className="py-4 px-4">Message</th>
                                                    <th className="py-4 px-4">Channel</th>
                                                    <th className="py-4 px-4">Billing Charge</th>
                                                    <th className="py-4 px-4">Status</th>
                                                    <th className="py-4 px-4">Message ID</th>
                                                    <th className="py-4 px-4">Sent At</th>
                                                    <th className="py-4 px-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                                {currentLogs.map((log: any, idx: number) => (
                                                    <tr 
                                                        key={log.message_id || idx} 
                                                        onClick={() => setSelectedLog(log)}
                                                        className="text-sm font-medium hover:bg-slate-50/55 dark:hover:bg-slate-800/20 cursor-pointer transition-colors"
                                                    >
                                                        <td className="py-4 px-4 text-center font-black text-slate-400 text-xs">
                                                            {startIndex + idx + 1}
                                                        </td>
                                                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-100">
                                                            {log.receiver}
                                                        </td>
                                                        <td className="py-4 px-4 max-w-[200px] truncate text-slate-500 dark:text-slate-400 font-mono text-xs" title={log.message}>
                                                            {log.message}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider border bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 dark:border-slate-700">
                                                                {log.sms_type || 'generic'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-slate-500 font-bold">
                                                            ₦{(log.amount || 1).toFixed(2)}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 ${
                                                                log.status?.toLowerCase() === 'delivered' 
                                                                    ? 'text-emerald-500' 
                                                                    : log.status?.toLowerCase() === 'failed' 
                                                                        ? 'text-red-500' 
                                                                        : 'text-amber-500'
                                                            }`}>
                                                                {log.status?.toLowerCase() === 'delivered' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                                {log.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-xs font-mono text-slate-400 max-w-[140px] truncate" title={log.message_id}>
                                                            {log.message_id}
                                                        </td>
                                                        <td className="py-4 px-4 text-xs text-slate-400 dark:text-slate-500">
                                                            {log.created_at}
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedLog(log);
                                                                }}
                                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                                            <span className="text-xs text-slate-500 font-bold">
                                                Showing {startIndex + 1} to {Math.min(startIndex + logsPerPage, filteredTermiiLogs.length)} of {filteredTermiiLogs.length} logs
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                >
                                                    Prev
                                                </button>
                                                <span className="text-xs text-slate-600 dark:text-slate-400 font-black">
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-20 text-center">
                                    <div className="size-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Activity size={32} className="text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No Transmission Logs</h3>
                                    <p className="text-sm text-slate-500 max-w-xs mx-auto">No records found matching your search query or logs list is empty.</p>
                                </div>
                            )}
                        </div>
                    </Tabs.Content>

                    {/* Tab 6: Number Status */}
                    <Tabs.Content value="numberStatus" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                Number Status & Portability Insights
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Form Column */}
                                <div className="lg:col-span-5 space-y-6">
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Detect fake, non-existent, or ported phone numbers before dispatching your campaign. 
                                        This helps optimize route pricing and improves campaign deliverability rates.
                                    </p>

                                    <form onSubmit={handleNumberLookup} className="space-y-4">
                                        {lookupError && (
                                            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-xs font-semibold">
                                                ⚠️ {lookupError}
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Phone Number</label>
                                            <input
                                                type="text"
                                                value={lookupPhoneNumber}
                                                onChange={(e) => setLookupPhoneNumber(e.target.value)}
                                                placeholder="e.g. 07065250817 or 2347065250817"
                                                className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold focus:border-primary focus:ring-primary"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">ISO Country Code</label>
                                            <select
                                                value={lookupCountryCode}
                                                onChange={(e) => setLookupCountryCode(e.target.value)}
                                                className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold focus:border-primary focus:ring-primary cursor-pointer"
                                            >
                                                <option value="NG">Nigeria (NG)</option>
                                                <option value="GH">Ghana (GH)</option>
                                                <option value="KE">Kenya (KE)</option>
                                                <option value="ZA">South Africa (ZA)</option>
                                            </select>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLookingUp}
                                            className="w-full py-3 bg-primary text-white rounded-xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors cursor-pointer disabled:opacity-55"
                                        >
                                            <Search size={14} />
                                            {isLookingUp ? 'Analyzing number...' : 'Verify Number Status'}
                                        </button>
                                    </form>
                                </div>

                                {/* Results Column */}
                                <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-h-[300px]">
                                    {lookupResult ? (
                                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Analysis Result</h4>
                                                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 font-black">
                                                    STATUS {lookupResult.status || 200}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black uppercase text-slate-400">Universal Format</span>
                                                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
                                                        <Smartphone size={14} className="text-slate-400" />
                                                        {lookupResult.format?.universalNumberFormat || lookupResult.routeDetail?.number}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black uppercase text-slate-400">Ported Number</span>
                                                    <div className="flex items-center gap-1.5 font-bold">
                                                        {lookupResult.routeDetail?.ported === 1 ? (
                                                            <span className="text-amber-500 flex items-center gap-1">
                                                                <AlertTriangle size={14} /> Yes (Ported)
                                                            </span>
                                                        ) : (
                                                            <span className="text-emerald-500 flex items-center gap-1">
                                                                <CheckCircle size={14} /> No (Original Operator)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black uppercase text-slate-400">Operator Network</span>
                                                    <div className="font-bold text-slate-800 dark:text-white">
                                                        {lookupResult.operatorDetail?.operatorName || 'Unknown Operator'} ({lookupResult.operatorDetail?.operatorCode})
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black uppercase text-slate-400">Line Connection Type</span>
                                                    <div className="font-bold text-slate-800 dark:text-white">
                                                        {lookupResult.operatorDetail?.lineType || 'Mobile'}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black uppercase text-slate-400">Country & ISO</span>
                                                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
                                                        <Globe size={14} className="text-slate-400" />
                                                        {lookupResult.countryDetail?.iso || 'NG'} (Code: +{lookupResult.countryDetail?.countryCode})
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black uppercase text-slate-400">Ref ID</span>
                                                    <div className="font-mono text-[10px] text-slate-400 select-all truncate" title={lookupResult.refId}>
                                                        {lookupResult.refId}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-slate-400 font-bold p-8">
                                            <div className="size-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ShieldCheck size={28} className="text-slate-400" />
                                            </div>
                                            Input a subscriber's phone number on the left and query status details.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>

            {/* Popup Message Transmission Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <h4 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
                            <Activity className="text-primary size-5" />
                            Transmission Details
                        </h4>

                        <div className="space-y-4 text-sm font-medium">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Recipient</span>
                                <span className="font-bold text-slate-800 dark:text-white">{selectedLog.receiver}</span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</span>
                                <span className={`text-xs font-black uppercase tracking-tighter flex items-center gap-1 ${
                                    selectedLog.status?.toLowerCase() === 'delivered' 
                                        ? 'text-emerald-500' 
                                        : selectedLog.status?.toLowerCase() === 'failed' 
                                            ? 'text-red-500' 
                                            : 'text-amber-500'
                                }`}>
                                    {selectedLog.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Channel</span>
                                <span className="text-xs px-2 py-0.5 rounded font-black uppercase tracking-wider border bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 dark:border-slate-700">
                                    {selectedLog.sms_type || 'generic'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cost / Charge</span>
                                <span className="font-bold text-slate-800 dark:text-white">₦{(selectedLog.amount || 1).toFixed(2)}</span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Message ID</span>
                                <span className="font-mono text-xs text-slate-500 max-w-[200px] truncate">{selectedLog.message_id}</span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sent At</span>
                                <span className="text-xs text-slate-500">{selectedLog.created_at}</span>
                            </div>

                            <div className="pt-2">
                                <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Message Body</span>
                                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
                                    {selectedLog.message}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-colors"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Termii Campaign Detail Modal */}
            {selectedTermiiCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <h4 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
                            <ListTodo className="text-primary size-5" />
                            Campaign Details
                        </h4>

                        {isFetchingCampaignDetail ? (
                            <div className="p-10 text-center text-slate-500 animate-pulse font-bold">Fetching campaign metrics from Termii...</div>
                        ) : campaignDetailResult ? (
                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Campaign ID</span>
                                    <span className="font-mono text-slate-800 dark:text-white font-bold">{campaignDetailResult.campaignId}</span>
                                </div>

                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phone Book</span>
                                    <span className="font-bold text-slate-800 dark:text-white">{campaignDetailResult.phonebookName}</span>
                                </div>

                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sender ID</span>
                                    <span className="font-bold text-slate-800 dark:text-white">{campaignDetailResult.sender}</span>
                                </div>

                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Route Channel</span>
                                    <span className="text-xs px-2 py-0.5 rounded font-black uppercase border bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 dark:border-slate-700">
                                        {campaignDetailResult.smsType}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Recipients</span>
                                    <span className="font-bold text-slate-800 dark:text-white">{campaignDetailResult.totalRecipient}</span>
                                </div>

                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Billing Cost</span>
                                    <span className="font-bold text-slate-800 dark:text-white">₦{Number(campaignDetailResult.cost || 0).toFixed(2)}</span>
                                </div>

                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Delivery Status</span>
                                    <span className={`text-xs font-black uppercase tracking-tighter ${
                                        campaignDetailResult.status === 'DELIVERED' ? 'text-emerald-500' : 'text-red-500'
                                    }`}>
                                        {campaignDetailResult.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Scheduled Run</span>
                                    <span className="text-xs text-slate-500">{campaignDetailResult.runAt}</span>
                                </div>

                                <div className="pt-2">
                                    <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Message Content</span>
                                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-all max-h-36 overflow-y-auto">
                                        {campaignDetailResult.message}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 text-center text-red-500 font-bold">Failed to load campaign data.</div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => {
                                    setSelectedTermiiCampaign(null);
                                    setCampaignDetailResult(null);
                                }}
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-colors"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Local Campaign Detail Modal */}
            {selectedLocalCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <h4 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
                            <BarChart3 className="text-primary size-5" />
                            Local Broadcast Details
                        </h4>

                        <div className="space-y-4 text-sm font-medium">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Campaign Title</span>
                                <span className="font-bold text-slate-800 dark:text-white max-w-[250px] truncate text-right">
                                    {selectedLocalCampaign.title}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Channel</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider border ${
                                    selectedLocalCampaign.channel === 'dnd' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40' :
                                    selectedLocalCampaign.channel === 'whatsapp' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40' :
                                    selectedLocalCampaign.channel === 'voice' ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800/40' :
                                    'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                }`}>
                                    {selectedLocalCampaign.channel}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Recipients</span>
                                <span className="font-bold text-slate-800 dark:text-white">{selectedLocalCampaign.recipientsCount}</span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimated Cost</span>
                                <span className="font-bold text-slate-800 dark:text-white">{selectedLocalCampaign.costUnits} Units</span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</span>
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                    {selectedLocalCampaign.status === 'sent' ? <CheckCircle size={14} /> : <Clock size={14} />} 
                                    <span className="capitalize">{selectedLocalCampaign.status}</span>
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sent At</span>
                                <span className="text-xs text-slate-500">
                                    {selectedLocalCampaign.sentAt ? format(new Date(selectedLocalCampaign.sentAt), 'dd MMM yyyy, h:mm a') : 'N/A'}
                                </span>
                            </div>

                            <div className="pt-2">
                                <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Message Content</span>
                                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-all max-h-36 overflow-y-auto">
                                    {selectedLocalCampaign.message}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setSelectedLocalCampaign(null)}
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-colors"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'sms' && (
                <StickyFooter
                    estimatedCost={smsMetrics.costStr}
                    estimatedDelivery={smsMetrics.deliveryStr}
                    totalRecipients={smsMetrics.count}
                    onSaveDraft={() => showAlert('success', 'Draft Saved', 'Your campaign draft has been successfully saved.')}
                    onSendBroadcast={handleSendBroadcast}
                    isSending={isSending}
                />
            )}

            {popupAlert && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center animate-in zoom-in-95 duration-200">
                        <div className="flex justify-center mb-6">
                            {popupAlert.type === 'success' && (
                                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full animate-bounce">
                                    <CheckCircle className="size-10" />
                                </div>
                            )}
                            {popupAlert.type === 'error' && (
                                <div className="p-4 bg-red-500/10 text-red-500 rounded-full">
                                    <XCircle className="size-10" />
                                </div>
                            )}
                            {popupAlert.type === 'warning' && (
                                <div className="p-4 bg-amber-500/10 text-amber-500 rounded-full">
                                    <AlertTriangle className="size-10" />
                                </div>
                            )}
                            {popupAlert.type === 'info' && (
                                <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-full">
                                    <Activity className="size-10" />
                                </div>
                            )}
                        </div>

                        <h4 className="text-lg font-black tracking-tight mb-2 text-slate-900 dark:text-white">
                            {popupAlert.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                            {popupAlert.message}
                        </p>

                        <button
                            onClick={() => setPopupAlert(null)}
                            className="w-full py-3 bg-primary text-white hover:bg-primary/95 active:scale-[0.98] rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all shadow-lg shadow-primary/20"
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}