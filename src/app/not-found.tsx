'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, MessageSquare, Search, AlertCircle, HelpCircle, FileText, Users } from 'lucide-react';

const suggestions = [
    { icon: Home, label: 'Dashboard', href: '/', description: 'Return to main dashboard' },
    { icon: MessageSquare, label: 'Live Chat', href: '/live-chat', description: 'Manage conversations' },
    { icon: Users, label: 'Contacts', href: '/contacts', description: 'View all contacts' },
    { icon: FileText, label: 'Analytics', href: '/analytics', description: 'View reports & insights' },
];

const errorMessages = [
    "Our AI couldn't find this page.",
    "This conversation took a wrong turn.",
    "The requested path seems to be offline.",
    "Even our AI gets lost sometimes!",
    "404: Page not in training data.",
];

export default function InteractiveNotFound() {
    const [randomMessage, setRandomMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Pick random error message
        setRandomMessage(errorMessages[Math.floor(Math.random() * errorMessages.length)]);

        // Auto-focus search on mount
        const timer = setTimeout(() => {
            const searchInput = document.getElementById('search-input');
            searchInput?.focus();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement search logic here
            console.log('Searching for:', searchQuery);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow delay-1000" />

                {/* Floating elements */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">AI Command Center</h1>
                            <p className="text-slate-400 text-sm">Dashboard</p>
                        </div>
                    </Link>
                </header>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Error Info */}
                    <div>
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-3 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
                                    <AlertCircle className="w-8 h-8 text-red-400" />
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                                        ERROR 404
                                    </span>
                                    <p className="text-slate-300 mt-1">{randomMessage}</p>
                                </div>
                            </div>

                            <h1 className="text-7xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
                                Lost in Space?
                            </h1>

                            <p className="text-lg text-slate-300 leading-relaxed">
                                The page you're looking for has drifted out of orbit. Don't worry,
                                our AI navigation system can help you find your way back.
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700">
                                <div className="text-2xl font-bold text-white">98%</div>
                                <div className="text-xs text-slate-400">Uptime</div>
                            </div>
                            <div className="p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700">
                                <div className="text-2xl font-bold text-white">24/7</div>
                                <div className="text-xs text-slate-400">AI Support</div>
                            </div>
                            <div className="p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700">
                                <div className="text-2xl font-bold text-white">99.9%</div>
                                <div className="text-xs text-slate-400">Page Found</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Interactive Section */}
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-slate-700 p-8">
                        {/* AI Assistant Card */}
                        <div className="mb-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0">
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center animate-pulse">
                                        <MessageSquare className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                        <span>🤖 AI Assistant</span>
                                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                                            Online
                                        </span>
                                    </h3>
                                    <p className="text-slate-300">
                                        I can help you navigate back to where you need to be.
                                        Try searching or choose from these common destinations:
                                    </p>
                                </div>
                            </div>

                            {/* Search */}
                            <form onSubmit={handleSearch} className="mb-8">
                                <div className="relative">
                                    <input
                                        id="search-input"
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="What are you looking for?"
                                        className="w-full px-6 py-4 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent pl-14"
                                    />
                                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Quick Links */}
                        <div className="mb-8">
                            <h4 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5" />
                                Quick Navigation
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {suggestions.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="group p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-800 group-hover:bg-purple-500/20 rounded-lg flex items-center justify-center transition-colors">
                                                <item.icon className="w-5 h-5 text-slate-400 group-hover:text-purple-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
                                                    {item.label}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Link
                                href="/"
                                className="block w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-center shadow-lg shadow-purple-500/25"
                            >
                                Return to Dashboard
                            </Link>

                            <button
                                onClick={() => window.history.back()}
                                className="block w-full px-6 py-4 bg-slate-900/50 backdrop-blur-sm text-slate-200 font-semibold rounded-xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300"
                            >
                                ← Go Back to Previous Page
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 pt-8 border-t border-slate-800 text-center">
                    <p className="text-slate-400 mb-4">
                        Need additional help? Our support team is always ready to assist.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <a
                            href="mailto:support@aicommandcenter.com"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            ✉️ Email Support
                        </a>
                        <a
                            href="/docs"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            📚 Documentation
                        </a>
                        <a
                            href="/status"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            📈 System Status
                        </a>
                        <a
                            href="tel:+1800AICHAT"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            📞 Call Support
                        </a>
                    </div>

                    <div className="mt-6 text-xs text-slate-500">
                        <p>© {new Date().getFullYear()} AI Command Center. All rights reserved.</p>
                        <p className="mt-1">Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}