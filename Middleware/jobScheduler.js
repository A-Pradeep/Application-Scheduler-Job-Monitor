const { http } = require("../Middleware/http");
const cronManager = require("cron-job-manager");
const logModel = require("../Models/logModel");

const job = new cronManager();

class jobScheduler {
  // Get Current Jobs
  getScheduleJobs() {
    var data = job.listCrons();
    return data;
  }

  // Create new Job
  scheduleNewJob({ method, endpoint, frequency }, id) {
    job.add(
      id,
      frequency,
      async () => {
        switch (method) {
          case "GET":
            await http
              .get(endpoint)
              .then(({ status, statusText, config }) => {
                // Save log
                const newLog = new logModel({
                  jobID: id,
                  status: status,
                  endpoint: config.url,
                  method: config.method,
                  message: statusText,
                });

                try {
                  newLog.save();
                } catch (error) {
                  console.log(error);
                }
              })
              .catch((error) => {
                const newLog = new logModel({
                  jobID: id,
                  status: error.errno,
                  endpoint: error.config.url,
                  method: error.config.method,
                  message: error.code,
                });

                try {
                  newLog.save();
                } catch (error) {
                  console.log(error);
                }
              });
            break;
          case "DELETE":
            await http
              .delete(endpoint)
              .then(({ status, statusText, config }) => {
                // Save log
                const newLog = new logModel({
                  jobID: id,
                  status: status,
                  endpoint: config.url,
                  method: config.method,
                  message: statusText,
                });

                try {
                  newLog.save();
                } catch (error) {
                  console.log(error);
                }
              })
              .catch((error) => {
                const newLog = new logModel({
                  jobID: id,
                  status: error.errno,
                  endpoint: error.config.url,
                  method: error.config.method,
                  message: error.code,
                });

                try {
                  newLog.save();
                } catch (error) {
                  console.log(error);
                }
              });
            break;
        }
      },
      {
        start: true,
      }
    );
  }

  // Stop existing job
  stopScheduleJob(id) {
    if (job.exists(id)) job.stop(id);
  }

  // Stop all existing job
  stopAllScheduleJob() {
    job.stopAll();
  }

  // Stop existing job
  reStartScheduleJob(id) {
    if (job.exists(id)) job.start(id);
  }

  // Delete existing Job
  deleteScheduleJob(id) {
    if (!job.exists(id)) return false;
    job.deleteJob(id);
    return true;
  }
}

module.exports = jobScheduler;
