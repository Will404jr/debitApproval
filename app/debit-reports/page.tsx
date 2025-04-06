"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Bank {
  _id: string;
  name: string;
}

interface DebitReport {
  _id: string;
  user: User;
  bank: Bank;
  transactionDate: string;
  nssfReferenceNumber: string;
  amount: number;
  justification: string;
}

export default function DebitReportsPage() {
  const [debitReports, setDebitReports] = useState<DebitReport[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<DebitReport | null>(null);
  const [formData, setFormData] = useState({
    user: "",
    bank: "",
    transactionDate: "",
    nssfReferenceNumber: "",
    amount: "",
    justification: "",
  });

  // Add pagination state variables after the existing state declarations
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch debit reports, users, and banks
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch debit reports
        const reportsResponse = await fetch("/api/debit-data");
        if (!reportsResponse.ok)
          throw new Error("Failed to fetch debit reports");
        const reportsData = await reportsResponse.json();
        setDebitReports(reportsData);

        // Fetch users
        const usersResponse = await fetch("/api/user");
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch banks
        const banksResponse = await fetch("/api/bank");
        if (!banksResponse.ok) throw new Error("Failed to fetch banks");
        const banksData = await banksResponse.json();
        setBanks(banksData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create debit report
  const handleCreateReport = async () => {
    try {
      // Format the data for the API
      const reportData = {
        user: formData.user,
        bank: formData.bank,
        transactionDate: new Date(formData.transactionDate).toISOString(),
        nssfReferenceNumber: formData.nssfReferenceNumber,
        amount: Number.parseFloat(formData.amount),
        justification: formData.justification,
      };

      const response = await fetch("/api/debit-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) throw new Error("Failed to create debit report");

      const newReport = await response.json();
      setDebitReports((prev) => [...prev, newReport]);
      setIsCreateDialogOpen(false);
      setFormData({
        user: "",
        bank: "",
        transactionDate: "",
        nssfReferenceNumber: "",
        amount: "",
        justification: "",
      });
      toast.success("Debit report created successfully");
    } catch (error) {
      console.error("Error creating debit report:", error);
      toast.error("Failed to create debit report");
    }
  };

  // Delete debit report
  const handleDeleteReport = async () => {
    if (!currentReport) return;

    try {
      const response = await fetch(`/api/debit-data/${currentReport._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete debit report");

      setDebitReports((prev) =>
        prev.filter((report) => report._id !== currentReport._id)
      );
      setIsDeleteDialogOpen(false);
      setCurrentReport(null);
      toast.success("Debit report deleted successfully");
    } catch (error) {
      console.error("Error deleting debit report:", error);
      toast.error("Failed to delete debit report");
    }
  };

  // Delete multiple debit reports
  const handleDeleteSelected = async () => {
    try {
      // Create a copy of the selected reports to avoid state issues during deletion
      const reportsToDelete = [...selectedReports];

      // Delete each selected report
      for (const reportId of reportsToDelete) {
        const response = await fetch(`/api/debit-data/${reportId}`, {
          method: "DELETE",
        });

        if (!response.ok)
          throw new Error(`Failed to delete report ${reportId}`);
      }

      // Update the reports list
      setDebitReports((prev) =>
        prev.filter((report) => !selectedReports.includes(report._id))
      );
      setSelectedReports([]);
      toast.success(`${reportsToDelete.length} reports deleted successfully`);
    } catch (error) {
      console.error("Error deleting selected reports:", error);
      toast.error("Failed to delete some reports");
    }
  };

  // Toggle report selection
  const toggleSelectReport = (id: string) => {
    setSelectedReports((prev) =>
      prev.includes(id)
        ? prev.filter((reportId) => reportId !== id)
        : [...prev, id]
    );
  };

  // Toggle select all reports
  const toggleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map((report) => report._id));
    }
  };

  // Open delete dialog
  const openDeleteDialog = (report: DebitReport) => {
    setCurrentReport(report);
    setIsDeleteDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format amount for display
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Filter reports based on search term
  const filteredReports = debitReports.filter((report) => {
    const userName =
      `${report.user.firstName} ${report.user.lastName}`.toLowerCase();
    const bankName = report.bank.name.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return (
      userName.includes(searchLower) ||
      bankName.includes(searchLower) ||
      report.nssfReferenceNumber.toLowerCase().includes(searchLower) ||
      report.justification.toLowerCase().includes(searchLower)
    );
  });

  // Add this after the filteredReports declaration
  // Calculate pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  // Add these functions for pagination control
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Debit Reports</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Debit Reports</CardTitle>
              <div className="flex items-center gap-2">
                {selectedReports.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Selected
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the selected reports and remove their data from
                          our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteSelected}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Debit Report</DialogTitle>
                      <DialogDescription>
                        Add a new debit report to the system. Fill out the form
                        below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="user">User</Label>
                        <Select
                          value={formData.user}
                          onValueChange={(value) =>
                            handleSelectChange("user", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user._id} value={user._id}>
                                {user.firstName} {user.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank">Bank</Label>
                        <Select
                          value={formData.bank}
                          onValueChange={(value) =>
                            handleSelectChange("bank", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a bank" />
                          </SelectTrigger>
                          <SelectContent>
                            {banks.map((bank) => (
                              <SelectItem key={bank._id} value={bank._id}>
                                {bank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="transactionDate">
                          Transaction Date
                        </Label>
                        <Input
                          id="transactionDate"
                          name="transactionDate"
                          type="date"
                          value={formData.transactionDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nssfReferenceNumber">
                          NSSF Reference Number
                        </Label>
                        <Input
                          id="nssfReferenceNumber"
                          name="nssfReferenceNumber"
                          value={formData.nssfReferenceNumber}
                          onChange={handleInputChange}
                          placeholder="NSSF-12345"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          value={formData.amount}
                          onChange={handleInputChange}
                          placeholder="1000.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="justification">Justification</Label>
                        <Input
                          id="justification"
                          name="justification"
                          value={formData.justification}
                          onChange={handleInputChange}
                          placeholder="Loan repayment"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateReport}>
                        Create Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <Input
                  placeholder="Search reports..."
                  className="h-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="rounded-md border">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={
                              selectedReports.length ===
                                filteredReports.length &&
                              filteredReports.length > 0
                            }
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Bank</TableHead>
                        <TableHead>Transaction Date</TableHead>
                        <TableHead>NSSF Reference Number</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Justification</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No debit reports found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentItems.map((report) => (
                          <TableRow key={report._id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedReports.includes(report._id)}
                                onCheckedChange={() =>
                                  toggleSelectReport(report._id)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {report.user.firstName} {report.user.lastName}
                            </TableCell>
                            <TableCell>{report.bank.name}</TableCell>
                            <TableCell>
                              {formatDate(report.transactionDate)}
                            </TableCell>
                            <TableCell>{report.nssfReferenceNumber}</TableCell>
                            <TableCell>{formatAmount(report.amount)}</TableCell>
                            <TableCell>{report.justification}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(report)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
                <div className="flex items-center justify-between mt-4 p-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Rows per page
                    </span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={handleItemsPerPageChange}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={itemsPerPage.toString()} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                      >
                        <span className="sr-only">Go to previous page</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                      >
                        <span className="sr-only">Go to next page</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Delete Report Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              debit report and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReport}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
