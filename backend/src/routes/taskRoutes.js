const express = require("express");
const taskController = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.post("/", taskController.createTask);
router.get("/", taskController.getAllTasks);
router.get("/workload", taskController.getTaskWorkload);
router.get("/user/:userId?", taskController.getUserTasks);
router.get("/:id", taskController.getTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.post("/:id/comments", taskController.addComment);

module.exports = router;
