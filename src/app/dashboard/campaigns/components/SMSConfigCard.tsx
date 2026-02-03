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
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                SMS Configuration
            </h3>

            <div className="space-y-5">
                {/* Sender ID Section */}
                <div>
                    <label className="block text-xs font-bold text-[#4c669a] uppercase tracking-wider mb-2">
                        Approved Sender ID
                    </label>
                    <div className="flex items-center justify-between p-3 bg-background-light dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                        <span className="font-mono font-bold text-lg">{senderId}</span>
                        <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase ${senderStatus === 'approved'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}
                        >
                            <CheckCircle className="w-3 h-3" />
                            {senderStatus === 'approved' ? 'Approved' : 'Pending'}
                        </span>
                    </div>
                    <p className="mt-2 text-[11px] text-[#4c669a]">
                        To request a new ID, please visit the{' '}
                        <a href={complianceUrl} className="text-primary hover:underline">
                            Compliance Center
                        </a>
                        .
                    </p>
                </div>

                {/* Route Selector */}
                <div>
                    <label className="block text-xs font-bold text-[#4c669a] uppercase tracking-wider mb-2">
                        Delivery Route
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {deliveryRoutes.map((route) => (
                            <button
                                key={route.id}
                                onClick={() => onRouteSelect?.(route.id)}
                                className={`flex flex-col p-3 border-2 rounded-xl hover:border-primary/50 transition-all text-left relative overflow-hidden ${selectedRoute === route.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-slate-100 dark:border-slate-800'
                                    }`}
                            >
                                {route.recommended && (
                                    <div className="absolute -right-1 -top-1 bg-primary text-white text-[8px] font-black px-2 py-1 rotate-12 uppercase">
                                        Recommended
                                    </div>
                                )}
                                <span
                                    className={`text-xs font-bold ${selectedRoute === route.id
                                            ? 'text-primary'
                                            : 'text-slate-500 dark:text-slate-400'
                                        }`}
                                >
                                    {route.name}
                                </span>
                                <span className="text-lg font-black mt-1">
                                    {route.price}
                                    <span className="text-[10px] font-normal text-slate-400">
                                        {route.priceUnit}
                                    </span>
                                </span>
                                <span
                                    className={`text-[10px] mt-1 ${selectedRoute === route.id
                                            ? 'text-primary/80'
                                            : 'text-slate-400'
                                        }`}
                                >
                                    {route.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};