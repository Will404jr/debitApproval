import { startOverdueCron } from "@/lib/cron";

// Start the cron job when the app starts
startOverdueCron();

export async function GET() {
  return new Response("Cron jobs running");
}
