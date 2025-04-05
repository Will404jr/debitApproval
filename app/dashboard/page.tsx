"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Users, Building, FileText, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import toast from "react-hot-toast";

interface DashboardStats {
  users: number;
  banks: number;
  debitObjects: number;
}

interface MonthlyData {
  name: string;
  value: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    banks: 0,
    debitObjects: 0,
  });
  const [monthlyData, setMonthlyData] = useState<{
    [key: string]: MonthlyData[];
  }>({});
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch users count
        const usersResponse = await fetch("/api/user");
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();

        // Fetch banks count
        const banksResponse = await fetch("/api/bank");
        if (!banksResponse.ok) throw new Error("Failed to fetch banks");
        const banksData = await banksResponse.json();

        // Fetch debit reports
        const debitResponse = await fetch("/api/debit-data");
        if (!debitResponse.ok) throw new Error("Failed to fetch debit data");
        const debitData = await debitResponse.json();

        // Set stats
        setStats({
          users: usersData.length,
          banks: banksData.length,
          debitObjects: debitData.length,
        });

        // Process monthly data for the chart
        const monthlyDataByYear: { [key: string]: { [key: string]: number } } =
          {};

        // Initialize data structure for the last 5 years
        for (const year of years) {
          monthlyDataByYear[year] = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
          };
        }

        // Count debit reports by month and year
        debitData.forEach((report: any) => {
          const date = new Date(report.transactionDate);
          const year = date.getFullYear();
          const month = date.toLocaleString("default", { month: "short" });

          if (
            monthlyDataByYear[year] &&
            monthlyDataByYear[year][month] !== undefined
          ) {
            monthlyDataByYear[year][month]++;
          }
        });

        // Convert to the format needed for the chart
        const formattedData: { [key: string]: MonthlyData[] } = {};

        for (const [year, months] of Object.entries(monthlyDataByYear)) {
          formattedData[year] = Object.entries(months).map(([name, value]) => ({
            name,
            value,
          }));
        }

        setMonthlyData(formattedData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.users}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Banks
                    </CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.banks}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Debit Objects
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.debitObjects}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card className="col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Debit Reports per Month</CardTitle>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                  {monthlyData[selectedYear] ? (
                    <ChartContainer
                      config={{
                        value: {
                          label: "Debit Reports",
                          color: "hsl(var(--primary))",
                        },
                      }}
                      className="h-full w-full"
                    >
                      <BarChart
                        accessibilityLayer
                        data={monthlyData[selectedYear]}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar
                          dataKey="value"
                          fill="var(--color-value)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-muted-foreground">
                        No data available for {selectedYear}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
