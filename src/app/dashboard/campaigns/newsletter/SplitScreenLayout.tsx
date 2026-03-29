/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';

interface SplitScreenLayoutProps {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode;
    activeView?: 'builder' | 'preview';
}

export const SplitScreenLayout = ({ leftContent, rightContent, activeView = 'builder' }: SplitScreenLayoutProps) => {
    // We use CSS for responsiveness instead of JS hooks to avoid hydration mismatches
    return (
        <div className="flex-1 w-full min-h-0 flex flex-col">
            {/* Desktop View: Horizontal Split */}
            <div className="hidden lg:flex flex-1 min-h-0">
                <Group orientation="horizontal" style={{ height: '100%' }}>
                    <Panel defaultSize={50} minSize={20}>
                        <div className="h-full overflow-y-auto bg-white border-r border-slate-200 custom-scrollbar">
                            {leftContent}
                        </div>
                    </Panel>

                    <Separator className="w-1.5 bg-slate-100/50 hover:bg-primary transition-colors cursor-col-resize flex items-center justify-center">
                        <div className="h-8 w-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                    </Separator>

                    <Panel defaultSize={50} minSize={20}>
                        <div className="h-full overflow-y-auto bg-slate-50 dark:bg-background-dark/50 custom-scrollbar">
                            {rightContent}
                        </div>
                    </Panel>
                </Group>
            </div>

            {/* Mobile/Tablet View: Single Panel Toggle */}
            <div className="flex lg:hidden flex-1 min-h-0 overflow-hidden relative">
                <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${activeView === 'builder' ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="h-full overflow-y-auto bg-white dark:bg-background-dark">
                        {leftContent}
                    </div>
                </div>
                <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${activeView === 'preview' ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-background-dark">
                        {rightContent}
                    </div>
                </div>
            </div>
        </div>
    );
};