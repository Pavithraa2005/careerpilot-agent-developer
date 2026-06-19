import React, { useState } from "react";
import type { CareerData, Profile, InterviewEvaluation } from "../services/gemini";
import { evaluateInterviewAnswer } from "../services/gemini";
import { MessageSquareCode, Award, CheckCircle, RefreshCw, PlayCircle, HelpCircle } from "lucide-react";

interface InterviewPrepProps {
  data: CareerData;
  profile: Profile;
  apiKey: string;
}

export const InterviewPrep: React.FC<InterviewPrepProps> = ({ data, profile, apiKey }) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState(data.interviewQuestions[0]?.id || "");
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<Record<string, InterviewEvaluation>>({});
  const [isLoading, setIsLoading] = useState(false);

  const selectedQuestion = data.interviewQuestions.find(q => q.id === selectedQuestionId);

  const handleEvaluate = async () => {
    if (!selectedQuestion) return;
    if (!userAnswer.trim()) {
      alert("Please write your answer before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      let result: InterviewEvaluation;
      
      if (!apiKey) {
        // Fallback mock evaluation if offline
        const wordCount = userAnswer.trim().split(/\s+/).length;
        if (wordCount < 15) {
          result = {
            score: 45,
            feedback: "Your answer is too brief. In professional interviews, you must elaborate on your methodology and explain the 'Why' behind actions. Standardize your response using the STAR format (Situation, Task, Action, Result). Try adding specific project contexts.",
            modelAnswer: `For the role of ${profile.targetRole}, a standard answer would be: 'In my recent project, I encountered this exact challenge. I analyzed the inputs, researched potential solutions, built a modular POC, and then deployed it, which improved performance by 25%.'`
          };
        } else {
          result = {
            score: 82,
            feedback: "Great start! You successfully articulated key concepts and detailed a structured solution. To get a perfect score, mention how you optimized the final results, how you worked with other developers, and specify a metric (like runtime reduction or user engagement boost).",
            modelAnswer: `A model answer to hit all themes: 'When tackling this, I first identify the core parameters. For example, in a React app, I would leverage components and optimize state (hitting ${selectedQuestion.expectedThemes.slice(0, 2).join(", ") || "themes"}). This ensures readability and reduces load overhead by 30%.'`
          };
        }
      } else {
        result = await evaluateInterviewAnswer(apiKey, profile, selectedQuestion.question, userAnswer);
      }

      setEvaluation({
        ...evaluation,
        [selectedQuestionId]: result
      });
    } catch (err) {
      alert("Failed to evaluate answer. Please verify your API Key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--success)";
    if (score >= 60) return "var(--warning)";
    return "var(--danger)";
  };

  return (
    <div className="glass section-card">
      <h2 className="section-card-title">
        <MessageSquareCode size={22} style={{ color: "var(--primary)" }} />
        AI Mock Interview Preparation
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: 28 }}>
        Practice role-specific behavioral and technical questions. Draft your answer below and let our AI evaluate your structure, keywords, and detail level.
      </p>

      <div className="interview-layout">
        {/* Left side: Questions selector */}
        <div className="questions-sidebar">
          {data.interviewQuestions.map((q, idx) => {
            const isSelected = q.id === selectedQuestionId;
            const hasEvaluated = !!evaluation[q.id];
            
            return (
              <button
                key={q.id}
                className={`q-select-btn ${isSelected ? "active" : ""}`}
                onClick={() => {
                  setSelectedQuestionId(q.id);
                  setUserAnswer("");
                }}
              >
                <div className="q-select-btn-meta">
                  <span className="q-select-btn-type" style={{ color: q.type === "technical" ? "var(--primary)" : "var(--secondary)" }}>
                    {q.type}
                  </span>
                  <span className="q-select-btn-num">
                    Question {idx + 1}
                  </span>
                </div>
                <div className="q-select-btn-text">
                  {q.question}
                </div>
                {hasEvaluated && (
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--success)", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                    <CheckCircle size={12} />
                    Evaluated ({evaluation[q.id].score}%)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right side: Active workspace */}
        <div className="glass interview-workspace">
          {selectedQuestion ? (
            <>
              {/* Question card */}
              <div className="question-prompt-card">
                <h3 className="question-text">{selectedQuestion.question}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 8 }}>
                  <span className="question-meta">
                    <strong>Type:</strong> {selectedQuestion.type.toUpperCase()}
                  </span>
                  <span className="question-meta">
                    <strong>Expected topics to cover:</strong> {selectedQuestion.expectedThemes.join(", ")}
                  </span>
                </div>
              </div>

              {/* Answer input area */}
              {!evaluation[selectedQuestionId] ? (
                <div className="answer-form-container" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <PlayCircle size={16} />
                    Draft your interview response here:
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={6}
                    placeholder="Provide a detailed response. Mention specific frameworks, outcomes, or experiences..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isLoading}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={handleEvaluate}
                      className="btn btn-primary"
                      disabled={isLoading || !userAnswer.trim()}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw size={16} className="spinner" style={{ animationDuration: "2s", borderTopColor: "transparent" }} />
                          Evaluating response...
                        </>
                      ) : (
                        <>
                          <Award size={16} />
                          Evaluate Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Evaluation output card */
                <div className="answer-feedback-box" style={{ borderLeft: `4px solid ${getScoreColor(evaluation[selectedQuestionId].score)}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: 12, marginBottom: 16 }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>AI Evaluation Results</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Your Answer Grade:</span>
                      <span style={{ fontSize: "1.5rem", fontWeight: 800, color: getScoreColor(evaluation[selectedQuestionId].score) }}>
                        {evaluation[selectedQuestionId].score}/100
                      </span>
                    </div>
                  </div>

                  {/* Candidate Answer */}
                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 6 }}>Your Submitted Answer:</h5>
                    <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                      "{userAnswer}"
                    </p>
                  </div>

                  {/* Feedback */}
                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 6 }}>Critique & Feedback:</h5>
                    <p style={{ fontSize: "0.92rem", lineHeight: 1.5, color: "var(--text-primary)" }}>
                      {evaluation[selectedQuestionId].feedback}
                    </p>
                  </div>

                  {/* Model Answer */}
                  <div style={{ padding: "16px 20px", backgroundColor: "rgba(var(--primary-rgb), 0.04)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(var(--primary-rgb), 0.1)", marginBottom: 20 }}>
                    <h5 style={{ fontSize: "0.85rem", color: "var(--primary)", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle size={14} />
                      Exemplar Model Answer:
                    </h5>
                    <p style={{ fontSize: "0.92rem", lineHeight: 1.5, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
                      {evaluation[selectedQuestionId].modelAnswer}
                    </p>
                  </div>

                  {/* Retry button */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        // Clear evaluation for this question to retry
                        const updated = { ...evaluation };
                        delete updated[selectedQuestionId];
                        setEvaluation(updated);
                        setUserAnswer("");
                      }}
                    >
                      <RefreshCw size={14} />
                      Try Question Again
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 250, color: "var(--text-tertiary)", gap: 12 }}>
              <HelpCircle size={48} />
              <p>Select a question from the sidebar to begin your mock preparation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
