const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    jobID: { type: String, required: true },
    status: { type: String, required: true },
    endpoint: { type: String, required: true },
    method: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Logs", logSchema);
