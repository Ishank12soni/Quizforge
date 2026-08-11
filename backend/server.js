const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());


// =========================================================
// QUIZ TOPIC INFORMATION
// =========================================================

const quizTopics = {
  1: "IoT Fundamentals",
  2: "Sensors & Actuators",
  3: "Communication Protocols",
  4: "Industrial Automation",
  5: "Cloud & Edge Computing",
  6: "IoT Security",
};


// =========================================================
// HELPER: EXPLANATIONS
// =========================================================

function getExplanation(question) {
  const text = question.question.toLowerCase();

  if (text.includes("primary function of a sensor")) {
    return "A sensor detects or measures a physical condition such as temperature, pressure, motion, or light and converts it into usable data.";
  }

  if (text.includes("temperature")) {
    return "A temperature sensor measures the temperature of its surrounding environment and sends that measurement to an IoT system.";
  }

  if (text.includes("what does an actuator")) {
    return "An actuator performs a physical action based on a control signal. Motors, valves, and relays are common examples.";
  }

  if (text.includes("actuator")) {
    return "Actuators convert control signals into physical actions, allowing an IoT system to interact with the real world.";
  }

  if (text.includes("mqtt")) {
    return "MQTT is a lightweight messaging protocol widely used in IoT. It uses a publish-subscribe communication model.";
  }

  if (text.includes("publish and subscribe")) {
    return "MQTT uses a publish-subscribe model. Devices publish messages to topics and subscribers receive messages from those topics.";
  }

  if (text.includes("coap")) {
    return "CoAP is a lightweight application protocol designed for constrained devices and networks commonly found in IoT systems.";
  }

  if (text.includes("web communication")) {
    return "HTTP is the standard protocol used for communication between web browsers and web servers and is also commonly used by IoT applications.";
  }

  if (text.includes("communication protocol")) {
    return "IoT communication protocols define how connected devices exchange data reliably and efficiently.";
  }

  if (text.includes("plc")) {
    return "A PLC, or Programmable Logic Controller, is an industrial computer used to control machines and automated processes.";
  }

  if (text.includes("scada")) {
    return "SCADA stands for Supervisory Control and Data Acquisition. It is used to monitor and control industrial processes.";
  }

  if (text.includes("smart factory")) {
    return "A smart factory uses connected sensors, automation, data analytics, and IoT technologies to improve industrial operations.";
  }

  if (text.includes("automate industrial machines")) {
    return "PLCs are commonly used to control industrial machines and automate manufacturing processes.";
  }

  if (text.includes("benefit of industrial iot")) {
    return "Industrial IoT can improve efficiency, monitoring, predictive maintenance, safety, and production performance.";
  }

  if (text.includes("edge computing")) {
    return "Edge computing processes data close to where it is generated instead of sending everything to a remote cloud server.";
  }

  if (text.includes("reduced latency")) {
    return "Processing data near the device reduces the distance data must travel, which can significantly reduce response time.";
  }

  if (text.includes("remote data centers")) {
    return "Cloud computing typically uses remote data centers that provide computing power, storage, databases, and other services over a network.";
  }

  if (text.includes("cloud computing useful")) {
    return "Cloud platforms provide scalable storage and processing resources that are useful for handling large amounts of IoT data.";
  }

  if (text.includes("processes data near")) {
    return "Edge computing processes data close to the source device, which helps reduce latency and network traffic.";
  }

  if (text.includes("why is security important")) {
    return "IoT security protects connected devices, networks, and data from unauthorized access, attacks, and misuse.";
  }

  if (text.includes("encryption")) {
    return "Encryption transforms readable data into protected data so unauthorized people cannot easily understand it.";
  }

  if (text.includes("authentication")) {
    return "Authentication verifies the identity of a user or device before allowing access to a system or resource.";
  }

  if (text.includes("good iot security practice")) {
    return "Strong passwords, secure authentication, regular firmware updates, encryption, and network protection are important IoT security practices.";
  }

  if (text.includes("weak security")) {
    return "Weak security can allow attackers to gain unauthorized access to IoT devices, networks, or sensitive data.";
  }

  if (text.includes("core concepts")) {
    return "IoT connects physical devices, sensors, networks, software, and data systems so they can collect and exchange information.";
  }

  return "This answer represents an important concept in Industrial IoT. Understanding it helps explain how connected industrial systems collect data, communicate, process information, and control physical processes.";
}


// =========================================================
// HOME
// =========================================================

app.get("/", (req, res) => {
  res.json({
    message: "Quizforge backend is running",
  });
});


// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    project: "Quizforge",
  });
});


// =========================================================
// GET QUIZ QUESTIONS
// =========================================================

app.get("/api/quiz", async (req, res) => {
  try {
    const quizId = Number(req.query.quizId) || 1;

    if (!Number.isInteger(quizId) || quizId < 1) {
      return res.status(400).json({
        message: "Invalid quizId",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        question,
        options
      FROM questions
      WHERE quiz_id = $1
      ORDER BY id
      `,
      [quizId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Quiz not found or has no questions",
      });
    }

    res.json(result.rows);

  } catch (error) {
    console.error("Error fetching quiz:", error);

    res.status(500).json({
      message: "Failed to fetch quiz questions",
    });
  }
});


// =========================================================
// SUBMIT QUIZ + REVIEW + SAVE HISTORY
// =========================================================

app.post("/api/quiz/submit", async (req, res) => {
  try {

    const quizId = Number(req.query.quizId) || 1;
    const { answers } = req.body;


    // -------------------------------------------------------
    // VALIDATE QUIZ ID
    // -------------------------------------------------------

    if (!Number.isInteger(quizId) || quizId < 1) {
      return res.status(400).json({
        message: "Invalid quizId",
      });
    }


    // -------------------------------------------------------
    // VALIDATE ANSWERS
    // -------------------------------------------------------

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers must be an array",
      });
    }


    // -------------------------------------------------------
    // GET QUESTIONS
    // -------------------------------------------------------

    const result = await pool.query(
      `
      SELECT
        id,
        question,
        options,
        correct_answer
      FROM questions
      WHERE quiz_id = $1
      ORDER BY id
      `,
      [quizId]
    );

    const questions = result.rows;


    if (questions.length === 0) {
      return res.status(404).json({
        message: "Quiz not found or has no questions",
      });
    }


    // -------------------------------------------------------
    // CALCULATE SCORE
    // -------------------------------------------------------

    let score = 0;


    const review = questions.map((question) => {

      const userAnswer =
        answers.find(
          (answer) =>
            Number(answer.questionId) === question.id
        )?.selectedAnswer || "";


      const correctAnswer =
        question.options[question.correct_answer];


      const isCorrect =
        userAnswer === correctAnswer;


      if (isCorrect) {
        score++;
      }


      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer,
        isCorrect,
        explanation: getExplanation(question),
      };

    });


    // -------------------------------------------------------
    // RESULT
    // -------------------------------------------------------

    const total = questions.length;


    const percentage =
      total > 0
        ? Math.round((score / total) * 100)
        : 0;


    // =======================================================
    // SAVE QUIZ ATTEMPT
    // =======================================================

    try {

      await pool.query(
        `
        INSERT INTO quiz_attempts
        (
          quiz_id,
          score,
          total_questions,
          percentage
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
          quizId,
          score,
          total,
          percentage,
        ]
      );

      console.log(
        `Quiz attempt saved: Quiz ${quizId} | ${score}/${total} | ${percentage}%`
      );

    } catch (historyError) {

      console.error(
        "Warning: Could not save quiz history:",
        historyError
      );

    }


    // -------------------------------------------------------
    // SEND RESULT TO FRONTEND
    // -------------------------------------------------------

    res.json({
      score,
      total,
      percentage,
      review,
      message: "Quiz submitted successfully",
    });


  } catch (error) {

    console.error(
      "Error submitting quiz:",
      error
    );

    res.status(500).json({
      message: "Failed to submit quiz",
    });

  }
});


// =========================================================
// GET QUIZ HISTORY
// =========================================================
//
// This endpoint reads all saved quiz attempts from
// PostgreSQL. The frontend will use this later for the
// Performance Dashboard.
//

app.get("/api/quiz/history", async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT
        id,
        quiz_id,
        score,
        total_questions,
        percentage,
        attempted_at
      FROM quiz_attempts
      ORDER BY attempted_at DESC
      `
    );


    // Add topic name for frontend
    const history = result.rows.map((attempt) => ({
      id: attempt.id,
      quiz_id: attempt.quiz_id,
      topic:
        quizTopics[attempt.quiz_id] ||
        `Quiz ${attempt.quiz_id}`,
      score: attempt.score,
      total_questions: attempt.total_questions,
      percentage: attempt.percentage,
      attempted_at: attempt.attempted_at,
    }));


    res.json(history);

  } catch (error) {

    console.error(
      "Error fetching quiz history:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch quiz history",
    });

  }

});


// =========================================================
// GET QUIZ PERFORMANCE SUMMARY
// =========================================================
//
// This endpoint calculates overall performance from the
// saved quiz attempts.
//
// It will be used by the future Performance Dashboard.
//

app.get("/api/quiz/performance", async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT
        COUNT(*) AS total_attempts,
        COALESCE(
          ROUND(AVG(percentage)),
          0
        ) AS average_score,
        COALESCE(
          MAX(percentage),
          0
        ) AS best_score,
        COALESCE(
          SUM(score),
          0
        ) AS total_correct,
        COALESCE(
          SUM(total_questions),
          0
        ) AS total_questions
      FROM quiz_attempts
      `
    );


    const data = result.rows[0];


    res.json({
      totalAttempts:
        Number(data.total_attempts),

      averageScore:
        Number(data.average_score),

      bestScore:
        Number(data.best_score),

      totalCorrect:
        Number(data.total_correct),

      totalQuestions:
        Number(data.total_questions),
    });

  } catch (error) {

    console.error(
      "Error fetching performance:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch performance",
    });

  }

});


// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {

  console.log(
    `Quizforge backend running on http://localhost:${PORT}`
  );

});