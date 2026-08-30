const cron = require("node-cron");

const { checkIdleVehicles } = require("../services/idleVehicleService");

const checkIdleVehicleJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Idle Vehicle Check...");
      const idleVehicle = await checkIdleVehicles();
      console.log("Idle Vehicles:", idleVehicle);
    } catch (error) {
      console.log("Idle Vehicle Job Error:", error);
      throw error;
    }
  });
};

module.exports = { checkIdleVehicleJob };
