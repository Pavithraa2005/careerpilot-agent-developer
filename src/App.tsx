import { useState, useEffect } from "react";
import { ProfileForm } from "./components/ProfileForm";
import { Dashboard } from "./components/Dashboard";
import type { Profile, CareerData } from "./services/gemini";
import { generateCareerData, getMockCareerData } from "./services/gemini";
import { Sparkles, ShieldAlert } from "lucide-react";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [careerData, setCareerData] = useState<CareerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Dynamic loading statuses for premium counselor experience
  const loadingSteps = [
    "Analyzing profile parameters & education metrics...",
    "Scanning current skills against industry standard benchmarks...",
    "Identifying critical skill gaps and building career matrices...",
    "Synthesizing customized 30-60-90 day learning roadmaps...",
    "Generating portfolio-ready project outlines and tech stacks...",
    "Structuring tailored behavioral and technical interview preps..."
  ];

  // Load API key from local storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("careerpilot-api-key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Cycle loading messages when loading
  useEffect(() => {
    let timer: number;
    if (isLoading) {
      timer = window.setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleUpdateApiKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem("careerpilot-api-key", key);
    } else {
      localStorage.removeItem("careerpilot-api-key");
    }
  };

  const handleProfileSubmit = async (newProfile: Profile, isDemoMode: boolean) => {
    setProfile(newProfile);
    
    if (isDemoMode) {
      setIsLoading(true);
      setIsDemo(true);
      setError(null);
      
      // Simulate loading for premium experience feel
      setTimeout(() => {
        try {
          const mockData = getMockCareerData(newProfile);
          setCareerData(mockData);
        } catch (err) {
          setError("Failed to load mock data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }, 2500);
    } else {
      if (!apiKey) {
        alert("A Gemini API Key is required to run live evaluations. Alternatively, select 'Demo Mode' to see an offline preview.");
        setProfile(null);
        return;
      }

      setIsLoading(true);
      setIsDemo(false);
      setError(null);

      try {
        const data = await generateCareerData(apiKey, newProfile);
        setCareerData(data);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.message || 
          "Failed to contact Gemini API. Please make sure your API Key is valid and active."
        );
        setProfile(null); // Reset profile selection to let them fix it
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetProfile = () => {
    setProfile(null);
    setCareerData(null);
    setIsDemo(false);
    setError(null);
  };

  return (
    <>
      {isLoading ? (
        /* Premium Skeleton Loading Screen */
        <div className="loading-viewport" style={{ minHeight: "100vh", backgroundColor: "var(--bg-app)" }}>
          <div className="glass" style={{ padding: "48px 40px", borderRadius: "var(--radius-lg)", maxWidth: 500, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <div className="logo-icon" style={{ width: 60, height: 60, borderRadius: "var(--radius-md)" }}>
              <Sparkles size={36} />
            </div>
            
            <div className="spinner" style={{ borderTopColor: "var(--secondary)" }}></div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Analyzing Profile</h3>
              <p className="loading-text" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", minHeight: 48 }}>
                {loadingSteps[loadingStep]}
              </p>
            </div>
          </div>
        </div>
      ) : error ? (
        /* Error Screen */
        <div className="loading-viewport" style={{ minHeight: "100vh", backgroundColor: "var(--bg-app)" }}>
          <div className="glass" style={{ padding: "40px", borderRadius: "var(--radius-lg)", maxWidth: 500, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <div style={{ color: "var(--danger)" }}>
              <ShieldAlert size={56} />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--danger)" }}>Analysis Failed</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                {error}
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, width: "100%" }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleResetProfile}>
                Try Again
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={() => {
                  setError(null);
                  setProfile(null);
                  // Trigger key check/update modal
                  const mockProf = { name: "Demo User", education: "Demo College", skills: ["JS"], targetRole: "Frontend Developer", experienceLevel: "Student" };
                  handleProfileSubmit(mockProf, true);
                }}
              >
                Launch Demo Mode
              </button>
            </div>
          </div>
        </div>
      ) : profile && careerData ? (
        /* Full Dashboard View */
        <Dashboard
          data={careerData}
          profile={profile}
          apiKey={apiKey}
          onUpdateApiKey={handleUpdateApiKey}
          onResetProfile={handleResetProfile}
          isDemo={isDemo}
        />
      ) : (
        /* Welcome / Input Screen */
        <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <ProfileForm onSubmit={handleProfileSubmit} />
        </div>
      )}
    </>
  );
}

export default App;
