"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define email form schema
const emailFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("user");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");

  // Completely separate OTP state
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  // Initialize email form
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle email form submission
  const onEmailSubmit = async (values: z.infer<typeof emailFormSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          userType: activeTab,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Specifically handle 404 errors for user/admin not found
        if (response.status === 404) {
          toast.error(
            `${activeTab === "admin" ? "Admin" : "User"} email not found`
          );
          // Return early without throwing an error
          return;
        } else {
          toast.error(data.error || "Failed to send OTP");
          throw new Error(data.error || "Failed to send OTP");
        }
      }

      setEmail(values.email);
      setShowOtpForm(true);
      // Reset OTP value
      setOtpValue("");
      setOtpError("");
      toast.success("OTP sent to your email");
    } catch (error) {
      console.error("Login error:", error);
      // Don't show toast here for 404 errors as we already handled them above
      if (!(error instanceof Error && error.message.includes("not found"))) {
        toast.error(
          error instanceof Error ? error.message : "Failed to send OTP"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP submission with separate state
  const handleOtpSubmit = async () => {
    // Reset error
    setOtpError("");

    // Validate OTP
    if (!otpValue || otpValue.length < 6) {
      setOtpError("OTP must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otpValue,
          userType: activeTab,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      toast.success(`Logged in successfully as ${activeTab}`);

      // Redirect based on user type
      if (activeTab === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/main");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError(
        error instanceof Error ? error.message : "Failed to verify OTP"
      );
      toast.error(
        error instanceof Error ? error.message : "Failed to verify OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back button click
  const handleBack = () => {
    setShowOtpForm(false);
    setIsLoading(false);
    setOtpValue("");
    setOtpError("");
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left side - Marketing Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/imgs/img.jpg"
          alt="Debit Approval System"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#094171]/80 to-transparent flex flex-col justify-end p-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Debit Approval Management System
          </h1>
          <p className="text-blue-100 text-xl max-w-md">
            Streamline your debit approval process with our comprehensive
            management solution
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#094171]">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Please sign in to continue</p>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-4">
              {!showOtpForm ? (
                <Tabs
                  defaultValue="user"
                  className="w-full"
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="user">User</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                  </TabsList>

                  <TabsContent value="user">
                    <CardTitle className="text-xl">User Login</CardTitle>
                    <CardDescription>
                      Login to submit and track your debit approval requests
                    </CardDescription>
                  </TabsContent>

                  <TabsContent value="admin">
                    <CardTitle className="text-xl">Admin Login</CardTitle>
                    <CardDescription>
                      Login to manage users, banks, and debit approvals
                    </CardDescription>
                  </TabsContent>
                </Tabs>
              ) : (
                <>
                  <CardTitle className="text-xl">Enter OTP</CardTitle>
                  <CardDescription>
                    We've sent a one-time password to your email
                  </CardDescription>
                </>
              )}
            </CardHeader>

            <CardContent>
              {showOtpForm ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {/* Use regular HTML label instead of FormLabel */}
                    <label
                      htmlFor="otp-input"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      One-Time Password
                    </label>
                    <div>
                      <Input
                        id="otp-input"
                        placeholder="Enter the 6-digit code"
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                        value={otpValue}
                        onChange={(e) => {
                          // Only allow digits
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setOtpValue(value);
                        }}
                      />
                    </div>
                    {otpError && (
                      <p className="text-sm font-medium text-destructive">
                        {otpError}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      type="button"
                      className="w-full bg-[#094171] hover:bg-[#0a5694]"
                      disabled={isLoading}
                      onClick={handleOtpSubmit}
                    >
                      {isLoading ? (
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
                          Verifying...
                        </>
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      className="text-[#094171]"
                    >
                      Back to login
                    </Button>
                  </div>
                </div>
              ) : (
                <Form {...emailForm}>
                  <form
                    onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                placeholder="name@example.com"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-[#094171] hover:bg-[#0a5694]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
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
                          Sending OTP...
                        </>
                      ) : (
                        `Sign in as ${activeTab === "admin" ? "Admin" : "User"}`
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="#"
                  className="font-medium text-[#094171] hover:underline"
                >
                  Contact your administrator
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
