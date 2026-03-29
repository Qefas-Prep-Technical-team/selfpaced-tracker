'use client'
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNavbar from './components/MobileNavbar';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Sidebar toggle for mobile with backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-300"
                    onClick={closeSidebar}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar onClose={closeSidebar} />
            </div>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header onMenuClick={toggleSidebar} />
                <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    {children}
                </div>
                <MobileNavbar />
            </main>
        </div>
    );
};

export default Layout;