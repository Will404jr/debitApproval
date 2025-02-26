import cron from "node-cron";
import { updateOverdueIssues } from "./updateOverdueIssues";

// Run every hour
export function startOverdueCron() {
  cron.schedule("0 * * * *", async () => {
    try {
      const updatedCount = await updateOverdueIssues();
      console.log(`Updated ${updatedCount} overdue issues`);
    } catch (error) {
      console.error("Error updating overdue issues:", error);
    }
  });
}
