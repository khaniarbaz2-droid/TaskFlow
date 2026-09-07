const express = require("express");
const notificationController = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.get("/", notificationController.getUserNotifications);
router.get("/unread-count", notificationController.getUnreadCount);
router.put("/:id/read", notificationController.markAsRead);
router.put("/mark-all-read", notificationController.markAllAsRead);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
