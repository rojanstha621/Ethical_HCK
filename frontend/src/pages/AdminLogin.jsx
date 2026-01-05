import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, Shield } from "lucide-react";
import CryptoJS from "crypto-js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkExistingAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify?token=${token}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          // Already authenticated, redirect to admin
          navigate("/admin", { replace: true });
        } else {
          // Token invalid, clear it
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminEmail");
          localStorage.removeItem("adminLoginTime");
          setCheckingAuth(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("adminLoginTime");
        setCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Hash the password on frontend
      const hashedPassword = CryptoJS.SHA256(password).toString();

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          passwordHash: hashedPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token in localStorage with timestamp
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminEmail", email.trim());
        localStorage.setItem("adminLoginTime", Date.now().toString());
        // Redirect to admin dashboard
        navigate("/admin", { replace: true });
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-red/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface/80">
                <div className="absolute inset-0 rounded-2xl bg-accent-red/20 blur-md" />
                <Shield className="relative h-8 w-8 text-accent-red" />
              </div>
            </div>
            <div>
              <h1 className="font-heading text-2xl text-text-primary mb-2">
                Admin Login
              </h1>
              <p className="text-sm text-text-muted">
                Enter your credentials to access the admin dashboard
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
                  placeholder="admin@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent-red text-white font-medium hover:bg-accent-redDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-xs text-text-muted pt-4 border-t border-border">
            <p>Authorized personnel only</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;

