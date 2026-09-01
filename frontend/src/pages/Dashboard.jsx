import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import "./Dashboard.css";

function Dashboard() {
  return (
    <DashboardLayout>

      <div className="dashboard-header">
        <h1>Welcome back 👋</h1>
        <p>Here's an overview of your tasks.</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Tasks" value="24" />
        <StatCard title="Pending" value="8" />
        <StatCard title="In Progress" value="7" />
        <StatCard title="Completed" value="7" />
        <StatCard title="Overdue" value="2" />
      </div>

      <div className="recent-section">

        <h2>Recent Tasks</h2>

        <div className="task-table">

          <div className="task-row task-heading">
            <span>Task</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Progress</span>
          </div>

          <div className="task-row">
            <span>Design Login Page</span>
            <span className="high">High</span>
            <span>In Progress</span>
            <span>60%</span>
          </div>

          <div className="task-row">
            <span>Setup Database</span>
            <span className="medium">Medium</span>
            <span>Completed</span>
            <span>100%</span>
          </div>

          <div className="task-row">
            <span>API Integration</span>
            <span className="high">High</span>
            <span>Pending</span>
            <span>0%</span>
          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;