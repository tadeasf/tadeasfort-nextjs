/** @format */

// backend/server.js
const express = require("express");
const app = express();

app.get("/api/data", (req, res) => {
  // Your logic to handle the request and response
  res.json({ message: "Hello from the backend!" });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
