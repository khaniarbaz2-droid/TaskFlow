#!/bin/bash

# TaskFlow Backend API Testing Script
# Usage: bash api-test.sh

API_URL="http://localhost:5000/api"

echo "🧪 TaskFlow Backend API Testing"
echo "================================\n"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Health Check
echo -e "${YELLOW}1. Testing Health Check...${NC}"
curl -X GET "$API_URL/health" 2>/dev/null | jq '.'
echo -e "\n"

# 2. Register User
echo -e "${YELLOW}2. Registering User...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "Manager",
    "phone": "1234567890",
    "department": "Engineering"
  }')

echo "$REGISTER_RESPONSE" | jq '.'

# Extract token from registration response
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token // empty')

if [ -z "$TOKEN" ]; then
  echo -e "${YELLOW}3. Attempting Login...${NC}"
  LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "password123"
    }')
  
  echo "$LOGIN_RESPONSE" | jq '.'
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')
else
  echo -e "${GREEN}✓ Token obtained from registration${NC}\n"
fi

if [ -z "$TOKEN" ]; then
  echo -e "${YELLOW}No token obtained. Exiting...${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Token: ${TOKEN:0:20}...${NC}\n"

# 3. Get Current User
echo -e "${YELLOW}3. Getting Current User Info...${NC}"
curl -s -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 4. Get All Users
echo -e "${YELLOW}4. Getting All Users...${NC}"
curl -s -X GET "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 5. Create Task
echo -e "${YELLOW}5. Creating Task...${NC}"
CREATE_TASK=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "priority": "High",
    "category": "Development",
    "tags": ["test", "urgent"],
    "estimatedHours": 8
  }')

echo "$CREATE_TASK" | jq '.'
TASK_ID=$(echo "$CREATE_TASK" | jq -r '.task._id // empty')
echo -e "\n"

# 6. Get All Tasks
echo -e "${YELLOW}6. Getting All Tasks...${NC}"
curl -s -X GET "$API_URL/tasks" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

if [ ! -z "$TASK_ID" ]; then
  # 7. Get Single Task
  echo -e "${YELLOW}7. Getting Single Task...${NC}"
  curl -s -X GET "$API_URL/tasks/$TASK_ID" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo -e "\n"

  # 8. Update Task
  echo -e "${YELLOW}8. Updating Task...${NC}"
  curl -s -X PUT "$API_URL/tasks/$TASK_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "status": "In Progress",
      "progress": 50
    }' | jq '.'
  echo -e "\n"

  # 9. Add Comment to Task
  echo -e "${YELLOW}9. Adding Comment to Task...${NC}"
  curl -s -X POST "$API_URL/tasks/$TASK_ID/comments" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "comment": "This is a test comment"
    }' | jq '.'
  echo -e "\n"
fi

# 10. Get Notifications
echo -e "${YELLOW}10. Getting Notifications...${NC}"
curl -s -X GET "$API_URL/notifications" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 11. Get Unread Count
echo -e "${YELLOW}11. Getting Unread Notification Count...${NC}"
curl -s -X GET "$API_URL/notifications/unread-count" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 12. Get Workload
echo -e "${YELLOW}12. Getting Task Workload...${NC}"
curl -s -X GET "$API_URL/tasks/workload" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

echo -e "${GREEN}✓ Testing Complete!${NC}"
