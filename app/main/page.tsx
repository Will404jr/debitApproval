"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CheckCircle2, CreditCard, LogOut } from "lucide-react";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Background from "@/components/bg";

// Define interfaces for data
interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface Bank {
  _id: string;
  name: string;
}

interface SessionData {
  isLoggedIn: boolean;
  email: string;
  userType: string;
  expiresAt: number;
}

// Define form schema
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  bank: z.string().min(1, "Please select a bank"),
  transactionDate: z.date({
    required_error: "Please select a transaction date",
  }),
  nssfReferenceNumber: z.string().min(1, "NSSF reference number is required"),
  amount: z.string().min(1, "Amount is required"),
  justification: z
    .string()
    .min(10, "Justification must be at least 10 characters"),
});

export default function DebitApprovalForm() {
  const router = useRouter();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bank: "",
      transactionDate: new Date(),
      nssfReferenceNumber: "",
      amount: "",
      justification: "",
    },
  });

  // Define fetchUserData function before using it
  const fetchUserData = async (email: string) => {
    try {
      // First try to find existing user
      const response = await fetch(
        `/api/user/by-email?email=${encodeURIComponent(email)}`
      );

      if (response.ok) {
        const data = await response.json();
        setUserData(data);

        // Update form with user data
        form.setValue("firstName", data.firstName);
        form.setValue("lastName", data.lastName);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Don't show error toast as the user might not exist yet
    }
  };

  // Fetch session data
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch("/api/session");
        if (!response.ok) throw new Error("Failed to fetch session data");
        const data = await response.json();
        setSessionData(data);

        // If we have an email in the session, fetch user details
        if (data.email) {
          fetchUserData(data.email);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        toast.error("Failed to load session data");
      }
    };

    fetchSessionData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch banks
  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
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

  // Handle form submission - UPDATED to use existing user
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Check if we have user data
    if (!userData || !userData._id) {
      toast.error(
        "User information not available. Please try logging in again."
      );
      return;
    }

    setSubmitting(true);
    try {
      // Create the debit data using the existing user ID
      const debitResponse = await fetch("/api/debit-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userData._id, // Use the existing user ID
          bank: values.bank,
          transactionDate: values.transactionDate.toISOString(),
          nssfReferenceNumber: values.nssfReferenceNumber,
          amount: Number.parseFloat(values.amount),
          justification: values.justification,
        }),
      });

      if (!debitResponse.ok) throw new Error("Failed to submit debit approval");

      // Also send data to external endpoint
      try {
        // Get bank name for the description
        const bankResponse = await fetch(`/api/bank/${values.bank}`);
        let bankName = "Selected Bank";
        if (bankResponse.ok) {
          const bankData = await bankResponse.json();
          bankName = bankData.name;
        }

        // Format description with all form fields
        const description = `
    User: ${userData.firstName} ${userData.lastName}
    Email: ${userData.email}
    Phone: ${userData.phoneNumber}
    Bank: ${bankName}
    Transaction Date: ${format(values.transactionDate, "dd/MM/yyyy")}
    NSSF Reference Number: ${values.nssfReferenceNumber}
    Amount: UGX ${values.amount}
    Justification: ${values.justification}
  `;

        // Prepare data for external API
        const externalData = {
          input_data: JSON.stringify({
            request: {
              subject: "Debit Approval Issues",
              description: description,
              requester: { id: "009", name: "administrator" },
              status: { name: "Open" },
            },
          }),
        };

        // Convert to URL encoded form data
        const formData = new URLSearchParams(externalData);

        // Send to external API
        const externalResponse = await fetch(
          "https://techassist.nssfug.org/api/v3/requests?PORTALID=901&TECHNICIAN_KEY=2207AA71-A318-44C5-BA75-2041F2D67688&format=json",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
          }
        );

        if (!externalResponse.ok) {
          console.warn(
            "External API request failed, but continuing with form submission"
          );
        } else {
          console.log("Successfully sent data to external API");
        }
      } catch (error) {
        console.error("Error sending to external API:", error);
        // Don't fail the whole submission if external API fails
        toast.error("Form submitted but external notification failed");
      }

      // Show success dialog instead of toast
      setShowSuccessDialog(true);

      // Reset form
      form.reset();

      // Close dialog and refresh page after 3 seconds
      setTimeout(() => {
        setShowSuccessDialog(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit debit approval");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle date change for the custom date picker
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
    form.setValue("transactionDate", date);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Logged out successfully");
        // Redirect to login page
        router.push("/");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <Background>
      <div className="min-h-screen">
        {/* Navbar */}
        <nav className="text-white">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6" />
              <h1 className="text-xl font-bold">Debit Approval Form</h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt={userData?.firstName || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userData
                        ? `${userData.firstName[0]}${userData.lastName[0]}`
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex flex-col items-start">
                    <span className="font-medium">
                      {userData
                        ? `${userData.firstName} ${userData.lastName}`
                        : "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {sessionData?.email || ""}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Personal Information
                        </h3>

                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Transaction Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Transaction Details
                        </h3>

                        <FormField
                          control={form.control}
                          name="bank"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bank</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={loading}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a bank" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {banks.map((bank) => (
                                    <SelectItem key={bank._id} value={bank._id}>
                                      {bank.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="transactionDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col pt-3">
                              <FormLabel>Transaction Date</FormLabel>
                              <FormControl>
                                {/* Simple HTML date input instead of shadcn calendar */}
                                <Input
                                  type="date"
                                  value={
                                    field.value
                                      ? format(field.value, "yyyy-MM-dd")
                                      : ""
                                  }
                                  onChange={handleDateChange}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Additional Details
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="nssfReferenceNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>NSSF Reference Number</FormLabel>
                              <FormControl>
                                <Input placeholder="NSSF-12345" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter your NSSF reference number
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="1000.00"
                                  {...field}
                                  onChange={(e) => {
                                    // Ensure only numbers and decimals
                                    const value = e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    );
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter the amount in UGX
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="justification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Justification</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide a detailed justification for this debit approval request"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Explain why this debit approval is needed
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <CardFooter className="flex justify-end px-0">
                      <Button
                        type="submit"
                        className="bg-[#094171] hover:bg-[#0a5694] text-white"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          "Submit Debit Approval"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-6 text-white">
            <div className="animate-bounce mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Success!</h2>
            <p className="text-center text-white mb-4">
              Your debit approval has been submitted successfully.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-green-500 h-2 rounded-full animate-[progress_3s_ease-in-out]"
                style={{ width: "100%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">Refreshing page...</p>
          </DialogContent>
        </Dialog>
      </div>
    </Background>
  );
}
