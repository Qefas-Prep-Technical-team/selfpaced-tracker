"use client";
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Database } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'react-toastify';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{type: 'success'|'error'|null, message: string}>({ type: null, message: '' });

  const handleUpload = () => {
    if (!file) return;
    setIsLoading(true);
    setProgress(0);
    setStatus({ type: null, message: '' });
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        
        // Map the rows to our EngagementReport structure
        const records = rows.map((row) => {
          const keys = Object.keys(row);
          const findKey = (str: string) => keys.find(k => k.toLowerCase().includes(str.toLowerCase()));

          const objectionsStr = row[findKey('Objections & Feedback') || ''] || '';
          const supportStr = row[findKey('Support Needed') || ''] || '';

          return {
            nameChannel: row[findKey('Name') || ''] || 'Unknown',
            date: row[findKey('Date') || ''] || new Date().toISOString(),
            location: row[findKey('School') || findKey('Location') || ''] || 'Unknown',
            hotLeads: parseInt(row[findKey('Hot Leads') || '']) || 0,
            convertedStudents: parseInt(row[findKey('Paying customers') || '']) || 0,
            flyersDistributed: parseInt(row[findKey('Flyers Distributed') || '']) || 0,
            giftsDistributed: parseInt(row[findKey('Gifts Distributed') || '']) || 0,
            contactsUploaded: parseInt(row[findKey('Contacts Uploaded') || '']) || 0,
            dataCollected: row[findKey('Parent/Student Data') || ''] || '',
            challenges: row[findKey('Challenges') || ''] || '',
            suggestions: row[findKey('Suggestions') || ''] || '',
            objections: objectionsStr ? objectionsStr.split(',').map((s: string) => s.trim()) : [],
            supportNeeded: supportStr ? supportStr.split(',').map((s: string) => s.trim()) : [],
            comments: row[findKey('Comment') || ''] || 'Imported from Google Forms'
          };
        });

        const CHUNK_SIZE = 50;
        let successCount = 0;
        let hasError = false;

        for (let i = 0; i < records.length; i += CHUNK_SIZE) {
          if (hasError) break;
          
          const chunk = records.slice(i, i + CHUNK_SIZE);
          
          try {
            const res = await fetch('/api/engagements/import', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ records: chunk })
            });
            
            const data = await res.json();
            
            if (data.success) {
              successCount += data.count;
              setProgress(Math.round(((i + chunk.length) / records.length) * 100));
            } else {
              hasError = true;
              setStatus({ type: 'error', message: data.error || "Failed to import chunk" });
            }
          } catch(e) {
            hasError = true;
            setStatus({ type: 'error', message: "An unexpected network error occurred." });
          }
        }

        if (!hasError) {
          setStatus({ type: 'success', message: `Successfully imported ${successCount} records to MongoDB!` });
          setProgress(100);
          setFile(null);
        }
        
        setIsLoading(false);
      },
      error: (error) => {
        setStatus({ type: 'error', message: "Failed to parse CSV file." });
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30 text-neutral-900 dark:text-neutral-100 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-200/50 dark:shadow-none rounded-2xl p-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
            <Database className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Import Historical Data</h1>
          <p className="text-neutral-500 mt-2">Upload your Google Forms CSV export to smoothly merge it into the MongoDB database.</p>
        </div>

        <div className="space-y-6">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-neutral-300 border-dashed rounded-xl cursor-pointer bg-neutral-50 dark:hover:bg-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 transition-colors relative overflow-hidden group">
            
            {isLoading && (
              <div 
                className="absolute left-0 bottom-0 top-0 bg-blue-50 dark:bg-blue-900/20 transition-all duration-300 ease-out z-0" 
                style={{ width: `${progress}%` }} 
              />
            )}
            
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 z-10 relative">
              <FileText className={`w-10 h-10 mb-3 transition-colors ${isLoading ? 'text-blue-500' : 'text-neutral-400 group-hover:text-blue-500'}`} />
              {file ? (
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{file.name}</p>
              ) : (
                <>
                  <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">CSV files only</p>
                </>
              )}
            </div>
            <input type="file" accept=".csv" className="hidden" disabled={isLoading} onChange={e => setFile(e.target.files?.[0] || null)} />
          </label>

          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <span>Importing records...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {status.type && (
            <div className={`p-4 rounded-xl flex items-start ${status.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
              {status.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          <button 
            onClick={handleUpload} 
            disabled={isLoading || !file} 
            className="w-full flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Import to Database"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
