export interface User {
  id: string;
  username: string;
  email: string;
  personnelType: "Md" | "Staff";
}

export const users: User[] = [
  {
    id: "U001",
    username: "J.Wilson",
    email: "jwilson@nssf.ug",
    personnelType: "Md",
  },
  {
    id: "U002",
    username: "John.Doe",
    email: "john@nssf.ug",
    personnelType: "Staff",
  },
  {
    id: "U003",
    username: "D.Thomas",
    email: "thomas@nssf.ug",
    personnelType: "Staff",
  },
  {
    id: "U004",
    username: "tech.Jason",
    email: "jason@nssf.ug",
    personnelType: "Staff",
  },
  {
    id: "U005",
    username: "R.Miller",
    email: "miller@nssf.ug",
    personnelType: "Staff",
  },
  {
    id: "U006",
    username: "Adamm.taylor",
    email: "Ataylor@nssf.ug",
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
