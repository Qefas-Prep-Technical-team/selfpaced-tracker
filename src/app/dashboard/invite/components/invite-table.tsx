"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SearchInput } from "./ui/input";
import {
  Copy,
  Send,
  UserX,
  RefreshCw,
  Trash2,
  Filter,
  ChevronDown,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface Invite {
  id: string;
  email: string;
  role: "Admin" | "Viewer" | "Editor";
  status: "accepted" | "pending" | "expired";
  invitedOn: Date | string;
  actions?: {
    copy?: boolean;
    resend?: boolean;
    revoke?: boolean;
    refresh?: boolean;
    delete?: boolean;
  };
}

interface InviteTableProps {
  invites: Invite[];
  searchPlaceholder?: string;
  onCopy?: (invite: Invite) => void;
  onResend?: (invite: Invite) => void;
  onRevoke?: (invite: Invite) => void;
  onRefresh?: (invite: Invite) => void;
  onDelete?: (invite: Invite) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

const InviteTable: React.FC<InviteTableProps> = ({
  invites,
  searchPlaceholder = "Search by email...",
  onCopy,
  onResend,
  onRevoke,
  onRefresh,
  onDelete,
  pagination,
}) => {
  const getStatusVariant = (status: Invite["status"]) => {
    switch (status) {
      case "accepted":
        return "success";
      case "pending":
        return "warning";
      case "expired":
        return "expired";
      default:
        return "default";
    }
  };

  const getRoleVariant = (role: Invite["role"]) => {
    switch (role) {
      case "Admin":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <div className="bg-white dark:bg-background-dark/50 border border-border-light dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
      {/* Table Header / Filters */}
      <div className="p-4 border-b border-border-light dark:border-border-dark flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1 max-w-lg">
          <SearchInput placeholder={searchPlaceholder} />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" rightIcon={<ChevronDown className="h-4 w-4" />}>
            Role: All
          </Button>
          <Button variant="secondary" rightIcon={<ChevronDown className="h-4 w-4" />}>
            Status: All
          </Button>
          <div className="w-[1px] h-8 bg-border-light dark:bg-border-dark mx-1" />
          <Button variant="secondary" size="icon">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Table Body */}
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
                <TableCell className="font-medium text-foreground">
                  {invite.email}
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleVariant(invite.role)}>
                    {invite.role}
                  </Badge>
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
                <TableCell className="text-gray-500 dark:text-gray-400">
                  {formatDate(invite.invitedOn)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {invite.status === "expired" ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled
                          className="opacity-50 cursor-not-allowed"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRefresh?.(invite)}
                        >
                          <RefreshCw className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                          onClick={() => onDelete?.(invite)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onCopy?.(invite)}
                        >
                          <Copy className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onResend?.(invite)}
                        >
                          <Send className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                          onClick={() => onRevoke?.(invite)}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer */}
      {pagination && (
        <div className="px-6 py-4 border-t border-border-light dark:border-border-dark flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-medium text-foreground">
              {Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{pagination.totalItems}</span>{" "}
            results
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { InviteTable };