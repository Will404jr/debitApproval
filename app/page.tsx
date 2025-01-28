import { IssuesTable } from "@/components/home-table";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8 w-[90%]">
      {/* <h1 className="text-3xl font-bold mb-6">Issues Dashboard</h1> */}
      <IssuesTable />
    </main>
  );
}
