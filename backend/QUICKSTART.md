# TaskFlow Backend - Complete Setup Summary

## ✅ What's Been Created

### Directory Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── models/
│   │   ├── User.js               # User schema with auth fields
│   │   ├── Task.js               # Task schema with tracking
│   │   └── Notification.js       # Notification schema
│   ├── controllers/
│   │   ├── authController.js     # Register, login, password reset
│   │   ├── taskController.js     # Task CRUD & management
│   │   ├── userController.js     # User management
│   │   └── notificationController.js # Notification handling
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── taskRoutes.js         # Task endpoints
│   │   ├── userRoutes.js         # User endpoints
│   │   └── notificationRoutes.js # Notification endpoints
│   ├── middleware/
│   │   └── auth.js               # JWT protection & role authorization
│   └── server.js                 # Main Express server
│
├── .env                          # Environment variables (EDIT THIS!)
├── .env.example                  # Template for .env
├── .gitignore                    # Git ignore patterns
├── package.json                  # Project configuration
├── README.md                      # Full API documentation
├── SETUP.md                      # Setup instructions
└── api-test.sh                   # Bash script to test all endpoints
```

## 🚀 Getting Started

### Step 1: Install MongoDB
```bash
# Option A: Local MongoDB
sudo apt-get install mongodb  # Ubuntu/Debian
brew install mongodb-community # macOS

# Option B: MongoDB Atlas (Cloud)
# Visit https://www.mongodb.com/cloud/atlas and create a free account
```

### Step 2: Configure Environment
```bash
cd backend
# The .env file is already created with defaults
# Edit .env to match your MongoDB setup
```

### Step 3: Start the Server
```bash
cd backend
npm install  # (if not already done)
npm run dev  # Development with auto-reload
```

You should see:
```
🚀 Server running on port 5000
Environment: development
```

### Step 4: Test the API
```bash
cd backend
bash api-test.sh
```

This will:
- ✅ Test health endpoint
- ✅ Register a new user
- ✅ Login and get JWT token
- ✅ Create a task
- ✅ Test all major endpoints

## 📚 API Endpoints

### Authentication (`/api/auth`)
```
POST   /register              # Create new account
POST   /login                 # Login & get token
GET    /me                    # Get current user (needs token)
PUT    /change-password       # Change password (needs token)
POST   /forgot-password       # Request password reset
PUT    /reset-password        # Reset with token
```

### Tasks (`/api/tasks`)
```
POST   /                      # Create task
GET    /                      # List all tasks (with filters)
GET    /:id                   # Get specific task
PUT    /:id                   # Update task
DELETE /:id                   # Delete task
GET    /user/:userId          # Get user's tasks
POST   /:id/comments          # Add comment to task
GET    /workload              # Team workload statistics
```

### Users (`/api/users`)
```
GET    /                      # List all users
GET    /:id                   # Get specific user
PUT    /:id                   # Update profile
PUT    /:id/role              # Change role (Admin only)
DELETE /:id                   # Delete user (Admin only)
PUT    /:id/toggle-status     # Enable/disable user (Admin only)
GET    /role/:role            # Get users by role
```

### Notifications (`/api/notifications`)
```
GET    /                      # Get user's notifications
GET    /unread-count          # Count unread
PUT    /:id/read              # Mark as read
PUT    /mark-all-read         # Mark all as read
DELETE /:id                   # Delete notification
```

## 🔐 Authentication

All protected endpoints require a JWT token in the header:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Example:
```bash
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:5000/api/auth/me
```

## 📊 Database Models

### User
- name, email, password (hashed)
- role (Admin, Manager, Team Member)
- phone, department, profileImage
- isActive, timestamps

### Task
- title, description, priority, status
- assignedTo, createdBy (user references)
- dueDate, startDate, category, tags
- progress (0-100), estimatedHours, actualHours
- comments (array), attachments

### Notification
- userId, title, message, type
- relatedTaskId, relatedUserId
- isRead, timestamps

## 🧪 Testing Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Manager"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Task (needs token)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Fix bug in dashboard",
    "description": "Dashboard stats not updating",
    "priority": "High",
    "category": "Bug Fix"
  }'
```

## 🔧 Environment Variables Explained

| Variable | Purpose | Default |
|----------|---------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/taskflow |
| JWT_SECRET | Secret for signing tokens | (set this!) |
| JWT_EXPIRE | Token expiration time | 7d |
| NODE_ENV | Environment mode | development |

## 📦 NPM Scripts

```bash
npm run dev      # Start development server with auto-reload
npm start        # Start production server
npm install      # Install dependencies
npm install pkg  # Install new package
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error connecting to MongoDB: connect ECONNREFUSED
```
**Solution**: Start MongoDB with `mongod` or check MONGODB_URI in .env

### Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
- Change PORT in .env, OR
- Kill process: `lsof -i :5000 && kill -9 <PID>`

### JWT Token Invalid
```
Not authorized to access this route
```
**Solution**: Make sure token is included in Authorization header with "Bearer " prefix

### User Not Found After Registration
```
Ensure MongoDB is running and connection string is correct
```
**Solution**: Check MONGODB_URI and verify MongoDB service is running

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use MongoDB Atlas for production (not localhost)
- [ ] Set NODE_ENV=production for production
- [ ] Configure SMTP for email notifications
- [ ] Use HTTPS in production
- [ ] Set secure CORS origin
- [ ] Add rate limiting
- [ ] Add request validation
- [ ] Use environment-specific configs

## 📖 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 🎯 Next Steps

1. ✅ Start MongoDB
2. ✅ Update .env with your MongoDB URI
3. ✅ Run `npm run dev`
4. ✅ Test with `bash api-test.sh`
5. ✅ Connect frontend to backend
6. ✅ Deploy to production when ready

## 📞 Common Questions

**Q: Can I use MongoDB Atlas instead of local MongoDB?**
A: Yes! Just update MONGODB_URI in .env with your Atlas connection string.

**Q: How do I add new API endpoints?**
A: Create controller → Create routes → Import in server.js

**Q: How do I change user roles?**
A: Only Admin users can update roles using PUT /api/users/:id/role

**Q: How do I reset a password?**
A: Use POST /api/auth/forgot-password then PUT /api/auth/reset-password

---

🎉 **Your backend is ready!** Start developing and building amazing features.
