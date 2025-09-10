// serverless-http olmadan, direkt handler olarak
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

module.exports = (req, res) => {
  const { url, method } = req;

  if (url === "/api/companies" && method === "GET") {
    return res.status(200).json(companies);
  }

  if (url === "/api/tims" && method === "GET") {
    return res.status(200).json(timDevices);
  }

  if (url === "/api/ttos" && method === "GET") {
    return res.status(200).json(ttoDevices);
  }

  if (url.startsWith("/api/tim/") && url.endsWith("/ttos") && method === "GET") {
    const timId = parseInt(url.split("/")[3]);
    return res.status(200).json(ttoDevices.filter(tto => tto.timId === timId));
  }

  if (url.startsWith("/api/company/") && url.endsWith("/devices") && method === "GET") {
    const companyId = parseInt(url.split("/")[3]);
    return res.status(200).json({
      tims: timDevices.filter(tim => tim.companyId === companyId),
      ttos: ttoDevices.filter(tto => tto.companyId === companyId)
    });
  }

  return res.status(404).json({ error: "Not Found" });
};
