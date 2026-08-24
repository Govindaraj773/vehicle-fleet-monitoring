const cron = require("node-cron");
const { checkOfflineVehicles } = require("../services/offlineService");

const startOfflineVehicleJobs = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("checking offline vehicles...");

      const offlineVehicles = await checkOfflineVehicles();

      console.log("Offline vehicles", offlineVehicles);
    } catch (error) {
      console.log("Offline vehicle check error:", error);
      throw error;
    }
  });
};

module.exports = { startOfflineVehicleJobs };
