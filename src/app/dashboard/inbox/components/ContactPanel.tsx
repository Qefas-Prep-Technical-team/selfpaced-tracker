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
    }
}

const ContactPanel: FC<ContactPanelProps> = ({ contact }) => {
    const engagements: Engagement[] = [
        { title: 'Opened Newsletter #42', time: '2 hours ago', color: 'primary' },
        { title: 'Interacted with Pricing Bot', time: '45 minutes ago', color: 'purple' },
        { title: 'Visited Enterprise Page', time: 'Yesterday', color: 'gray' },
    ]

    const tags: Tag[] = [
        { label: 'Enterprise', color: 'blue' },
        { label: 'Warm Lead', color: 'orange' },
        { label: 'CRM Interest', color: 'purple' },
    ]

    return (
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-background-dark flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            {/* Profile Header */}
            <div className="p-6 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800">
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 mb-4 ring-4 ring-white dark:ring-slate-800 shadow-md"
                    style={{ backgroundImage: `url(${contact?.avatar})` }}
                />
                <h4 className="text-[#0d141b] dark:text-white font-bold text-lg">
                    {contact?.name}
                </h4>
                <p className="text-[#4c739a] text-sm mb-4">{contact?.role}</p>
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all">
                    <span className="material-symbols-outlined">handshake</span>
                    Take Over Conversation
                </button>
            </div>

            {/* Contact Details */}
            <div className="p-6 flex flex-col gap-6">
                {/* Contact Information */}
                <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Contact Information
                    </h5>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400 text-lg">mail</span>
                            <span className="text-sm text-[#0d141b] dark:text-slate-300">
                                {contact?.email}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400 text-lg">
                                location_on
                            </span>
                            <span className="text-sm text-[#0d141b] dark:text-slate-300">
                                {contact?.location}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400 text-lg">
                                calendar_today
                            </span>
                            <span className="text-sm text-[#0d141b] dark:text-slate-300">
                                Customer since {contact?.since}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recent Engagement */}
                <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Recent Engagement
                    </h5>
                    <div className="flex flex-col gap-4">
                        {engagements.map((engagement, index) => (
                            <div key={index} className="flex gap-3 items-start">
                                <div
                                    className={`mt-1 size-2 rounded-full shrink-0 ${engagement.color === 'primary'
                                        ? 'bg-primary'
                                        : engagement.color === 'purple'
                                            ? 'bg-ai-purple'
                                            : 'bg-slate-300'
                                        }`}
                                />
                                <div>
                                    <p className="text-xs font-semibold text-[#0d141b] dark:text-slate-200">
                                        {engagement.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400">{engagement.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Tags
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge key={tag.label} color={tag.color}>
                                {tag.label}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default ContactPanel