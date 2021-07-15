const logModel = require("../Models/logModel");

// Chekc ID present or not before proceding.
const checkLogID = async (req, res, next) => {
  try {
    let data = await logModel.findOne({ jobID: req.params.id });
    if (data._id) next();
  } catch (error) {
    res.status(404).json({ message: "ID not found" });
  }
};

module.exports = checkLogID;
