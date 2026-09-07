import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary navigation
    // Later this will connect to the backend
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <h1>TaskFlow</h1>

        <p className="login-subtitle">
          Task Monitoring & Collaboration System
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit">
            Login
          </button>

        </form>

       <p className="forgot-password">
        <Link to="/forgot-password">Forgot password?</Link>
       </p>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;