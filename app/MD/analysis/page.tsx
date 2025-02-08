"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Create a wrapper component for the chart to handle dynamic imports
const Chart = dynamic(
  () =>
    import("recharts").then((mod) => {
      const {
        BarChart,
        Bar,
        XAxis,
        CartesianGrid,
        Tooltip,
        Legend,
        ResponsiveContainer,
      } = mod;

      return function Chart({ data }: { data: MonthlyData[] }) {
        return (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="monthLabel"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{
                    fill: "#6b7280",
                    fontSize: 12,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  name="Total Issues"
                  dataKey="totalIssues"
                  fill="#3b82f6"
                  barSize={20}
                />
                <Bar
                  name="Closed Issues"
                  dataKey="closedIssues"
                  fill="#22c55e"
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      };
    }),
  { ssr: false }
);

interface Issue {
  _id: string;
  subject: string;
  category: string;
  content: string;
  status: "Open" | "Closed" | "Pending" | "Overdue" | "Urgent";
  submittedBy: string;
  assignedTo: string | null;
  dueDate: Date;
  createdAt: string;
}

interface MonthlyData {
  month: string;
  monthLabel: string;
  totalIssues: number;
  closedIssues: number;
}

interface StatusCard {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const LoadingCard = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-[60px]" />
    </CardContent>
  </Card>
);

const LoadingChart = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-[150px]" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[400px] w-full" />
    </CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value} Issues
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalysisPage() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [monthlyData, setMonthlyData] = React.useState<MonthlyData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch("/api/issues");
        const data: Issue[] = await response.json();
        setIssues(data);

        const monthlyIssues = processMonthlyData(data);
        setMonthlyData(monthlyIssues);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const processMonthlyData = (data: Issue[]): MonthlyData[] => {
    const months: Record<string, { total: number; closed: number }> = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    data.forEach((issue) => {
      const date = new Date(issue.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!months[monthKey]) {
        months[monthKey] = { total: 0, closed: 0 };
      }
      months[monthKey].total++;
      if (issue.status === "Closed") {
        months[monthKey].closed++;
      }
    });

    return Object.entries(months)
      .map(([month, counts]) => {
        const [year, monthNum] = month.split("-");
        return {
          month: month,
          monthLabel: `${monthNames[parseInt(monthNum) - 1]} ${year}`,
          totalIssues: counts.total,
          closedIssues: counts.closed,
        };
      })
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const statusCounts = {
    Open: issues.filter((issue) => issue.status === "Open").length,
    Closed: issues.filter((issue) => issue.status === "Closed").length,
    Pending: issues.filter((issue) => issue.status === "Pending").length,
    Overdue: issues.filter((issue) => issue.status === "Overdue").length,
    Urgent: issues.filter((issue) => issue.status === "Urgent").length,
  };

  const statusCards: StatusCard[] = [
    {
      title: "Open Issues",
      value: statusCounts.Open,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Closed Issues",
      value: statusCounts.Closed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Issues",
      value: statusCounts.Pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Overdue Issues",
      value: statusCounts.Overdue,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Urgent Issues",
      value: statusCounts.Urgent,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
        <LoadingChart />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart data={monthlyData} />
        </CardContent>
      </Card>
    </div>
  );
}
