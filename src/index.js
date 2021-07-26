require("dotenv").config({ path: ".env.local" });
require("../DB/mongoose");
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Routes
const jobRoutes = require("../Routes/job");

app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/job", jobRoutes);

app.use("*", express.static(path.join(__dirname, "../client/build")));

app.listen(port, () => {
  console.log("Server running on port " + port);
});
