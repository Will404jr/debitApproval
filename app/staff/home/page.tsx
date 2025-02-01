"use client";

import React from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface Issue {
  _id: string;
  subject: string;
  category: string;
  status: string;
  assignedTo: string;
  dueDate: string;
  submittedBy: string;
  content: string;
  createdAt: string;
}

export default function IssuesTable() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const itemsPerPage = 10;

  // Fetch issues
  React.useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch("/api/issues");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setIssues(data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };
    fetchIssues();
  }, []);

  // Filter issues based on search query and status
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.subject
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      issue.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = filteredIssues.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Format date for display
  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <main className="container mx-auto px-4 py-8 w-[90%]">
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
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
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
              <TableRow key={issue._id}>
                <TableCell className="font-medium">{issue.subject}</TableCell>
                <TableCell>{issue.category}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                      {
                        "bg-yellow-100 text-yellow-700":
                          issue.status === "Pending",
                        "bg-red-100 text-red-700": issue.status === "Overdue",
                        "bg-green-100 text-green-700":
                          issue.status === "Closed",
                        "bg-blue-100 text-blue-700": issue.status === "Open",
                      }
                    )}
                  >
                    {issue.status}
                  </span>
                </TableCell>
                <TableCell>{issue.assignedTo || "Unassigned"}</TableCell>
                <TableCell>{formatDate(issue.dueDate)}</TableCell>
                <TableCell>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setSelectedIssue(issue);
                      setIsDialogOpen(true);
                    }}
                  >
                    Details
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedIssue?.subject}</DialogTitle>
            </DialogHeader>
            {selectedIssue && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Category</h3>
                    <p>{selectedIssue.category}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Status</h3>
                    <p>{selectedIssue.status}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Submitted By</h3>
                    <p>{selectedIssue.submittedBy}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Assigned To</h3>
                    <p>{selectedIssue.assignedTo || "Unassigned"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Due Date</h3>
                    <p>{formatDate(selectedIssue.dueDate)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Created At</h3>
                    <p>{formatDate(selectedIssue.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Content</h3>
                  <p className="mt-2">{selectedIssue.content}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={cn(
                  currentPage === totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
}
