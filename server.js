const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// -------------------------
// Mock Data
// -------------------------
const companies = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Firma-${i + 1}`
}));

const timDevices = Array.from({ length: 20 }, (_, i) => {
  const companyId = companies[i % companies.length].id;
  return {
    id: i + 1,
    serialNumber: `TIM-${1000 + i}`,
    companyId
  };
});

const ttoDevices = Array.from({ length: 100 }, (_, i) => {
  const timId = timDevices[i % timDevices.length].id;
  const companyId = timDevices[i % timDevices.length].companyId;
  return {
    id: i + 1,
    serialNumber: `TTO-${5000 + i}`,
    timId,
    companyId
  };
});

// -------------------------
// Routes
// -------------------------
app.get("/", (req, res) => res.send("API Çalışıyor 🚀"));

app.get("/companies", (req, res) => res.json(companies));
app.get("/tims", (req, res) => res.json(timDevices));
app.get("/ttos", (req, res) => res.json(ttoDevices));

app.get("/tim/:id/ttos", (req, res) => {
  const timId = parseInt(req.params.id);
  res.json(ttoDevices.filter(tto => tto.timId === timId));
});

app.get("/company/:id/devices", (req, res) => {
  const companyId = parseInt(req.params.id);
  res.json({
    tims: timDevices.filter(tim => tim.companyId === companyId),
    ttos: ttoDevices.filter(tto => tto.companyId === companyId)
  });
});

// -------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
