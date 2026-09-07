# TaskFlow Backend

A robust REST API backend for the TaskFlow task management system built with Express.js and MongoDB.

## Features

- 🔐 **Authentication**: JWT-based authentication with role-based access control
- 📋 **Task Management**: Create, read, update, and delete tasks
- 👥 **User Management**: Manage users with different roles (Admin, Manager, Team Member)
- 🔔 **Notifications**: Real-time notifications for task updates and assignments
- 🔑 **Security**: Password hashing with bcrypt, JWT token validation
- 📊 **Workload Tracking**: Monitor task distribution and workload across team

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend root directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@taskflow.com
NODE_ENV=development
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will run on `http://localhost:5000` (or the port specified in `.env`)

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /me` - Get current user info (requires auth)
- `PUT /change-password` - Change password (requires auth)
- `POST /forgot-password` - Request password reset
- `PUT /reset-password` - Reset password with token

### Tasks (`/api/tasks`)
- `POST /` - Create a new task (requires auth)
- `GET /` - Get all tasks with filters (requires auth)
- `GET /:id` - Get a specific task (requires auth)
- `PUT /:id` - Update a task (requires auth)
- `DELETE /:id` - Delete a task (requires auth)
- `GET /user/:userId` - Get tasks for a specific user (requires auth)
- `POST /:id/comments` - Add comment to task (requires auth)
- `GET /workload` - Get team workload statistics (requires auth)

### Users (`/api/users`)
- `GET /` - Get all users (requires auth)
- `GET /:id` - Get specific user (requires auth)
- `PUT /:id` - Update user profile (requires auth)
- `PUT /:id/role` - Update user role (Admin only)
- `DELETE /:id` - Delete user (Admin only)
- `PUT /:id/toggle-status` - Toggle user active status (Admin only)
- `GET /role/:role` - Get users by role (requires auth)

### Notifications (`/api/notifications`)
- `GET /` - Get user notifications (requires auth)
- `GET /unread-count` - Get unread notification count (requires auth)
- `PUT /:id/read` - Mark notification as read (requires auth)
- `PUT /mark-all-read` - Mark all notifications as read (requires auth)
- `DELETE /:id` - Delete notification (requires auth)

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Admin, Manager, Team Member),
  phone: String,
  department: String,
  profileImage: String,
  isActive: Boolean,
  timestamps: true
}
```

### Task
```javascript
{
  title: String,
  description: String,
  priority: String (Low, Medium, High, Urgent),
  status: String (Pending, In Progress, Completed, On Hold),
  assignedTo: ObjectId (User),
  createdBy: ObjectId (User),
  dueDate: Date,
  startDate: Date,
  category: String,
  tags: [String],
  progress: Number (0-100),
  estimatedHours: Number,
  actualHours: Number,
  comments: Array,
  timestamps: true
}
```

### Notification
```javascript
{
  userId: ObjectId (User),
  title: String,
  message: String,
  type: String (Task, User, System, Comment),
  relatedTaskId: ObjectId (Task),
  relatedUserId: ObjectId (User),
  isRead: Boolean,
  timestamps: true
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Task.js            # Task schema
│   │   └── Notification.js    # Notification schema
│   ├── controllers/
│   │   ├── authController.js      # Auth logic
│   │   ├── taskController.js      # Task logic
│   │   ├── userController.js      # User logic
│   │   └── notificationController.js  # Notification logic
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   ├── taskRoutes.js      # Task routes
│   │   ├── userRoutes.js      # User routes
│   │   └── notificationRoutes.js  # Notification routes
│   ├── middleware/
│   │   └── auth.js            # JWT and role validation
│   └── server.js              # Main server file
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
└── package.json                # Dependencies
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained from the login endpoint and expire based on the `JWT_EXPIRE` setting in `.env`.

## Error Handling

All endpoints return JSON responses with the following format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ Input validation
- ✅ Protected routes with middleware

## Development

### Adding a New Route

1. Create a controller in `src/controllers/`
2. Create routes in `src/routes/`
3. Import and use routes in `server.js`

### Example:
```javascript
// controller
exports.getExample = async (req, res) => {
  // logic here
};

// routes
router.get("/example", protect, controller.getExample);

// server.js
app.use("/api/example", exampleRoutes);
```

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify network connection if using MongoDB Atlas

### JWT Errors
- Make sure token is included in Authorization header
- Check if token has expired
- Verify `JWT_SECRET` in `.env` matches the one used to create tokens

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC
