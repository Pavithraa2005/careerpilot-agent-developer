import React, { useState } from "react";
import type { CareerData, Profile } from "../services/gemini";
import { optimizeResumeBullet } from "../services/gemini";
import { FileText, Key, Lightbulb, AlertCircle, FileEdit, Sparkles, RefreshCw } from "lucide-react";

interface ResumeSuggestionsProps {
  data: CareerData;
  profile: Profile;
  apiKey: string;
}

export const ResumeSuggestions: React.FC<ResumeSuggestionsProps> = ({ data, profile, apiKey }) => {
  const [inputBullet, setInputBullet] = useState("");
  const [optimizedBullet, setOptimizedBullet] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOptimize = async () => {
    if (!inputBullet.trim()) {
      alert("Please enter a bullet point to optimize.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await optimizeResumeBullet(apiKey, inputBullet, profile.targetRole);
      setOptimizedBullet(result);
    } catch (err) {
      alert("Error optimizing bullet point. Please verify your API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass section-card">
      <h2 className="section-card-title">
        <FileText size={22} style={{ color: "var(--primary)" }} />
        ATS Resume Suggestions
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: 28 }}>
        To pass through modern applicant tracking systems (ATS), your resume must be structured, readable, and keyword-optimized. Here are tailored modifications for your target role.
      </p>

      <div className="resume-layout">
        {/* Left column: Tips and Improvements */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8, color: "var(--primary)" }}>
              <Lightbulb size={18} />
              General ATS Strategies
            </h3>
            <div className="resume-list">
              {data.resumeSuggestions.generalTips.map((tip, idx) => (
                <div key={idx} className="resume-tip-row">
                  <div style={{ color: "var(--primary)", marginTop: 2 }}>•</div>
                  <p className="resume-tip-desc">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8, color: "var(--secondary)" }}>
              <AlertCircle size={18} />
              Formatting & Layout Upgrades
            </h3>
            <div className="resume-list">
              {data.resumeSuggestions.formattingImprovements.map((tip, idx) => (
                <div key={idx} className="resume-tip-row">
                  <div style={{ color: "var(--secondary)", marginTop: 2 }}>✦</div>
                  <p className="resume-tip-desc">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Target Keywords */}
        <div>
          <h3 style={{ fontSize: "1.1rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8, color: "var(--success)" }}>
            <Key size={18} />
            High-Value Target Keywords to Include
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 12 }}>
            Hiring managers and ATS filters screen heavily for these terms. Make sure they are represented inside your experience and skills summaries:
          </p>
          <div className="keywords-container">
            {data.resumeSuggestions.keywordsToAdd.map((kw, idx) => (
              <span key={idx} className="keyword-badge">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bullet point optimizer workspace */}
      <div className="glass optimizer-box" style={{ marginTop: 40, borderTop: "2px solid rgba(var(--primary-rgb), 0.1)" }}>
        <h3 className="optimizer-title">
          <FileEdit size={20} style={{ color: "var(--primary)" }} />
          Interactive ATS Resume Bullet Optimizer
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 16 }}>
          Transform weak resume descriptions into high-impact, STAR-method statements. Paste a basic bullet point (e.g., "I coded features in React") and let Gemini optimize it.
        </p>

        <div className="optimizer-inputs">
          <textarea
            className="form-textarea"
            placeholder="e.g., I worked on a web application and fixed bug issues on the main user dashboard page."
            value={inputBullet}
            onChange={(e) => setInputBullet(e.target.value)}
            disabled={isLoading}
          />
          
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleOptimize}
              className="btn btn-primary"
              disabled={isLoading || !inputBullet.trim()}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="spinner" style={{ animationDuration: "2s", borderTopColor: "transparent" }} />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Optimize Bullet
                </>
              )}
            </button>
          </div>
        </div>

        {optimizedBullet && (
          <div className="optimizer-results">
            <div className="optimizer-result-card before">
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--danger)", textTransform: "uppercase", marginBottom: 6 }}>Before (Weak):</h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{inputBullet}</p>
            </div>
            
            <div className="optimizer-result-card after">
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--success)", textTransform: "uppercase", marginBottom: 6 }}>After (ATS Optimized):</h4>
              <p style={{ fontSize: "0.92rem", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.45 }}>{optimizedBullet}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
