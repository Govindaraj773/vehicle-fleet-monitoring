const cron = require("node-cron");
const { checkLowBatteryVehicles } = require("../services/lowBatteryService");

const checkLowBatteryJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Low Battery Vehicles...");
      const lowBatteryVehicles = await checkLowBatteryVehicles();
      console.log("Low Battery Vehicles:", lowBatteryVehicles);
    } catch (error) {
      console.log("low battery vehicles", error);
    }
  });
};

module.exports = { checkLowBatteryJob };
