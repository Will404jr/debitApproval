export interface User {
  id: string;
  username: string;
  email: string;
  personnelType: "Md" | "Staff";
}

export const users: User[] = [
  {
    id: "U001",
    username: "dr.smith",
    email: "jsmith@hospital.com",
    personnelType: "Md",
  },
  {
    id: "U002",
    username: "nurse.johnson",
    email: "bjohnson@hospital.com",
    personnelType: "Staff",
  },
  {
    id: "U003",
    username: "dr.patel",
    email: "rpatel@hospital.com",
    personnelType: "Staff",
  },
  {
    id: "U004",
    username: "tech.wilson",
    email: "mwilson@hospital.com",
    personnelType: "Staff",
  },
  {
    id: "U005",
    username: "dr.garcia",
    email: "agarcia@hospital.com",
    personnelType: "Staff",
  },
  {
    id: "U006",
    username: "admin.taylor",
    email: "ktaylor@hospital.com",
    personnelType: "Staff",
  },
  {
    id: "U007",
    username: "dr.chen",
    email: "lchen@hospital.com",
    personnelType: "Staff",
  },
  {
    id: "U008",
    username: "nurse.brown",
    email: "sbrown@hospital.com",
    personnelType: "Staff",
  },
  {
    id: "U009",
    username: "dr.miller",
    email: "dmiller@hospital.com",
    personnelType: "Staff",
  },
  {
    id: "U010",
    username: "tech.davis",
    email: "pdavis@hospital.com",
    personnelType: "Staff",
  },
];
