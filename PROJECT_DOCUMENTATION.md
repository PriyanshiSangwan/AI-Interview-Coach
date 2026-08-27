# AI Interview Coach

## 1. Product Overview

AI Interview Coach is an AI-powered interview practice application that simulates realistic interviews and evaluates candidate responses using AI.

The application allows users to:

- Practice interview questions
- Answer questions using their voice
- Convert spoken answers into text
- Submit answers for AI evaluation
- Receive structured feedback and scores
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

The AI can determine whether an answer deserves a follow-up question.

If appropriate, the application asks a contextual follow-up question before continuing to the next main question.

### Interview Scorecard

At the end of the interview, users receive:

- Overall score
- Category scores
- Answer-by-answer review
- Strengths
- Improvement feedback
- Follow-up questions

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
Scorecard

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

The overall score is also calculated on a 0–10 scale.

8. Follow-up Question Logic

The AI determines whether a follow-up question is appropriate.

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
9. Handling Invalid Answers

The system does not give high scores to meaningless answers.

Examples include:

"hello"
"hi"
"test"
"hello hello"

Meaningless responses receive very low scores and do not trigger unnecessary follow-up questions.

10. Technology Stack
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
11. System Architecture
                    ┌──────────────────┐
                    │      User        │
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
                    │ Supabase Edge    │
                    │    Function      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Gemini API     │
                    │ AI Evaluation    │
                    └────────┬─────────┘
                             │
                     JSON Evaluation
                             │
                             ▼
                    ┌──────────────────┐
                    │ React Scorecard  │
                    └──────────────────┘
12. Security

The Gemini API key is stored as a Supabase Edge Function secret.

The API key is not exposed directly in the React frontend.

The frontend communicates with the Supabase Edge Function, which securely communicates with Gemini.

13. Current Product Status
Completed
 Interview landing page
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
14. Product Success Metrics

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

