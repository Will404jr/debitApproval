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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandInput, CommandList, CommandItem } from "cmdk";
import { MoreVertical, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { users } from "@/lib/models/user";

interface User {
  id: string;
  username: string;
  email: string;
  personnelType: string;
}

interface Issue {
  _id: string;
  subject: string;
  category: string;
  status: string;
  assignedTo: string | null;
  dueDate: string;
  submittedBy: string;
  content: string;
  createdAt: string;
}

export default function EnhancedIssuesTable() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = React.useState(false);
  const [userSearchQuery, setUserSearchQuery] = React.useState("");
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

  // Calculate metrics
  const totalIssues = issues.length;
  const unassignedIssues = issues.filter((issue) => !issue.assignedTo).length;
  const assignedIssues = issues.filter((issue) => issue.assignedTo).length;

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Handle issue assignment
  const handleAssign = async (issueId: string, username: string) => {
    try {
      console.log("Assigning Issue:", { issueId, username });

      const response = await fetch(`/api/issues/${issueId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignedTo: username, status: "Pending" }),
      });

      if (!response.ok) {
        throw new Error(`Failed to assign issue. Status: ${response.status}`);
      }

      const updatedIssue = await response.json();

      setIssues(
        issues.map((issue) =>
          issue._id === issueId
            ? {
                ...issue,
                assignedTo: updatedIssue.assignedTo,
                status: updatedIssue.status,
              }
            : issue
        )
      );

      setIsAssignDialogOpen(false);
    } catch (error) {
      console.error("Error assigning issue:", error);
    }
  };

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
    <main className="container mx-auto px-4 py-8 w-[90%] space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalIssues}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Unassigned Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {unassignedIssues}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Assigned Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {assignedIssues}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
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
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedIssue(issue);
                          setIsAssignDialogOpen(true);
                        }}
                      >
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Assign
                      </DropdownMenuItem>
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

        {/* Assign User Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Issue</DialogTitle>
            </DialogHeader>
            <Command>
              <CommandInput
                placeholder="Search users..."
                value={userSearchQuery}
                onValueChange={setUserSearchQuery}
              />
              <CommandList>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => {
                      if (selectedIssue) {
                        handleAssign(selectedIssue._id, user.username);
                      }
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{user.username}</span>
                      <span className="text-sm text-gray-500">
                        {user.email} • {user.personnelType}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
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
