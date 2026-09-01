import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CreateTask from "./pages/CreateTask";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AllTasks from "./pages/AllTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Registration */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* All Tasks */}
        <Route path="/tasks" element={<AllTasks />} />

        {/* Create Task */}
        <Route path="/tasks/create" element={<CreateTask />} />

        {/* Default page */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;