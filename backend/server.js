const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Quizforge backend is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    project: "Quizforge",
  });
});

// Get all quiz questions
app.get("/api/quiz", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, question, options
      FROM questions
      WHERE quiz_id = 1
      ORDER BY id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching quiz:", error);

    res.status(500).json({
      message: "Failed to fetch quiz questions",
    });
  }
});

// Submit quiz answers
app.post("/api/quiz/submit", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers must be an array"
      });
    }

    const result = await pool.query(`
      SELECT id, options, correct_answer
      FROM questions
      WHERE quiz_id = 1
      ORDER BY id
    `);

    const questions = result.rows;

    let score = 0;

    answers.forEach((answer) => {
      const question = questions.find(
        (q) => q.id === answer.questionId
      );

      if (
        question &&
        answer.selectedAnswer ===
          question.options[question.correct_answer]
      ) {
        score++;
      }
    });

    res.json({
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      message: "Quiz submitted successfully"
    });

  } catch (error) {
    console.error("Error submitting quiz:", error);

    res.status(500).json({
      message: "Failed to submit quiz"
    });
  }
});
app.listen(PORT, () => {
  console.log(
    `Quizforge backend running on http://localhost:${PORT}`
  );
});
