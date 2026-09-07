# 📋 TaskFlow
Task Monitoring & Collaboration System

A comprehensive task management and team collaboration platform with a modern React frontend and a robust Express.js + MongoDB backend.

## 🌟 Features

- 👤 **User Management** - Create users with different roles (Admin, Manager, Team Member)
- 📝 **Task Management** - Create, assign, and track tasks with priority and status
- 🔐 **Authentication** - Secure JWT-based authentication with role-based access control
- 🔔 **Notifications** - Real-time notifications for task updates and assignments
- 📊 **Workload Tracking** - Monitor team workload and task distribution
- 💬 **Comments & Collaboration** - Add comments to tasks for team collaboration
- 🔄 **Progress Tracking** - Track task progress with visual indicators
- 🎯 **Task Categorization** - Organize tasks by category, priority, and tags

## 🏗️ Project Structure

```
TaskFlow/
├── frontend/              # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── backend/               # Express API server
    ├── src/
    │   ├── models/        # MongoDB schemas
    │   ├── controllers/   # Business logic
    │   ├── routes/        # API endpoints
    │   ├── middleware/    # Auth & validation
    │   ├── config/        # Configuration
    │   └── server.js      # Main server file
    ├── .env
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and other configurations
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in your frontend (if needed):
```javascript
const API_URL = 'http://localhost:5000/api';
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or next available port)

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/change-password` - Change password (requires token)
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password` - Reset password

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/user/:userId` - Get user's tasks
- `POST /api/tasks/:id/comments` - Add comment
- `GET /api/tasks/workload` - Get workload statistics

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/role` - Update user role (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/role/:role` - Get users by role

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread count

## 🧪 Testing the API

Use the included API test script:

```bash
cd backend
bash api-test.sh
```

Or use tools like:
- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/)
- [Insomnia](https://insomnia.rest/)

## 📖 Documentation

- [Backend README](./backend/README.md) - Detailed backend documentation
- [Backend Setup Guide](./backend/SETUP.md) - Step-by-step setup instructions
- [Frontend README](./frontend/README.md) - Frontend documentation

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ Input validation
- ✅ Protected API routes

## 📦 Tech Stack

### Frontend
- React 18
- Vite
- CSS3
- JavaScript ES6+

### Backend
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Node.js

## 🛠️ Development

### Available Scripts

#### Backend
```bash
npm run dev    # Development with auto-reload
npm start      # Production
npm run build  # Build for production
```

#### Frontend
```bash
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License

## 📞 Support

For issues or questions:
1. Check the [Backend README](./backend/README.md)
2. Check the [Frontend README](./frontend/README.md)
3. Open an issue on GitHub

## 🎉 Getting Started

1. Clone the repository
2. Follow the Quick Start section above
3. Access the application at `http://localhost:5173`
4. Login with the credentials
5. Start managing tasks!

---

Made with ❤️ by the TaskFlow team
