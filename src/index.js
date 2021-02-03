require("dotenv").config({ path: ".env.local" });
require("../DB/mongoose");
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Routes
const dashboardRoutes = require("../Routes/dashboard");
const jobRoutes = require("../Routes/job");

app.use("/", dashboardRoutes);
app.use("/job", jobRoutes);

// final route if no matching
app.use("*", (req, res) => {
  res.status(404).json({ message: "Page not found." });
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
