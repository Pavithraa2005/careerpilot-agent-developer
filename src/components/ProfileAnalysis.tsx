import React from "react";
import type { CareerData, Profile } from "../services/gemini";
import { CheckCircle, AlertCircle, ArrowUpRight, Award, Zap, Compass } from "lucide-react";

interface ProfileAnalysisProps {
  data: CareerData;
  profile: Profile;
}

export const ProfileAnalysis: React.FC<ProfileAnalysisProps> = ({ data, profile }) => {
  // SVG circle computations
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.readinessScore / 100) * circumference;

  // Compute readiness label
  const getReadinessLevel = (score: number) => {
    if (score >= 80) return { label: "Job Ready", class: "success" };
    if (score >= 60) return { label: "Developing", class: "warning" };
    return { label: "Needs Training", class: "danger" };
  };

  const readiness = getReadinessLevel(data.readinessScore);

  return (
    <div>
      {/* Overview stats grid */}
      <div className="metrics-grid">
        <div className="glass metric-card">
          <div className="metric-icon-wrapper" style={{ backgroundColor: "rgba(99, 102, 241, 0.12)", color: "var(--primary)" }}>
            <Zap size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{data.readinessScore}%</span>
            <span className="metric-label">Readiness Score</span>
          </div>
        </div>

        <div className="glass metric-card">
          <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>
            <CheckCircle size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {data.skills.filter(s => s.status === "match").length}
            </span>
            <span className="metric-label">Skills Matched</span>
          </div>
        </div>

        <div className="glass metric-card">
          <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>
            <AlertCircle size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {data.skills.filter(s => s.status === "gap").length}
            </span>
            <span className="metric-label">Skill Gaps Found</span>
          </div>
        </div>

        <div className="glass metric-card">
          <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--info-bg)", color: "var(--info)" }}>
            <Compass size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{data.projects.length}</span>
            <span className="metric-label">Portfolio Projects</span>
          </div>
        </div>
      </div>

      {/* Profile analysis layout */}
      <div className="analysis-layout">
        {/* Left score panel */}
        <div className="glass score-panel">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-secondary)" }}>Readiness Level</h3>
          
          <div className="circular-progress-container">
            <svg width="140" height="140">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
              </defs>
              <circle
                className="circular-progress-bg"
                cx="70"
                cy="70"
                r={radius}
              />
              <circle
                className="circular-progress-bar"
                cx="70"
                cy="70"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="circular-progress-text">
              <span className="progress-number">{data.readinessScore}%</span>
              <span className="progress-label">Score</span>
            </div>
          </div>

          <span className={`readiness-level ${readiness.class}-bg`} style={{ color: `var(--${readiness.class})` }}>
            {readiness.label}
          </span>
          
          <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginTop: 8 }}>
            Based on required technical stack vs. current skills for <strong>{profile.targetRole}</strong>.
          </p>
        </div>

        {/* Right summary panel */}
        <div className="glass summary-panel">
          <div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Award size={20} className="text-primary" />
              Executive Profile Analysis
            </h3>
            <p className="summary-text">{data.summary}</p>
          </div>

          <div className="summary-highlights">
            {/* Strengths */}
            <div className="highlight-box">
              <div style={{ color: "var(--success)", paddingTop: 2 }}>
                <CheckCircle size={18} />
              </div>
              <div>
                <h4 style={{ color: "var(--success)" }}>Key Strengths</h4>
                <ul style={{ listStyleType: "none", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                  {data.strengths.map((str, i) => (
                    <li key={i} style={{ display: "flex", gap: 6 }}>
                      <span style={{ color: "var(--success)" }}>✓</span>
                      {str}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Growth Areas */}
            <div className="highlight-box">
              <div style={{ color: "var(--warning)", paddingTop: 2 }}>
                <ArrowUpRight size={18} />
              </div>
              <div>
                <h4 style={{ color: "var(--primary)" }}>Development Gaps</h4>
                <ul style={{ listStyleType: "none", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                  {data.growthAreas.map((gro, i) => (
                    <li key={i} style={{ display: "flex", gap: 6 }}>
                      <span style={{ color: "var(--primary)" }}>✦</span>
                      {gro}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
