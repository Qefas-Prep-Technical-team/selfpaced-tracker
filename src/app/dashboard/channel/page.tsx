"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
import { Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { FilterBar } from './components/FilterBar'
import { ChannelTable } from './components/ChannelTable'
import { AddChannelDrawer } from './components/sidedrawer/AddChannelDrawer'
import { useState } from 'react'
import { AddChannelModal } from './components/Modal/AddChannelModal'



export default function DashboardPage() {
     const [isDrawerOpen, setIsDrawerOpen] = useState(false)
      const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddChannel = (data: any) => {
    console.log('Adding channel:', data)
    // Here you would typically make an API call
    alert(`Channel "${data.name}" added successfully!`)
  }


  const handleSaveChannel = (data: any) => {
    console.log('Saving channel:', data)
    // Here you would typically make an API call
    alert(`Channel "${data.name}" saved successfully!`)
  }
  return (
    <>
    <div className="flex h-screen overflow-hidden">
   
      
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark flex flex-col">
        <div className="max-w-[1200px] w-full mx-auto px-6 pt-8">
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
            
            {/* <Button 

             icon={Plus} 
                iconPosition="left"
                onClick={() => setIsDrawerOpen(true)}
            >
              Add New Channel
            </Button> */}
              {/* <Button 
                icon={Plus} 
                iconPosition="left"
                onClick={() => setIsModalOpen(true)}
                className="shadow-lg shadow-primary/20"
              >
                Add New Channel
              </Button> */}
          </div>

          {/* Filters */}
          <FilterBar />

          {/* Table */}
          <div className="mb-12">
            <ChannelTable />
          </div>
        </div>
      </main>
    </div>
    {/* Add Channel Drawer */}
      {/* <AddChannelDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveChannel}
      /> */}
      {/* Add Channel Modal */}
      <AddChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddChannel}
      />
    </>
  )
}