"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Send, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

const CHANNELS = [
  "School Outreach",
  "Event Marketing",
  "Direct Sales",
  "Social Media",
  "Referral",
  "Other"
];

const OBJECTIONS = [
  "Price",
  "Parental Approval",
  "Timing",
  "Understanding of Product",
  "Other"
];

const SUPPORT_OPTIONS = [
  "More materials",
  "Admins follow-up",
  "Student access issue",
  "None"
];

export default function DailyEngagementForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nameChannel: '',
    nameCustom: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    hotLeads: '',
    convertedStudents: '',
    flyersDistributed: '',
    giftsDistributed: '',
    contactsUploaded: '',
    dataCollected: '',
    challenges: '',
    suggestions: '',
    objections: [] as string[],
    supportNeeded: [] as string[],
    comments: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleArrayItem = (field: 'objections' | 'supportNeeded', value: string) => {
    setFormData(prev => {
      const array = prev[field];
      if (array.includes(value)) {
        return { ...prev, [field]: array.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...array, value] };
      }
    });
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(2);
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call and saving data for tracking
    try {
      // Create payload tracking object
      const payload = {
        ...formData,
        submittedAt: new Date().toISOString(),
        finalName: formData.nameChannel === 'Other' ? formData.nameCustom : formData.nameChannel
      };

      // In a real app this would be a POST to /api/engagements or similar
      console.log('Saving Data for Tracking:', payload);
      
      // We can use localstorage as a fallback tracking mechanism for now
      const existing = JSON.parse(localStorage.getItem('engagement_records') || '[]');
      localStorage.setItem('engagement_records', JSON.stringify([...existing, payload]));
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Engagement data saved successfully!");
      
      // Reset form
      setFormData({
        nameChannel: '',
        nameCustom: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        hotLeads: '',
        convertedStudents: '',
        flyersDistributed: '',
        giftsDistributed: '',
        contactsUploaded: '',
        dataCollected: '',
        challenges: '',
        suggestions: '',
        objections: [],
        supportNeeded: [],
        comments: ''
      });
      setStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error("Failed to save data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSection1Valid = formData.nameChannel !== '' && 
    (formData.nameChannel !== 'Other' || formData.nameCustom !== '') && 
    formData.date !== '' && 
    formData.location !== '' && 
    formData.hotLeads !== '' && 
    formData.convertedStudents !== '' && 
    formData.flyersDistributed !== '' && 
    formData.giftsDistributed !== '' && 
    formData.contactsUploaded !== '';

  const isSection2Valid = formData.objections.length > 0 && 
    formData.supportNeeded.length > 0 && 
    formData.comments !== '';

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30 text-neutral-900 dark:text-neutral-100">
      
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Daily Engagement Report
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Please complete this form daily after your school gate activities. Ensure all data is accurate and submitted within 24 hours. Your performance will be reviewed for KPI tracking and contract evaluation.
          </p>
          
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4 pt-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-medium transition-colors ${step === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-green-500 text-white'}`}>
              {step === 1 ? '1' : <Check className="w-4 h-4" />}
            </div>
            <div className={`h-1 flex-1 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-800'} transition-colors`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-medium transition-colors ${step === 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'}`}>
              2
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-200/50 dark:shadow-none rounded-2xl overflow-hidden relative">
          
          {/* Decorative Top Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-1 px-3 rounded-full text-sm mr-3">Section 1</span>
                        General Engagement Data
                      </h2>

                      <div className="space-y-6">
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Name / Channel <span className="text-red-500">*</span></label>
                          <select 
                            name="nameChannel" 
                            value={formData.nameChannel} 
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            required
                          >
                            <option value="" disabled>Select a channel</option>
                            {CHANNELS.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        {formData.nameChannel === 'Other' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2"
                          >
                            <label className="text-sm font-medium">Specify Custom Name / Channel <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              name="nameCustom"
                              value={formData.nameCustom}
                              onChange={handleInputChange}
                              placeholder="Enter custom channel"
                              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              required
                            />
                          </motion.div>
                        )}

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Date <span className="text-red-500">*</span></label>
                          <input 
                            type="date" 
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">School(s) visited / Location <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g. Lincoln High School"
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Hot Leads (Interested Students) <span className="text-red-500">*</span></label>
                            <input 
                              type="number" 
                              min="0"
                              name="hotLeads"
                              value={formData.hotLeads}
                              onChange={handleInputChange}
                              placeholder="0"
                              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Paying Customers (Converted) <span className="text-red-500">*</span></label>
                            <input 
                              type="number" 
                              min="0"
                              name="convertedStudents"
                              value={formData.convertedStudents}
                              onChange={handleInputChange}
                              placeholder="0"
                              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Flyers Distributed <span className="text-red-500">*</span></label>
                            <input 
                              type="number" 
                              min="0"
                              name="flyersDistributed"
                              value={formData.flyersDistributed}
                              onChange={handleInputChange}
                              placeholder="0"
                              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Gifts Distributed <span className="text-red-500">*</span></label>
                            <input 
                              type="number" 
                              min="0"
                              name="giftsDistributed"
                              value={formData.giftsDistributed}
                              onChange={handleInputChange}
                              placeholder="0"
                              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Valid Contacts Uploaded to CRM <span className="text-red-500">*</span></label>
                          <input 
                            type="number" 
                            min="0"
                            name="contactsUploaded"
                            value={formData.contactsUploaded}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Parent/Student Data Collected</label>
                          <textarea 
                            name="dataCollected"
                            value={formData.dataCollected}
                            onChange={handleInputChange}
                            placeholder="Briefly describe the data collected (optional)"
                            rows={3}
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                          />
                        </div>

                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isSection1Valid}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next Section
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 py-1 px-3 rounded-full text-sm mr-3">Section 2</span>
                        Feedback & Support Needed
                      </h2>

                      <div className="space-y-8">
                        
                        <div className="space-y-4">
                          <label className="text-sm font-medium">Challenges / Observations <span className="text-neutral-400 font-normal">(optional)</span></label>
                          <textarea 
                            name="challenges"
                            value={formData.challenges}
                            onChange={handleInputChange}
                            placeholder="Describe any challenges you faced today..."
                            rows={3}
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-medium">Suggestions for Improvement <span className="text-neutral-400 font-normal">(optional)</span></label>
                          <textarea 
                            name="suggestions"
                            value={formData.suggestions}
                            onChange={handleInputChange}
                            placeholder="How can we improve the process?"
                            rows={3}
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-medium block">Objections & Feedback <span className="text-red-500">*</span></label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {OBJECTIONS.map((option) => (
                              <label key={option} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${formData.objections.includes(option) ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'}`}>
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  checked={formData.objections.includes(option)}
                                  onChange={() => toggleArrayItem('objections', option)}
                                />
                                <span className="ml-3 text-sm text-neutral-700 dark:text-neutral-300">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-medium block">Support Needed <span className="text-red-500">*</span></label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {SUPPORT_OPTIONS.map((option) => (
                              <label key={option} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${formData.supportNeeded.includes(option) ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'}`}>
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  checked={formData.supportNeeded.includes(option)}
                                  onChange={() => toggleArrayItem('supportNeeded', option)}
                                />
                                <span className="ml-3 text-sm text-neutral-700 dark:text-neutral-300">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Comment: What worked / what didn't today? <span className="text-red-500">*</span></label>
                          <textarea 
                            name="comments"
                            value={formData.comments}
                            onChange={handleInputChange}
                            placeholder="Summarize your day in 1-2 lines..."
                            rows={2}
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                            required
                          />
                        </div>

                      </div>
                    </div>
                    
                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 px-6 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-all hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                      >
                        <ChevronLeft className="mr-2 w-4 h-4" />
                        Previous
                      </button>
                      <button
                        type="submit"
                        disabled={!isSection2Valid || isSubmitting}
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 w-4 h-4" />
                            Submit Report
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
