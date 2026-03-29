/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react'
import Badge from './ui/Badge'

interface Engagement {
    title: string
    time: string
    color: 'primary' | 'purple' | 'gray'
}

interface Tag {
    label: string
    color: 'blue' | 'orange' | 'purple'
}

interface ContactPanelProps {
    contact?: {
        name: string
        email: string
        avatar: string
        role?: string
        location: string
        since: string
        engagements: Engagement[]
        tags: Tag[]
    };
    onBack?: () => void;
}

const ContactPanel: FC<ContactPanelProps> = ({ contact, onBack }) => {
    const engagements: Engagement[] = [
        { title: 'Opened Newsletter #42', time: '2 hours ago', color: 'primary' },
        { title: 'Interacted with Pricing Bot', time: '45 minutes ago', color: 'purple' },
        { title: 'Visited Enterprise Page', time: 'Yesterday', color: 'gray' },
    ];

    const tags: Tag[] = [
        { label: 'Enterprise', color: 'blue' },
        { label: 'Warm Lead', color: 'orange' },
        { label: 'CRM Interest', color: 'purple' },
    ];

    return (
        <aside className="w-full md:w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            {/* Profile Header */}
            <div className="p-8 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
                
                {/* Mobile Back Button */}
                <button 
                    onClick={onBack}
                    className="md:hidden absolute top-4 left-4 z-20 size-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95 transition-all"
                    aria-label="Back to chat"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>

                <div className="relative mt-4">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-3xl h-24 w-24 mb-4 ring-4 ring-white dark:ring-slate-900 shadow-xl"
                        style={{ backgroundImage: `url(${contact?.avatar || "https://ui-avatars.com/api/?name=" + contact?.name})` }}
                    />
                    <div className="absolute -bottom-1 -right-1 size-6 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 shadow-sm flex items-center justify-center">
                        <div className="size-2 bg-white rounded-full animate-pulse" />
                    </div>
                </div>
                
                <h4 className="text-slate-900 dark:text-white font-bold text-xl tracking-tight mb-1">
                    {contact?.name}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-6">{contact?.role || "Potential Customer"}</p>
                
                <div className="grid grid-cols-2 gap-2 w-full">
                    <button className="bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        <span className="material-symbols-outlined text-sm">handshake</span>
                        Take Over
                    </button>
                    <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                        <span className="material-symbols-outlined text-sm">mail</span>
                        Email
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-8">
                {/* Contact Information */}
                <section>
                    <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                        Contact Details
                    </h5>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 group">
                            <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-slate-100 dark:border-slate-700/50">
                                <span className="material-symbols-outlined text-lg">mail</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Email</span>
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
                                    {contact?.email}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors border border-slate-100 dark:border-slate-700/50">
                                <span className="material-symbols-outlined text-lg">location_on</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Location</span>
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                                    {contact?.location || "Unknown"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors border border-slate-100 dark:border-slate-700/50">
                                <span className="material-symbols-outlined text-lg">verified_user</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Active Since</span>
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                                    {contact?.since || "Recently"}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Engagement */}
                <section>
                    <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                        Recent Activity
                    </h5>
                    <div className="space-y-5 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
                        {engagements.map((engagement, index) => (
                            <div key={index} className="flex gap-4 items-start relative z-10">
                                <div
                                    className={`mt-1.5 size-6 rounded-full shrink-0 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm ${
                                        engagement.color === 'primary' ? 'bg-primary' : 
                                        engagement.color === 'purple' ? 'bg-indigo-500' : 'bg-slate-300'
                                    }`}
                                >
                                    <div className="size-1 bg-white rounded-full" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight mb-0.5">
                                        {engagement.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium">{engagement.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tags */}
                <section>
                    <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">
                        Lead Tags
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {(contact?.tags || tags).map((tag, idx) => (
                            <Badge key={idx} color={tag.color as any}>
                                {tag.label}
                            </Badge>
                        ))}
                    </div>
                </section>
            </div>
        </aside>
    )
}

export default ContactPanel