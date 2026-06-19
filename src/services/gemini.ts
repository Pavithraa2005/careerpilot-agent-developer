import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Profile {
  name: string;
  education: string;
  skills: string[];
  targetRole: string;
  experienceLevel: string;
}

export interface Skill {
  name: string;
  status: "match" | "gap";
  importance: "high" | "medium" | "low";
  description: string;
}

export interface RoadmapTask {
  title: string;
  description: string;
  resources: string[];
  duration: string;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  features: string[];
  techStack: string[];
  portfolioValue: string;
}

export interface ResumeSuggestions {
  generalTips: string[];
  keywordsToAdd: string[];
  formattingImprovements: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: "technical" | "behavioral";
  expectedThemes: string[];
}

export interface CareerData {
  readinessScore: number;
  summary: string;
  strengths: string[];
  growthAreas: string[];
  skills: Skill[];
  roadmap30: RoadmapTask[];
  roadmap60: RoadmapTask[];
  roadmap90: RoadmapTask[];
  projects: ProjectRecommendation[];
  resumeSuggestions: ResumeSuggestions;
  interviewQuestions: InterviewQuestion[];
}

export interface InterviewEvaluation {
  score: number;
  feedback: string;
  modelAnswer: string;
}

// Structured output schema for Career Analysis
const careerDataSchema = {
  type: "object" as any,
  properties: {
    readinessScore: {
      type: "integer" as any,
      description: "A career readiness percentage score from 0 to 100 based on the skills match."
    },
    summary: {
      type: "string" as any,
      description: "A brief professional summary of the candidate's profile relative to the dream job."
    },
    strengths: {
      type: "array" as any,
      items: { type: "string" as any },
      description: "Exactly 3 major strengths of this profile compared to target role."
    },
    growthAreas: {
      type: "array" as any,
      items: { type: "string" as any },
      description: "Exactly 3 major areas where the candidate needs professional or technical development."
    },
    skills: {
      type: "array" as any,
      items: {
        type: "object" as any,
        properties: {
          name: { type: "string" as any },
          status: { type: "string" as any, description: "Either 'match' or 'gap'." },
          importance: { type: "string" as any, description: "Either 'high', 'medium', or 'low'." },
          description: { type: "string" as any, description: "Brief description of the gap or how current experience validates this skill." }
        },
        required: ["name", "status", "importance", "description"]
      },
      description: "A detailed list of technical and soft skills that are either matches or critical gaps."
    },
    roadmap30: {
      type: "array" as any,
      items: {
        type: "object" as any,
        properties: {
          title: { type: "string" as any },
          description: { type: "string" as any },
          resources: { type: "array" as any, items: { type: "string" as any } },
          duration: { type: "string" as any }
        },
        required: ["title", "description", "resources", "duration"]
      },
      description: "Actionable study topics and practice for the first 30 days (Focus on core missing skills)."
    },
    roadmap60: {
      type: "array" as any,
      items: {
        type: "object" as any,
        properties: {
          title: { type: "string" as any },
          description: { type: "string" as any },
          resources: { type: "array" as any, items: { type: "string" as any } },
          duration: { type: "string" as any }
        },
        required: ["title", "description", "resources", "duration"]
      },
      description: "Actionable roadmap items for days 31-60 (Focus on project construction and advanced topics)."
    },
    roadmap90: {
      type: "array" as any,
      items: {
        type: "object" as any,
        properties: {
          title: { type: "string" as any },
          description: { type: "string" as any },
          resources: { type: "array" as any, items: { type: "string" as any } },
          duration: { type: "string" as any }
        },
        required: ["title", "description", "resources", "duration"]
      },
      description: "Actionable roadmap items for days 61-90 (Focus on resumes, portfolios, and mock interviews)."
    },
    projects: {
      type: "array" as any,
      items: {
        type: "object" as any,
        properties: {
          id: { type: "string" as any },
          title: { type: "string" as any },
          difficulty: { type: "string" as any, description: "Either 'Beginner', 'Intermediate', or 'Advanced'." },
          description: { type: "string" as any },
          features: { type: "array" as any, items: { type: "string" as any } },
          techStack: { type: "array" as any, items: { type: "string" as any } },
          portfolioValue: { type: "string" as any }
        },
        required: ["id", "title", "difficulty", "description", "features", "techStack", "portfolioValue"]
      },
      description: "3 highly recommended portfolio projects tailored to their profile and dream job."
    },
    resumeSuggestions: {
      type: "object" as any,
      properties: {
        generalTips: { type: "array" as any, items: { type: "string" as any } },
        keywordsToAdd: { type: "array" as any, items: { type: "string" as any } },
        formattingImprovements: { type: "array" as any, items: { type: "string" as any } }
      },
      required: ["generalTips", "keywordsToAdd", "formattingImprovements"]
    },
    interviewQuestions: {
      type: "array" as any,
      items: {
        type: "object" as any,
        properties: {
          id: { type: "string" as any },
          question: { type: "string" as any },
          type: { type: "string" as any, description: "Either 'technical' or 'behavioral'." },
          expectedThemes: { type: "array" as any, items: { type: "string" as any } }
        },
        required: ["id", "question", "type", "expectedThemes"]
      },
      description: "5 custom behavioral/technical interview prep questions tailored specifically to their gaps and target role."
    }
  },
  required: [
    "readinessScore",
    "summary",
    "strengths",
    "growthAreas",
    "skills",
    "roadmap30",
    "roadmap60",
    "roadmap90",
    "projects",
    "resumeSuggestions",
    "interviewQuestions"
  ]
};

// Structured output schema for Interview Evaluation
const evaluationSchema = {
  type: "object" as any,
  properties: {
    score: { type: "integer" as any, description: "Score from 0 to 100 based on accuracy, structure, and communication." },
    feedback: { type: "string" as any, description: "Helpful details on what was done well and what was missing." },
    modelAnswer: { type: "string" as any, description: "A top-tier model response that demonstrating how to articulate this answer correctly." }
  },
  required: ["score", "feedback", "modelAnswer"]
};

// Gemini API calling helper
export async function generateCareerData(apiKey: string, profile: Profile): Promise<CareerData> {
  if (!apiKey) {
    throw new Error("Gemini API key is required");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash as the standard, fast, and structured-supporting model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: careerDataSchema,
      },
    });

    const prompt = `
      You are a professional tech career counselor and executive recruiter.
      Analyze this candidate's profile and generate their Career Dashboard data:
      
      Candidate Profile:
      - Name: ${profile.name}
      - Education: ${profile.education}
      - Current Skills: ${profile.skills.join(", ")}
      - Target Role/Dream Job: ${profile.targetRole}
      - Experience Level: ${profile.experienceLevel}
      
      Generate a thorough, practical, and highly realistic report. 
      Identify critical technical and soft skill gaps required to succeed as a ${profile.targetRole}.
      Structure the output exactly as requested in the JSON schema.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText) as CareerData;
  } catch (error) {
    console.error("Gemini API Error in generateCareerData:", error);
    throw error;
  }
}

export async function evaluateInterviewAnswer(
  apiKey: string,
  profile: Profile,
  question: string,
  answer: string
): Promise<InterviewEvaluation> {
  if (!apiKey) {
    throw new Error("Gemini API key is required");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
      },
    });

    const prompt = `
      You are a senior tech interviewer for the role of ${profile.targetRole}.
      Evaluate the candidate's response to the following interview question.
      
      Candidate Info:
      - Education: ${profile.education}
      - Target Role: ${profile.targetRole}
      
      Interview Question: "${question}"
      Candidate's Answer: "${answer}"
      
      Provide a constructive assessment in JSON format. Grade fairly but strictly (standard candidate level).
      Highlight strengths, gap areas in their answer, and provide an exemplary model answer they should use to study.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText) as InterviewEvaluation;
  } catch (error) {
    console.error("Gemini API Error in evaluateInterviewAnswer:", error);
    throw error;
  }
}

export async function optimizeResumeBullet(
  apiKey: string,
  bullet: string,
  targetRole: string
): Promise<string> {
  if (!apiKey) {
    return `Spearheaded redesign of core user dashboards for the ${targetRole} role, collaborating with cross-functional teams to resolve 15+ latency issues and improving client load speeds by 24%.`;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are a professional ATS resume writer.
      Rewrite this resume bullet point into a high-impact, results-driven bullet point using strong action verbs and quantitative metrics (estimate realistic values if not provided) suited for a candidate applying for the role of ${targetRole}.
      
      Original Bullet: "${bullet}"
      
      Return ONLY the final rewritten bullet point text. Do not add quotes, introductory phrases, or markdown styling.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini API Error in optimizeResumeBullet:", error);
    throw error;
  }
}

// Highly detailed Mock Data Generators for offline/demo mode
export function getMockCareerData(profile: Profile): CareerData {
  const role = profile.targetRole.toLowerCase();
  
  if (role.includes("front") || role.includes("web") || role.includes("react")) {
    return getFrontendMockData(profile);
  } else if (role.includes("data") || role.includes("machine") || role.includes("analytics")) {
    return getDataScienceMockData(profile);
  } else if (role.includes("back") || role.includes("node") || role.includes("api") || role.includes("system")) {
    return getBackendMockData(profile);
  } else {
    // General fallback template that adapts to their input
    return getFallbackMockData(profile);
  }
}

// 1. Frontend Developer Mock
function getFrontendMockData(profile: Profile): CareerData {
  const matching = profile.skills.filter(s => 
    ["html", "css", "javascript", "react", "bootstrap", "tailwind", "git"].includes(s.toLowerCase())
  );
  const score = Math.min(95, Math.max(35, 40 + (matching.length * 8)));

  return {
    readinessScore: score,
    summary: `Hi ${profile.name}! Your profile shows a strong foundation in frontend building blocks (${matching.join(", ") || "HTML/JS"}). However, to transition into a professional Frontend role, employers search for production-ready capabilities. Enhancing your skill set with TypeScript for type-safety and Next.js for server-side rendering is the key next step.`,
    strengths: [
      "Solid core coding mechanics with HTML, CSS, and basic JavaScript.",
      "Hands-on building experience with UI structures and styles.",
      `Highly motivated to transition from ${profile.education} into Frontend Engineering.`
    ],
    growthAreas: [
      "Type-safe application architecture using TypeScript.",
      "Next-generation frameworks (Next.js/React Server Components).",
      "Writing robust frontend test suites using Jest and React Testing Library."
    ],
    skills: [
      { name: "React", status: matching.some(s => s.toLowerCase().includes("react")) ? "match" : "gap", importance: "high", description: "The most popular library for interactive user interfaces." },
      { name: "TypeScript", status: "gap", importance: "high", description: "Crucial for writing maintainable code in larger engineering teams." },
      { name: "CSS Modules / Sass", status: "match", importance: "medium", description: "Component-level styling approaches standard in industry codebases." },
      { name: "Next.js", status: "gap", importance: "high", description: "Required for production websites requiring SEO, SSR, and routing." },
      { name: "Redux Toolkit / Zustand", status: "gap", importance: "medium", description: "Required for global client-side state management." },
      { name: "Git & Version Control", status: "match", importance: "high", description: "Essential for team collaboration and CI/CD pipelines." },
      { name: "Tailwind CSS", status: "match", importance: "low", description: "Utility-first design styling frameworks popular in startup setups." }
    ],
    roadmap30: [
      {
        title: "TypeScript Deep Dive",
        description: "Upgrade JavaScript skills with interfaces, custom types, generic interfaces, and strict compiler configs.",
        resources: ["TypeScript Docs", "Jack Herrington's TS YouTube tutorials"],
        duration: "15 hours"
      },
      {
        title: "State Management with Zustand",
        description: "Build client side stores to share state between multiple complex components, replacing simple prop drilling.",
        resources: ["Zustand Documentation", "React State Management Guides"],
        duration: "10 hours"
      }
    ],
    roadmap60: [
      {
        title: "Next.js (App Router) & Tailwind CSS",
        description: "Build multi-page SEO-friendly apps using Server-Side Rendering (SSR), API routes, and styling libraries.",
        resources: ["Next.js Learn Dashboard", "Vercel Guides"],
        duration: "25 hours"
      },
      {
        title: "Interpreting API payloads & error handling",
        description: "Incorporate robust loading states, interceptors, and fallback UI screens when loading data.",
        resources: ["MDN Fetch API", "Axios Interceptor guides"],
        duration: "12 hours"
      }
    ],
    roadmap90: [
      {
        title: "Testing & CI/CD",
        description: "Learn to test components using Jest and React Testing Library. Implement GitHub Actions to run tests automatically.",
        resources: ["React Testing Library Docs", "GitHub Actions Intro"],
        duration: "18 hours"
      },
      {
        title: "Portfolio Deployment & Optimization",
        description: "Build 2 key projects, deploy on Vercel, and optimize Lighthouse score to over 90 on mobile.",
        resources: ["Lighthouse Audits Guide", "Vercel Hosting Docs"],
        duration: "15 hours"
      }
    ],
    projects: [
      {
        id: "p1",
        title: "DevPortfolio Builder Hub",
        difficulty: "Intermediate",
        description: "A drag-and-drop portfolio builder dashboard for developers. Includes custom theme customization and live previews.",
        features: [
          "Drag-and-drop component layout editor",
          "Rich forms with auto-saving to localStorage",
          "One-click HTML/JSON template exporter"
        ],
        techStack: ["React", "TypeScript", "Tailwind CSS", "dnd-kit"],
        portfolioValue: "Proves you can handle complex client-side state, user actions, and modular components."
      },
      {
        id: "p2",
        title: "NextGen E-Commerce Dashboard",
        difficulty: "Advanced",
        description: "A beautiful e-commerce platform with dynamic routing, stripe integration, and full CMS editor for products.",
        features: [
          "SSR pages for fast product loads",
          "Secure payments via Stripe integration",
          "Search filtering and interactive shopping cart"
        ],
        techStack: ["Next.js", "Zustand", "Stripe API", "CSS Modules"],
        portfolioValue: "Highlights capability in handling backend integrations, SSR, database payloads, and transaction security."
      },
      {
        id: "p3",
        title: "Real-time Chat Space",
        difficulty: "Intermediate",
        description: "A collaborative workspace chat room featuring multiple channels, typing indicators, and user avatars.",
        features: [
          "Live socket messages and message history",
          "Authentication and profile customization",
          "Active status indicator toggles"
        ],
        techStack: ["React", "Node.js", "Socket.io", "Express"],
        portfolioValue: "Showcases real-time data streaming, state syncing, and fullstack capability."
      }
    ],
    resumeSuggestions: {
      generalTips: [
        "Include a 'Projects' section at the top of your resume, detailed with bullet points describing what YOU built.",
        "Add a technical skills section categorized into Languages, Frameworks, and Tools.",
        "Rephrase project descriptions to show outcomes instead of just listing features."
      ],
      keywordsToAdd: [
        "TypeScript",
        "Next.js",
        "React Server Components",
        "REST APIs",
        "State Management",
        "Lighthouse Optimization",
        "Git Workflow"
      ],
      formattingImprovements: [
        "Ensure all technical items have links to live demos and GitHub repositories.",
        "Limit resume to 1 single page. Focus on impact metrics (e.g. 'reduced load time by 30%').",
        "Remove generic details like Microsoft Office skills to make space for core software technologies."
      ]
    },
    interviewQuestions: [
      {
        id: "fe-q1",
        question: "Explain the difference between Server Components and Client Components in Next.js. When would you use each?",
        type: "technical",
        expectedThemes: ["Server-side rendering", "Data fetching efficiency", "SEO", "Interactivity hooks (useState)", "Hydration"]
      },
      {
        id: "fe-q2",
        question: "What is TypeScript's strict mode, and why is it recommended for new frontend codebases?",
        type: "technical",
        expectedThemes: ["Strict null checks", "Implicit 'any' prevention", "Compile-time safety", "Reduced runtime errors"]
      },
      {
        id: "fe-q3",
        question: "Describe a scenario where you had to manage state across multiple components. How did you choose your approach?",
        type: "behavioral",
        expectedThemes: ["Prop drilling issue", "Context API vs Redux/Zustand", "Performance impacts", "Architecture decisions"]
      },
      {
        id: "fe-q4",
        question: "Explain how React's virtual DOM works and what problem it solves.",
        type: "technical",
        expectedThemes: ["Reconciliation algorithm", "Batch updates", "Direct DOM manipulation cost", "Diffing process"]
      },
      {
        id: "fe-q5",
        question: "How do you optimize a React web page that is loading slowly?",
        type: "technical",
        expectedThemes: ["Code splitting (React.lazy)", "Image optimization", "Reducing re-renders", "Bundle analysis", "Lighthouse audits"]
      }
    ]
  };
}

// 2. Data Scientist Mock
function getDataScienceMockData(profile: Profile): CareerData {
  const matching = profile.skills.filter(s => 
    ["python", "r", "pandas", "numpy", "matplotlib", "sql", "excel", "tableau"].includes(s.toLowerCase())
  );
  const score = Math.min(95, Math.max(35, 38 + (matching.length * 9)));

  return {
    readinessScore: score,
    summary: `Welcome ${profile.name}! Your profile shows a solid starting framework for data analysis, particularly with tools like ${matching.join(", ") || "Python/Excel"}. To progress into a junior Data Scientist position, you will need to expand your competencies into predictive modeling, machine learning theory, statistics (hypothesis testing), and deploying pipelines into production.`,
    strengths: [
      "Core Python analytics coding libraries (Pandas/Numpy).",
      "Visualizing datasets to pull simple insights.",
      "Clear educational background in analysis concepts."
    ],
    growthAreas: [
      "Rigorous experimental design (A/B testing, hypothesis formulation).",
      "Deploying model weights as active APIs using FastAPI.",
      "Advanced database handling and complex SQL window queries."
    ],
    skills: [
      { name: "Python", status: "match", importance: "high", description: "The premier standard programming language for data science." },
      { name: "Pandas & Numpy", status: "match", importance: "high", description: "Essential for loading, clean-up, and manipulation of data arrays." },
      { name: "SQL (PostgreSQL / BigQuery)", status: "gap", importance: "high", description: "Required to query large data warehouses and build staging views." },
      { name: "Machine Learning (Scikit-Learn)", status: "gap", importance: "high", description: "Needed to build supervised models (regression, classifications)." },
      { name: "Deep Learning (PyTorch/Tensorflow)", status: "gap", importance: "low", description: "Important for neural network modeling (NLP, Computer Vision)." },
      { name: "A/B Testing & Statistics", status: "gap", importance: "high", description: "Required to validate model assumptions and run business tests." },
      { name: "Tableau / PowerBI", status: "match", importance: "medium", description: "Useful for summarizing insights for business executives." }
    ],
    roadmap30: [
      {
        title: "Intermediate SQL & Data Extraction",
        description: "Master subqueries, window functions, complex joins, and writing efficient queries to pull aggregate metrics.",
        resources: ["Kaggle SQL course", "Mode Analytics SQL Tutorial"],
        duration: "16 hours"
      },
      {
        title: "Classical Machine Learning Theory",
        description: "Study regressions, Decision Trees, Random Forests, and SVMs. Focus on evaluation metrics (Precision, Recall, ROC-AUC).",
        resources: ["Introduction to Statistical Learning (ISLR)", "StatQuest YouTube channel"],
        duration: "20 hours"
      }
    ],
    roadmap60: [
      {
        title: "Practical Machine Learning (Scikit-Learn)",
        description: "Write modeling scripts to clean data, engineer features, scale inputs, and optimize hyperparameters.",
        resources: ["Scikit-Learn Documentation", "Machine Learning with Python Course"],
        duration: "24 hours"
      },
      {
        title: "Applied Business Statistics",
        description: "Understand hypothesis testing, p-values, confidence intervals, and how to structure A/B tests.",
        resources: ["Khan Academy AP Statistics", "Udacity A/B Testing Course"],
        duration: "15 hours"
      }
    ],
    roadmap90: [
      {
        title: "Model Deployment & APIs",
        description: "Convert a trained machine learning model (.pkl) into a web API using FastAPI and wrap it in a Docker container.",
        resources: ["FastAPI Getting Started", "Docker for Data Science Tutorials"],
        duration: "20 hours"
      },
      {
        title: "Portfolio Pipeline Projects",
        description: "Construct end-to-end pipelines that pull raw data, model it, and display predictions on a simple dashboard.",
        resources: ["Streamlit Quickstart Guides", "GitHub project uploads"],
        duration: "18 hours"
      }
    ],
    projects: [
      {
        id: "ds-p1",
        title: "Customer Churn Prediction Engine",
        difficulty: "Intermediate",
        description: "Build a model to predict which customers are likely to cancel their subscriptions, complete with a web UI dashboard.",
        features: [
          "Detailed exploratory data analysis (EDA) notebook",
          "Hyperparameter tuning comparing XGBoost and Random Forests",
          "Interactive dashboard built with Streamlit for business managers"
        ],
        techStack: ["Python", "Pandas", "Scikit-Learn", "Streamlit", "XGBoost"],
        portfolioValue: "Shows you can translate a business problem (churn) into a complete machine learning solution and present it."
      },
      {
        id: "ds-p2",
        title: "Real-time Housing Market Predictor API",
        difficulty: "Advanced",
        description: "An end-to-end pricing pipeline. Scraping web listings, modeling price predictions, and hosting as a FastAPI microservice.",
        features: [
          "Automated Python data cleaning scripts",
          "REST API endpoint that returns model confidence intervals",
          "Docker container build config for production hosting"
        ],
        techStack: ["Python", "FastAPI", "Docker", "Scikit-Learn", "PostgreSQL"],
        portfolioValue: "Proves you understand production deployment, API integrations, and code deployment patterns."
      },
      {
        id: "ds-p3",
        title: "A/B Test Evaluation Framework",
        difficulty: "Intermediate",
        description: "A python toolkit that loads e-commerce experimental data and computes p-values, sample sizes, and dashboard summaries.",
        features: [
          "Power analysis calculator script",
          "Bootstrap distributions simulation",
          "Visual output reporting pdf generator"
        ],
        techStack: ["Python", "SciPy", "Statsmodels", "Matplotlib", "Seaborn"],
        portfolioValue: "Demonstrates statistical rigor and deep experimental testing competency."
      }
    ],
    resumeSuggestions: {
      generalTips: [
        "Include links to your GitHub repositories containing cleanly documented Jupyter Notebooks.",
        "Emphasize business impact rather than just listing ML models. (e.g. 'boosted model recall by 12% resulting in 5% higher retention').",
        "List key math/stats packages in your tech stack area."
      ],
      keywordsToAdd: [
        "Machine Learning",
        "SQL Query Optimization",
        "A/B Testing",
        "Feature Engineering",
        "Hyperparameter Tuning",
        "FastAPI",
        "Predictive Modeling"
      ],
      formattingImprovements: [
        "Ensure Python notebook files have clear markdowns detailing the 'Why' behind decisions.",
        "Structure projects under headings: Challenge, Approach, and Business Impact.",
        "Add a link to your Kaggle profile if you have participated in data contests."
      ]
    },
    interviewQuestions: [
      {
        id: "ds-q1",
        question: "Explain the bias-variance tradeoff in Machine Learning. How does it relate to overfitting?",
        type: "technical",
        expectedThemes: ["Model complexity", "Training vs validation errors", "Underfitting", "Regularization", "Cross-validation"]
      },
      {
        id: "ds-q2",
        question: "How do you handle highly imbalanced datasets when training a classification model?",
        type: "technical",
        expectedThemes: ["Resampling (SMOTE, undersampling)", "Class weights adjustment", "Precision-Recall metrics over Accuracy", "Ensemble techniques"]
      },
      {
        id: "ds-q3",
        question: "What is a p-value and how do you explain it to a non-technical business stakeholder?",
        type: "behavioral",
        expectedThemes: ["Null hypothesis", "Probability of observing extreme data", "Analogy examples", "Business context clarity"]
      },
      {
        id: "ds-q4",
        question: "What is the difference between L1 (Lasso) and L2 (Ridge) regularization? When would you use which?",
        type: "technical",
        expectedThemes: ["L1 drives weights to absolute zero", "L1 acts as feature selector", "Mathematical differences", "Multicollinearity handling"]
      },
      {
        id: "ds-q5",
        question: "Explain how you would write a SQL query to find the second-highest salary in a department database.",
        type: "technical",
        expectedThemes: ["DENSE_RANK() window function", "Subqueries", "LIMIT / OFFSET syntax", "Handling duplicate salaries"]
      }
    ]
  };
}

// 3. Backend Developer Mock
function getBackendMockData(profile: Profile): CareerData {
  const matching = profile.skills.filter(s => 
    ["node", "express", "sql", "mongodb", "python", "java", "git", "c#"].includes(s.toLowerCase())
  );
  const score = Math.min(95, Math.max(35, 42 + (matching.length * 8)));

  return {
    readinessScore: score,
    summary: `Hi ${profile.name}! Your database and coding basics (${matching.join(", ") || "Node/SQL"}) represent a great start. Professional backend engineering requires a deep appreciation of scalability, security (authentication & rate-limiting), system design, and deployment pipelines. Your roadmap focuses heavily on turning basic APIs into secure, scalable engines.`,
    strengths: [
      "Writing logic routes and simple database endpoints.",
      "Understanding JSON payload structures.",
      `Relevant education in engineering principles.`
    ],
    growthAreas: [
      "Optimizing relational databases (Indexes, Query analysis).",
      "Designing fault-tolerant systems and scaling strategies (redis caching).",
      "Setting up secure JSON Web Token authentication flows."
    ],
    skills: [
      { name: "Node.js / Express", status: matching.some(s => s.toLowerCase().includes("node") || s.toLowerCase().includes("express")) ? "match" : "gap", importance: "high", description: "Standard Javascript runtime for backend servers." },
      { name: "SQL Databases (Postgres/MySQL)", status: matching.some(s => s.toLowerCase().includes("sql")) ? "match" : "gap", importance: "high", description: "Required for robust transactional business data." },
      { name: "NoSQL Databases (MongoDB)", status: "match", importance: "medium", description: "Useful for flexible schema documents." },
      { name: "Redis Caching", status: "gap", importance: "medium", description: "Required for low latency loads and session management." },
      { name: "Docker", status: "gap", importance: "high", description: "The industry standard for containerizing applications." },
      { name: "System Design", status: "gap", importance: "high", description: "Knowledge of load balancers, rate limiters, and microservices." },
      { name: "Authentication (JWT/OAuth)", status: "gap", importance: "high", description: "Crucial for securing API endpoints." }
    ],
    roadmap30: [
      {
        title: "Relational Database Masterclass",
        description: "Master relational schema creation, normalization, transaction safety (ACID), and database indexing to speed up queries.",
        resources: ["Use The Index, Luke", "SQL Zoo"],
        duration: "18 hours"
      },
      {
        title: "Secure API Architecture",
        description: "Learn password hashing (bcrypt), JWT generation, refresh tokens, role-based authorization, and CORS policies.",
        resources: ["OWASP API Security Top 10", "MDN Auth Guides"],
        duration: "14 hours"
      }
    ],
    roadmap60: [
      {
        title: "Docker & Container Basics",
        description: "Write Dockerfiles, build images, and spin up multi-container systems (App, Postgres, Redis) using Docker Compose.",
        resources: ["Docker Curriculum", "FreeCodeCamp Docker Intro"],
        duration: "20 hours"
      },
      {
        title: "Caching & Performance",
        description: "Integrate Redis into an API to cache slow database query responses and handle session states.",
        resources: ["Redis University", "Node.js Redis caching articles"],
        duration: "12 hours"
      }
    ],
    roadmap90: [
      {
        title: "Basic System Design & Deployment",
        description: "Learn how load balancers, CDN caching, and rate limiters protect systems. Deploy APIs to Render or AWS EC2.",
        resources: ["ByteByteGo YouTube channel", "Pragmatic System Design Guides"],
        duration: "22 hours"
      },
      {
        title: "Testing & Monitoring",
        description: "Write API integration tests using Supertest/Mocha. Set up logging tools like Winston or Morgan.",
        resources: ["Supertest Documentation", "Winston Logger Configs"],
        duration: "15 hours"
      }
    ],
    projects: [
      {
        id: "be-p1",
        title: "FinTech Transaction Engine",
        difficulty: "Advanced",
        description: "A secure banking ledger backend. Supports multi-currency accounts, instant transfers, and transaction history with database safety.",
        features: [
          "ACID transactions to guarantee balance accuracy",
          "JWT session auth with secure refresh-token rotations",
          "PDF statement generation endpoint"
        ],
        techStack: ["Node.js", "Express", "PostgreSQL", "Knex.js", "Jest"],
        portfolioValue: "Demonstrates competency in writing transactional code where balance consistency and security are paramount."
      },
      {
        id: "be-p2",
        title: "Scalable Image Compression API",
        difficulty: "Intermediate",
        description: "An API that receives image uploads, offloads resizing tasks to worker queues using Redis, and hosts them on cloud storage.",
        features: [
          "Asynchronous job queue processing (BullMQ)",
          "Cloudinary / S3 integrations",
          "API rate limiter restricting uploads per IP"
        ],
        techStack: ["Node.js", "Redis", "BullMQ", "Express", "AWS S3"],
        portfolioValue: "Highlights knowledge of asynchronous processing, worker threads, rate limiting, and cloud asset hosting."
      },
      {
        id: "be-p3",
        title: "Dockerized SaaS Management Hub",
        difficulty: "Intermediate",
        description: "A complete CRUD tenant system configured inside Docker containers, featuring PostgreSQL replication and unit tests.",
        features: [
          "Docker Compose file for multi-service setup",
          "Database backup scripts",
          "Detailed API documentation via Swagger"
        ],
        techStack: ["Node.js", "PostgreSQL", "Docker", "Swagger", "Supertest"],
        portfolioValue: "Validates ability to write containerized applications, compile API docs, and run server unit tests."
      }
    ],
    resumeSuggestions: {
      generalTips: [
        "Include database schema designs or architectural diagrams in your repository README files.",
        "Highlight security integrations (e.g. 'implemented JWT authentication with HTTPS encryption').",
        "Discuss query optimization achievements (e.g. 'reduced API response times by 40% using indexing')."
      ],
      keywordsToAdd: [
        "REST API Design",
        "Relational Databases",
        "JWT Authentication",
        "Docker Containerization",
        "Redis Caching",
        "ACID Transactions",
        "Unit Testing"
      ],
      formattingImprovements: [
        "Structure experience bullet points using the STAR method (Situation, Task, Action, Result).",
        "Ensure code repositories have clear setup scripts so interviewers can run them locally with one command.",
        "List standard developer tools (Git, Postman, Docker, Linux Shell) in a dedicated area."
      ]
    },
    interviewQuestions: [
      {
        id: "be-q1",
        question: "Explain what ACID transactions are. Why are they important in financial databases?",
        type: "technical",
        expectedThemes: ["Atomicity, Consistency, Isolation, Durability", "Rollbacks", "Data races", "Ledger accuracy"]
      },
      {
        id: "be-q2",
        question: "What is database indexing? What is the tradeoff when adding multiple indexes to a database table?",
        type: "technical",
        expectedThemes: ["B-Tree structure", "Read speed boost", "Write speed decrease (overhead)", "Storage cost"]
      },
      {
        id: "be-q3",
        question: "How do you secure user passwords before saving them to a database?",
        type: "technical",
        expectedThemes: ["One-way hashing algorithms (bcrypt/argon2)", "Salting to prevent rainbow table attacks", "Avoiding MD5/SHA1"]
      },
      {
        id: "be-q4",
        question: "Describe the difference between vertical scaling and horizontal scaling of a backend server.",
        type: "technical",
        expectedThemes: ["Adding RAM/CPU vs adding more server nodes", "Load balancers", "State synchronization challenges", "Cost constraints"]
      },
      {
        id: "be-q5",
        question: "Tell me about a time you had to debug a slow database query. What was your process?",
        type: "behavioral",
        expectedThemes: ["EXPLAIN ANALYZE command", "Identifying table scans", "Adding indexes", "Measuring response time improvements"]
      }
    ]
  };
}

// 4. Fallback Generic Mock
function getFallbackMockData(profile: Profile): CareerData {
  return {
    readinessScore: 55,
    summary: `Hi ${profile.name}! Based on your studies in ${profile.education} and current skills (${profile.skills.join(", ") || "fundamental tools"}), you have a solid start. To successfully enter a role as a ${profile.targetRole}, you will need to focus on building dedicated projects, deepening technical knowledge, and learning standard team workflows.`,
    strengths: [
      "Core problem solving skills gained through education.",
      "Familiarity with standard programming or analytical workflows.",
      `Highly motivated to bridge skill gaps to become a ${profile.targetRole}.`
    ],
    growthAreas: [
      `Advanced concepts related directly to ${profile.targetRole}.`,
      "Building complete end-to-end projects for your portfolio.",
      "Learning standard industry collaboration tools like Git and testing frameworks."
    ],
    skills: [
      { name: profile.skills[0] || "Core Programming", status: "match", importance: "high", description: "Your existing foundation in software concepts." },
      { name: `${profile.targetRole} Best Practices`, status: "gap", importance: "high", description: `Required domain knowledge to perform effectively as a ${profile.targetRole}.` },
      { name: "Git & Version Control", status: "match", importance: "medium", description: "Essential for team engineering environments." },
      { name: "Testing Frameworks", status: "gap", importance: "high", description: "Required to build reliable codebases in professional production settings." },
      { name: "System Deployment / Integration", status: "gap", importance: "medium", description: "Deploying code live so it is available to users." }
    ],
    roadmap30: [
      {
        title: `${profile.targetRole} Essentials`,
        description: "Study key structures, tools, and theoretical principles required for this domain.",
        resources: ["Developer Roadmaps (roadmap.sh)", "Domain documentation"],
        duration: "20 hours"
      },
      {
        title: "Git Workflow & Collaboration",
        description: "Master branches, pull requests, resolving merge conflicts, and commit messages.",
        resources: ["Git Flight Rules", "Interactive Git Branching tutorials"],
        duration: "8 hours"
      }
    ],
    roadmap60: [
      {
        title: "Intermediate Practical Builds",
        description: "Construct small scripts or projects solving practical domain problems.",
        resources: ["GitHub templates", "Open-source guides"],
        duration: "24 hours"
      },
      {
        title: "Testing Core Logic",
        description: "Write unit tests to verify the accuracy of your code outputs.",
        resources: ["Testing guides", "Official frameworks"],
        duration: "12 hours"
      }
    ],
    roadmap90: [
      {
        title: "Portfolio Capstone Build",
        description: "Create a fully functional application or project demonstrating your skills.",
        resources: ["GitHub portfolio projects guides"],
        duration: "25 hours"
      },
      {
        title: "Resume & Interview Prep",
        description: "Format your resume to highlight your new capstone project, and practice common interview questions.",
        resources: ["ATS Resume Optimizers", "Tech Interview Handbooks"],
        duration: "15 hours"
      }
    ],
    projects: [
      {
        id: "gen-p1",
        title: "Domain Capstone Dashboard",
        difficulty: "Intermediate",
        description: `A fully functioning dashboard that solves a core problem for a ${profile.targetRole}.`,
        features: [
          "Interactive user inputs and graphs",
          "Data storage using local databases or files",
          "Clean styling matching current design conventions"
        ],
        techStack: ["React", "TypeScript", "Tailwind CSS"],
        portfolioValue: `Demonstrates that you can build a complete, user-facing project tailored for a ${profile.targetRole}.`
      },
      {
        id: "gen-p2",
        title: "Automated Utility Pipeline",
        difficulty: "Advanced",
        description: "A workflow automation script that fetches data from APIs, processes it, and stores the results.",
        features: [
          "Scheduled cron-like triggers",
          "Error handling and logging alerts",
          "Docker setup for ease of deployment"
        ],
        techStack: ["Python", "Docker", "GitHub Actions"],
        portfolioValue: "Highlights your capability in automation, integration, and infrastructure coding."
      },
      {
        id: "gen-p3",
        title: "Open-source Toolkit Contribution",
        difficulty: "Intermediate",
        description: "A small package or collection of utility classes solving common developer tasks in your field.",
        features: [
          "Detailed README documentation",
          "Published to a package registry (e.g. npm/pip)",
          "100% test coverage"
        ],
        techStack: ["JavaScript", "Jest", "Git"],
        portfolioValue: "Shows community involvement, clean documentation, and high-quality testing practices."
      }
    ],
    resumeSuggestions: {
      generalTips: [
        "Include a summary explaining your transition from studies into this goal.",
        "Highlight projects that show your ability to apply concepts.",
        "Categorize skills clearly to make it easy for recruiters to scan."
      ],
      keywordsToAdd: [
        profile.targetRole,
        "Version Control",
        "Testing",
        "Problem Solving",
        "Collaboration",
        "Data Integration"
      ],
      formattingImprovements: [
        "Avoid multi-page resumes; condense to a single page.",
        "Use active verbs to start every bullet point (e.g. 'Designed', 'Built', 'Analyzed').",
        "Remove high school details and unrelated temporary jobs."
      ]
    },
    interviewQuestions: [
      {
        id: "gen-q1",
        question: `What motivated you to pursue a career as a ${profile.targetRole}? How have your studies prepared you?`,
        type: "behavioral",
        expectedThemes: ["Motivation", "Adaptability", "Transferable skills", "Initiative"]
      },
      {
        id: "gen-q2",
        question: "Explain a technical challenge you encountered when building a project and how you solved it.",
        type: "behavioral",
        expectedThemes: ["Debugging process", "Resourcefulness", "Systematic analysis", "Outcome"]
      },
      {
        id: "gen-q3",
        question: "How do you stay up-to-date with trends and new tools in your field?",
        type: "behavioral",
        expectedThemes: ["Continuous learning", "Blogs/newsletters", "Pet projects", "Curiosity"]
      },
      {
        id: "gen-q4",
        question: "What is Git, and what is your typical workflow when collaborating on a repository?",
        type: "technical",
        expectedThemes: ["Commits", "Branches", "Pull requests", "Merge conflicts"]
      },
      {
        id: "gen-q5",
        question: "Why is writing tests for your code important in a production setting?",
        type: "technical",
        expectedThemes: ["Regression prevention", "Code reliability", "Documentation value", "Confidence in deployment"]
      }
    ]
  };
}
