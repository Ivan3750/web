const express = require("express");
const db = require("../../db");
const router = express.Router();

 
router.get("/project/:id", async (req, res) => {
    const { id } = req.params;  // Отримуємо id з параметрів URL
  
    try {
      // Запит до бази даних для отримання проекту за конкретним id
      const [rows] = await db.query("SELECT id, name, details, technology, steps, deadline, progress FROM projects WHERE id = ?", [id]);
  
      if (rows.length === 0) {
        return res.status(404).send("Project not found");
      }
  
      const project = rows.map((proj) => {
        return {
          id: proj.id,
          name: proj.name,
          details: proj.details,
          technology: proj.technology,
          steps: proj.steps.split(','),    
          deadline: proj.deadline,
          progress: proj.progress,
        };
      })[0];  // Отримуємо перший проект, оскільки припускаємо, що буде лише один
  
      res.json(project);
  
    } catch (error) {
      console.error("Error fetching project data:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

module.exports = router;
