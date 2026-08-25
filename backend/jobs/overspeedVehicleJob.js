const cron = require("node-cron");
const { checkOverSpeedVehicles } = require("../services/overspeedService");

const checkOverSpeedVehicleJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Vehicle speed alert...");
      const overspeedVehicles = await checkOverSpeedVehicles();
      console.log("Over Speed Vehicles", overspeedVehicles);
    } catch (error) {
      console.log("Over Speed Vehicles Error", error);
      throw error;
    }
  });
};

module.exports = { checkOverSpeedVehicleJob };
