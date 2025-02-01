export type Issue = {
  id: string;
  subject: string;
  category: "Technical" | "Finance" | "Environment";
  status: "Urgent" | "Open" | "Closed" | "Overdue";
  assignedTo: string;
  dueDate: string;
};

export const issues: Issue[] = [
  {
    id: "1",
    subject: "System Issue",
    category: "Technical",
    status: "Urgent",
    assignedTo: "Senior IT Officer",
    dueDate: "2024-12-20",
  },
  {
    id: "2",
    subject: "Budget overhail",
    category: "Finance",
    status: "Open",
    assignedTo: "Accountant",
    dueDate: "2024-12-30",
  },
  {
    id: "3",
    subject: "Slow servers",
    category: "Technical",
    status: "Urgent",
    assignedTo: "Senior IT Officer",
    dueDate: "2024-12-20",
  },
  {
    id: "4",
    subject: "Extra cafe",
    category: "Environment",
    status: "Closed",
    assignedTo: "Culture Officer",
    dueDate: "2024-12-20",
  },
  {
    id: "5",
    subject: "Improper chairs",
    category: "Environment",
    status: "Open",
    assignedTo: "Procurement Officer",
    dueDate: "2024-12-20",
  },
  {
    id: "6",
    subject: "Limited support",
    category: "Technical",
    status: "Open",
    assignedTo: "Senior IT Officer",
    dueDate: "2024-12-20",
  },
  {
    id: "7",
    subject: "System Issue",
    category: "Technical",
    status: "Closed",
    assignedTo: "Senior IT Officer",
    dueDate: "2024-12-20",
  },
];
