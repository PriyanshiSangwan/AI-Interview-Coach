# AI Interview Coach

AI Interview Coach is an AI-powered interview practice application that simulates realistic interviews and evaluates candidate responses using AI.

The application combines voice-based interview practice, speech-to-text, AI-powered answer evaluation, contextual follow-up questions, and a detailed interview scorecard.

## Live Demo

[Add your Vercel deployment link here]

## GitHub Repository

https://github.com/PriyanshiSangwan/AI-Interview-Coach

---

## 1. Product Overview

AI Interview Coach helps candidates practice interviews in a realistic environment and receive structured AI-generated feedback.

Users can:

- Practice interview questions
- Answer questions using their voice
- Convert spoken answers into text
- Submit answers for AI evaluation
- Receive structured scores and feedback
- Receive AI-generated follow-up questions
- Review their overall interview performance

---

## 2. Problem Statement

Interview candidates often practice without receiving structured and objective feedback.

Traditional interview preparation methods may provide questions and sample answers, but they do not continuously evaluate:

- Relevance
- Communication
- Clarity
- Structure
- Role knowledge
- Problem solving

Candidates also need practice responding naturally rather than simply reading prepared answers.

AI Interview Coach addresses this problem by combining voice-based interview practice with AI-powered answer evaluation.

---

## 3. Target Users

### Primary Users

Students and early-career professionals preparing for interviews.

### Secondary Users

Professionals preparing for:

- Product management interviews
- Behavioral interviews
- Business interviews
- Technical interviews

---

## 4. Product Goal

The goal is to provide users with a realistic interview practice environment where they can:

1. Answer interview questions naturally.
2. Receive objective AI-based evaluation.
3. Understand their strengths and weaknesses.
4. Improve their answers through actionable feedback.
5. Practice follow-up questions similar to a real interview.

---

## 5. Core Features

### Voice Interview

Users can answer questions using their microphone.

Speech recognition converts spoken responses into text.

### AI Answer Evaluation

Each submitted answer is evaluated by Gemini.

The evaluation includes:

- Relevance
- Communication
- Clarity
- Structure
- Role Knowledge
- Problem Solving
- Overall Score

### AI Feedback

The system provides:

- Strengths
- Weaknesses
- Improvement suggestions
- Example of a stronger answer

### AI Follow-up Questions

The AI determines whether an answer deserves a contextual follow-up question.

If appropriate, the application asks a follow-up question before continuing to the next main question.

### Interview Scorecard

At the end of the interview, users receive:

- Overall score
- Category scores
- Answer-by-answer review
- Strengths
- Areas for improvement
- Example better answers
- Follow-up question evaluation

---

## 6. User Flow

```text
Home
  ↓
Start Interview
  ↓
Interview Question
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
AI Follow-up (if required)
  ↓
Next Question
  ↓
Interview Complete
  ↓
Detailed Scorecard

7. AI Evaluation Framework

Each answer is evaluated across six dimensions.

Dimension	Purpose
Relevance	Measures whether the answer addresses the question
Communication	Evaluates how effectively the answer communicates its ideas
Clarity	Measures how understandable the response is
Structure	Evaluates organization and logical flow
Role Knowledge	Evaluates knowledge relevant to the target role
Problem Solving	Evaluates reasoning and approach to problems

Each category is scored from 0–10.

The system also generates an overall score on a 0–10 scale.

8. Detailed AI Review

For every completed answer, the application can display a detailed performance review containing:

Your Answer

The candidate's submitted answer is displayed for review.

Score Breakdown

The system displays individual scores for:

Relevance
Communication
Clarity
Structure
Role Knowledge
Problem Solving
Overall Score
What You Did Well

The AI identifies specific strengths in the candidate's response.

Areas to Improve

The AI identifies weaknesses or areas where the response could be stronger.

How You Can Improve

The system provides actionable recommendations for improving the response.

Example of a Better Answer

The AI can generate an example of a stronger answer to help the candidate understand how the response could be improved.

9. Follow-up Question Logic

The AI determines whether a follow-up question is appropriate based on the candidate's answer.

A follow-up may be generated when:

The candidate makes an interesting claim.
An important detail is missing.
The candidate's reasoning requires clarification.
A deeper question would naturally follow.

A follow-up is not generated when:

The answer is meaningless.
The answer is completely unrelated.
A follow-up would be repetitive.
The interview should move to an independent question.

This helps make the interview flow more similar to a real interviewer conversation.

10. Handling Invalid or Meaningless Answers

The system is designed not to reward meaningless responses with artificially high scores.

Examples include:

hello
hi
test
hello hello

Such responses receive very low evaluation scores and should not trigger unnecessary follow-up questions.

This prevents users from achieving misleadingly high interview scores without providing meaningful answers.

11. Technology Stack
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
Database / Backend Platform
Supabase
Version Control
Git
GitHub
Deployment
Vercel
12. System Architecture
                    ┌──────────────────┐
                    │       User       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   React + Vite   │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
                       Voice → Text
                             │
                             ▼
                    ┌──────────────────┐
                    │     Supabase     │
                    │   Edge Function  │
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
                    │ React Scorecard  │
                    │ + Detailed Review│
                    └──────────────────┘
13. Security

The Gemini API key is stored securely as a Supabase Edge Function secret.

The API key is not exposed directly in the React frontend.

The frontend communicates with the Supabase Edge Function, which securely communicates with Gemini.

Environment variables are used for frontend configuration.

Sensitive environment files such as .env.local should not be committed to GitHub.

14. Dataset

The project uses the InterviewForge dataset for interview question generation and evaluation support.

Due to GitHub's file size limitations, the complete dataset is hosted separately.

Dataset Download

Google Drive:

https://drive.google.com/drive/folders/1elSnnCTuxEfWxDsZCcUnkuZKt7Na-7GC?usp=sharing

The dataset can be downloaded from the link above and used with the project according to the documented data flow.

15. Project Structure
AI-Interview-Coach/
│
├── public/
│   ├── InterviewForge_GenDS.csv
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── supabaseClient.js
│
├── .gitignore
├── README.md
├── PROJECT_DOCUMENTATION.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js

Note: The large dataset may be hosted separately because of GitHub file-size limitations.

16. Installation and Local Setup
Prerequisites

Make sure the following are installed:

Node.js
npm
Git
Clone the Repository
git clone https://github.com/PriyanshiSangwan/AI-Interview-Coach.git
Navigate to the Project
cd AI-Interview-Coach
Install Dependencies
npm install
Environment Variables

Create a .env.local file in the project root.

Add the required Supabase configuration:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Do not commit .env.local to GitHub.

Run the Development Server
npm run dev

The application will run locally using the Vite development server.

17. Production Build

To create a production build:

npm run build

To preview the production build locally:

npm run preview
18. Deployment

The frontend is deployed using Vercel.

The production deployment connects to the GitHub repository and automatically builds the React/Vite application.

Required environment variables should be configured in the Vercel project settings.

The Supabase project should also have the required Edge Function configuration and Gemini API secret.

19. Current Product Status
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
Overall score
Detailed answer-by-answer review
Score breakdown
Strengths
Areas for improvement
Example better answers
Vercel deployment
GitHub repository
Future Improvements
Persistent user accounts
Interview history
Multiple interview types
Custom question sets
Resume-based interviews
Difficulty adaptation
Performance tracking over multiple interviews
More detailed analytics
Personalized interview recommendations
20. Product Success Metrics

Potential product metrics include:

Engagement
Interview completion rate
Average interviews per user
Average questions answered per interview
Quality
Percentage of answers receiving meaningful feedback
Follow-up question engagement
Repeat practice rate
Retention
Users returning for another interview
Weekly active users
Interview sessions per returning user
Outcome
Improvement in average score across repeated interviews
Improvement in individual evaluation categories
21. Product Impact

AI Interview Coach aims to make interview preparation more interactive and feedback-driven.

Instead of simply providing interview questions, the product creates a practice loop:

Practice
   ↓
Answer
   ↓
AI Evaluation
   ↓
Feedback
   ↓
Improve
   ↓
Practice Again

This enables candidates to identify weaknesses, understand how their answers can improve, and repeatedly practice in a realistic interview environment.

22. Project Documentation

Detailed product and technical documentation is available in:

PROJECT_DOCUMENTATION.md

The documentation covers the product requirements, feature decisions, AI evaluation logic, architecture, implementation details, testing, and project status.

23. License

This project is created for educational, portfolio, and demonstration purposes.


