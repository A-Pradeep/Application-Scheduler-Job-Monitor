const express = require("express");
const router = express.Router();
const jobSchedulerModal = require("../Models/jobModel");
const jobScheduler = require("../Middleware/jobScheduler");

const js = new jobScheduler();

// Getting all jobs
router.get("/", async (req, res) => {
  try {
    const allJob = await jobSchedulerModal.find();
    res.status(200).json(allJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new job
router.post("/new", async (req, res) => {
  const {
    title,
    alertType,
    method,
    frequency,
    endpoint,
    currentStatus,
    logs,
  } = req.body;
  const newJobDetails = new jobSchedulerModal({
    title: title,
    currentStatus: currentStatus,
    alertType: alertType,
    method: method,
    frequency: frequency,
    endpoint: endpoint,
    logs: logs,
  });

  try {
    const newJob = await newJobDetails.save();
    js.scheduleNewJob(newJob.id);
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Stop job by ID
router.patch("/stop", async (req, res) => {
  console.log("\n\n Stopping: " + req.body.id);
  try {
    const getJob = await jobSchedulerModal.updateOne(
      { _id: req.body.id },
      { currentStatus: "Stopped" }
    );
    if (!getJob) res.status(400).send();
    js.stopScheduleJob(req.body.id);
    res.status(200).send("Stop job ID : " + req.body.id);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Re-start the job by ID
router.post("/restart", async (req, res) => {
  console.log("\n\n Starting: " + req.body.id);
  try {
    const getJob = await jobSchedulerModal.updateOne(
      { _id: req.body.id },
      { currentStatus: "Active" }
    );
    if (!getJob) res.status(400).send();
    js.reStartScheduleJob(req.body.id);
    res.status(200).send("Started job ID : " + req.body.id);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete All jobs
router.delete("/all", async (req, res) => {
  try {
    const emptyCollection = await jobSchedulerModal.deleteMany();
    res.status(201).send(emptyCollection);
  } catch (error) {
    res.status(404).send("Job not found.");
  }
});

// Delete Existing job
router.delete("/:id", async (req, res) => {
  try {
    const checkID = await jobSchedulerModal.findByIdAndDelete(req.params.id);
    if (!checkID) return res.status(404).send("Job not found.");
    res.status(200).send(`Job : ${req.params.id}  deleted successfully`);
  } catch (error) {
    res.status(404).send("Job not found.");
  }
});

module.exports = router;
