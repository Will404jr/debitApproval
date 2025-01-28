"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Issue, issues } from "@/lib/data";

export function IssuesTable() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Filter issues based on search query and status
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.subject
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || issue.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = filteredIssues.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <div className="w-full bg-gradient-to-r from-blue-600 to-green-400 h-1 absolute top-0 left-0 right-0" />
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned to</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedIssues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell className="font-medium">{issue.subject}</TableCell>
              <TableCell>{issue.category}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                    {
                      "bg-red-100 text-red-700": issue.status === "Urgent",
                      "bg-green-100 text-green-700": issue.status === "Closed",
                      "bg-gray-100 text-gray-700": issue.status === "Open",
                    }
                  )}
                >
                  {issue.status}
                </span>
              </TableCell>
              <TableCell>{issue.assignedTo}</TableCell>
              <TableCell>{issue.dueDate}</TableCell>
              <TableCell>
                <button className="text-blue-600 hover:underline">
                  Details
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={cn(
                currentPage === 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={cn(
                currentPage === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
