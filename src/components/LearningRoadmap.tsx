import React, { useState, useEffect } from "react";
import type { CareerData, Profile, RoadmapTask } from "../services/gemini";
import { Calendar, Check, BookOpen, CheckCircle } from "lucide-react";

interface LearningRoadmapProps {
  data: CareerData;
  profile: Profile;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({ data, profile }) => {
  // Store the checked tasks. Key will be "name-role-phase-taskTitle"
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load initial check state from localStorage
    const saved = localStorage.getItem(`careerpilot-roadmap-checked-${profile.name}-${profile.targetRole}`);
    if (saved) {
      try {
        setCheckedTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing roadmap checked tasks", e);
      }
    }
  }, [profile.name, profile.targetRole]);

  const toggleTask = (phase: string, taskTitle: string) => {
    const key = `${phase}-${taskTitle}`;
    const newChecked = {
      ...checkedTasks,
      [key]: !checkedTasks[key]
    };
    setCheckedTasks(newChecked);
    localStorage.setItem(
      `careerpilot-roadmap-checked-${profile.name}-${profile.targetRole}`,
      JSON.stringify(newChecked)
    );
  };

  const getPhaseProgress = (tasks: RoadmapTask[], phaseKey: string) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => checkedTasks[`${phaseKey}-${t.title}`]).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const renderPhase = (tasks: RoadmapTask[], title: string, subtitle: string, phaseKey: string) => {
    const progress = getPhaseProgress(tasks, phaseKey);
    return (
      <div className="roadmap-phase">
        <div className="roadmap-phase-indicator"></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
          <h3 className="roadmap-phase-title">{title} <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "normal" }}>({subtitle})</span></h3>
          
          {/* Phase progress indicators */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 100, height: 6, backgroundColor: "var(--border-color)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, var(--primary), var(--secondary))", transition: "width var(--transition-normal)" }}></div>
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>{progress}% Complete</span>
          </div>
        </div>

        <div className="roadmap-tasks-grid">
          {tasks.map((task, idx) => {
            const isChecked = !!checkedTasks[`${phaseKey}-${task.title}`];
            return (
              <div key={idx} className={`glass roadmap-task-card ${isChecked ? "checked" : ""}`}>
                <div className="roadmap-checkbox-wrapper">
                  <button
                    type="button"
                    className={`roadmap-checkbox ${isChecked ? "checked" : ""}`}
                    onClick={() => toggleTask(phaseKey, task.title)}
                  >
                    {isChecked && <Check size={14} strokeWidth={3} />}
                  </button>
                </div>
                <div className="roadmap-task-content">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                    <h4 className="roadmap-task-title">{task.title}</h4>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)" }}>
                      Est: {task.duration}
                    </span>
                  </div>
                  <p className="roadmap-task-desc">{task.description}</p>
                  
                  {task.resources && task.resources.length > 0 && (
                    <div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Recommended Materials:
                      </span>
                      <div className="roadmap-resources-list">
                        {task.resources.map((res, rIdx) => (
                          <span key={rIdx} className="resource-pill">
                            <BookOpen size={12} style={{ color: "var(--primary)" }} />
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const totalTasks = data.roadmap30.length + data.roadmap60.length + data.roadmap90.length;
  const completedTasks = 
    data.roadmap30.filter(t => checkedTasks[`30-${t.title}`]).length +
    data.roadmap60.filter(t => checkedTasks[`60-${t.title}`]).length +
    data.roadmap90.filter(t => checkedTasks[`90-${t.title}`]).length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="glass section-card">
      <div className="section-title-bar">
        <h2 className="section-card-title" style={{ borderBottom: "none", marginBottom: 0, paddingBottom: 0 }}>
          <Calendar size={22} style={{ color: "var(--primary)" }} />
          Personalized Learning Roadmap
        </h2>
        
        {/* Total completion meter */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="print-hide">
          <CheckCircle size={18} style={{ color: "var(--success)" }} />
          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Total Roadmap Progress:</span>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--success)" }}>{overallProgress}%</span>
        </div>
      </div>
      
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: 28, borderBottom: "1px solid var(--border-color)", paddingBottom: 16 }}>
        Your personalized study path divided into monthly checkpoints. Work through the tasks step-by-step to bridge your skill gaps.
      </p>

      <div className="roadmap-timeline">
        {renderPhase(data.roadmap30, "Phase 1: Foundation Building", "Days 1 to 30", "30")}
        {renderPhase(data.roadmap60, "Phase 2: Project Deployment", "Days 31 to 60", "60")}
        {renderPhase(data.roadmap90, "Phase 3: Portfolio & Placement", "Days 61 to 90", "90")}
      </div>
    </div>
  );
};
