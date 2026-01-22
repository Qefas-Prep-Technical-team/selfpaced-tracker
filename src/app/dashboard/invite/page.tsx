/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { Check, Clock, AlertCircle } from "lucide-react";
import { PageHeading } from "./components/page-heading";
import { StatCard } from "./components/ui/stat-card";
import { InviteTable } from "./components/invite-table";
import { Alert } from "./components/ui/alert";
import { SlideOver } from "./components/ui/slide-over";
import { Button } from "../components/ui/Button";
import { InviteGenerator } from "./components/invite-generator";

export default function InviteManagementPage() {
   const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  const handleGenerateInvite = async (data: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `https://platform.qefas.io/invite/${Math.random().toString(36).substr(2, 9)}`;
  };

  const [invites] = useState([
    {
      id: "1",
      email: "sarah.jennings@corp.com",
      role: "Admin" as const,
      status: "accepted" as const,
      invitedOn: new Date("2023-10-24"),
    },
    {
      id: "2",
      email: "m.chen@analytics.io",
      role: "Viewer" as const,
      status: "pending" as const,
      invitedOn: new Date("2023-10-26"),
    },
    {
      id: "3",
      email: "david.wilson@security.net",
      role: "Admin" as const,
      status: "expired" as const,
      invitedOn: new Date("2023-09-12"),
    },
    {
      id: "4",
      email: "lisa.monroe@partner.com",
      role: "Viewer" as const,
      status: "accepted" as const,
      invitedOn: new Date("2023-10-19"),
    },
  ]);

  const handleCopy = (invite: any) => {
    console.log("Copy invite:", invite.email);
    // Implement copy logic
  };

  const handleResend = (invite: any) => {
    console.log("Resend invite:", invite.email);
    // Implement resend logic
  };

  const handleRevoke = (invite: any) => {
    console.log("Revoke invite:", invite.email);
    // Implement revoke logic
  };

  return (
    <>
     
      <main className=" mx-auto px-6 py-8">
        <PageHeading
          title="Invite Management"
          description="Manage secure, invite-only user access to the QEFAS platform."
          action={{
            label: "Generate Invite",
            onClick: ()=>setIsSlideOverOpen(true),
          }}
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Active Invites"
            value={124}
            icon={<Check className="h-5 w-5 text-primary" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Pending"
            value={18}
            icon={<Clock className="h-5 w-5 text-amber-400" />}
          />
          <StatCard
            title="Expired"
            value={5}
            icon={<AlertCircle className="h-5 w-5 text-red-400" />}
            trend={{ value: 5, isPositive: false }}
          />
        </div>

        {/* Table */}
        <InviteTable
          invites={invites}
          onCopy={handleCopy}
          onResend={handleResend}
          onRevoke={handleRevoke}
          onRefresh={handleCopy}
          onDelete={handleRevoke}
          pagination={{
            currentPage: 1,
            totalPages: 37,
            totalItems: 147,
            itemsPerPage: 4,
            onPageChange: (page) => console.log("Page changed:", page),
          }}
        />

        {/* Security Note */}
        <div className="mt-8">
          <Alert icon={<Shield className="h-5 w-5" />}>
            All generated links are secure and expire automatically after 7 days unless accepted. Access can be revoked instantly at any time.
          </Alert>
        </div>
      </main>
        {/* Slide-over Panel */}
      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        title="Generate New Invite"
        footer={
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                // Handle generate invite
                console.log("Generate invite");
              }}
              size="lg"
              className="w-full"
            >
              Generate Invite Link
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsSlideOverOpen(false)}
              size="lg"
              className="w-full"
            >
              Send Another Invite
            </Button>
          </div>
        }
      >
        <InviteGenerator onGenerate={async (data) => {
    const res = await fetch("/api/invites/generate", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    
    if (!res.ok) throw new Error("Failed");
    
    const result = await res.json();
    return result.link; // This string will populate the GeneratedLink UI
  }} />
      </SlideOver>
    </>
  );
}