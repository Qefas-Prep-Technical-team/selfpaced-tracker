import React, { useState } from 'react';
import { Settings, Plus, ArrowLeft, Send } from 'lucide-react';

interface DeliveryRoute {
    id: string;
    name: string;
    description: string;
    price: string;
    priceUnit: string;
    recommended?: boolean;
}

interface SenderIdItem {
    sender_id: string;
    status: 'active' | 'pending' | 'blocked';
    country?: string;
    company?: string;
    usecase?: string;
}

interface SMSConfigCardProps {
    deliveryRoutes?: DeliveryRoute[];
    onRouteSelect?: (routeId: string) => void;
    selectedRoute?: string;
    balance?: number;
    currency?: string;
    accountUser?: string;
    senderIds?: SenderIdItem[];
    selectedSenderId?: string;
    onSenderIdSelect?: (senderId: string) => void;
    onRefreshSenderIds?: () => void;
}

export const SMSConfigCard: React.FC<SMSConfigCardProps> = ({
    deliveryRoutes = [],
    onRouteSelect,
    selectedRoute = 'dnd',
    balance = 0.00,
    currency = 'NGN',
    accountUser = 'Termii Account',
    senderIds = [],
    selectedSenderId = '',
    onSenderIdSelect,
    onRefreshSenderIds,
}) => {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [newSenderId, setNewSenderId] = useState('');
    const [company, setCompany] = useState('');
    const [useCase, setUseCase] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleRequestSenderId = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSenderId || !company || !useCase) {
            setErrorMsg('All fields are required.');
            return;
        }
        if (newSenderId.length < 3 || newSenderId.length > 11) {
            setErrorMsg('Sender ID must be between 3 and 11 characters.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await fetch('/api/campaigns/sender-id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_id: newSenderId,
                    company,
                    use_case: useCase
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit Sender ID request.');
            }

            setSuccessMsg('Request submitted successfully! It is pending approval.');
            setNewSenderId('');
            setCompany('');
            setUseCase('');
            onRefreshSenderIds?.();
            
            // Go back after 2 seconds
            setTimeout(() => {
                setShowRequestForm(false);
                setSuccessMsg('');
            }, 2500);
        } catch (err: any) {
            setErrorMsg(err.message || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 size-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />
            
            <h3 className="text-xl font-black mb-6 flex items-center justify-between tracking-tight">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <Settings className="w-5 h-5" />
                    </div>
                    <span>Gateway Logic</span>
                </div>
                {!showRequestForm && (
                    <button
                        onClick={() => setShowRequestForm(true)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white px-3 py-1.5 rounded-xl font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                    >
                        <Plus size={14} /> Request New
                    </button>
                )}
            </h3>

            {showRequestForm ? (
                <form onSubmit={handleRequestSenderId} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowRequestForm(false);
                                setErrorMsg('');
                                setSuccessMsg('');
                            }}
                            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                        >
                            <ArrowLeft size={14} /> Back to config
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Registration Form</span>
                    </div>

                    {errorMsg && (
                        <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-xs font-semibold">
                            ⚠️ {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20 text-xs font-semibold">
                            ✅ {successMsg}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Sender ID (3 - 11 chars)</label>
                        <input
                            type="text"
                            value={newSenderId}
                            onChange={(e) => setNewSenderId(e.target.value)}
                            placeholder="e.g. QefasSMS"
                            maxLength={11}
                            className="w-full text-sm rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold focus:border-primary focus:ring-primary"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Company Name</label>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="e.g. Qefas Hub"
                            className="w-full text-sm rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold focus:border-primary focus:ring-primary"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Use Case Example</label>
                        <textarea
                            value={useCase}
                            onChange={(e) => setUseCase(e.target.value)}
                            placeholder="e.g. Your Qefas verification code is 12345"
                            rows={2}
                            className="w-full text-sm rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold focus:border-primary focus:ring-primary"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-primary text-white rounded-xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <Send size={14} />
                        {isSubmitting ? 'Submitting...' : 'Register Sender ID'}
                    </button>
                </form>
            ) : (
                <div className="space-y-6">
                    {/* Identity & Balance Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                                Termii Balance
                            </label>
                            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10 h-[58px]">
                                <span className="font-black text-base text-primary">
                                    {currency} {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-tight text-slate-400">
                                    {accountUser.split(" ")[0]}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                                Sender ID Selection
                            </label>
                            <div className="relative h-[58px]">
                                {senderIds && senderIds.length > 0 ? (
                                    <select
                                        value={selectedSenderId}
                                        onChange={(e) => onSenderIdSelect?.(e.target.value)}
                                        className="w-full h-full rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm font-bold pr-10 focus:border-primary focus:ring-primary cursor-pointer appearance-none bg-none"
                                    >
                                        <option value="" disabled>Select Sender ID</option>
                                        {senderIds.map((item) => (
                                            <option key={item.sender_id} value={item.sender_id}>
                                                {item.sender_id} ({item.status})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="flex items-center justify-center h-full p-4 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-400 font-bold">
                                        No Sender IDs found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Route Selector */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                            Transmission Protocol
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {deliveryRoutes.map((route) => (
                                <button
                                    key={route.id}
                                    onClick={() => onRouteSelect?.(route.id)}
                                    className={`flex items-center justify-between p-4 border-2 rounded-2xl transition-all relative overflow-hidden group/btn ${
                                        selectedRoute === route.id
                                            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                            : 'border-slate-100 dark:border-white/5 bg-white/50 dark:bg-white/5 hover:border-slate-200 dark:hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex flex-col text-left">
                                        <span className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${
                                            selectedRoute === route.id ? 'text-primary' : 'text-slate-400'
                                        }`}>
                                            {route.name}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                                            {route.description}
                                        </span>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="text-base font-black text-slate-800 dark:text-white">
                                            {route.price}
                                            <span className="text-[9px] font-bold text-slate-400 ml-0.5">
                                                {route.priceUnit}
                                            </span>
                                        </span>
                                        {route.recommended && (
                                            <span className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${
                                                selectedRoute === route.id ? 'text-primary' : 'text-slate-400'
                                            }`}>
                                                Priority
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};