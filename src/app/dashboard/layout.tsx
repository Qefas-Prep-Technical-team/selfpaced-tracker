import React, { FC } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col">
                <Header />
                {children}
            </main>
        </div>
    );
};

export default layout;