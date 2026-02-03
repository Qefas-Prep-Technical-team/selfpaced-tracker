"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ChannelTable } from './components/ChannelTable'
import { useState } from 'react'
import { AddChannelModal } from './components/Modal/AddChannelModal'
import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<any>(null) // New: Holds channel for editing

  const userRole = (session?.user as any)?.role?.toUpperCase();
  const canManage = userRole === "ADMIN" || userRole === "EDITOR";

  const handleEdit = (channel: any) => {
    setSelectedChannel(channel);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedChannel(null); // Clear selected channel for "New" mode
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 bg-background-light dark:bg-background-dark flex flex-col">
          <div className="max-w-300 w-full mx-auto px-6 pt-8">
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
                  onClick={handleAddNew} // Use the helper
                  className="shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Add New Channel
                </Button>
              )}
            </div>

            <div className="mb-12">
              {/* Pass the handleEdit function to the table */}
              <ChannelTable onEdit={handleEdit} />
            </div>
          </div>
        </main>
      </div>
     
      {/* Modal handles both Edit and Add based on initialData */}
      <AddChannelModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedChannel(null);
        }}
        initialData={selectedChannel} 
      />
    </>
  )
}