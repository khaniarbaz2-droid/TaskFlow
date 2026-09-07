import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import UserManagement from "./pages/UserManagement";
import Workload from "./pages/Workload";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AllTasks from "./pages/AllTasks";
import CreateTask from "./pages/CreateTask";
import MyTasks from "./pages/MyTasks";
import TaskDetails from "./pages/TaskDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Tasks */}
        <Route path="/tasks" element={<AllTasks />} />
        <Route path="/tasks/create" element={<CreateTask />} />
        <Route path="/my-tasks" element={<MyTasks />} />

        {/* Task Details */}
        <Route path="/tasks/:id" element={<TaskDetails />} />

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
        <Route path="/notifications" element={<Notifications />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/workload" element={<Workload />} />
        <Route path="/user-management" element={<UserManagement />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;