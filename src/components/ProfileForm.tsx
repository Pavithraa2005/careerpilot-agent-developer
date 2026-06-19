import React, { useState } from "react";
import type { Profile } from "../services/gemini";
import { User, GraduationCap, Award, Briefcase, ChevronRight, Plus, X, Sparkles } from "lucide-react";

interface ProfileFormProps {
  onSubmit: (profile: Profile, isDemo: boolean) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Student");
  
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkillInput, setCurrentSkillInput] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && currentSkillInput.trim() !== "") {
      e.preventDefault();
      const newSkill = currentSkillInput.trim().replace(/,/g, "");
      if (newSkill && !skills.some(s => s.toLowerCase() === newSkill.toLowerCase())) {
        setSkills([...skills, newSkill]);
      }
      setCurrentSkillInput("");
    }
  };

  const handleAddSkillBtn = () => {
    const newSkill = currentSkillInput.trim().replace(/,/g, "");
    if (newSkill && !skills.some(s => s.toLowerCase() === newSkill.toLowerCase())) {
      setSkills([...skills, newSkill]);
    }
    setCurrentSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent, isDemoMode: boolean) => {
    e.preventDefault();
    if (!name.trim() || !education.trim() || !targetRole.trim()) {
      alert("Please fill in Name, Education, and Dream Job.");
      return;
    }
    onSubmit({
      name: name.trim(),
      education: education.trim(),
      skills: skills.length > 0 ? skills : ["HTML", "CSS", "JavaScript"],
      targetRole: targetRole.trim(),
      experienceLevel
    }, isDemoMode);
  };

  return (
    <div className="glass welcome-container">
      <div className="welcome-header">
        <h1 className="welcome-title">CareerPilot Agent</h1>
        <p className="welcome-subtitle">Navigate your path from classroom to professional career. Identify skill gaps and generate custom roadmaps.</p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className="form-grid">
          {/* Name Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              <User size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Experience level */}
          <div className="form-group">
            <label className="form-label" htmlFor="experience">
              <ChevronRight size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Experience Level
            </label>
            <select
              id="experience"
              className="form-select"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="Student">Current Student</option>
              <option value="Fresh Graduate">Fresh Graduate (0 years experience)</option>
              <option value="Junior Developer">Junior Level (0-1 years experience)</option>
            </select>
          </div>

          {/* Education Input */}
          <div className="form-grid-full form-group">
            <label className="form-label" htmlFor="edu">
              <GraduationCap size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Education / Degree Detail
            </label>
            <input
              id="edu"
              type="text"
              className="form-input"
              placeholder="B.S. in Computer Science - State University (2026)"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              required
            />
          </div>

          {/* Dream Job Input */}
          <div className="form-grid-full form-group">
            <label className="form-label" htmlFor="dreamJob">
              <Briefcase size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Dream Job / Career Goal
            </label>
            <input
              id="dreamJob"
              type="text"
              className="form-input"
              placeholder="Frontend Developer, Data Scientist, UX Designer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              required
            />
          </div>

          {/* Skills Tag Input */}
          <div className="form-grid-full form-group">
            <label className="form-label" htmlFor="skillsRaw">
              <Award size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Current Skills
            </label>
            <div className="skills-input-container">
              {skills.map((skill, idx) => (
                <span key={idx} className="tag">
                  {skill}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                id="skillsRaw"
                type="text"
                className="skills-raw-input"
                placeholder={skills.length === 0 ? "Type a skill and press Enter (e.g. JavaScript, Python)" : "Add more..."}
                value={currentSkillInput}
                onChange={(e) => setCurrentSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
              />
              {currentSkillInput.trim() && (
                <button
                  type="button"
                  onClick={handleAddSkillBtn}
                  className="btn btn-secondary"
                  style={{ padding: "4px 8px", fontSize: "0.8rem", height: "auto" }}
                >
                  <Plus size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="demo-trigger"
            onClick={() => {
              // Pre-fill name and education for a fast demo
              setName("Alex Johnson");
              setEducation("B.S. in Computer Science (Graduate 2026)");
              setTargetRole("Frontend Developer");
              setSkills(["HTML", "CSS", "JavaScript", "React", "Git"]);
              // Trigger submit as demo
              setTimeout(() => {
                onSubmit({
                  name: "Alex Johnson",
                  education: "B.S. in Computer Science (Graduate 2026)",
                  skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
                  targetRole: "Frontend Developer",
                  experienceLevel: "Student"
                }, true);
              }, 100);
            }}
          >
            Load Demo Profile (Frontend Dev)
          </button>
          
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={(e) => handleSubmit(e, true)}
            >
              Demo Mode (Offline)
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Sparkles size={16} />
              Analyze Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
