"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface IKnowledge {
  _id?: string;
  category: string;
  question: string; // The Title/Keyword field
  answer: string;
  tags: string[];   // Aligned with your Mongoose Schema
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
    answer: "",
    tags: [],
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
        item.answer.toLowerCase().includes(searchStr) ||
        item.tags.some(t => t.toLowerCase().includes(searchStr))
      );
    });
  }, [searchTerm, knowledgeList]);

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
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen p-4 md:p-8">
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
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT PANEL: INPUT FORM */}
          <div className="w-full lg:w-96 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col shadow-sm sticky top-8">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold">Add Knowledge</h3>
              <p className="text-xs text-slate-400 mt-1">Populate training facts here</p>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* Title Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Knowledge Title (Keywords)</label>
                <input
                  className="w-full rounded-xl border-slate-200 dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. SSS1 Pricing & Subjects"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                />
              </div>

              {/* Category Input */}
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

              {/* Answer/Fact Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Fact Details</label>
                <textarea
                  className="w-full min-h-[140px] rounded-xl border-slate-200 dark:bg-slate-800 text-sm p-3 resize-none focus:ring-2 focus:ring-primary/20"
                  placeholder="The actual information the AI will say..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                ></textarea>
              </div>

              {/* TAGS INPUT - NEW */}
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
              {filteredList.map((item) => (
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
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary">edit_note</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FOR PREVIEW/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-2xl font-black mb-2">{formData.question}</h2>
            <div className="flex gap-2 mb-6">
               {formData.tags.map(t => <span key={t} className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-bold text-slate-500">#{t}</span>)}
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-8">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{formData.answer}</p>
            </div>
            <div className="flex justify-between items-center">
              <button onClick={async () => {
                if(confirm("Delete this fact?")){
                  await fetch(`/api/knowledge?id=${formData._id}`, { method: 'DELETE' });
                  setIsModalOpen(false);
                  fetchKnowledge();
                }
              }} className="text-red-500 font-bold text-sm">Delete Fact</button>
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-primary text-white rounded-xl font-bold">Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}