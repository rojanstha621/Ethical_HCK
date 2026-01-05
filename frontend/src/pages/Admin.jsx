import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Settings, 
  Menu, 
  X,
  Home,
  Calendar,
  CalendarPlus,
  FolderKanban,
  FolderPlus,
  Lock
} from "lucide-react";
import MemberForm from "../components/admin/MemberForm";
import MemberList from "../components/admin/MemberList";
import EventForm from "../components/admin/EventForm";
import EventList from "../components/admin/EventList";
import ProjectForm from "../components/admin/ProjectForm";
import ProjectList from "../components/admin/ProjectList";

const sidebarItems = [
  { id: "members", label: "Members", icon: Users },
  { id: "add-member", label: "Add Member", icon: UserPlus },
  { id: "events", label: "Events", icon: Calendar },
  { id: "add-event", label: "Add Event", icon: CalendarPlus },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "add-project", label: "Add Project", icon: FolderPlus },
  { id: "settings", label: "Settings", icon: Settings },
];

function Admin() {
  const [activeTab, setActiveTab] = useState("members");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "members":
        return <MemberList />;
      case "add-member":
        return <MemberForm onSuccess={() => setActiveTab("members")} />;
      case "events":
        return <EventList />;
      case "add-event":
        return <EventForm onSuccess={() => setActiveTab("events")} />;
      case "projects":
        return <ProjectList />;
      case "add-project":
        return <ProjectForm onSuccess={() => setActiveTab("projects")} />;
      case "settings":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-heading mb-4">Settings</h2>
            <p className="text-text-muted">Settings coming soon...</p>
          </div>
        );
      default:
        return <MemberList />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? "280px" : "80px" }}
        className="border-r border-border bg-surface/50 backdrop-blur flex-shrink-0 transition-all duration-300"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-heading text-lg text-accent-red"
              >
                Admin Panel
              </motion.div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-background/50 transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-text-muted" />
              ) : (
                <Menu className="h-5 w-5 text-text-muted" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-accent-red/20 text-accent-red border border-accent-red/30"
                      : "text-text-muted hover:text-text-primary hover:bg-background/50"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border-t border-border space-y-2"
            >
              <a
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:text-text-primary hover:bg-background/50 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Site</span>
              </a>
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("adminToken");
                    if (token) {
                      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                      await fetch(`${API_BASE_URL}/auth/logout`, {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      });
                    }
                  } catch (error) {
                    console.error("Logout error:", error);
                  } finally {
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("adminEmail");
                    localStorage.removeItem("adminLoginTime");
                    window.location.href = "/adminLogin";
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:text-accent-red hover:bg-background/50 transition-colors"
              >
                <Lock className="h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-border bg-surface/50 backdrop-blur p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-heading capitalize">
              {sidebarItems.find((item) => item.id === activeTab)?.label || "Admin"}
            </h1>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span className="h-2 w-2 rounded-full bg-accent-red animate-pulse" />
              <span>Admin Mode</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

export default Admin;

