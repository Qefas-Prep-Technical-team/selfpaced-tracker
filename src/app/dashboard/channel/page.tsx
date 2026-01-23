"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
import { Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { FilterBar } from './components/FilterBar'
import { ChannelTable } from './components/ChannelTable'
import { useState } from 'react'
import { AddChannelModal } from './components/Modal/AddChannelModal'
import { useSession } from 'next-auth/react'



export default function DashboardPage() {
  const { data: session } = useSession();
      const [isModalOpen, setIsModalOpen] = useState(false)
      {/* 1. Define your check */}
const userRole = (session?.user as any)?.role?.toUpperCase();
const canManage = userRole === "ADMIN" || userRole === "EDITOR";

  return (
    <>
    <div className="flex h-screen overflow-hidden">
      <main className="flex-1  bg-background-light dark:bg-background-dark flex flex-col">
        <div className="max-w-300 w-full mx-auto px-6 pt-8">
          {/* Page Header */}
          <div className="flex flex-wrap justify-between items-end gap-4 pb-6">
            <div>
              <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">
                Channels Management
              </h2>
              <p className="text-slate-500 dark:text-[#92adc9] mt-1">
                Overview and performance of your acquisition sources
              </p>
            </div>
             {canManage && (
  <Button 
    icon={Plus} 
    iconPosition="left"
    onClick={() => setIsModalOpen(true)}
    className="shadow-lg shadow-primary/20 cursor-pointer"
  >
    Add New Channel
  </Button>
)}
          </div>

          {/* Table */}
          <div className="mb-12">
            <ChannelTable />
          </div>
        </div>
      </main>
    </div>
   
      {/* Add Channel Modal */}
      <AddChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
     
      />
    </>
  )
}