"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface IKnowledge {
  _id?: string;
  category: string;
  question: string;
  answer: string;
}

export default function KnowledgeCenter() {
  const [knowledgeList, setKnowledgeList] = useState<IKnowledge[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  
  const [formData, setFormData] = useState<IKnowledge>({ 
    category: "General", 
    question: "", 
    answer: "" 
  });

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

  const filteredList = useMemo(() => {
    return knowledgeList.filter((item) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        item.question.toLowerCase().includes(searchStr) ||
        item.category.toLowerCase().includes(searchStr) ||
        item.answer.toLowerCase().includes(searchStr)
      );
    });
  }, [searchTerm, knowledgeList]);

  const categories = Array.from(new Set(knowledgeList.map(item => item.category)));

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
      setFormData({ category: "General", question: "", answer: "" });
      await fetchKnowledge();
    } finally {
      setLoading(false);
    }
  };

  const hasData = knowledgeList.length > 0;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen p-4 md:p-8">
      
      {/* 1. MAIN CONTAINER: Full Width when no Sidebar/Header */}
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary text-white p-2 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">AI Training Center</h1>
          </div>
          <p className="text-slate-500">Add, edit, and manage facts to populate your AI&apos;s brain.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 2. LEFT PANEL: INPUT FORM (Always visible) */}
          <div className="w-full lg:w-96 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col shadow-sm sticky top-8">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold">Add Knowledge</h3>
              <p className="text-xs text-slate-400 mt-1">Populate training facts here</p>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Knowledge Title</label>
                <input 
                  className="w-full rounded-xl border-slate-200 dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary/20" 
                  placeholder="e.g. SSS1 Pricing"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                ) : (
                  <select 
                    className="w-full rounded-xl border-slate-200 dark:bg-slate-800 text-sm p-3"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    {categories.length === 0 && <option value="General">General</option>}
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Fact Details</label>
                <textarea 
                  className="w-full min-h-[180px] rounded-xl border-slate-200 dark:bg-slate-800 text-sm p-3 resize-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="Detailed factual response..."
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                ></textarea>
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

          {/* 3. RIGHT PANEL: LIST SECTION */}
          <div className="flex-1 w-full space-y-6">
            
            {!hasData ? (
              /* EMPTY STATE */
              <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                 <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                   <span className="material-symbols-outlined text-5xl text-primary/30">auto_stories</span>
                 </div>
                 <h3 className="text-2xl font-black">No training data yet</h3>
                 <p className="text-slate-400 max-w-sm mt-2">Start by filling the form on the left to populate your AI&apos;s knowledge base.</p>
              </div>
            ) : (
              <>
                {/* SEARCH BAR (RELOCATED TO TOP OF LIST) */}
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                  <input 
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-lg focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none" 
                    placeholder="Filter facts by title, content, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* LIST OF CARDS */}
                <div className="grid grid-cols-1 gap-4">
                  {filteredList.map((item) => (
                    <div 
                      key={item._id} 
                      className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex justify-between items-center group cursor-pointer"
                      onClick={() => { setFormData(item); setIsModalOpen(true); }}
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                        </div>
                        <h4 className="text-slate-900 dark:text-white font-bold text-lg">{item.question}</h4>
                        <p className="text-slate-400 text-sm line-clamp-1 mt-1">{item.answer}</p>
                      </div>
                      <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                        <span className="material-symbols-outlined text-xl">open_in_new</span>
                      </div>
                    </div>
                  ))}
                  {filteredList.length === 0 && (
                    <div className="p-12 text-center text-slate-400 italic">No matches found.</div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* 4. MODAL FOR PREVIEW/EDIT (Always at end of component) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
           {/* ... (Previous Modal Code) ... */}
           <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden p-8 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><span className="material-symbols-outlined">close</span></button>
              <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">{formData.category}</span>
              <h2 className="text-2xl font-black mb-6">{formData.question}</h2>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-8">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{formData.answer}</p>
              </div>
              <div className="flex justify-between items-center">
                <button onClick={async () => {
                  if(confirm("Delete this fact?")){
                    await fetch(`/api/knowledge?id=${formData._id}`, { method: 'DELETE' });
                    setIsModalOpen(false);
                    fetchKnowledge();
                  }
                }} className="text-red-500 font-bold text-sm">Delete Fact</button>
                <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold">Done</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}