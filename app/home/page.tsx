export default function IssuesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Issues</h1>
      <div className="grid gap-4">
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold">Recent Health Issue #1</h2>
          <p className="text-gray-600">Status: Open</p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold">Recent Health Issue #2</h2>
          <p className="text-gray-600">Status: Resolved</p>
        </div>
      </div>
    </main>
  );
}
