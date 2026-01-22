import React, { FC } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ProtectedUserRoute } from './components/ProtectedUserRoute';

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        // <ProtectedUserRoute>
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col">
                <Header />
                {children}
            </main>
        </div>
        // </ProtectedUserRoute>
    );
};

export default layout;