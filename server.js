const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serves index.html in /public

// Save location
app.post("/save-location", async (req, res) => {
  const { id, latitude, longitude } = req.body;

  let data = [];
  try {
    const file = await fs.readFile("locations.json", "utf-8");
    data = JSON.parse(file);
  } catch {
    console.log("No existing locations.json, starting fresh.");
  }

  // Replace existing entry for same user
  data = data.filter(loc => loc.id !== id);
  data.push({ id, latitude, longitude, timestamp: new Date().toISOString() });

  await fs.writeFile("locations.json", JSON.stringify(data, null, 2));
  res.json({ status: "ok" });
});

// Remove location
app.post("/remove-location", async (req, res) => {
  const { id } = req.body;

  let data = [];
  try {
    const file = await fs.readFile("locations.json", "utf-8");
    data = JSON.parse(file);
  } catch {
    console.log("No existing locations.json, nothing to remove.");
  }

  data = data.filter(loc => loc.id !== id);
  await fs.writeFile("locations.json", JSON.stringify(data, null, 2));

  res.json({ status: "removed" });
});

// Get all locations
app.get("/get-locations", async (req, res) => {
  try {
    const file = await fs.readFile("locations.json", "utf-8");
    res.json(JSON.parse(file));
  } catch {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
