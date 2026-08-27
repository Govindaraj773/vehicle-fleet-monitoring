const cron = require("node-cron");

const {
  checkHighEngineTemperature,
} = require("../services/engineTemperatureService");

const checkEngineTemeratureJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("High Temperature Vehicles...");
      const highTemperatureVehicles = await checkHighEngineTemperature();
      console.log("High Temperature Vehicles:", highTemperatureVehicles);
    } catch (error) {
      console.log("High Temperature Error", error);
      throw error;
    }
  });
};

module.exports = { checkEngineTemeratureJob };
