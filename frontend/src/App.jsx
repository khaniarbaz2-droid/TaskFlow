import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;