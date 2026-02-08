import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import styles from "./Login.module.scss";
import bgImage from "../assets/bg.png";
import { login } from "../api/auth";

import logo from "../assets/logo.png";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleLogin() {
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password);
      console.log("LOGIN SUCCESS:", res);

      // ✅ TEMP: store result to confirm login works
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: res.user_id,
          email: res.email,
          first_name: res.first_name,
          last_name: res.last_name,
          role: res.role,
        }),
      );

      // ✅ REDIRECT TO DASHBOARD
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* ================= LEFT – FORM ================= */}
      <div className={styles.formSection}>
        <div className={styles.formWrap}>
          <div className={styles.logo}>Lotus Domaine DDC</div>

          <h1 className={styles.sectionTitle}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Sign in to access your dashboard process.
          </p>

          {/* Email */}
          <div className={styles.field}>
            <label>Email</label>
            <div className={styles.inputWrap}>
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className={styles.eyeSpacer} />
            </div>
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label>Password</label>
            <div className={styles.inputWrap}>
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.eye}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <a className={styles.forgot}>Forgot Password?</a>
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</p>
          )}

          {/* Submit */}
          <button
            className={styles.signIn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <button className={styles.oauth} disabled>
            Continue with Google
          </button>
          <button className={styles.oauth} disabled>
            Continue with Apple
          </button>

          <p className={styles.signup}>
            Don’t have an account? <span>Sign Up</span>
          </p>
        </div>
      </div>

      {/* ================= RIGHT – BRAND ================= */}

      <div
        className={styles.brandSection}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <img src={logo} alt="Lotus Domaine" className={styles.brandLogo} />
        <div className={styles.brandContent}>
          <h2>Smarter Due Diligence with AI</h2>

          <blockquote>
            AI-assisted due diligence that helps teams review more
            opportunities, extract insights faster, and make consistent,
            transparent decisions from first submission to final approval.
          </blockquote>
        </div>

        {/* <div className={styles.techStack}>
          <p>BUILT WITH</p>

          <div className={styles.techGrid}>
            <div>
              <Cloud size={16} /> Google
            </div>
            <div>
              <Brain size={16} /> OpenAI
            </div>
            <div>
              <Server size={16} /> AWS
            </div>
            <div>
              <Database size={16} /> PostgreSQL
            </div>
            <div>
              <Atom size={16} /> React
            </div>
            <div>
              <Code2 size={16} /> TypeScript
            </div>
            <div>
              <Github size={16} /> GitHub
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
