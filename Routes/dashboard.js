const express = require("express");
const router = express.Router();

// Getting all jobs
router.get("/", (req, res) => {
  res.send("Hey PS!, good to see you.");
});

module.exports = router;
