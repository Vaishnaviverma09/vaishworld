const express = require("express");
const QRCode = require("qrcode");
const crypto = require("crypto");

const router = express.Router();

// ============================================
// SPECIFIC ROUTES FIRST
// ============================================

// GET - Generate QR code
router.get("/", async (req, res) => {
  try {
    const token = crypto.randomBytes(12).toString("hex");
    const payload = `https://vaishworld.exe/transmission/${token}`;

    console.log("📝 Generating QR code for token:", token);

    const pngBuffer = await QRCode.toBuffer(payload, {
      type: "png",
      width: 600,
      margin: 2,
      color: {
        dark: "#31080B",
        light: "#D7C6A8",
      },
    });

    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "no-store");
    res.send(pngBuffer);
  } catch (err) {
    console.error("❌ QR generation error:", err);
    res.status(500).json({ error: "Could not generate QR code." });
  }
});

// POST - Mark QR as scanned (if you have this endpoint)
router.post("/scan", async (req, res) => {
  const { token } = req.body;
  
  try {
    console.log("📝 QR scanned:", token);
    // Your QR scanning logic here
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error scanning QR:", err);
    res.status(500).json({ error: "Failed to scan QR" });
  }
});

module.exports = router;