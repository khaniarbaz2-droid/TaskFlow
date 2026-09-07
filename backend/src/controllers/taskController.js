const Task = require("../models/Task");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      assignedTo,
      dueDate,
      category,
      tags,
      estimatedHours,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo,
      createdBy: req.user.id,
      dueDate,
      category,
      tags,
      estimatedHours,
    });

    // Create notification for assigned user
    await Notification.create({
      userId: assignedTo,
      title: "New Task Assigned",
      message: `You have been assigned a new task: ${title}`,
      type: "Task",
      relatedTaskId: task._id,
      relatedUserId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo, category } = req.query;

    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (category) query.category = category;

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email")
      .populate("comments.userId", "name profileImage");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check if user is authorized
    if (
      task.createdBy.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to update this task" });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check if user is authorized
    if (
      task.createdBy.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user tasks
exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const tasks = await Task.find({
      $or: [{ assignedTo: userId }, { createdBy: userId }],
    })
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add comment to task
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.comments.push({
      userId: req.user.id,
      comment,
    });

    await task.save();

    // Notify task creator
    if (task.createdBy.toString() !== req.user.id) {
      await Notification.create({
        userId: task.createdBy,
        title: "New Comment on Task",
        message: `A new comment has been added to "${task.title}"`,
        type: "Comment",
        relatedTaskId: task._id,
        relatedUserId: req.user.id,
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get task workload
exports.getTaskWorkload = async (req, res) => {
  try {
    const workload = await Task.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          taskCount: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
          },
          inProgressCount: {
            $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      workload,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
