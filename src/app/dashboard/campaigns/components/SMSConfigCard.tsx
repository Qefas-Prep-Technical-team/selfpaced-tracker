import React from 'react';
import { Settings, CheckCircle } from 'lucide-react';

interface DeliveryRoute {
    id: string;
    name: string;
    description: string;
    price: string;
    priceUnit: string;
    recommended?: boolean;
}

interface SMSConfigCardProps {
    senderId?: string;
    senderStatus?: 'approved' | 'pending' | 'rejected';
    deliveryRoutes?: DeliveryRoute[];
    onRouteSelect?: (routeId: string) => void;
    selectedRoute?: string;
    complianceUrl?: string;
}

export const SMSConfigCard: React.FC<SMSConfigCardProps> = ({
    senderId = 'NAIJAS_ANLTX',
    senderStatus = 'approved',
    deliveryRoutes = [
        {
            id: 'standard',
            name: 'Standard',
            description: 'High-speed delivery',
            price: '₦4.00',
            priceUnit: '/unit',
        },
        {
            id: 'corporate',
            name: 'Corporate (Priority)',
            description: 'Bypasses DND restrictions',
            price: '₦12.00',
            priceUnit: '/unit',
            recommended: true,
        },
    ],
    selectedRoute = 'corporate',
    onRouteSelect,
    complianceUrl = '#',
}) => {
    return (
        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 size-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />
            
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Settings className="w-5 h-5" />
                </div>
                Gateway Logic
            </h3>

            <div className="space-y-8">
                {/* Sender ID Section */}
                <div className="relative">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        Validated Identity
                    </label>
                    <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-inner">
                        <span className="font-mono font-black text-xl tracking-tighter text-slate-800 dark:text-white">{senderId}</span>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                            senderStatus === 'approved'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-amber-500 text-white'
                        }`}>
                            <CheckCircle className="w-3 h-3" />
                            {senderStatus === 'approved' ? 'Verified' : 'Pending'}
                        </div>
                    </div>
                </div>

                {/* Route Selector */}
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        Transmission Protocol
                    </label>
                    <div className="grid grid-cols-1 gap-4">
                        {deliveryRoutes.map((route) => (
                            <button
                                key={route.id}
                                onClick={() => onRouteSelect?.(route.id)}
                                className={`flex items-center justify-between p-5 border-2 rounded-2xl transition-all relative overflow-hidden group/btn ${
                                    selectedRoute === route.id
                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                        : 'border-slate-100 dark:border-white/5 bg-white/50 dark:bg-white/5 hover:border-slate-200 dark:hover:border-white/20'
                                }`}
                            >
                                <div className="flex flex-col text-left">
                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                                        selectedRoute === route.id ? 'text-primary' : 'text-slate-400'
                                    }`}>
                                        {route.name}
                                    </span>
                                    <span className="text-lg font-black text-slate-800 dark:text-white leading-none">
                                        {route.price}
                                        <span className="text-[10px] font-bold text-slate-400 ml-1">
                                            {route.priceUnit}
                                        </span>
                                    </span>
                                </div>

                                {route.recommended && (
                                    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                        selectedRoute === route.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                                    }`}>
                                        Priority
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};