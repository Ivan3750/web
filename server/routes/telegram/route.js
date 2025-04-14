const express = require("express");
require("dotenv").config();

const router = express.Router();
router.use(express.json());

// Перевірка змінних середовища
const TELEGRAM_API_URL = process.env.TELEGRAM_API;
const CHAT_ID = process.env.CHAT_ID;

if (!TELEGRAM_API_URL || !CHAT_ID) {
  console.error("❌ Missing TELEGRAM_API or CHAT_ID in environment variables.");
  process.exit(1);
}

router.post("/submit-contact", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default; // Динамічний імпорт

    const { name, email, packages, project, budget } = req.body;

    if (!name || !email || !packages || !project || !budget) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    const message = `
      📩 New Contact Form Submission:
      🏷 Name: ${name}
      📧 Email: ${email}
      📦 Package: ${packages}
      💡 Project: ${project}
      💰 Budget: ${budget} DKK
    `;

    const response = await fetch(TELEGRAM_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
