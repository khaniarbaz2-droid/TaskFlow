import DashboardLayout from "../layouts/DashboardLayout";
import "./Workload.css";

function Workload() {
  const teamMembers = [
    {
      id: 1,
      name: "Arbaz",
      role: "Frontend Developer",
      total: 8,
      pending: 2,
      inProgress: 3,
      completed: 3,
      overdue: 1,
    },
    {
      id: 2,
      name: "Rahul",
      role: "Backend Developer",
      total: 6,
      pending: 1,
      inProgress: 2,
      completed: 3,
      overdue: 0,
    },
    {
      id: 3,
      name: "Aman",
      role: "Database Developer",
      total: 5,
      pending: 2,
      inProgress: 1,
      completed: 2,
      overdue: 1,
    },
  ];

  return (
    <DashboardLayout>
      <div className="workload-page">

        <div className="workload-header">
          <div>
            <h1>Team Workload</h1>
            <p>Monitor team tasks, progress, and workload.</p>
          </div>
        </div>

        <div className="workload-summary">

          <div className="workload-stat">
            <span>Total Members</span>
            <strong>3</strong>
          </div>

          <div className="workload-stat">
            <span>Total Tasks</span>
            <strong>19</strong>
          </div>

          <div className="workload-stat">
            <span>In Progress</span>
            <strong>6</strong>
          </div>

          <div className="workload-stat">
            <span>Overdue</span>
            <strong>2</strong>
          </div>

        </div>

        <div className="team-table-card">

          <h2>Team Members</h2>

          <div className="team-table">

            <div className="team-row team-heading">
              <span>Member</span>
              <span>Total Tasks</span>
              <span>Pending</span>
              <span>In Progress</span>
              <span>Completed</span>
              <span>Overdue</span>
            </div>

            {teamMembers.map((member) => (
              <div className="team-row" key={member.id}>

                <div className="member-info">
                  <div className="member-avatar">
                    {member.name.charAt(0)}
                  </div>

                  <div>
                    <strong>{member.name}</strong>
                    <p>{member.role}</p>
                  </div>
                </div>

                <span>{member.total}</span>

                <span className="pending-count">
                  {member.pending}
                </span>

                <span className="progress-count">
                  {member.inProgress}
                </span>

                <span className="completed-count">
                  {member.completed}
                </span>

                <span className="overdue-count">
                  {member.overdue}
                </span>

              </div>
            ))}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Workload;