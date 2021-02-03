const express = require("express");
const router = express.Router();
const jobScheduler = require("../Models/jobModel");

// Getting all jobs
router.get("/", async (req, res) => {
  try {
    const allJob = await jobScheduler.find();
    res.status(200).json(allJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/new", async (req, res) => {
  const { title, alertType, method, frequency, endpoint } = req.body;
  const newJobDetails = new jobScheduler({
    title: title,
    alertType: alertType,
    method: method,
    frequency: frequency,
    endpoint: endpoint,
  });

  try {
    const newJob = await newJobDetails.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
