const express = require("express");
const userController = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.put("/:id/role", authorize("Admin"), userController.updateUserRole);
router.delete("/:id", authorize("Admin"), userController.deleteUser);
router.put("/:id/toggle-status", authorize("Admin"), userController.toggleUserStatus);
router.get("/role/:role", userController.getUsersByRole);

module.exports = router;
