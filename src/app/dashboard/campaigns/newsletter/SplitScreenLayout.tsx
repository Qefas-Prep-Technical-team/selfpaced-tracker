/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { GripVertical } from 'lucide-react';

export const SplitScreenLayout = ({ leftContent, rightContent }: any) => {
    return (
        <div className="flex-1 w-full min-h-0"> {/* min-h-0 is critical for flex children to scroll */}
            <Group orientation="horizontal" style={{ height: '100%' }}>
                <Panel defaultSize={50} minSize={20}>
                    <div className="h-full overflow-y-auto bg-white border-r border-slate-200">
                        {leftContent}
                    </div>
                </Panel>

                <Separator className="w-1.5 bg-slate-100 hover:bg-blue-500 transition-colors cursor-col-resize flex items-center justify-center">
                    <div className="h-8 w-1 bg-slate-300 rounded-full" />
                </Separator>

                <Panel defaultSize={50} minSize={20}>
                    <div className="h-full overflow-y-auto bg-slate-50">
                        {rightContent}
                    </div>
                </Panel>
            </Group>
        </div>
    );
};