import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

const DATASET_PATH = "/InterviewForge_GenDS.csv";

const QUESTION_COUNTS = [3, 5, 8];

/* =====================================================
   CSV
===================================================== */

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());

  return result;
}

function parseCSV(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (!lines.length) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map((header) =>
    header
      .trim()
      .replace(/^"|"$/g, "")
      .toLowerCase()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return row;
  });
}

function getColumn(row, names) {
  for (const name of names) {
    const value = row[name.toLowerCase()];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim()
    ) {
      return String(value).trim();
    }
  }

  return "";
}

function getQuestion(row) {
  return getColumn(row, [
    "question",
    "question_text",
    "interview_question",
  ]);
}

function getRole(row) {
  return getColumn(row, [
    "role",
    "job_role",
    "target_role",
  ]);
}

function getDifficulty(row) {
  return getColumn(row, [
    "question_level",
    "difficulty",
    "level",
    "difficulty_level",
  ]);
}

function getInterviewType(row) {
  return getColumn(row, [
    "interview_type",
    "interview_stage",
    "question_category",
    "category",
  ]);
}

function normalizeDifficulty(value) {
  const text = String(value || "")
    .trim()
    .toLowerCase();

  if (
    text.includes("beginner") ||
    text.includes("basic") ||
    text.includes("foundation") ||
    text.includes("level 1")
  ) {
    return "Beginner";
  }

  if (
    text.includes("practical") ||
    text.includes("level 2") ||
    text.includes("intermediate")
  ) {
    return "Practical";
  }

  if (
    text.includes("advanced") ||
    text.includes("level 3")
  ) {
    return "Advanced";
  }

  return String(value || "").trim();
}

function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/* =====================================================
   APP
===================================================== */

function App() {
  /* ---------------- AUTH ---------------- */

  const [session, setSession] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);

  const [authMode, setAuthMode] = useState("login");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [authError, setAuthError] = useState("");

  const [authMessage, setAuthMessage] = useState("");

  /* ---------------- SCREEN ---------------- */

  const [screen, setScreen] = useState("dashboard");

  /* ---------------- DATASET ---------------- */

  const [dataset, setDataset] = useState([]);

  const [datasetLoading, setDatasetLoading] = useState(true);

  const [datasetError, setDatasetError] = useState("");

  /* ---------------- SETUP ---------------- */

  const [selectedRole, setSelectedRole] = useState("");

  const [selectedInterviewType, setSelectedInterviewType] =
    useState("All");

  const [selectedDifficulty, setSelectedDifficulty] =
    useState("");

  const [selectedQuestionCount, setSelectedQuestionCount] =
    useState(5);

  /* ---------------- QUESTIONS ---------------- */

  const [interviewQuestions, setInterviewQuestions] =
    useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  /* ---------------- ANSWERS ---------------- */

  const [answers, setAnswers] = useState([]);

  const [transcript, setTranscript] = useState("");

  const [interimTranscript, setInterimTranscript] =
    useState("");

  /* ---------------- AI ---------------- */

  const [isEvaluating, setIsEvaluating] =
    useState(false);

  const [followUpQuestion, setFollowUpQuestion] =
    useState("");

  const [isFollowUp, setIsFollowUp] =
    useState(false);

  /* ---------------- MIC ---------------- */

  const [isListening, setIsListening] =
    useState(false);

  const recognitionRef = useRef(null);

  const shouldKeepListeningRef = useRef(false);

  const restartTimeoutRef = useRef(null);

  const transcriptRef = useRef("");

  /* ---------------- ERROR ---------------- */

  const [error, setError] = useState("");

  /* ---------------- HISTORY ---------------- */

  const [history, setHistory] = useState([]);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  /* =====================================================
     AUTH INITIALIZATION
  ===================================================== */

  useEffect(() => {
    async function initializeAuth() {
      const { data } =
        await supabase.auth.getSession();

      setSession(data?.session || null);

      setAuthLoading(false);
    }

    initializeAuth();

    const { data: listener } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* =====================================================
     LOAD DATASET
  ===================================================== */

  useEffect(() => {
    async function loadDataset() {
      try {
        const response = await fetch(
          DATASET_PATH
        );

        if (!response.ok) {
          throw new Error(
            "Interview dataset could not be loaded."
          );
        }

        const text = await response.text();

        const rows = parseCSV(text);

        const validRows = rows.filter(
          (row) =>
            getQuestion(row) &&
            getRole(row)
        );

        if (!validRows.length) {
          throw new Error(
            "Dataset contains no valid interview questions."
          );
        }

        setDataset(validRows);

        setSelectedRole(
          getRole(validRows[0])
        );

        setSelectedDifficulty(
          normalizeDifficulty(
            getDifficulty(validRows[0])
          )
        );
      } catch (err) {
        setDatasetError(err.message);
      } finally {
        setDatasetLoading(false);
      }
    }

    loadDataset();
  }, []);

  /* =====================================================
     LOAD HISTORY
  ===================================================== */

  async function loadHistory() {
    if (!session?.user?.id) {
      return;
    }

    setHistoryLoading(true);

    const { data, error } =
      await supabase
        .from("interview_sessions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "History error:",
        error
      );
    } else {
      setHistory(data || []);
    }

    setHistoryLoading(false);
  }

  useEffect(() => {
    if (session) {
      loadHistory();
    }
  }, [session]);

  /* =====================================================
     ROLES
  ===================================================== */

  const roles = useMemo(() => {
    return [
      ...new Set(
        dataset
          .map((row) => getRole(row))
          .filter(Boolean)
      ),
    ].sort();
  }, [dataset]);

  /* =====================================================
     DIFFICULTIES
  ===================================================== */

  const difficulties = useMemo(() => {
    return [
      ...new Set(
        dataset
          .filter(
            (row) =>
              getRole(row) ===
              selectedRole
          )
          .map((row) =>
            normalizeDifficulty(
              getDifficulty(row)
            )
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [dataset, selectedRole]);

  /* =====================================================
     TYPES
  ===================================================== */

  const interviewTypes = useMemo(() => {
    return [
      ...new Set(
        dataset
          .filter(
            (row) =>
              getRole(row) ===
              selectedRole
          )
          .map((row) =>
            getInterviewType(row)
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [dataset, selectedRole]);

  /* =====================================================
     FILTER QUESTIONS
  ===================================================== */

  const filteredQuestionPool = useMemo(() => {
    return dataset.filter((row) => {
      const role = getRole(row);

      const difficulty =
        normalizeDifficulty(
          getDifficulty(row)
        );

      const type =
        getInterviewType(row);

      return (
        role === selectedRole &&
        difficulty === selectedDifficulty &&
        (
          selectedInterviewType === "All" ||
          type === selectedInterviewType
        ) &&
        Boolean(getQuestion(row))
      );
    });
  }, [
    dataset,
    selectedRole,
    selectedDifficulty,
    selectedInterviewType,
  ]);

  /* =====================================================
     SPEECH
  ===================================================== */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interim = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const text =
          event.results[i][0].transcript;

        if (
          event.results[i].isFinal
        ) {
          finalText +=
            text + " ";
        } else {
          interim += text;
        }
      }

      if (finalText) {
        const value =
          `${transcriptRef.current} ${finalText}`.trim();

        transcriptRef.current = value;

        setTranscript(value);
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      if (
        event.error ===
        "not-allowed"
      ) {
        shouldKeepListeningRef.current =
          false;

        setIsListening(false);

        setError(
          "Microphone permission was denied."
        );
      }
    };

    recognition.onend = () => {
      if (
        shouldKeepListeningRef.current &&
        !isEvaluating
      ) {
        clearTimeout(
          restartTimeoutRef.current
        );

        restartTimeoutRef.current =
          setTimeout(() => {
            try {
              recognition.start();
            } catch {}
          }, 300);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current =
      recognition;

    return () => {
      shouldKeepListeningRef.current =
        false;

      clearTimeout(
        restartTimeoutRef.current
      );

      try {
        recognition.stop();
      } catch {}
    };
  }, [isEvaluating]);

  /* =====================================================
     AUTH
  ===================================================== */

  async function handleAuth(event) {
    event.preventDefault();

    setAuthError("");
    setAuthMessage("");

    if (!email || !password) {
      setAuthError(
        "Please enter your email and password."
      );

      return;
    }

    if (authMode === "signup") {
      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            window.location.origin,
        },
      });

      if (error) {
        setAuthError(
          error.message
        );

        return;
      }

      if (
        data?.user &&
        !data?.session
      ) {
        setAuthMessage(
          "Account created! Please check your email and click the confirmation link."
        );

        setEmail("");
        setPassword("");

        return;
      }

      setAuthMessage(
        "Account created successfully."
      );

      return;
    }

    const { error } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    if (error) {
      setAuthError(
        error.message
      );
    }
  }

  async function logout() {
    await supabase.auth.signOut();

    setScreen("dashboard");
  }

  /* =====================================================
     START SETUP
  ===================================================== */

  function openSetup() {
    setError("");

    setScreen("setup");
  }

  /* =====================================================
     START INTERVIEW
  ===================================================== */

  function startInterview() {
    if (
      !filteredQuestionPool.length
    ) {
      setError(
        "No questions are available for this combination."
      );

      return;
    }

    const selected =
      shuffle(
        filteredQuestionPool
      )
        .slice(
          0,
          Math.min(
            selectedQuestionCount,
            filteredQuestionPool.length
          )
        )
        .map((row) => ({
          question:
            getQuestion(row),

          role:
            getRole(row),

          difficulty:
            normalizeDifficulty(
              getDifficulty(row)
            ),

          interviewType:
            getInterviewType(row),
        }));

    setInterviewQuestions(
      selected
    );

    setCurrentQuestion(0);

    setAnswers([]);

    transcriptRef.current = "";

    setTranscript("");

    setInterimTranscript("");

    setFollowUpQuestion("");

    setIsFollowUp(false);

    setError("");

    setScreen("interview");
  }

  /* =====================================================
     START LISTENING
  ===================================================== */

  async function startListening() {
    setError("");

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          { audio: true }
        );

      stream
        .getTracks()
        .forEach((track) =>
          track.stop()
        );
    } catch {
      setError(
        "Please allow microphone access."
      );

      return;
    }

    shouldKeepListeningRef.current =
      true;

    try {
      recognitionRef.current?.start();
    } catch {}
  }

  function stopListening() {
    shouldKeepListeningRef.current =
      false;

    clearTimeout(
      restartTimeoutRef.current
    );

    try {
      recognitionRef.current?.stop();
    } catch {}

    setIsListening(false);

    setInterimTranscript("");
  }

  /* =====================================================
     EVALUATION
  ===================================================== */

  async function evaluateWithAI({
    question,
    answer,
  }) {
    const {
      data,
      error,
    } =
      await supabase.functions.invoke(
        "evaluate-answer",
        {
          body: {
            question,
            answer,

            role:
              selectedRole,

            interviewType:
              selectedInterviewType,

            difficulty:
              selectedDifficulty,

            previousQuestions:
              answers.map(
                (item) =>
                  item.question
              ),
          },
        }
      );

    if (error) {
      throw new Error(
        error.message
      );
    }

    if (!data?.success) {
      throw new Error(
        data?.details ||
        data?.error ||
        "AI evaluation failed."
      );
    }

    return data.evaluation;
  }

  /* =====================================================
     SUBMIT ANSWER
  ===================================================== */

  async function submitAnswer() {
    stopListening();

    const answer =
      transcriptRef.current.trim();

    if (!answer) {
      setError(
        "Please provide an answer first."
      );

      return;
    }

    setIsEvaluating(true);

    setError("");

    const question =
      isFollowUp
        ? followUpQuestion
        : interviewQuestions[
            currentQuestion
          ]?.question;

    try {
      const evaluation =
        await evaluateWithAI({
          question,
          answer,
        });

      const record = {
        question,
        answer,
        evaluation,
        isFollowUp,
      };

      setAnswers(
        (previous) => [
          ...previous,
          record,
        ]
      );

      if (
        evaluation?.shouldAskFollowUp &&
        evaluation?.followUpQuestion &&
        !isFollowUp
      ) {
        setFollowUpQuestion(
          evaluation.followUpQuestion
        );

        setIsFollowUp(true);

        transcriptRef.current =
          "";

        setTranscript("");

        setInterimTranscript("");

        setIsEvaluating(false);

        return;
      }

      setIsFollowUp(false);

      setFollowUpQuestion("");

      transcriptRef.current =
        "";

      setTranscript("");

      setInterimTranscript("");

      if (
        currentQuestion <
        interviewQuestions.length - 1
      ) {
        setCurrentQuestion(
          (value) =>
            value + 1
        );
      } else {
        await finishInterview([
          ...answers,
          record,
        ]);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Evaluation failed."
      );
    } finally {
      setIsEvaluating(false);
    }
  }

  /* =====================================================
     SAVE INTERVIEW
  ===================================================== */

  async function finishInterview(
    finalAnswers
  ) {
    if (!session?.user?.id) {
      setScreen("complete");
      return;
    }

    const evaluated =
      finalAnswers.filter(
        (item) =>
          item.evaluation
      );

    const scores =
      evaluated.map(
        (item) =>
          Number(
            item.evaluation
              ?.overallScore
          ) || 0
      );

    const overall =
      scores.length
        ? Math.round(
            (
              scores.reduce(
                (a, b) =>
                  a + b,
                0
              ) /
              scores.length
            ) * 100
          ) / 100
        : null;

    const {
      data: sessionData,
      error: sessionError,
    } =
      await supabase
        .from(
          "interview_sessions"
        )
        .insert({
          user_id:
            session.user.id,

          role:
            selectedRole,

          interview_type:
            selectedInterviewType,

          difficulty:
            selectedDifficulty,

          question_count:
            interviewQuestions.length,

          overall_score:
            overall,

          completed_at:
            new Date().toISOString(),
        })
        .select()
        .single();

    if (sessionError) {
      console.error(
        "Session save error:",
        sessionError
      );

      setScreen("complete");

      return;
    }

    const answerRows =
      evaluated.map(
        (item) => ({
          session_id:
            sessionData.id,

          user_id:
            session.user.id,

          question:
            item.question,

          answer:
            item.answer,

          relevance:
            item.evaluation
              ?.relevance ??
            null,

          communication:
            item.evaluation
              ?.communication ??
            null,

          clarity:
            item.evaluation
              ?.clarity ??
            null,

          structure:
            item.evaluation
              ?.structure ??
            null,

          role_knowledge:
            item.evaluation
              ?.roleKnowledge ??
            null,

          problem_solving:
            item.evaluation
              ?.problemSolving ??
            null,

          overall_score:
            item.evaluation
              ?.overallScore ??
            null,

          strengths:
            item.evaluation
              ?.strengths ||
            [],

          weaknesses:
            item.evaluation
              ?.weaknesses ||
            [],

          improvement:
            item.evaluation
              ?.improvement ||
            "",

          example_better_answer:
            item.evaluation
              ?.exampleBetterAnswer ||
            "",

          is_follow_up:
            item.isFollowUp ||
            false,
        })
      );

    if (answerRows.length) {
      const {
        error: answerError,
      } =
        await supabase
          .from(
            "interview_answers"
          )
          .insert(
            answerRows
          );

      if (answerError) {
        console.error(
          "Answer save error:",
          answerError
        );
      }
    }

    await loadHistory();

    setScreen("complete");
  }

  /* =====================================================
     END INTERVIEW
  ===================================================== */

  async function endInterview() {
    if (isEvaluating) {
      return;
    }

    stopListening();

    const confirmed =
      window.confirm(
        "Are you sure you want to end the interview? Only answers you have submitted will be evaluated."
      );

    if (!confirmed) {
      return;
    }

    setError("");

    await finishInterview(
      answers
    );
  }

  /* =====================================================
     OVERALL SCORE
  ===================================================== */

  const completedAnswers =
    answers.filter(
      (item) =>
        item.evaluation
    );

  const overallScore =
    completedAnswers.length
      ? Math.round(
          (
            completedAnswers.reduce(
              (sum, item) =>
                sum +
                (
                  Number(
                    item.evaluation
                      ?.overallScore
                  ) || 0
                ),
              0
            ) /
            completedAnswers.length
          ) * 10
        ) / 10
      : null;

  /* =====================================================
     AUTH LOADING
  ===================================================== */

  if (authLoading) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          Loading...
        </div>
      </main>
    );
  }

  /* =====================================================
     AUTH SCREEN
  ===================================================== */

  if (!session) {
    return (
      <main className="auth-page">
        <div className="auth-card">

          <div className="ai-logo">
            <span>AI</span>
          </div>

          <h1>
            AI Interview Coach
          </h1>

          <p className="subtitle">
            {authMode === "login"
              ? "Sign in to continue"
              : "Create your account"}
          </p>

          <form
            onSubmit={handleAuth}
          >

            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            {authError && (
              <div className="error-message">
                {authError}
              </div>
            )}

            {authMessage && (
              <div className="success-message">
                {authMessage}
              </div>
            )}

            <button
              className="start-button"
              type="submit"
            >
              {authMode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>

          </form>

          <button
            className="text-button"
            onClick={() => {
              setAuthMode(
                authMode === "login"
                  ? "signup"
                  : "login"
              );

              setAuthError("");

              setAuthMessage("");
            }}
          >
            {authMode === "login"
              ? "Create a new account"
              : "Already have an account? Sign in"}
          </button>

        </div>
      </main>
    );
  }

  /* =====================================================
     DASHBOARD
  ===================================================== */

  if (screen === "dashboard") {
    const completedHistory =
      history.filter(
        (item) =>
          item.overall_score !==
          null
      );

    const averageScore =
      completedHistory.length
        ? Math.round(
            (
              completedHistory.reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.overall_score
                  ),
                0
              ) /
              completedHistory.length
            ) * 10
          ) / 10
        : 0;

    const bestScore =
      completedHistory.length
        ? Math.max(
            ...completedHistory.map(
              (item) =>
                Number(
                  item.overall_score
                )
            )
          )
        : 0;

    return (
      <main className="dashboard-page">

        <header className="dashboard-header">

          <div>

            <p className="eyebrow">
              AI INTERVIEW COACH
            </p>

            <h1>
              Welcome back 👋
            </h1>

            <p>
              {session.user.email}
            </p>

          </div>

          <button
            className="secondary-button"
            onClick={logout}
          >
            Logout
          </button>

        </header>

        <button
          className="start-button dashboard-start"
          onClick={openSetup}
        >
          + Start New Interview
        </button>

        <div className="dashboard-stats">

          <div className="stat-card">

            <span>
              Interviews
            </span>

            <strong>
              {history.length}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Average Score
            </span>

            <strong>
              {averageScore
                ? `${averageScore}/10`
                : "—"}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Best Score
            </span>

            <strong>
              {bestScore
                ? `${bestScore}/10`
                : "—"}
            </strong>

          </div>

        </div>

        <section className="dashboard-section">

          <h2>
            Recent Interviews
          </h2>

          {historyLoading ? (
            <p>
              Loading history...
            </p>
          ) : history.length === 0 ? (

            <div className="empty-state">

              <h3>
                No interviews yet
              </h3>

              <p>
                Complete your first
                interview to see your
                performance here.
              </p>

            </div>

          ) : (

            <div className="history-list">

              {history.map(
                (item) => (

                  <div
                    className="history-card"
                    key={item.id}
                  >

                    <div>

                      <h3>
                        {item.role}
                      </h3>

                      <p>
                        {item.interview_type}
                        {" • "}
                        {item.difficulty}
                      </p>

                      <small>
                        {new Date(
                          item.created_at
                        ).toLocaleDateString()}
                      </small>

                    </div>

                    <strong>
                      {item.overall_score !==
                      null
                        ? `${item.overall_score}/10`
                        : "—"}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>
    );
  }

  /* =====================================================
     SETUP
  ===================================================== */

  if (screen === "setup") {
    return (
      <main className="setup-page">

        <div className="setup-card">

          <div className="ai-logo">
            <span>AI</span>
          </div>

          <h1>
            Interview Setup
          </h1>

          <p className="subtitle">
            Choose your interview
            preferences.
          </p>

          {datasetLoading ? (

            <p>
              Loading dataset...
            </p>

          ) : datasetError ? (

            <div className="error-message">
              {datasetError}
            </div>

          ) : (

            <>

              <div className="setup-field">

                <label>
                  Target Role
                </label>

                <select
                  value={selectedRole}
                  onChange={(e) => {

                    const role =
                      e.target.value;

                    setSelectedRole(
                      role
                    );

                    const rows =
                      dataset.filter(
                        (row) =>
                          getRole(row) ===
                          role
                      );

                    setSelectedDifficulty(
                      normalizeDifficulty(
                        getDifficulty(
                          rows[0]
                        )
                      )
                    );

                    setSelectedInterviewType(
                      "All"
                    );

                  }}
                >

                  {roles.map(
                    (role) => (
                      <option
                        key={role}
                        value={role}
                      >
                        {role}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="setup-field">

                <label>
                  Difficulty
                </label>

                <select
                  value={
                    selectedDifficulty
                  }
                  onChange={(e) =>
                    setSelectedDifficulty(
                      e.target.value
                    )
                  }
                >

                  {difficulties.map(
                    (difficulty) => (
                      <option
                        key={difficulty}
                        value={difficulty}
                      >
                        {difficulty}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="setup-field">

                <label>
                  Interview Type
                </label>

                <select
                  value={
                    selectedInterviewType
                  }
                  onChange={(e) =>
                    setSelectedInterviewType(
                      e.target.value
                    )
                  }
                >

                  <option value="All">
                    All
                  </option>

                  {interviewTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="setup-field">

                <label>
                  Number of Questions
                </label>

                <select
                  value={
                    selectedQuestionCount
                  }
                  onChange={(e) =>
                    setSelectedQuestionCount(
                      Number(
                        e.target.value
                      )
                    )
                  }
                >

                  {QUESTION_COUNTS.map(
                    (count) => (
                      <option
                        key={count}
                        value={count}
                      >
                        {count} Questions
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="dataset-match-info">

                <strong>
                  {
                    filteredQuestionPool.length
                  }
                </strong>{" "}
                matching dataset
                questions

              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="setup-actions">

                <button
                  className="secondary-button"
                  onClick={() =>
                    setScreen(
                      "dashboard"
                    )
                  }
                >
                  Back
                </button>

                <button
                  className="start-button"
                  disabled={
                    !filteredQuestionPool.length
                  }
                  onClick={
                    startInterview
                  }
                >
                  Start Interview
                </button>

              </div>

            </>

          )}

        </div>

      </main>
    );
  }

  /* =====================================================
     INTERVIEW
  ===================================================== */

  if (screen === "interview") {

    const current =
      interviewQuestions[
        currentQuestion
      ];

    const question =
      isFollowUp
        ? followUpQuestion
        : current?.question;

    const displayedAnswer =
      transcript +
      (
        interimTranscript
          ? ` ${interimTranscript}`
          : ""
      );

    return (
      <main className="interview-page">

        <div className="interview-top">

          <span>
            {isFollowUp
              ? "Follow-up Question"
              : `Question ${
                  currentQuestion + 1
                } of ${
                  interviewQuestions.length
                }`}
          </span>

          {/* UPDATED END INTERVIEW BUTTON */}

          <button
            className="end-interview"
            onClick={endInterview}
            disabled={isEvaluating}
          >
            End Interview
          </button>

        </div>

        <div className="progress-container">

          <div
            className="progress-bar"
            style={{
              width: `${
                (
                  (currentQuestion + 1) /
                  interviewQuestions.length
                ) * 100
              }%`,
            }}
          />

        </div>

        <div className="interview-content">

          <div className="interview-ai-logo">
            <span>AI</span>
          </div>

          <p className="interviewer-label">
            AI Interviewer
          </p>

          <div className="interview-context">

            <span>
              {selectedRole}
            </span>

            <span>
              {selectedDifficulty}
            </span>

          </div>

          <h1>
            {question}
          </h1>

          {isFollowUp && (
            <p>
              Follow-up based on your
              previous answer
            </p>
          )}

          <button
            className={`mic-button ${
              isListening
                ? "recording"
                : ""
            }`}
            onClick={() =>
              isListening
                ? stopListening()
                : startListening()
            }
            disabled={
              isEvaluating
            }
          >
            🎙️
          </button>

          <p className="status-text">
            {isListening
              ? "Listening..."
              : "Click the microphone and start speaking"}
          </p>

          <textarea
            className="answer-box"
            value={
              displayedAnswer
            }
            onChange={(e) => {

              const value =
                e.target.value;

              transcriptRef.current =
                value;

              setTranscript(
                value
              );

              setInterimTranscript(
                ""
              );

            }}
            placeholder="Your answer will appear here..."
            disabled={
              isEvaluating
            }
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isEvaluating && (
            <div className="ai-loading">
              Analyzing your answer...
            </div>
          )}

          <div className="interview-actions">

            <button
              className="secondary-button"
              onClick={() => {

                transcriptRef.current =
                  "";

                setTranscript("");

                setInterimTranscript(
                  ""
                );

              }}
            >
              Clear
            </button>

            <button
              className="start-button"
              onClick={
                submitAnswer
              }
              disabled={
                isEvaluating ||
                !transcriptRef.current.trim()
              }
            >
              {isFollowUp
                ? "Submit Follow-up"
                : "Submit Answer"}
            </button>

          </div>

        </div>

      </main>
    );
  }

  /* =====================================================
     COMPLETE
  ===================================================== */

 /* =====================================================
   COMPLETE / DETAILED REVIEW
===================================================== */

if (screen === "complete") {
  return (
    <main className="complete-page">

      <div className="complete-icon">
        ✓
      </div>

      <h1>
        Interview Complete!
      </h1>

      <p className="subtitle">
        Your interview has been saved to your dashboard.
      </p>

      {/* ================================
          OVERALL SUMMARY
      ================================= */}

      <div className="summary-card">

        <h2>
          Interview Summary
        </h2>

        <p>
          <strong>Role:</strong>{" "}
          {selectedRole}
        </p>

        <p>
          <strong>Difficulty:</strong>{" "}
          {selectedDifficulty}
        </p>

        <p>
          <strong>Questions Answered:</strong>{" "}
          {completedAnswers.length}
        </p>

        <p className="overall-score">
          <strong>Overall Score:</strong>{" "}
          {overallScore !== null
            ? `${overallScore}/10`
            : "—"}
        </p>

      </div>


      {/* ================================
          DETAILED PERFORMANCE REVIEW
      ================================= */}

      <section className="review-section">

        <h2>
          Detailed Performance Review
        </h2>

        {completedAnswers.length === 0 ? (

          <div className="empty-state">
            <h3>
              No answers were submitted
            </h3>

            <p>
              There is no detailed evaluation
              available for this interview.
            </p>
          </div>

        ) : (

          <div className="review-list">

            {completedAnswers.map(
              (item, index) => {

                const evaluation =
                  item.evaluation || {};

                return (
                  <div
                    className="review-card"
                    key={`${item.question}-${index}`}
                  >

                    {/* ================================
                        QUESTION HEADER
                    ================================= */}

                    <div className="review-question-header">

                      <div>

                        <span className="review-question-number">
                          Question {index + 1}
                        </span>

                        <h3>
                          {item.question}
                        </h3>

                      </div>

                      <div className="question-score">

                        <strong>
                          {evaluation.overallScore ??
                            "—"}
                        </strong>

                        <span>
                          /10
                        </span>

                      </div>

                    </div>


                    {/* ================================
                        CANDIDATE ANSWER
                    ================================= */}

                    <div className="review-block">

                      <h4>
                        Your Answer
                      </h4>

                      <p>
                        {item.answer}
                      </p>

                    </div>


                    {/* ================================
                        SCORE BREAKDOWN
                    ================================= */}

                    <div className="review-block">

                      <h4>
                        Score Breakdown
                      </h4>

                      <div className="score-grid">

                        <div className="score-item">
                          <span>
                            Relevance
                          </span>

                          <strong>
                            {evaluation.relevance ?? "—"}
                            /10
                          </strong>
                        </div>

                        <div className="score-item">
                          <span>
                            Communication
                          </span>

                          <strong>
                            {evaluation.communication ?? "—"}
                            /10
                          </strong>
                        </div>

                        <div className="score-item">
                          <span>
                            Clarity
                          </span>

                          <strong>
                            {evaluation.clarity ?? "—"}
                            /10
                          </strong>
                        </div>

                        <div className="score-item">
                          <span>
                            Structure
                          </span>

                          <strong>
                            {evaluation.structure ?? "—"}
                            /10
                          </strong>
                        </div>

                        <div className="score-item">
                          <span>
                            Role Knowledge
                          </span>

                          <strong>
                            {evaluation.roleKnowledge ?? "—"}
                            /10
                          </strong>
                        </div>

                        <div className="score-item">
                          <span>
                            Problem Solving
                          </span>

                          <strong>
                            {evaluation.problemSolving ?? "—"}
                            /10
                          </strong>
                        </div>

                      </div>

                    </div>


                    {/* ================================
                        STRENGTHS
                    ================================= */}

                    <div className="review-block">

                      <h4>
                        What You Did Well
                      </h4>

                      {Array.isArray(
                        evaluation.strengths
                      ) &&
                      evaluation.strengths.length > 0 ? (

                        <ul>
                          {evaluation.strengths.map(
                            (strength, strengthIndex) => (
                              <li
                                key={strengthIndex}
                              >
                                {strength}
                              </li>
                            )
                          )}
                        </ul>

                      ) : (

                        <p>
                          No strengths were provided.
                        </p>

                      )}

                    </div>


                    {/* ================================
                        WEAKNESSES
                    ================================= */}

                    <div className="review-block">

                      <h4>
                        Areas to Improve
                      </h4>

                      {Array.isArray(
                        evaluation.weaknesses
                      ) &&
                      evaluation.weaknesses.length > 0 ? (

                        <ul>
                          {evaluation.weaknesses.map(
                            (weakness, weaknessIndex) => (
                              <li
                                key={weaknessIndex}
                              >
                                {weakness}
                              </li>
                            )
                          )}
                        </ul>

                      ) : (

                        <p>
                          No major weaknesses were provided.
                        </p>

                      )}

                    </div>


                    {/* ================================
                        IMPROVEMENT
                    ================================= */}

                    {evaluation.improvement && (
                      <div className="review-block">

                        <h4>
                          How You Can Improve
                        </h4>

                        <p>
                          {evaluation.improvement}
                        </p>

                      </div>
                    )}


                    {/* ================================
                        BETTER ANSWER
                    ================================= */}

                    {evaluation.exampleBetterAnswer && (
                      <div className="review-block better-answer">

                        <h4>
                          Example of a Better Answer
                        </h4>

                        <p>
                          {evaluation.exampleBetterAnswer}
                        </p>

                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>


      {/* ================================
          ACTIONS
      ================================= */}

      <div className="complete-actions">

        <button
          className="start-button"
          onClick={() =>
            setScreen("dashboard")
          }
        >
          Back to Dashboard
        </button>

        <button
          className="text-button"
          onClick={openSetup}
        >
          Practice Again
        </button>

      </div>

    </main>
  );
}
  return null;
}

export default App;