# AI Interview Coach

AI Interview Coach is an AI-powered interview practice application that simulates realistic interviews and evaluates candidate responses using AI.

The product combines voice-based interview practice, speech-to-text, Gemini-powered answer evaluation, contextual follow-up questions, structured feedback, and a final interview scorecard.

---

## 🚀 Live Demo

**Live Application:**  
https://ai-interview-coach-theta-seven.vercel.app/

---

## 🔗 Project Resources

This project was developed as a combined **Product Management + AI Product + Full-Stack Development** project.

| Resource | Purpose | Link |
|---|---|---|
| 📘 Notion | Product discovery, research, PRD, AI evaluation, technical architecture, roadmap and case study | [View Notion](https://festive-ski-219.notion.site/AI-Interview-Coach-3cfdad4ca3a98038b1c8f1a71ba6a6be) |
| 🎨 Figma | Product UI/UX designs and high-fidelity interface designs | [View Figma](https://www.figma.com/design/vVOtq5XqM9DKjhVNrHPqF2/Ai-interview-coach---product-design?node-id=0-1&t=LSQiIC7lALKiuPp3-1) |
| 🧠 Miro | Problem framing, persona, user journey, MVP prioritization and product thinking | [View Miro Board](YOUR_MIRO_LINK) |
| 📋 Jira | Product backlog, workstreams, tasks, priorities and acceptance criteria | [View Jira](https://priyanshisangwan38.atlassian.net/jira/software/projects/AIC/boards/34/backlog?atlOrigin=eyJpIjoiM2ZhNTU3ZDI1ZTM0NDk0MzkwNmRiYWYxNDRlYWY4Y2UiLCJwIjoiaiJ9) |
| 📊 Dataset | Interview-ticket dataset used during product/data analysis | [View Dataset](https://drive.google.com/drive/folders/1elSnnCTuxEfWxDsZCcUnkuZKt7Na-7GC?usp=sharing) |

> **Note:** Replace `YOUR_MIRO_LINK` with your actual Miro board link.

---

# 1. Product Overview

AI Interview Coach helps candidates practice realistic interviews and receive structured AI-powered feedback on their answers.

The application allows users to:

- Practice interview questions
- Select interview role and difficulty
- Answer questions using their voice
- Convert spoken answers into text
- Submit answers for AI evaluation
- Receive structured scores and feedback
- Receive contextual AI follow-up questions
- Review their overall interview performance
- Practice again based on previous feedback

---

# 2. Problem Statement

Interview candidates often practice without receiving structured and objective feedback.

Traditional interview preparation methods may provide questions and sample answers, but they do not continuously evaluate:

- Relevance
- Communication
- Clarity
- Structure
- Role knowledge
- Problem solving

Candidates also need practice responding naturally rather than simply reading prepared answers.

### Problem

Candidates need a realistic environment where they can practice answering interview questions and understand exactly how their responses can improve.

### Product Opportunity

Build a voice-based AI interview experience that simulates realistic interviews and provides actionable feedback after every answer.

---

# 3. Target Users

## Primary Users

Students and early-career professionals preparing for interviews.

## Secondary Users

Professionals preparing for:

- Product management interviews
- Behavioral interviews
- Business interviews
- Technical interviews

---

# 4. Product Goal

The goal is to provide users with a realistic interview practice environment where they can:

1. Answer interview questions naturally.
2. Receive objective AI-based evaluation.
3. Understand their strengths and weaknesses.
4. Improve their answers through actionable feedback.
5. Practice follow-up questions similar to a real interview.

---

# 5. Core Features

## Voice Interview

Users can answer interview questions using their microphone.

Browser speech recognition converts spoken responses into text.

## AI Answer Evaluation

Each submitted answer is evaluated using Gemini.

The evaluation includes:

- Relevance
- Communication
- Clarity
- Structure
- Role Knowledge
- Problem Solving
- Overall Score

Each category is scored on a 0–10 scale.

## AI Feedback

The system provides:

- Strengths
- Weaknesses
- Improvement suggestions
- Example of a stronger answer

## AI Follow-up Questions

The AI can determine whether an answer deserves a contextual follow-up question.

A follow-up may be generated when:

- An important detail is missing
- The candidate makes an interesting claim
- The reasoning needs clarification
- A deeper question would naturally follow

Follow-ups are avoided when they would be:

- Meaningless
- Repetitive
- Completely unrelated
- Unnecessary for the interview flow

## Interview Scorecard

At the end of the interview, users receive:

- Overall score
- Category scores
- Answer-by-answer review
- Strengths
- Improvement feedback
- Follow-up question review

---

# 6. User Flow

```text
Home
  ↓
Start Interview
  ↓
Select Role & Difficulty
  ↓
Receive Interview Question
  ↓
Speak Answer
  ↓
Speech → Text
  ↓
Submit Answer
  ↓
Supabase Edge Function
  ↓
Gemini AI Evaluation
  ↓
Score + Feedback
  ↓
Follow-up Question (if required)
  ↓
Next Question
  ↓
Interview Complete
  ↓
Final Scorecard

# 7. AI Evaluation Framework

Each answer is evaluated across six dimensions.

Dimension	Purpose
Relevance	Measures whether the answer addresses the question
Communication	Evaluates how effectively the response communicates ideas
Clarity	Measures how understandable the response is
Structure	Evaluates organization and logical flow
Role Knowledge	Evaluates knowledge relevant to the target role
Problem Solving	Evaluates reasoning and approach to problems

Each category is scored from 0–10.

The overall score is also calculated on a 0–10 scale.

# 8. Follow-up Question Logic

The AI determines whether a follow-up question is appropriate.

Follow-up may be generated when:
The candidate makes an interesting claim.
An important detail is missing.
The candidate's reasoning requires clarification.
A deeper question would naturally follow.
Follow-up is not generated when:
The answer is meaningless.
The answer is completely unrelated.
The follow-up would be repetitive.
The interview should move to an independent question.

# 9. Handling Invalid Answers

The system should not give high scores to meaningless answers.

Examples include:

hello
hi
test
hello hello

Meaningless responses receive very low scores and do not trigger unnecessary follow-up questions.

# 10. Technology Stack
Frontend
React
Vite
JavaScript
CSS
AI
Google Gemini API
Backend
Supabase Edge Functions
Deno
Browser APIs
Web Speech API
Speech Recognition API
Deployment
Vercel

# 11. System Architecture
                    ┌──────────────────┐
                    │       User       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   React + Vite   │
                    │     Frontend     │
                    └────────┬─────────┘
                             │
                       Voice → Text
                             │
                             ▼
                    ┌──────────────────┐
                    │ Supabase Edge    │
                    │    Function      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Gemini API    │
                    │  AI Evaluation   │
                    └────────┬─────────┘
                             │
                      JSON Evaluation
                             │
                             ▼
                    ┌──────────────────┐
                    │  React Scorecard │
                    └──────────────────┘
# 12. Security

The Gemini API key is stored as a Supabase Edge Function secret.

The API key is not exposed directly in the React frontend.

The frontend communicates with the Supabase Edge Function, which securely communicates with Gemini.

13. MVP Prioritization

The MVP was prioritized around the core user value:

Realistic interview practice + objective AI evaluation + actionable feedback

Must Have
Interview setup
Interview questions
Voice input
Speech-to-text
AI answer evaluation
Scoring
Structured feedback
Should Have
AI follow-up questions
Detailed interview scorecard
Interview history
Could Have
Resume-based interviews
Difficulty adaptation
Personalized recommendations
Won't Have — For Now
Advanced analytics
Long-term personalization
Complex long-term performance tracking
14. Current Product Status
Completed
Interview landing page
Interview setup
Interview question flow
Voice input
Speech-to-text
Answer submission
Supabase Edge Function
Gemini integration
AI answer evaluation
Structured scoring
AI feedback
Follow-up question logic
Interview completion
Final scorecard
Deployment
Future Improvements
Persistent user accounts
Interview history
Multiple interview types
Custom question sets
Resume-based interviews
Difficulty adaptation
Performance tracking
Personalized recommendations
More detailed analytics
15. Product Success Metrics
Engagement
Interview completion rate
Average interviews per user
Average questions answered per interview
Quality
Percentage of answers receiving meaningful feedback
Follow-up question engagement
Retention
Users returning for another interview
Repeat practice rate
Outcome
Improvement in average score across repeated interviews
Improvement in individual evaluation categories
16. Product Documentation

The project was developed using a structured product-development process covering:

Problem Discovery
        ↓
User Research
        ↓
Dataset Analysis
        ↓
MVP Definition
        ↓
User Stories
        ↓
User Flow & UX
        ↓
PRD
        ↓
AI Product Design
        ↓
AI Evaluation
        ↓
Technical Architecture
        ↓
Figma Design
        ↓
Development
        ↓
User Testing
        ↓
Analytics
        ↓
Experiments
        ↓
Roadmap
        ↓
Final Case Study

Detailed documentation is available in the linked Notion workspace.

17. Project Management

Jira was used to structure product execution into workstreams and implementation tasks.

The Jira backlog covers:

Product discovery
MVP definition
Interview setup
Voice experience
AI evaluation
AI follow-ups
Scorecard
Backend and security
Testing
Launch and analytics
18. Design

The product UI/UX was designed in Figma.

The design includes:

Welcome screen
Interview setup
Setup confirmation
Microphone permission
Voice interview
Recording state
Processing state
Follow-up state
Interview completion
Scorecard
Detailed feedback
Practice again

See the Figma link above for the complete design file.

19. Dataset

The project uses a dataset for product and AI-related analysis.

Dataset:

View Dataset on Google Drive

Dataset analysis and related product insights are documented in Notion.

20. Portfolio Artifacts

This project includes a complete product-development portfolio consisting of:

GitHub — Source code and technical documentation
Notion — Product strategy and documentation
Figma — UI/UX designs
Miro — Product discovery, user journey and MVP prioritization
Jira — Product backlog and execution planning
21. Author

Priyanshi Sangwan

AI Product Management + Full-Stack Development

Project Links
Live Demo
Notion
Figma
Jira
Dataset
Miro

I also verified that your Notion hub is the **AI Interview Coach** workspace containing the product-discovery, PRD, development, testing, analytics, roadmap, and final-case-study material, and your Figma file contains the full interview product flow from welcome/setup through scorecard and detailed feedback. 

**Only one thing is missing from the README above: your actual Miro URL.** Replace `YOUR_MIRO_LINK` in the two places with the real board link, then your README is ready to paste into GitHub.
View Dataset on Google Drive
Google Drive
