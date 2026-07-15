const express = require("express");
const QRCode = require("qrcode");
const crypto = require("crypto");

const router = express.Router();

// GET /api/qr - Generate QR code
router.get("/", async (req, res) => {
  try {
    const token = crypto.randomBytes(12).toString("hex");
    const payload = `https://vaishworld.exe/transmission/${token}`;

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
    console.error("QR generation error:", err);
    res.status(500).json({ error: "Could not generate QR code." });
  }
});

module.exports = router;