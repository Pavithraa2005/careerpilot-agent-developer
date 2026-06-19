import React from "react";
import type { CareerData } from "../services/gemini";
import { Code2, Target, CheckCircle2 } from "lucide-react";

interface ProjectRecommendationsProps {
  data: CareerData;
}

export const ProjectRecommendations: React.FC<ProjectRecommendationsProps> = ({ data }) => {
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "beginner";
      case "intermediate": return "intermediate";
      case "advanced": return "advanced";
      default: return "intermediate";
    }
  };

  return (
    <div className="glass section-card">
      <h2 className="section-card-title">
        <Code2 size={22} style={{ color: "var(--primary)" }} />
        Recommended Portfolio Projects
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: 28 }}>
        Building real projects is the single most effective way to prove your competency to hiring managers. Here are three custom-tailored concepts for your portfolio.
      </p>

      <div className="projects-grid">
        {data.projects.map((project) => (
          <div key={project.id} className="glass-interactive project-card">
            <span className={`project-difficulty ${getDifficultyClass(project.difficulty)}`}>
              {project.difficulty} Level
            </span>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            
            {/* Features */}
            <div style={{ marginBottom: 16 }}>
              <span className="project-section-title">Key Core Features:</span>
              <ul className="project-features">
                {project.features.map((feat, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={12} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div style={{ marginBottom: 20 }}>
              <span className="project-section-title">Suggested Tech Stack:</span>
              <div className="project-tech">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="project-tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Value */}
            <div className="project-value">
              <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontStyle: "normal", color: "var(--text-primary)" }}>
                <Target size={14} style={{ color: "var(--secondary)" }} />
                Portfolio Pitch:
              </span>
              {project.portfolioValue}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
