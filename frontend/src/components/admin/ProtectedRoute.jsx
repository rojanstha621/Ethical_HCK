import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
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
          setIsAuthenticated(true);
          // Token is valid and has been refreshed
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminEmail");
          localStorage.removeItem("adminLoginTime");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("adminLoginTime");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Set up periodic token refresh (every 30 minutes)
    const refreshInterval = setInterval(() => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        fetch(`${API_BASE_URL}/auth/verify?token=${token}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(console.error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/adminLogin" replace />;
  }

  return children;
}

export default ProtectedRoute;

