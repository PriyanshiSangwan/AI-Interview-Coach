# AI Interview Coach

An AI-powered interview practice platform that simulates role-based interviews, evaluates candidate responses, and provides actionable feedback to help candidates improve.

## 🚀 Live Demo

[Open the live AI Interview Coach](https://ai-interview-coach-theta-seven.vercel.app)

## 📌 Project Overview

AI Interview Coach makes interview preparation structured and measurable.

Candidates can:
- Select an interview role and difficulty
- Start a simulated interview
- Answer interview questions
- Submit answers for evaluation
- Receive an overall score
- Review question-level performance
- See strengths and areas for improvement
- View an example of a stronger answer
- Practice again from the dashboard

## ✨ Key Features

### Role-Based Interview Setup
Configure an interview based on the selected role and difficulty.

### Structured Interview Flow
A guided flow takes the candidate from setup through interview completion.

### AI Evaluation
Responses are evaluated across:
- Relevance
- Communication
- Clarity
- Structure
- Role Knowledge
- Problem Solving

### Detailed Performance Review
After an interview, candidates can review:
- Original question
- Submitted answer
- Question-level score
- Score breakdown
- What they did well
- Areas to improve
- Improvement guidance
- Example of a better answer

### Overall Performance Score
The interview produces an overall score out of 10.

## 🧠 Evaluation Framework

| Dimension | Purpose |
|---|---|
| Relevance | How directly the answer addresses the question |
| Communication | How effectively the response communicates the idea |
| Clarity | How understandable the response is |
| Structure | How logically the response is organized |
| Role Knowledge | Role-specific understanding |
| Problem Solving | Quality of reasoning and approach |

The goal is to provide actionable feedback rather than relying only on a numerical score.

## 🗂️ Dataset

The project uses the InterviewForge GenDS dataset for interview-related question data.

The dataset is hosted externally because the CSV file is larger than GitHub's standard 25 MB file limit.

**[Download the InterviewForge GenDS Dataset](https://drive.google.com/drive/folders/1elSnnCTuxEfWxDsZCcUnkuZKt7Na-7GC?usp=sharing)**

> The dataset is not stored directly in this GitHub repository.

## 🛠️ Tech Stack

- **Frontend:** React
- **Build Tool:** Vite
- **Styling:** CSS
- **Backend / Database / Authentication:** Supabase
- **Deployment:** Vercel
- **Version Control:** Git + GitHub
- **Dataset:** InterviewForge GenDS (CSV)

## 📁 Project Structure

```text
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
├── .env.local
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── PROJECT_DOCUMENTATION.md
├── README.md
└── vite.config.js
```

> Environment files containing credentials should not be committed to GitHub.

## ⚙️ Local Setup

### Prerequisites

- Node.js
- npm
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/PriyanshiSangwan/AI-Interview-Coach.git
cd AI-Interview-Coach
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Do not commit `.env.local` to GitHub.

### 4. Start the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

## 🌐 Deployment

The application is deployed using Vercel.

Configure these production environment variables in Vercel:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Supabase authentication URL configuration should also use the production Vercel domain.

## 🔐 Security Notes

- Keep `.env.local` out of GitHub.
- Never expose a Supabase service-role/secret key in frontend code.
- Use the Supabase publishable key intended for client-side use.
- The large dataset is hosted externally rather than committed to GitHub.

## 📈 Product Goals

The product aims to help candidates:
1. Practice realistic interviews.
2. Understand how their answers perform.
3. Identify specific weaknesses.
4. Learn from actionable feedback.
5. Repeat interviews and improve over time.

## 🔮 Future Improvements

Potential future iterations:
- Interview history and progress analytics
- More role-specific question banks
- Adaptive follow-up questions
- Voice-based interview interaction
- Interview session timing
- Personalized improvement plans
- More advanced AI evaluation
- Performance trends across multiple interviews

## 👩‍💻 Project

**AI Interview Coach**

A portfolio project demonstrating product thinking, AI-assisted evaluation, frontend development, database integration, deployment, and end-to-end product execution.

## 📄 Documentation

See `PROJECT_DOCUMENTATION.md` for detailed product and project documentation.
