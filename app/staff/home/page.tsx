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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MoreVertical, CheckSquare, Info } from "lucide-react";

interface Issue {
  _id: string;
  subject: string;
  category: string;
  status: string;
  assignedTo: string;
  submittedBy: string;
  content: string;
  approved: boolean;
  reslvedComment: string | null;
  createdAt: string;
}

export default function IssuesTable() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = React.useState(false);
  const [resolveComment, setResolveComment] = React.useState("");
  const [session, setSession] = React.useState<any>(null);
  const itemsPerPage = 10;

  // Fetch issues and session
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [issuesResponse, sessionResponse] = await Promise.all([
          fetch("/api/issues"),
          fetch("/api/session"),
        ]);
        if (!issuesResponse.ok || !sessionResponse.ok)
          throw new Error("Failed to fetch");
        const issuesData = await issuesResponse.json();
        const sessionData = await sessionResponse.json();
        // Only show approved issues
        setIssues(issuesData.filter((issue: Issue) => issue.approved));
        setSession(sessionData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
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

  // Handle opening the resolve dialog
  const openResolveDialog = (issue: Issue) => {
    setSelectedIssue(issue);
    setResolveComment("");
    setIsResolveDialogOpen(true);
  };

  // Handle resolving an issue
  const handleResolve = async () => {
    if (!selectedIssue) return;

    try {
      const response = await fetch(`/api/issues/${selectedIssue._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Closed",
          reslvedComment: resolveComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to resolve issue");
      }

      const updatedIssue = await response.json();
      setIssues(
        issues.map((issue) =>
          issue._id === selectedIssue._id ? updatedIssue : issue
        )
      );

      setIsResolveDialogOpen(false);
    } catch (error) {
      console.error("Error resolving issue:", error);
    }
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedIssue(issue);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Info className="mr-2 h-4 w-4" />
                        Details
                      </DropdownMenuItem>
                      {session?.username === issue.assignedTo &&
                        issue.status !== "Closed" && (
                          <DropdownMenuItem
                            onClick={() => openResolveDialog(issue)}
                          >
                            <CheckSquare className="mr-2 h-4 w-4" />
                            Resolve
                          </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Issue Details Dialog */}
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
                    <h3 className="font-semibold">Created At</h3>
                    <p>{formatDate(selectedIssue.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Content</h3>
                  <p className="mt-2">{selectedIssue.content}</p>
                </div>
                {selectedIssue.reslvedComment && (
                  <div>
                    <h3 className="font-semibold">Resolution Comment</h3>
                    <p className="mt-2">{selectedIssue.reslvedComment}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Resolve Issue Dialog */}
        <Dialog
          open={isResolveDialogOpen}
          onOpenChange={setIsResolveDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Resolve Issue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>Add a comment about how this issue was resolved:</p>
              <Textarea
                placeholder="Resolution details..."
                value={resolveComment}
                onChange={(e) => setResolveComment(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResolveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleResolve}>Resolve Issue</Button>
            </DialogFooter>
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
