const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    method: { type: String, required: true },
    frequency: { type: String, required: true },
    alertType: { type: String, required: true },
    endpoint: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job Scheduler", jobSchema);
