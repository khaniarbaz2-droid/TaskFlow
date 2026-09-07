# TaskFlow Backend Setup Guide

## Quick Start

### 1. Install MongoDB

**Option A: Local MongoDB**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS (using Homebrew)
brew install mongodb-community

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free account
- Create a cluster
- Get your connection string
- Update `MONGODB_URI` in `.env`

### 2. Configure Environment Variables

Update `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start the Server

```bash
cd backend
npm install
npm run dev
```

You should see:
```
🚀 Server running on port 5000
Environment: development
```

### 4. Test the API

Use Postman, Thunder Client, or curl to test:

```bash
# Health check
curl http://localhost:5000/api/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Manager"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Connecting Frontend to Backend

Update your frontend API calls to use:
```
http://localhost:5000/api
```

Example in React:
```javascript
const API_URL = 'http://localhost:5000/api';

// Register
fetch(`${API_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
})

// Login
fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

## Database Initialization

The database will be created automatically when the server starts. To add seed data:

```bash
# Create a seed file in backend/src/utils/seed.js
# Then run it manually when needed
node src/utils/seed.js
```

## Key Directories

- `src/models/` - Database schemas (User, Task, Notification)
- `src/controllers/` - Business logic
- `src/routes/` - API endpoints
- `src/middleware/` - Authentication and authorization
- `src/config/` - Configuration files (database connection)

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Check firewall settings

### "PORT already in use"
- Change PORT in .env
- Or kill the process using the port:
  ```bash
  lsof -i :5000
  kill -9 <PID>
  ```

### "JWT errors"
- Make sure to include Authorization header
- Format: `Authorization: Bearer <token>`

## Additional Commands

```bash
# Production build
npm start

# Install new dependencies
npm install <package-name>

# Install dev dependencies
npm install --save-dev <package-name>

# View all npm scripts
npm run
```

## Next Steps

1. ✅ Start the backend server
2. ✅ Test API endpoints with Postman
3. ✅ Connect frontend to backend
4. ✅ Set up MongoDB Atlas for production
5. ✅ Configure email service for password reset
6. ✅ Deploy to production

## Support

For issues or questions, check:
- Backend README.md for detailed API documentation
- MongoDB documentation
- Express.js documentation
