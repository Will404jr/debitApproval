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
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
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
import toast from "react-hot-toast";

interface Bank {
  _id: string;
  name: string;
  representativeName: string;
  representativePhoneNumber: string;
  representativeEmail: string;
  bankIdentificationNumber: string;
}

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBank, setCurrentBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    representativeName: "",
    representativePhoneNumber: "",
    representativeEmail: "",
    bankIdentificationNumber: "",
  });

  // Fetch banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch("/api/bank");
        if (!response.ok) throw new Error("Failed to fetch banks");
        const data = await response.json();
        setBanks(data);
      } catch (error) {
        console.error("Error fetching banks:", error);
        toast.error("Failed to load banks");
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create bank
  const handleCreateBank = async () => {
    try {
      const response = await fetch("/api/bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create bank");

      const newBank = await response.json();
      setBanks((prev) => [...prev, newBank]);
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        representativeName: "",
        representativePhoneNumber: "",
        representativeEmail: "",
        bankIdentificationNumber: "",
      });
      toast.success("Bank created successfully");
    } catch (error) {
      console.error("Error creating bank:", error);
      toast.error("Failed to create bank");
    }
  };

  // Edit bank
  const handleEditBank = async () => {
    if (!currentBank) return;

    try {
      const response = await fetch(`/api/bank/${currentBank._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update bank");

      const updatedBank = await response.json();
      setBanks((prev) =>
        prev.map((bank) => (bank._id === updatedBank._id ? updatedBank : bank))
      );
      setIsEditDialogOpen(false);
      setCurrentBank(null);
      toast.success("Bank updated successfully");
    } catch (error) {
      console.error("Error updating bank:", error);
      toast.error("Failed to update bank");
    }
  };

  // Delete bank
  const handleDeleteBank = async () => {
    if (!currentBank) return;

    try {
      const response = await fetch(`/api/bank/${currentBank._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete bank");

      setBanks((prev) => prev.filter((bank) => bank._id !== currentBank._id));
      setIsDeleteDialogOpen(false);
      setCurrentBank(null);
      toast.success("Bank deleted successfully");
    } catch (error) {
      console.error("Error deleting bank:", error);
      toast.error("Failed to delete bank");
    }
  };

  // Delete multiple banks
  const handleDeleteSelected = async () => {
    try {
      // Create a copy of the selected banks to avoid state issues during deletion
      const banksToDelete = [...selectedBanks];

      // Delete each selected bank
      for (const bankId of banksToDelete) {
        const response = await fetch(`/api/bank/${bankId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error(`Failed to delete bank ${bankId}`);
      }

      // Update the banks list
      setBanks((prev) =>
        prev.filter((bank) => !selectedBanks.includes(bank._id))
      );
      setSelectedBanks([]);
      toast.success(`${banksToDelete.length} banks deleted successfully`);
    } catch (error) {
      console.error("Error deleting selected banks:", error);
      toast.error("Failed to delete some banks");
    }
  };

  // Toggle bank selection
  const toggleSelectBank = (id: string) => {
    setSelectedBanks((prev) =>
      prev.includes(id) ? prev.filter((bankId) => bankId !== id) : [...prev, id]
    );
  };

  // Toggle select all banks
  const toggleSelectAll = () => {
    if (selectedBanks.length === filteredBanks.length) {
      setSelectedBanks([]);
    } else {
      setSelectedBanks(filteredBanks.map((bank) => bank._id));
    }
  };

  // Open edit dialog
  const openEditDialog = (bank: Bank) => {
    setCurrentBank(bank);
    setFormData({
      name: bank.name,
      representativeName: bank.representativeName,
      representativePhoneNumber: bank.representativePhoneNumber,
      representativeEmail: bank.representativeEmail,
      bankIdentificationNumber: bank.bankIdentificationNumber,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (bank: Bank) => {
    setCurrentBank(bank);
    setIsDeleteDialogOpen(true);
  };

  // Filter banks based on search term
  const filteredBanks = banks.filter((bank) => {
    return (
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.representativeName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      bank.representativeEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      bank.representativePhoneNumber.includes(searchTerm) ||
      bank.bankIdentificationNumber.includes(searchTerm)
    );
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Banks</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Banks Management</CardTitle>
              <div className="flex items-center gap-2">
                {selectedBanks.length > 0 && (
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
                          delete the selected banks and remove their data from
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
                      Create Bank
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Bank</DialogTitle>
                      <DialogDescription>
                        Add a new bank to the system. Fill out the form below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Bank Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="First National Bank"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="representativeName">
                          Representative Name
                        </Label>
                        <Input
                          id="representativeName"
                          name="representativeName"
                          value={formData.representativeName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="representativePhoneNumber">
                          Representative Phone Number
                        </Label>
                        <Input
                          id="representativePhoneNumber"
                          name="representativePhoneNumber"
                          value={formData.representativePhoneNumber}
                          onChange={handleInputChange}
                          placeholder="+1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="representativeEmail">
                          Representative Email
                        </Label>
                        <Input
                          id="representativeEmail"
                          name="representativeEmail"
                          type="email"
                          value={formData.representativeEmail}
                          onChange={handleInputChange}
                          placeholder="john.doe@bank.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankIdentificationNumber">
                          Bank Identification Number
                        </Label>
                        <Input
                          id="bankIdentificationNumber"
                          name="bankIdentificationNumber"
                          value={formData.bankIdentificationNumber}
                          onChange={handleInputChange}
                          placeholder="BNK12345"
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
                      <Button onClick={handleCreateBank}>Create Bank</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <Input
                  placeholder="Search banks..."
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
                              selectedBanks.length === filteredBanks.length &&
                              filteredBanks.length > 0
                            }
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Representative</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Identification Number</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBanks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No banks found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBanks.map((bank) => (
                          <TableRow key={bank._id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedBanks.includes(bank._id)}
                                onCheckedChange={() =>
                                  toggleSelectBank(bank._id)
                                }
                              />
                            </TableCell>
                            <TableCell>{bank.name}</TableCell>
                            <TableCell>{bank.representativeName}</TableCell>
                            <TableCell>
                              {bank.representativePhoneNumber}
                            </TableCell>
                            <TableCell>{bank.representativeEmail}</TableCell>
                            <TableCell>
                              {bank.bankIdentificationNumber}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(bank)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(bank)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Edit Bank Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bank</DialogTitle>
            <DialogDescription>
              Update bank information. Fill out the form below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Bank Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-representativeName">
                Representative Name
              </Label>
              <Input
                id="edit-representativeName"
                name="representativeName"
                value={formData.representativeName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-representativePhoneNumber">
                Representative Phone Number
              </Label>
              <Input
                id="edit-representativePhoneNumber"
                name="representativePhoneNumber"
                value={formData.representativePhoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-representativeEmail">
                Representative Email
              </Label>
              <Input
                id="edit-representativeEmail"
                name="representativeEmail"
                type="email"
                value={formData.representativeEmail}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bankIdentificationNumber">
                Bank Identification Number
              </Label>
              <Input
                id="edit-bankIdentificationNumber"
                name="bankIdentificationNumber"
                value={formData.bankIdentificationNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditBank}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Bank Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              bank and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBank}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
