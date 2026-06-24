import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import { apiRequest, setSession } from "../api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateForm = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSession(data);
      navigate("/chat");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>LOGIN</h1>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email or username"
            value={form.emailOrUsername}
            onChange={updateForm}
            autoComplete="username"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={updateForm}
            autoComplete="current-password"
            required
          />

          <div className="remember">
            <input type="checkbox" />
            <label>Remember me</label>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="forgot">
            Forgot your password?
          </p>

          <p className="link">
            Don't have an account?
            <Link to="/register"> Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
