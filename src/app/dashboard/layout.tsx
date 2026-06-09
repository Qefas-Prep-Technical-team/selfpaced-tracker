'use client'
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNavbar from './components/MobileNavbar';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen w-screen bg-background transition-colors duration-300 overflow-hidden">
            {/* Sidebar toggle for mobile with backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-300"
                    onClick={closeSidebar}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out overflow-hidden
                ${isSidebarOpen ? 'w-72 translate-x-0 md:sticky md:top-0 md:h-screen' : 'w-0 -translate-x-full md:sticky md:w-0'}
            `}>
                <div className="w-72 h-full shrink-0 overflow-y-auto no-scrollbar">
                    <Sidebar onClose={closeSidebar} />
                </div>
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