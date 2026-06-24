import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import { apiRequest, setSession } from "../api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
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
      <Link
        className="home-link"
        to="/"
        aria-label="Back to home"
        title="Back to home"
      >
        ←
      </Link>
      <div className="card">
        <div className="logo auth-logo">
          <label></label>
          CONVOS
        </div>
        <h1>REGISTER</h1>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={updateForm}
            autoComplete="username"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={updateForm}
            autoComplete="email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={updateForm}
            autoComplete="new-password"
            minLength="6"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={updateForm}
            autoComplete="new-password"
            minLength="6"
            required
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="link">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
