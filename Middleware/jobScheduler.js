const cronManager = require("cron-job-manager");
const job = new cronManager();
class jobScheduler {
  // Create new Job
  scheduleNewJob(id) {
    console.log(`Hey Welcome Ps - ${id}`);
    job.add(
      id,
      "* * * * *",
      async () => {
        console.log("tick - what should be executed?");
      },
      {
        start: true,
        onComplete: () => {
          console.log(`${id} has stopped....`);
        },
      }
    );
    console.log(`\nI got the current jobs: ${job}`);
  }

  // Stop existing job
  stopScheduleJob(id) {
    console.log(`Stopping Job : ${id}`);
    console.log(job.exists(id) ? "key exists" : "Job not found.");
    if (job.exists(id)) job.stop(id);
  }

  // Stop existing job
  reStartScheduleJob(id) {
    console.log(`Starting Job : ${id}`);
    console.log(job.exists(id) ? "key exists" : "Job not found.");
    if (job.exists(id)) job.start(id);
  }
}

module.exports = jobScheduler;
