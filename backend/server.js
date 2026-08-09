const express = require("express");
const cors = require("cors");

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

// Quiz questions
const questions = [
  {
    id: 1,
    question: "What does IoT stand for?",
    options: [
      "Internet of Things",
      "Integration of Technology",
      "Internet of Technology",
      "Interface of Things",
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "Which device is commonly used to collect data in an IoT system?",
    options: [
      "Sensor",
      "Monitor",
      "Keyboard",
      "Printer",
    ],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: "Which protocol is commonly used in IoT communication?",
    options: [
      "MQTT",
      "HTML",
      "CSS",
      "JPEG",
    ],
    correctAnswer: 0,
  },
  {
    id: 4,
    question: "What is the main purpose of an actuator?",
    options: [
      "Store data",
      "Perform a physical action",
      "Display a webpage",
      "Create passwords",
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "Which technology can process IoT data close to the device?",
    options: [
      "Edge Computing",
      "Word Processing",
      "Email",
      "Bluetooth Keyboard",
    ],
    correctAnswer: 0,
  },
];

// Get all quiz questions
app.get("/api/quiz", (req, res) => {
  const quiz = questions.map(({ correctAnswer, ...question }) => question);

  res.json(quiz);
});

// Submit quiz answers
app.post("/api/quiz/submit", (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({
      message: "Answers must be an array",
    });
  }

  let score = 0;

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);

    if (
  question &&
  answer.selectedAnswer === question.options[question.correctAnswer]
) {
      score++;
    }
  });

  res.json({
    score,
    total: questions.length,
    percentage: Math.round((score / questions.length) * 100),
    message: "Quiz submitted successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Quizforge backend running on http://localhost:${PORT}`);
});