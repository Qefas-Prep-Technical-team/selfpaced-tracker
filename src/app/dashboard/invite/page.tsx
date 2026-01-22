/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Shield, Check, Clock, AlertCircle } from "lucide-react";
import { PageHeading } from "./components/page-heading";
import { StatCard } from "./components/ui/stat-card";
import { Invite, InviteTable } from "./components/invite-table";
import { Alert } from "./components/ui/alert";
import { SlideOver } from "./components/ui/slide-over";
import { Button } from "../components/ui/Button";
import { InviteGenerator } from "./components/invite-generator";
import { toast } from "react-toastify"; // Ensure ToastContainer is in your layout.tsx

export default function InviteManagementPage() {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    try {
      const res = await fetch("/api/invites");
      const data = await res.json();
      setInvites(data);
    } catch (err) {
      console.error("Error loading invites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  // --- ROLE CHANGE LOGIC (Toastify Style) ---
  const handleRoleChange = async (invite: Invite, newRole: Invite["role"]) => {
    // 1. Create the loading toast and capture the ID
    const toastId = toast.loading(`Updating ${invite.email}...`);

    try {
      const res = await fetch(`/api/invites/${invite.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole.toLowerCase() }),
      });

      if (!res.ok) throw new Error();

      // 2. Update the existing toast to success
      toast.update(toastId, {
        render: `Role updated to ${newRole}`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setInvites(prev => prev.map(i => i.id === invite.id ? { ...i, role: newRole } : i));
    } catch (err) {
      // 3. Update the existing toast to error
      toast.update(toastId, {
        render: "Failed to update role. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // --- DELETE LOGIC (Toastify Style) ---
  const handleDelete = async (invite: Invite) => {
    const deletePromise = fetch(`/api/invites/${invite.id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        setInvites(prev => prev.filter(i => i.id !== invite.id));
        return `Invite for ${invite.email} removed`;
      });

    toast.promise(deletePromise, {
      pending: 'Deleting invite...',
      success: {
        render({ data }) { return `${data}`; }
      },
      error: 'Could not delete invite 🤯'
    });
  };

  const handleCopy = (invite: Invite) => {
    navigator.clipboard.writeText(`${window.location.origin}/invite?token=${invite.token}`);
    toast.success("Link copied to clipboard!");
  };

  return (
    <>
      <main className="mx-auto px-6 py-8">
        <PageHeading
          title="Invite Management"
          description="Manage secure, invite-only user access to the QEFAS platform."
          action={{
            label: "Generate Invite",
            onClick: () => setIsSlideOverOpen(true),
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Active Invites"
            value={invites.filter(i => i.status === 'accepted').length}
            icon={<Check className="h-5 w-5 text-primary" />}
          />
          <StatCard
            title="Pending"
            value={invites.filter(i => i.status === 'pending').length}
            icon={<Clock className="h-5 w-5 text-amber-400" />}
          />
          <StatCard
            title="Expired"
            value={invites.filter(i => i.status === 'expired').length}
            icon={<AlertCircle className="h-5 w-5 text-red-400" />}
          />
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading team data...</div>
        ) : (
          <InviteTable
            invites={invites}
            onRoleChange={handleRoleChange}
            onDelete={handleDelete}
            onCopy={handleCopy}
          />
        )}

        <div className="mt-8">
          <Alert icon={<Shield className="h-5 w-5" />}>
            All generated links are secure and expire automatically after 7 days unless accepted. Access can be revoked instantly at any time.
          </Alert>
        </div>
      </main>

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        title="Generate New Invite"
      >
        <InviteGenerator onGenerate={async (formData) => {
          const res = await fetch("/api/invites/generate", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) throw new Error("Failed");

          const result = await res.json();
          fetchInvites();
          return result.link;
        }} />
      </SlideOver>
    </>
  );
}