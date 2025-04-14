// start.js

const express = require('express');
const app = express();
const port = 10000;

// Імпортуємо ваші маршрути
const blogsRoute = require("./server/routes/blogs/route");
const projectsRoute = require("./server/routes/projects/route");
const telegramRoute = require("./server/routes/telegram/route");

// Middleware
app.use(express.json()); // Для обробки JSON запитів
app.use(express.urlencoded({ extended: true })); // Для обробки даних з форм

// Статичні файли
app.use("/uploads", express.static("uploads"));

// Використовуємо ваші маршрути
app.use("/blogs", blogsRoute);
app.use("/projects", projectsRoute);
app.use("/telegram", telegramRoute);

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
