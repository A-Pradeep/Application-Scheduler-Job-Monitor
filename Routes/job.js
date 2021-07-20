const express = require("express");
const router = express.Router();
const jobSchedulerModal = require("../Models/jobModel");
const jobScheduler = require("../Middleware/jobScheduler");
const logModel = require("../Models/logModel");

const checkID = require("../Middleware/checkID");
const checkLogID = require("../Middleware/checkLogID");

const js = new jobScheduler();

// Getting all jobs
router.get("/", async (req, res) => {
  try {
    const allJob = await jobSchedulerModal.find().sort({ createdAt: -1 });
    res.status(200).json({
      count: allJob.length,
      jobsList: allJob,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Job by ID
router.get("/details/:id", checkID, async (req, res) => {
  try {
    let jobData = await jobSchedulerModal.findById(req.params.id);

    if (!jobData) {
      res.status(404).json({ message: "Invalid Job ID" });
    }

    res.status(200).json(jobData);
  } catch (error) {
    res.status(404).send("Server Error : " + error);
  }
});

// Get all Cron Job --- TESTING ONLY
router.get("/Cjob", async (req, res) => {
  try {
    const ScheduleJobs = await js.getScheduleJobs();
    res.status(200).send(ScheduleJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new job
router.post("/new", async (req, res) => {
  const { title, alertType, method, frequency, endpoint, currentStatus } =
    req.body;
  const newJobDetails = new jobSchedulerModal({
    title: title,
    currentStatus: currentStatus,
    alertType: alertType,
    method: method,
    frequency: frequency,
    endpoint: endpoint,
  });

  try {
    const newJob = await newJobDetails.save();
    js.scheduleNewJob(req.body, newJob.id);
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stop job by ID
router.post("/stop", checkID, async (req, res) => {
  if (!req.body.id) {
    res.status(404).json({ message: "Job UID required." });
  } else {
    console.log("\n\n Stopping: " + req.body.id);
    try {
      const getJob = await jobSchedulerModal.updateOne(
        { _id: req.body.id },
        { currentStatus: "Stopped" }
      );
      if (!getJob) res.status(400).send();
      js.stopScheduleJob(req.body.id);
      res.status(200).send({ message: "Job stopped successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

// Stop all job
router.post("/stopAll", async (req, res) => {
  console.log("\n\n Stopping ALL");
  try {
    const getJob = await jobSchedulerModal.updateMany({
      currentStatus: "Stopped",
    });
    if (!getJob) res.status(400).send();
    js.stopAllScheduleJob();
    res.status(200).send("Stopped All job");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Re-start the job by ID
router.post("/restart", checkID, async (req, res) => {
  if (!req.body.id) {
    res.status(404).json({ message: "Job UID required." });
  } else {
    console.log("\n\n Starting: " + req.body.id);
    try {
      const getJob = await jobSchedulerModal.updateOne(
        { _id: req.body.id },
        { currentStatus: "Active" }
      );
      if (!getJob) res.status(400).send();
      js.reStartScheduleJob(req.body.id);
      res.status(200).json({ message: "Job restarted successfully." });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

// Delete All jobs
router.delete("/delete/all", async (req, res) => {
  try {
    await logModel.deleteMany();
    await jobSchedulerModal.deleteMany();
    res
      .status(201)
      .json({ message: "All Jobs and Logs deleted successfully." });
  } catch (error) {
    res.status(404).send("Job not found.");
  }
});

// Delete Existing job
router.delete("/delete/:id", checkID, async (req, res) => {
  try {
    const checkID = await jobSchedulerModal.findByIdAndDelete(req.params.id);
    if (!checkID) return res.status(404).json({ message: "Job not found." });

    await logModel.deleteMany({ jobID: req.params.id });

    const deleteScheduleJob = js.deleteScheduleJob(req.params.id);
    if (!deleteScheduleJob)
      return res.status(404).json({ message: "Oops, job not found" });
    res.status(200).json({ message: `Job deleted successfully` });
  } catch (error) {
    res.status(404).send({ message: "Job not found." });
  }
});

// Get logs related to Job
router.get("/log/:id", checkLogID, async (req, res) => {
  try {
    const logData = await logModel
      .find({ jobID: req.params.id })
      .sort({ createdAt: -1 });
    res.status(200).json(logData);
  } catch (error) {
    res.status(404).json({ message: "Log not found" });
  }
});

module.exports = router;
