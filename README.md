# AI CareerPilot Agent

An AI-powered career guidance platform built with **React**, **TypeScript**, **Vite**, and the **Google Gemini API**. The application helps students and fresh graduates assess their career readiness, identify skill gaps, and receive personalized recommendations to achieve their dream careers.

---

## Overview

AI CareerPilot Agent is an intelligent web application designed to bridge the gap between academic learning and industry expectations. By analyzing a user's educational background, technical skills, career goals, and experience level, the platform generates personalized career insights and actionable recommendations.

The application leverages Google's Gemini AI to deliver:

* Career Readiness Assessment
* Skill Gap Analysis
* Personalized Learning Roadmap
* Course and Certification Recommendations
* Portfolio Project Suggestions
* ATS Resume Improvement Suggestions
* Interview Preparation
* Career Guidance and Next Steps

---

## Features

### User Profile

The application collects the following information:

* Name
* Education
* Current Skills
* Career Goal / Dream Job
* Experience Level

---

### Profile Analysis

Analyzes the user's profile and provides:

* Career readiness assessment
* Professional strengths
* Areas for improvement
* Personalized career summary

---

### Skill Gap Analysis

Compares the user's existing skills with the required skills for the target role.

The report includes:

* Existing Skills
* Missing Skills
* Technical Skill Gaps
* Soft Skill Recommendations
* Career Readiness Score

---

### Personalized Learning Roadmap

Creates a structured learning roadmap divided into three phases.

#### 30-Day Plan

* Strengthen programming fundamentals
* Learn core technologies
* Complete beginner-level projects

#### 60-Day Plan

* Learn frameworks and development tools
* Build intermediate projects
* Practice coding challenges

#### 90-Day Plan

* Develop production-ready applications
* Prepare for technical interviews
* Optimize portfolio and resume
* Learn deployment practices

---

### Course and Certification Recommendations

Provides personalized learning recommendations from leading platforms, including:

* Google
* Microsoft Learn
* Coursera
* Cisco Networking Academy
* freeCodeCamp
* Infosys Springboard
* Udemy

---

### Portfolio Project Recommendations

Generates practical project ideas based on the user's career goal.

Each recommendation includes:

* Project Title
* Description
* Difficulty Level
* Technology Stack
* Learning Outcomes

---

### ATS Resume Improvement

Provides AI-powered suggestions to improve resume quality by:

* Optimizing ATS keywords
* Enhancing project descriptions
* Improving professional summaries
* Recommending technical skills
* Refining resume structure

---

### Interview Preparation

Generates personalized interview preparation materials including:

* Technical Questions
* HR Questions
* Behavioral Questions
* Coding Questions
* Scenario-Based Questions

The platform also provides preparation tips for each category.

---

### Career Guidance

Offers personalized career recommendations, including:

* Immediate next steps
* Learning priorities
* Recommended certifications
* Internship suggestions
* Career growth strategy

---

### Interactive Dashboard

All generated results are displayed in a professional dashboard featuring:

* Profile Analysis
* Skill Gap Report
* Learning Roadmap
* Project Recommendations
* Resume Suggestions
* Interview Preparation
* Progress Indicators
* Downloadable Reports

---

## System Workflow

```text
User Profile
      │
      ▼
Profile Analysis
      │
      ▼
Skill Gap Analysis
      │
      ▼
Gemini AI Processing
      │
      ▼
Career Readiness Report
      │
      ├── Learning Roadmap
      ├── Course Recommendations
      ├── Portfolio Projects
      ├── Resume Suggestions
      ├── Interview Preparation
      ▼
Career Action Plan
```

---

## Technology Stack

| Category    | Technologies            |
| ----------- | ----------------------- |
| Frontend    | React, TypeScript, Vite |
| Styling     | CSS3                    |
| AI Engine   | Google Gemini API       |
| Development | Node.js, npm            |
| Linting     | ESLint                  |

---

## Project Structure

```text
build_with_ai/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── InterviewPrep.tsx
│   │   ├── LearningRoadmap.tsx
│   │   ├── ProfileAnalysis.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── ProjectRecommendations.tsx
│   │   ├── ResumeSuggestions.tsx
│   │   └── SkillGapReport.tsx
│   │
│   ├── services/
│   │   └── gemini.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/AI-CareerPilot-Agent.git
```

### Navigate to the Project

```bash
cd build_with_ai
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

### Build the Project

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

---

## Gemini API Configuration

1. Create a Gemini API key from Google AI Studio.
2. Open the application.
3. Enter the API key in the settings section.
4. Save the key.
5. Generate AI-powered career recommendations.

---

## Project Objectives

The AI CareerPilot Agent is designed to help students and fresh graduates:

* Assess career readiness
* Identify technical and soft skill gaps
* Create a personalized learning roadmap
* Build industry-ready portfolio projects
* Improve ATS resume quality
* Prepare for interviews
* Achieve career goals through AI-powered guidance

---

## Future Enhancements

* User Authentication
* Resume Builder
* PDF Report Generation
* AI Mock Interview
* Voice-Based Interview Practice
* Internship Recommendation System
* Job Recommendation Engine
* Progress Tracking Dashboard
* Cloud Database Integration
* Multi-language Support

---

## Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch.
5. Submit a Pull Request.

---

## License

This project is licensed under the **MIT License**.

---

## Developer

**Pavithra M**

Computer Science Undergraduate
Aspiring Software Engineer
AI and Full-Stack Development Enthusiast

---

**Built with React, TypeScript, Vite, and Google Gemini AI.**
