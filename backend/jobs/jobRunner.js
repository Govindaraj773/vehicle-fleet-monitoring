const { startOfflineVehicleJobs } = require("./offlineVehicleJobs");
const { checkOverSpeedVehicleJob } = require("./overspeedVehicleJob");
const { checkLowFuelJob } = require("./lowFuelJob");
const { checkLowBatteryJob } = require("./lowBatteryJob");
const { checkEngineTemeratureJob } = require("./engineTemperatureJob");
const { checkIdleVehicleJob } = require("./idleVehicleJob");

const startAllJobs = () => {
  startOfflineVehicleJobs();
  checkOverSpeedVehicleJob();
  checkLowFuelJob();
  checkLowBatteryJob();
  checkEngineTemeratureJob();
  checkIdleVehicleJob();

  console.log("All vehicle monitoring jobs started");
};

module.exports = {
  startAllJobs,
};
