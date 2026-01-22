/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Copy,
  Send,
  UserX,
  RefreshCw,
  Trash2,
  ChevronDown,
  Loader2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { cn, formatDate } from "@/lib/utils"; // Ensure formatDate is exported from utils
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export interface Invite {
  id: string;
  token: string;
  email: string;
  role: "Admin" | "Viewer" | "Editor";
  status: "accepted" | "pending" | "expired";
  invitedOn: Date | string;
}

interface InviteTableProps {
  invites: Invite[];
  onRoleChange?: (invite: Invite, newRole: Invite["role"]) => Promise<void> | void;
  onDelete?: (invite: Invite) => void;
  onCopy?: (invite: Invite) => void;
  onResend?: (invite: Invite) => void;
  onRevoke?: (invite: Invite) => void;
}

const InviteTable: React.FC<InviteTableProps> = ({
  invites,
  onRoleChange,
  onDelete,
  onCopy,
  onResend,
  onRevoke
}) => {
  // Track which invite is currently updating its role
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const handleRoleUpdate = async (invite: Invite, newRole: Invite["role"]) => {
    setUpdatingId(invite.id);
    if (onRoleChange) {
      await onRoleChange(invite, newRole);
    }
    setUpdatingId(null);
  };

  const getStatusVariant = (status: Invite["status"]): "success" | "warning" | "expired" | "default" => {
    switch (status) {
      case "accepted": return "success";
      case "pending": return "warning";
      case "expired": return "expired";
      default: return "default";
    }
  };

  return (
    <div className="bg-white dark:bg-background-dark/50 border border-border-light dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invited On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => (
              <TableRow key={invite.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                <TableCell className="font-medium text-foreground">{invite.email}</TableCell>

                {/* ROLE CELL WITH LOADING */}
                <TableCell>
                  <div className="relative group flex items-center gap-2">
                    {updatingId === invite.id ? (
                      <div className="flex items-center gap-2 text-sm text-primary animate-pulse font-medium pl-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <select
                          value={invite.role}
                          onChange={(e) => handleRoleUpdate(invite, e.target.value as Invite["role"])}
                          className={cn(
                            "appearance-none bg-transparent py-1 pl-2 pr-8 rounded-md border border-transparent",
                            "text-sm font-semibold cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-white/5",
                            invite.role === "Admin" ? "text-primary" : "text-slate-600 dark:text-slate-400"
                          )}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Editor">Editor</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                        <ChevronDown className="absolute right-2 h-3 w-3 text-slate-400 pointer-events-none group-hover:text-primary" />
                      </>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={getStatusVariant(invite.status)}
                    dot
                    dotClassName={invite.status === "pending" ? "animate-pulse" : ""}
                  >
                    {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                  </Badge>
                </TableCell>

                {/* INVITED ON CELL */}
                <TableCell className="text-gray-500 dark:text-gray-400 text-sm">
                  {invite.invitedOn ? formatDate(invite.invitedOn) : "N/A"}
                </TableCell>

                {/* ACTIONS CELL */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onCopy?.(invite)}>
                      <Copy className="h-4 w-4 text-primary cursor-pointer" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onResend?.(invite)}>
                      <Send className="h-4 w-4 cursor-pointer" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 cursor-pointer"
                      onClick={() => onDelete?.(invite)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export { InviteTable };