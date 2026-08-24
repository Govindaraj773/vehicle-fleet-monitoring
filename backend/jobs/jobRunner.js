const offlineVehicleJob = require("./offlineVehicleJobs");

const startJobs = () => {
  console.log("Background jobs started...");

  setInterval(async () => {
    try {
      await offlineVehicleJob();
    } catch (error) {
      console.error("Offline vehicle job error:", error.message);
    }
  }, 60 * 1000); // runs every 1 minute
};

module.exports = startJobs;
