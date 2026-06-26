"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GoogleFormPage() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen font-sans">
      
      {/* Header Container */}
      <div className="max-w-3xl mx-auto pt-8 px-4 sm:px-6 pb-6">
        <Link href="/" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
          Daily Engagement Report
        </h1>
      </div>

      {/* Main Content Container (Standard Block Layout) */}
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-neutral-900 sm:rounded-2xl sm:shadow-xl border-t sm:border border-neutral-200 dark:border-neutral-800 overflow-hidden mb-12">
        
        {/* Decorative Top Gradient */}
        <div className="w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 block" />
        
        {/* 
          Standard block wrapping without flexbox, absolute positioning, or z-index.
          This bypasses a notorious iOS Safari bug where iframes inside flex/relative containers lose touch focus.
        */}
        <div className="w-full block">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSfVJrh6gsO7sXqD7Mfj8WKaXVxemO1WyNvPFxmp2Myq40ps3A/viewform?embedded=true" 
            width="100%" 
            height="2300"
            frameBorder="0" 
            marginHeight={0} 
            marginWidth={0}
            className="w-full block m-0 p-0 border-none bg-transparent"
          >
            Loading…
          </iframe>
        </div>
        
      </div>
      
    </div>
  );
}
