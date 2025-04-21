const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../../db");
const moment = require("moment-timezone");
const router = express.Router();

// 📌 Налаштування multer для завантаження фото
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Вказуємо папку для збереження файлів
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Використовуємо оригінальне ім'я файлу
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Обмеження 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

// 📌 Отримання одного блогу за ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM blog_posts WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 📌 Отримання всіх блогів
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, title, cover_image, description, created_at, category FROM blog_posts ORDER BY created_at DESC"
    );

    // Поточна дата та час у часовому поясі Данії
    const nowInDenmark = moment().tz("Europe/Copenhagen");

    // Фільтруємо ті, що мають дату у майбутньому
    const filteredRows = rows.filter((row) =>
      moment(row.created_at).isSameOrBefore(nowInDenmark)
    );

    res.json(filteredRows);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 📌 **Створення блогу (POST /api/blogPosts)**
router.post(
  "/",
  upload.fields([{ name: "image" }, { name: "video" }]),
  async (req, res) => {
    const {
      title,
      content,
      description,
      seo_title,
      seo_description,
      seo_keywords,
      cover_image,
      category,
    } = req.body;

    if (!title || !content || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      await db.query(
        "INSERT INTO blog_posts (title, content, description, seo_title, seo_description, seo_keywords, cover_image, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          content,
          description,
          seo_title,
          seo_description,
          seo_keywords,
          cover_image,
          category,
        ]
      );

      res.status(201).json({ message: "Blog post created successfully" });
    } catch (error) {
      console.error("Error inserting blog post:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
