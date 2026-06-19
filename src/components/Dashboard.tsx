import React, { useState, useEffect } from "react";
import type { CareerData, Profile } from "../services/gemini";
import { ProfileAnalysis } from "./ProfileAnalysis";
import { SkillGapReport } from "./SkillGapReport";
import { LearningRoadmap } from "./LearningRoadmap";
import { ProjectRecommendations } from "./ProjectRecommendations";
import { ResumeSuggestions } from "./ResumeSuggestions";
import { InterviewPrep } from "./InterviewPrep";

import {
  Compass,
  PieChart,
  BookOpen,
  Calendar,
  Code2,
  FileText,
  MessageSquareCode,
  ArrowLeft,
  Key,
  Download,
  Sun,
  Moon,
  Lock,
  X,
  Check
} from "lucide-react";

interface DashboardProps {
  data: CareerData;
  profile: Profile;
  apiKey: string;
  onUpdateApiKey: (key: string) => void;
  onResetProfile: () => void;
  isDemo: boolean;
}

type TabType = "analysis" | "skills" | "roadmap" | "projects" | "resume" | "interview";

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  profile,
  apiKey,
  onUpdateApiKey,
  onResetProfile,
  isDemo
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("analysis");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [isKeySaved, setIsKeySaved] = useState(false);

  // Initialize theme from system preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("careerpilot-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("careerpilot-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateApiKey(localApiKey.trim());
    setIsKeySaved(true);
    setTimeout(() => {
      setIsKeySaved(false);
      setShowKeyModal(false);
    }, 1000);
  };

  const triggerPrint = () => {
    // We print all sections in one document by applying print styles
    window.print();
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "analysis":
        return <ProfileAnalysis data={data} profile={profile} />;
      case "skills":
        return <SkillGapReport data={data} />;
      case "roadmap":
        return <LearningRoadmap data={data} profile={profile} />;
      case "projects":
        return <ProjectRecommendations data={data} />;
      case "resume":
        return <ResumeSuggestions data={data} profile={profile} apiKey={apiKey} />;
      case "interview":
        return <InterviewPrep data={data} profile={profile} apiKey={apiKey} />;
      default:
        return <ProfileAnalysis data={data} profile={profile} />;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "analysis": return "Profile Analysis";
      case "skills": return "Skill Gap Report";
      case "roadmap": return "Learning Roadmap";
      case "projects": return "Project Recommendations";
      case "resume": return "Resume Optimization";
      case "interview": return "Interview Preparation";
      default: return "Dashboard Overview";
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <Compass size={24} />
          </div>
          <span className="logo-text">CareerPilot</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "analysis" ? "active" : ""}`}
            onClick={() => setActiveTab("analysis")}
          >
            <PieChart size={18} />
            Overview
          </button>
          
          <button
            className={`nav-item ${activeTab === "skills" ? "active" : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            <BookOpen size={18} />
            Skill Gap Report
          </button>
          
          <button
            className={`nav-item ${activeTab === "roadmap" ? "active" : ""}`}
            onClick={() => setActiveTab("roadmap")}
          >
            <Calendar size={18} />
            Roadmap
          </button>
          
          <button
            className={`nav-item ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <Code2 size={18} />
            Projects
          </button>
          
          <button
            className={`nav-item ${activeTab === "resume" ? "active" : ""}`}
            onClick={() => setActiveTab("resume")}
          >
            <FileText size={18} />
            Resume Tips
          </button>
          
          <button
            className={`nav-item ${activeTab === "interview" ? "active" : ""}`}
            onClick={() => setActiveTab("interview")}
          >
            <MessageSquareCode size={18} />
            Interview Prep
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={onResetProfile}>
            <ArrowLeft size={16} />
            Change Profile
          </button>

          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === "dark" ? (
              <>
                <Sun size={16} />
                Light Mode
              </>
            ) : (
              <>
                <Moon size={16} />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="main-content">
        <header className="header">
          <div className="header-title-section">
            <h1 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>
              {getTabTitle()}
            </h1>
            <span className="header-subtitle">
              Prepared for <strong>{profile.name}</strong> • Dream Job: <strong>{profile.targetRole}</strong>
            </span>
          </div>

          <div className="header-actions">
            {isDemo && (
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "4px 8px", backgroundColor: "var(--info-bg)", color: "var(--info)", borderRadius: 4 }}>
                Demo Profile Mode
              </span>
            )}
            
            {/* API Key configuration badge */}
            <div
              className={`api-key-badge ${apiKey ? "configured" : "missing"}`}
              onClick={() => setShowKeyModal(true)}
            >
              <Key size={14} />
              <span>{apiKey ? "API Key Connected" : "Connect Gemini API"}</span>
            </div>

            {/* Export PDF report button */}
            <button className="btn btn-primary" onClick={triggerPrint}>
              <Download size={16} />
              Export Report
            </button>
          </div>
        </header>

        {/* Viewport content */}
        <div className="dashboard-viewport">
          {renderActiveView()}
        </div>
      </main>

      {/* API Key Modal Overlay */}
      {showKeyModal && (
        <div className="modal-overlay" onClick={() => setShowKeyModal(false)}>
          <div className="glass modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowKeyModal(false)}>
              <X size={20} />
            </button>
            <h3 className="modal-title">
              <Lock size={20} style={{ color: "var(--primary)" }} />
              Gemini API Integration
            </h3>
            <p className="modal-description">
              We interact directly with the Google Gemini API to run profile evaluations, resume writes, and mock interviews. Your API Key is stored safely only inside your browser's localStorage.
            </p>
            
            <form onSubmit={handleSaveApiKey}>
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label" htmlFor="apiKeyInput">Enter Gemini API Key:</label>
                <input
                  id="apiKeyInput"
                  type="password"
                  className="form-input"
                  placeholder="AIzaSy..."
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  required
                />
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: "0.75rem", marginTop: 6, display: "inline-block", textAlign: "right" }}
                >
                  Get a free Gemini API Key from Google AI Studio →
                </a>
              </div>
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    onUpdateApiKey("");
                    setLocalApiKey("");
                    setShowKeyModal(false);
                  }}
                >
                  Clear Key
                </button>
                
                <button type="submit" className="btn btn-primary" style={{ minWidth: 100 }}>
                  {isKeySaved ? <Check size={16} /> : "Save Key"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
