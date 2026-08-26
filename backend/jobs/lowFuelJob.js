const cron = require("node-cron");

const { checkLowFuelVehicles } = require("../services/lowFuelService");

const checkLowFuelJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Low Fuel Vehicles...");
      const lowFuelVehicles = await checkLowFuelVehicles();
      console.log("Low Fuel Vehicles", lowFuelVehicles);
    } catch (error) {
      console.log("low fuel error", error);
    }
  });
};

module.exports = { checkLowFuelJob };
