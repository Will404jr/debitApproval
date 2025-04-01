export interface User {
  id: string;
  username: string;
  email: string;
  personnelType: "Md" | "Staff";
}

export const users: User[] = [
  {
    id: "U001",
    username: "Admin",
    email: "admin@nssfug.org",
    personnelType: "Md",
  },
  {
    id: "U002",
    username: "Ethel Nagaddya",
    email: "enagaddya@nssfug.org",
    personnelType: "Staff",
  },
  {
    id: "U003",
    username: "Emmanuel Sserumaga",
    email: "esserumaga@nssfug.org",
    personnelType: "Staff",
  },
  {
    id: "U004",
    username: "Alex Abala",
    email: "aabala@nssfug.org",
    personnelType: "Staff",
  },
  {
    id: "U005",
    username: "Remigious Kaggwa",
    email: "rkaggwa@nssfug.org",
    personnelType: "Staff",
  },
  {
    id: "U006",
    username: "Abdul Makubuya",
    email: "amakubuya@nssfug.org",
    personnelType: "Staff",
  },
  {
    id: "U007",
    username: "J.chen",
    email: "Jchen@nssf.ug",
    personnelType: "Staff",
  },
  {
    id: "U008",
    username: "John.brown",
    email: "brown@nssf.ug",
    personnelType: "Staff",
  },
  {
    id: "U009",
    username: "B.Marcus",
    email: "bmarcus@nssf.ug",
    personnelType: "Staff",
  },
  {
    id: "U010",
    username: "Tom.davis",
    email: "davis@nssf.ug",
    personnelType: "Staff",
  },
];
