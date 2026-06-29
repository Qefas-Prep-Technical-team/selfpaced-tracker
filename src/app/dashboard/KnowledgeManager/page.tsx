"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface IKnowledge {
  _id?: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

export default function KnowledgeCenter() {
  const [knowledgeList, setKnowledgeList] = useState<IKnowledge[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  // Chat Widget State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ragMessages, setRagMessages] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [generalMessages, setGeneralMessages] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'rag'|'general'|'auto'>('auto');

  const activeMessages = chatMode === 'rag' ? ragMessages : generalMessages;
  const setActiveMessages = chatMode === 'rag' ? setRagMessages : setGeneralMessages;

  // Load chat history on mount
  useEffect(() => {
    const savedRag = localStorage.getItem('qefas_test_chat_rag');
    const savedGeneral = localStorage.getItem('qefas_test_chat_general');
    if (savedRag) {
      try { setRagMessages(JSON.parse(savedRag)); } catch(e) {}
    }
    if (savedGeneral) {
      try { setGeneralMessages(JSON.parse(savedGeneral)); } catch(e) {}
    }
  }, []);

  // Save chat history on change
  useEffect(() => {
    localStorage.setItem('qefas_test_chat_rag', JSON.stringify(ragMessages));
  }, [ragMessages]);

  useEffect(() => {
    localStorage.setItem('qefas_test_chat_general', JSON.stringify(generalMessages));
  }, [generalMessages]);

  const [formData, setFormData] = useState<IKnowledge>({
    category: "General",
    question: "",
    answer: "",
    tags: [],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePdfUpload = async () => {
    if (!selectedFile) return;
    setIsUploadingPdf(true);
    setPdfStatus("Uploading and parsing document...");
    
    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);

    try {
      const res = await fetch("/api/ingest/pdf", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (res.ok) {
        setPdfStatus(`Success! Ingested ${data.chunks} chunks into Pinecone.`);
        setSelectedFile(null);
        // Reset file input if possible by using a ref or just leaving it for now
      } else {
        setPdfStatus(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setPdfStatus(`Error: ${e.message}`);
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const [isClearing, setIsClearing] = useState(false);

  const handleClearPinecone = async () => {
    if (!confirm("Are you sure you want to completely wipe the AI's PDF memory? This cannot be undone!")) return;
    setIsClearing(true);
    try {
      const res = await fetch("/api/ingest/clear", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert("Success! All PDF memory has been erased.");
        setPdfStatus("");
      } else {
        alert("Error: " + data.error);
      }
    } catch (e: any) {
      alert("Error clearing memory: " + e.message);
    } finally {
      setIsClearing(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const newMessage = { role: 'user' as const, content: chatInput };
    setActiveMessages(prev => [...prev, newMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      // Send up to the last 5 messages as history for context
      const historyToSend = activeMessages.slice(-5);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: newMessage.content, 
          mode: chatMode,
          history: historyToSend
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setActiveMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
      } else {
        setActiveMessages(prev => [...prev, { role: 'ai', content: `Error: ${data.error}` }]);
      }
    } catch (e: any) {
      setActiveMessages(prev => [...prev, { role: 'ai', content: `Network Error: ${e.message}` }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchKnowledge = useCallback(async () => {
    try {
      const res = await fetch("/api/knowledge");
      const data = await res.json();
      setKnowledgeList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load knowledge:", error);
    }
  }, []);

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  const handleBulkUpload = async () => {
    const rawData = prompt("Paste your JSON array here:");
    if (!rawData) return;
    try {
      const parsed = JSON.parse(rawData);
      if (!Array.isArray(parsed)) return alert("Data must be an array of objects!");
      
      setLoading(true);
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (res.ok) {
        alert("Bulk upload successful!");
        fetchKnowledge();
      }
    } catch (e) {
      alert("Invalid JSON format. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    return knowledgeList.filter((item) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        item.question.toLowerCase().includes(searchStr) ||
        item.category.toLowerCase().includes(searchStr) ||
        item.answer.toLowerCase().includes(searchStr) ||
        item.tags.some(t => t.toLowerCase().includes(searchStr))
      );
    });
  }, [searchTerm, knowledgeList]);

  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const categories = Array.from(new Set(knowledgeList.map((item) => item.category)));

  const handleSave = async (dataToSave: IKnowledge) => {
    if (!dataToSave.question || !dataToSave.answer) return alert("Please fill all fields");
    setLoading(true);
    try {
      const method = dataToSave._id ? "PUT" : "POST";
      await fetch("/api/knowledge", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      setIsModalOpen(false);
      setIsAddingNewCategory(false);
      setFormData({ category: "General", question: "", answer: "", tags: [] });
      await fetchKnowledge();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-slate-900 dark:text-slate-100 font-display min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary text-white p-2 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight">AI Training Center</h1>
            </div>
            <p className="text-slate-500">Manage facts and tags to populate your AI&apos;s brain.</p>
          </div>
          {/* Added Bulk Import Button to Header */}
          <button 
            onClick={handleBulkUpload}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm transition-all"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            Bulk Import
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start mb-10">
          {/* LEFT PANEL: INPUT FORM */}
          <div className="w-full lg:w-96 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col shadow-sm sticky top-8">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Add Knowledge</h3>
                <p className="text-xs text-slate-400 mt-1">Populate training facts here</p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Knowledge Title (Keywords)</label>
                <input
                  className="w-full rounded-xl border-slate-200 dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. SSS1 Pricing & Subjects"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <button onClick={() => setIsAddingNewCategory(!isAddingNewCategory)} className="text-xs text-primary font-bold">
                    {isAddingNewCategory ? "Use List" : "+ New Category"}
                  </button>
                </div>
                {isAddingNewCategory ? (
                  <input
                    autoFocus
                    className="w-full rounded-xl border-primary border-2 dark:bg-slate-800 text-sm p-3"
                    placeholder="New category name"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                ) : (
                  <select
                    className="w-full rounded-xl border-slate-200 dark:bg-slate-800 text-sm p-3"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    {categories.length === 0 && <option value="General">General</option>}
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Fact Details</label>
                <textarea
                  className="w-full min-h-[140px] rounded-xl border-slate-200 dark:bg-slate-800 text-sm p-3 resize-none focus:ring-2 focus:ring-primary/20"
                  placeholder="The actual information the AI will say..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                ></textarea>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tags (Comma separated)</label>
                <input
                  className="w-full rounded-xl border-slate-200 dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary/20"
                  placeholder="math, pricing, sss1, scheme"
                  value={formData.tags.join(", ")}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()) })}
                />
              </div>

              <button
                onClick={() => handleSave(formData)}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined">{loading ? 'sync' : 'bolt'}</span>
                {loading ? 'Saving...' : 'Train AI Instance'}
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: LIST SECTION */}
          <div className="flex-1 w-full space-y-6">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-lg outline-none focus:border-primary"
                placeholder="Search tags, categories, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {paginatedList.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex justify-between items-start group cursor-pointer"
                  onClick={() => { setFormData(item); setIsModalOpen(true); }}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[10px] text-slate-400 italic">#{tag}</span>
                      ))}
                    </div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-lg">{item.question}</h4>
                    <p className="text-slate-400 text-sm line-clamp-1 mt-1">{item.answer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary">edit_note</span>
                  </div>
                </div>
              ))}
              {filteredList.length === 0 && (
                <div className="p-12 text-center text-slate-400 italic">No matches found.</div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm font-bold text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PDF UPLOAD SECTION (RAG) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-500 text-white p-2 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined">picture_as_pdf</span>
            </div>
            <div>
              <h2 className="text-2xl font-black">Train AI on Documents</h2>
              <p className="text-slate-500 text-sm">Upload PDFs to extract text and embed directly into Pinecone for RAG-based context.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              className="w-full md:w-auto file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-500/20 dark:file:text-indigo-300 dark:hover:file:bg-indigo-500/30 cursor-pointer" 
            />
            <button
              onClick={handlePdfUpload}
              disabled={isUploadingPdf || !selectedFile}
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-indigo-600/20 relative overflow-hidden"
            >
              <span className={`flex items-center gap-2 transition-opacity ${isUploadingPdf ? 'opacity-0' : 'opacity-100'}`}>
                <span className="material-symbols-outlined">upload</span>
                Ingest Document
              </span>
              {isUploadingPdf && (
                <div className="absolute inset-0 flex items-center justify-center bg-indigo-700">
                  <span className="text-sm font-bold tracking-widest mr-2">INGESTING</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </button>
            <button
              onClick={handleClearPinecone}
              disabled={isClearing || isUploadingPdf}
              className="w-full md:w-auto px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ml-auto"
            >
              <span className="material-symbols-outlined">{isClearing ? 'sync' : 'delete'}</span>
              {isClearing ? 'Wiping...' : 'Clear AI Memory'}
            </button>
          </div>

          {/* Bar Loader */}
          {isUploadingPdf && (
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-6 overflow-hidden relative">
              <div className="absolute top-0 bottom-0 left-0 bg-indigo-500 w-1/2 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
              <div className="absolute top-0 bottom-0 left-0 bg-indigo-500 w-full rounded-full animate-pulse"></div>
            </div>
          )}

          {pdfStatus && !isUploadingPdf && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className={`text-sm font-bold ${pdfStatus.includes('Error') ? 'text-red-500' : 'text-emerald-500'}`}>
                {pdfStatus}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL FOR PREVIEW/EDIT (POP-UP) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className="mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">{formData.category}</span>
              <h2 className="text-2xl font-black">{formData.question}</h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map(t => (
                  <span key={t} className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-bold text-slate-500">#{t}</span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{formData.answer}</p>
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={async () => {
                  if(confirm("Are you sure you want to delete this fact? This cannot be undone.")){
                    await fetch(`/api/knowledge?id=${formData._id}`, { method: 'DELETE' });
                    setIsModalOpen(false);
                    fetchKnowledge();
                  }
                }} 
                className="text-red-500 hover:text-red-600 font-bold text-sm transition-colors"
              >
                Delete Fact
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    // This sets the form data so the user can edit it in the left panel
                    setIsModalOpen(false);
                  }} 
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold"
                >
                  Edit in Form
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat Box */}
        {isChatOpen && (
          <div className="bg-white dark:bg-slate-900 w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 mb-4 overflow-hidden flex flex-col transition-all transform origin-bottom-right scale-100 opacity-100">
            <div className="bg-primary text-white p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">smart_toy</span>
                  <span className="font-bold text-sm">Test AI Memory</span>
                </div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => setActiveMessages([])} className="hover:bg-white/20 p-1 rounded-full transition-colors flex items-center" title="Clear Chat">
                    <span className="material-symbols-outlined text-sm block">delete</span>
                  </button>
                  <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors flex items-center">
                    <span className="material-symbols-outlined text-sm block">close</span>
                  </button>
                </div>
              </div>
              <div className="flex bg-black/20 p-1 rounded-lg">
                <button 
                  onClick={() => setChatMode('auto')}
                  className={`flex-1 text-[10px] py-1.5 rounded-md font-bold transition-colors ${chatMode === 'auto' ? 'bg-white text-primary shadow-sm' : 'text-white/70 hover:text-white'}`}
                >
                  Auto-Pilot
                </button>
                <button 
                  onClick={() => setChatMode('rag')}
                  className={`flex-1 text-[10px] py-1.5 rounded-md font-bold transition-colors ${chatMode === 'rag' ? 'bg-white text-primary shadow-sm' : 'text-white/70 hover:text-white'}`}
                >
                  Qefas Hub
                </button>
                <button 
                  onClick={() => setChatMode('general')}
                  className={`flex-1 text-[10px] py-1.5 rounded-md font-bold transition-colors ${chatMode === 'general' ? 'bg-white text-primary shadow-sm' : 'text-white/70 hover:text-white'}`}
                >
                  Prep School
                </button>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50 dark:bg-slate-900/50">
              {activeMessages.length === 0 ? (
                <div className="text-center text-slate-400 text-sm mt-10">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">forum</span>
                  <p>Ask a question to test the AI's knowledge base.</p>
                </div>
              ) : (
                activeMessages.map((msg, idx) => {
                  // Basic URL parser to make links clickable
                  const renderTextWithLinks = (text: string) => {
                    const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
                    return text.split(urlRegex).map((part, i) => {
                      if (part && part.match(urlRegex)) {
                        // Strip trailing punctuation often caught by regex
                        const cleanPart = part.replace(/[.,:;)]$/, '');
                        const trailing = part.slice(cleanPart.length);
                        const href = cleanPart.startsWith('http') ? cleanPart : `https://${cleanPart}`;
                        
                        return (
                          <span key={i}>
                            <a href={href} target="_blank" rel="noopener noreferrer" className="underline font-medium opacity-90 hover:opacity-100 text-blue-600 dark:text-blue-400">
                              {cleanPart}
                            </a>
                            {trailing}
                          </span>
                        );
                      }
                      return <span key={i}>{part}</span>;
                    });
                  };

                  return (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-br-sm' 
                          : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-bl-sm text-slate-800 dark:text-slate-200'
                      }`}>
                        {renderTextWithLinks(msg.content)}
                      </div>
                    </div>
                  );
                })
              )}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm p-4 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                placeholder="Ask something..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                onClick={handleSendChatMessage}
                disabled={!chatInput.trim() || isChatLoading}
                className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined block text-sm">send</span>
              </button>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl">
            {isChatOpen ? 'close' : 'chat'}
          </span>
        </button>
      </div>
    </div>
  );
}