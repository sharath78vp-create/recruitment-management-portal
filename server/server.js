const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

console.log("Starting Recruitment Management Portal API...");
console.log("PORT exists:", !!process.env.PORT);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use(
  "/api/applications",
  applicationRoutes
);

app.get("/", (req, res) => {
  res.json({
    message:
      "Recruitment Management Portal API is running!",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("MongoDB connection successful.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "SERVER STARTUP FAILED:"
    );
    console.error(error);
    process.exit(1);
  }
};

startServer();