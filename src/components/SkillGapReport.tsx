import React from "react";
import type { CareerData } from "../services/gemini";
import { CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";

interface SkillGapReportProps {
  data: CareerData;
}

export const SkillGapReport: React.FC<SkillGapReportProps> = ({ data }) => {
  const matchedSkills = data.skills.filter(s => s.status === "match");
  const gapSkills = data.skills.filter(s => s.status === "gap");

  return (
    <div className="glass section-card">
      <h2 className="section-card-title">
        <BookOpen size={22} style={{ color: "var(--primary)" }} />
        Skills Analysis & Gap Report
      </h2>
      
      <div className="skills-comparison-layout">
        {/* Matched Skills */}
        <div>
          <h3 className="skills-column-title" style={{ color: "var(--success)" }}>
            <CheckCircle2 size={20} />
            Acquired & Matched Skills ({matchedSkills.length})
          </h3>
          <div className="skills-list">
            {matchedSkills.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontStyle: "italic", padding: 12 }}>
                No matching skills identified for this role yet. Complete the gap items to begin matching!
              </p>
            ) : (
              matchedSkills.map((skill, idx) => (
                <div key={idx} className="skill-row" style={{ borderLeft: "4px solid var(--success)" }}>
                  <div className="skill-row-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-badge match">Match</span>
                  </div>
                  <p className="skill-desc">{skill.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Gaps to Bridge */}
        <div>
          <h3 className="skills-column-title" style={{ color: "var(--warning)" }}>
            <AlertTriangle size={20} />
            Critical Skill Gaps ({gapSkills.length})
          </h3>
          <div className="skills-list">
            {gapSkills.length === 0 ? (
              <p style={{ color: "var(--success)", fontStyle: "italic", padding: 12 }}>
                Amazing! You have matched all identified key skills for this role!
              </p>
            ) : (
              gapSkills.map((skill, idx) => (
                <div key={idx} className="skill-row" style={{ borderLeft: "4px solid var(--danger)" }}>
                  <div className="skill-row-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className={`skill-badge ${skill.importance}`}>
                      {skill.importance} Priority
                    </span>
                  </div>
                  <p className="skill-desc">{skill.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
