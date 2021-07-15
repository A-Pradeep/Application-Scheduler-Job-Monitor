const jobSchedulerModal = require("../Models/jobModel");

// Chekc ID present or not before proceding.
const checkID = async (req, res, next) => {
  try {
    let data = await jobSchedulerModal.findById(req.params.id ?? req.body.id);
    if (data._id) next();
  } catch (error) {
    res.status(404).json({ message: "ID not found" });
  }
};

module.exports = checkID;
