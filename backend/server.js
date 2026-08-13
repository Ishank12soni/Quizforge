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
// HELPER: NORMALIZE OPTIONS
// =========================================================

function normalizeOptions(options) {

  if (Array.isArray(options)) {
    return options;
  }

  if (typeof options === "string") {

    try {

      const parsed = JSON.parse(options);

      if (Array.isArray(parsed)) {
        return parsed;
      }

    } catch (error) {
      // Ignore invalid JSON
    }

  }

  return [];
}


// =========================================================
// HELPER: QUIZ EXPLANATIONS
// =========================================================

function getExplanation(question) {

  const text =
    String(question.question || "").toLowerCase();


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
// STUDENT — CREATE OR GET STUDENT
// =========================================================
// POST /api/students
//
// Body:
//
// {
//   "name": "Ishank Verma"
// }
// =========================================================

app.post("/api/students", async (req, res) => {

  try {

    const { name } = req.body;


    // -------------------------------------------------------
    // VALIDATE NAME
    // -------------------------------------------------------

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {

      return res.status(400).json({
        message: "Student name is required",
      });

    }


    const studentName =
      name.trim();


    // -------------------------------------------------------
    // CHECK EXISTING STUDENT
    // -------------------------------------------------------

    const existingStudent =
      await pool.query(
        `
        SELECT
          id,
          name,
          created_at
        FROM students
        WHERE LOWER(name) = LOWER($1)
        LIMIT 1
        `,
        [studentName]
      );


    // -------------------------------------------------------
    // EXISTING STUDENT
    // -------------------------------------------------------

    if (
      existingStudent.rows.length > 0
    ) {

      const student =
        existingStudent.rows[0];


      return res.json({

        message:
          "Student found",

        studentId:
          Number(student.id),

        studentName:
          student.name,

        created_at:
          student.created_at,

      });

    }


    // -------------------------------------------------------
    // CREATE STUDENT
    // -------------------------------------------------------

    const result =
      await pool.query(
        `
        INSERT INTO students
        (
          name
        )
        VALUES
        (
          $1
        )
        RETURNING
          id,
          name,
          created_at
        `,
        [studentName]
      );


    const student =
      result.rows[0];


    console.log(
      `New student created: ${student.name} | ID: ${student.id}`
    );


    return res.status(201).json({

      message:
        "Student created successfully",

      studentId:
        Number(student.id),

      studentName:
        student.name,

      created_at:
        student.created_at,

    });


  } catch (error) {

    console.error(
      "Error creating/finding student:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to create student",

    });

  }

});


// =========================================================
// GET QUIZ QUESTIONS
// =========================================================

app.get("/api/quiz", async (req, res) => {

  try {

    const quizId =
      Number(req.query.quizId) || 1;


    if (
      !Number.isInteger(quizId) ||
      quizId < 1
    ) {

      return res.status(400).json({
        message: "Invalid quizId",
      });

    }


    const result =
      await pool.query(
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


    if (
      result.rows.length === 0
    ) {

      return res.status(404).json({
        message:
          "Quiz not found or has no questions",
      });

    }


    const questions =
      result.rows.map(
        (question) => ({

          ...question,

          options:
            normalizeOptions(
              question.options
            ),

        })
      );


    return res.json(
      questions
    );


  } catch (error) {

    console.error(
      "Error fetching quiz:",
      error
    );


    return res.status(500).json({
      message:
        "Failed to fetch quiz questions",
    });

  }

});


// =========================================================
// SUBMIT QUIZ
// =========================================================

app.post("/api/quiz/submit", async (req, res) => {

  try {

    const quizId =
      Number(req.query.quizId) || 1;


    const {
      answers,
      studentId,
      student_id,
    } = req.body;


    // -------------------------------------------------------
    // STUDENT ID
    // -------------------------------------------------------

    const finalStudentId =
      Number(
        studentId ||
        student_id ||
        0
      );


    // -------------------------------------------------------
    // VALIDATE QUIZ
    // -------------------------------------------------------

    if (
      !Number.isInteger(quizId) ||
      quizId < 1
    ) {

      return res.status(400).json({
        message:
          "Invalid quizId",
      });

    }


    // -------------------------------------------------------
    // VALIDATE STUDENT
    // -------------------------------------------------------

    if (
      !Number.isInteger(
        finalStudentId
      ) ||
      finalStudentId < 1
    ) {

      return res.status(400).json({
        message:
          "Valid studentId is required",
      });

    }


    // -------------------------------------------------------
    // VALIDATE ANSWERS
    // -------------------------------------------------------

    if (
      !Array.isArray(answers)
    ) {

      return res.status(400).json({
        message:
          "Answers must be an array",
      });

    }


    // -------------------------------------------------------
    // CHECK STUDENT
    // -------------------------------------------------------

    const studentResult =
      await pool.query(
        `
        SELECT
          id,
          name
        FROM students
        WHERE id = $1
        `,
        [finalStudentId]
      );


    if (
      studentResult.rows.length === 0
    ) {

      return res.status(404).json({
        message:
          "Student not found",
      });

    }


    const student =
      studentResult.rows[0];


    // -------------------------------------------------------
    // GET QUESTIONS
    // -------------------------------------------------------

    const result =
      await pool.query(
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


    const questions =
      result.rows;


    if (
      questions.length === 0
    ) {

      return res.status(404).json({
        message:
          "Quiz not found or has no questions",
      });

    }


    // -------------------------------------------------------
    // CALCULATE SCORE
    // -------------------------------------------------------

    let score = 0;


    const review =
      questions.map(
        (question) => {

          const options =
            normalizeOptions(
              question.options
            );


          const answer =
            answers.find(
              (item) =>
                Number(
                  item.questionId
                ) === question.id
            );


          const userAnswer =
            answer?.selectedAnswer ||
            "";


          const correctAnswer =
            options[
              Number(
                question.correct_answer
              )
            ];


          const isCorrect =
            userAnswer ===
            correctAnswer;


          if (isCorrect) {
            score++;
          }


          return {

            questionId:
              question.id,

            question:
              question.question,

            userAnswer,

            correctAnswer,

            isCorrect,

            explanation:
              getExplanation(
                question
              ),

          };

        }
      );


    // -------------------------------------------------------
    // RESULT
    // -------------------------------------------------------

    const total =
      questions.length;


    const percentage =
      total > 0
        ? Math.round(
            (score / total) * 100
          )
        : 0;


    // -------------------------------------------------------
    // SAVE ATTEMPT
    // -------------------------------------------------------

    try {

      await pool.query(
        `
        INSERT INTO quiz_attempts
        (
          student_id,
          quiz_id,
          score,
          total_questions,
          percentage
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5
        )
        `,
        [
          finalStudentId,
          quizId,
          score,
          total,
          percentage,
        ]
      );


      console.log(
        `Quiz attempt saved: Student ${student.name} | Quiz ${quizId} | ${score}/${total} | ${percentage}%`
      );


    } catch (historyError) {

      console.error(
        "Could not save quiz history:",
        historyError
      );


      return res.status(500).json({
        message:
          "Failed to save quiz attempt",
      });

    }


    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    return res.json({

      studentId:
        finalStudentId,

      studentName:
        student.name,

      quizId,

      score,

      total,

      percentage,

      review,

      message:
        "Quiz submitted successfully",

    });


  } catch (error) {

    console.error(
      "Error submitting quiz:",
      error
    );


    return res.status(500).json({
      message:
        "Failed to submit quiz",
    });

  }

});


// =========================================================
// GET QUIZ HISTORY
// =========================================================
// Student:
// /api/quiz/history?studentId=1
//
// Admin:
// /api/quiz/history
// =========================================================

app.get("/api/quiz/history", async (req, res) => {

  try {

    const hasStudentId =
      req.query.studentId !== undefined;


    const studentId =
      Number(
        req.query.studentId
      );


    // -------------------------------------------------------
    // STUDENT HISTORY
    // -------------------------------------------------------

    if (hasStudentId) {

      if (
        !Number.isInteger(
          studentId
        ) ||
        studentId < 1
      ) {

        return res.status(400).json({
          message:
            "Invalid studentId",
        });

      }


      const result =
        await pool.query(
          `
          SELECT

            qa.id,

            qa.student_id,

            s.name,

            qa.quiz_id,

            q.title AS quiz_title,

            qa.score,

            qa.total_questions,

            qa.percentage,

            qa.attempted_at

          FROM quiz_attempts qa

          LEFT JOIN students s
            ON qa.student_id = s.id

          LEFT JOIN quizzes q
            ON qa.quiz_id = q.id

          WHERE qa.student_id = $1

          ORDER BY
            qa.attempted_at DESC
          `,
          [studentId]
        );


      const history =
        result.rows.map(
          (attempt) => ({

            id:
              attempt.id,

            student_id:
              attempt.student_id,

            studentName:
              attempt.name ||
              "Unknown Student",

            quiz_id:
              attempt.quiz_id,

            topic:
              attempt.quiz_title ||
              quizTopics[
                attempt.quiz_id
              ] ||
              `Quiz ${attempt.quiz_id}`,

            score:
              attempt.score,

            total_questions:
              attempt.total_questions,

            percentage:
              attempt.percentage,

            attempted_at:
              attempt.attempted_at,

          })
        );


      return res.json(
        history
      );

    }


    // -------------------------------------------------------
    // ALL HISTORY — ADMIN
    // -------------------------------------------------------

    const result =
      await pool.query(
        `
        SELECT

          qa.id,

          qa.student_id,

          s.name,

          qa.quiz_id,

          q.title AS quiz_title,

          qa.score,

          qa.total_questions,

          qa.percentage,

          qa.attempted_at

        FROM quiz_attempts qa

        LEFT JOIN students s
          ON qa.student_id = s.id

        LEFT JOIN quizzes q
          ON qa.quiz_id = q.id

        ORDER BY
          qa.attempted_at DESC
        `
      );


    const history =
      result.rows.map(
        (attempt) => ({

          id:
            attempt.id,

          student_id:
            attempt.student_id,

          studentName:
            attempt.name ||
            "Unknown Student",

          quiz_id:
            attempt.quiz_id,

          topic:
            attempt.quiz_title ||
            quizTopics[
              attempt.quiz_id
            ] ||
            `Quiz ${attempt.quiz_id}`,

          score:
            attempt.score,

          total_questions:
            attempt.total_questions,

          percentage:
            attempt.percentage,

          attempted_at:
            attempt.attempted_at,

        })
      );


    return res.json(
      history
    );


  } catch (error) {

    console.error(
      "Error fetching quiz history:",
      error
    );


    return res.status(500).json({
      message:
        "Failed to fetch quiz history",
    });

  }

});


// =========================================================
// GET QUIZ PERFORMANCE
// =========================================================
// Student:
// /api/quiz/performance?studentId=1
//
// Admin:
// /api/quiz/performance
// =========================================================

app.get("/api/quiz/performance", async (req, res) => {

  try {

    const hasStudentId =
      req.query.studentId !== undefined;


    const studentId =
      Number(
        req.query.studentId
      );


    let query = `
      SELECT

        COUNT(*) AS total_attempts,

        COALESCE(
          ROUND(
            AVG(percentage)
          ),
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
    `;


    let values = [];


    // -------------------------------------------------------
    // STUDENT FILTER
    // -------------------------------------------------------

    if (hasStudentId) {

      if (
        !Number.isInteger(
          studentId
        ) ||
        studentId < 1
      ) {

        return res.status(400).json({
          message:
            "Invalid studentId",
        });

      }


      query += `
        WHERE student_id = $1
      `;


      values = [
        studentId,
      ];

    }


    const result =
      await pool.query(
        query,
        values
      );


    const data =
      result.rows[0];


    return res.json({

      totalAttempts:
        Number(
          data.total_attempts
        ),

      averageScore:
        Number(
          data.average_score
        ),

      bestScore:
        Number(
          data.best_score
        ),

      totalCorrect:
        Number(
          data.total_correct
        ),

      totalQuestions:
        Number(
          data.total_questions
        ),

    });


  } catch (error) {

    console.error(
      "Error fetching performance:",
      error
    );


    return res.status(500).json({
      message:
        "Failed to fetch performance",
    });

  }

});


// =========================================================
// ADMIN — GET ALL STUDENT RESULTS
// =========================================================

app.get("/api/admin/results", async (req, res) => {

  try {

    const result =
      await pool.query(
        `
        SELECT

          qa.id,

          qa.student_id,

          s.name AS student_name,

          qa.quiz_id,

          q.title AS quiz_title,

          qa.score,

          qa.total_questions,

          qa.percentage,

          qa.attempted_at

        FROM quiz_attempts qa

        LEFT JOIN students s
          ON qa.student_id = s.id

        LEFT JOIN quizzes q
          ON qa.quiz_id = q.id

        ORDER BY
          qa.attempted_at DESC
        `
      );


    return res.json(
      result.rows
    );


  } catch (error) {

    console.error(
      "Error fetching admin results:",
      error
    );


    return res.status(500).json({
      message:
        "Failed to fetch student results",
    });

  }

});


// =========================================================
// ADMIN — STUDENT RANKING
// =========================================================

app.get("/api/admin/ranking", async (req, res) => {

  try {

    const result =
      await pool.query(
        `
        SELECT

          s.id AS student_id,

          s.name AS student_name,

          COUNT(qa.id) AS total_attempts,

          COALESCE(
            ROUND(
              AVG(qa.percentage)
            ),
            0
          ) AS average_score,

          COALESCE(
            MAX(qa.percentage),
            0
          ) AS best_score,

          COALESCE(
            SUM(qa.score),
            0
          ) AS total_correct,

          COALESCE(
            SUM(qa.total_questions),
            0
          ) AS total_questions

        FROM students s

        LEFT JOIN quiz_attempts qa
          ON s.id = qa.student_id

        GROUP BY
          s.id,
          s.name

        ORDER BY
          average_score DESC,
          best_score DESC,
          total_attempts DESC
        `
      );


    const ranking =
      result.rows.map(
        (student, index) => ({

          rank:
            index + 1,

          studentId:
            Number(
              student.student_id
            ),

          studentName:
            student.student_name,

          totalAttempts:
            Number(
              student.total_attempts
            ),

          averageScore:
            Number(
              student.average_score
            ),

          bestScore:
            Number(
              student.best_score
            ),

          totalCorrect:
            Number(
              student.total_correct
            ),

          totalQuestions:
            Number(
              student.total_questions
            ),

        })
      );


    return res.json(
      ranking
    );


  } catch (error) {

    console.error(
      "Error fetching student ranking:",
      error
    );


    return res.status(500).json({
      message:
        "Failed to fetch student ranking",
    });

  }

});


// =========================================================
// ADMIN — GET ALL STUDENTS
// =========================================================

app.get("/api/admin/students", async (req, res) => {

  try {

    const result =
      await pool.query(
        `
        SELECT

          id,

          name,

          created_at

        FROM students

        ORDER BY
          created_at DESC
        `
      );


    return res.json(
      result.rows
    );


  } catch (error) {

    console.error(
      "Error fetching students:",
      error
    );


    return res.status(500).json({
      message:
        "Failed to fetch students",
    });

  }

});


// =========================================================
// ADMIN — GET ALL QUIZZES
// =========================================================

app.get("/api/admin/quizzes", async (req, res) => {

  try {

    const result =
      await pool.query(
        `
        SELECT

          id,

          title,

          description,

          created_at

        FROM quizzes

        ORDER BY
          id
        `
      );


    return res.json(
      result.rows
    );


  } catch (error) {

    console.error(
      "Error fetching quizzes:",
      error
    );


    return res.status(500).json({
      message:
        "Failed to fetch quizzes",
    });

  }

});


// =========================================================
// ADMIN — CREATE QUIZ
// =========================================================
// POST /api/admin/quizzes
//
// Body:
//
// {
//   "title": "Industrial IoT Advanced Concepts",
//   "description": "Test your Industrial IoT knowledge.",
//   "questions": [
//     {
//       "question": "What does IoT stand for?",
//       "options": [
//         "Internet of Things",
//         "Internet of Technology",
//         "Input Output Technology",
//         "Integrated Online Tools"
//       ],
//       "correct_answer": 0
//     }
//   ]
// }
//
// correct_answer:
// 0 = A
// 1 = B
// 2 = C
// 3 = D
// =========================================================

app.post("/api/admin/quizzes", async (req, res) => {

  const client =
    await pool.connect();


  try {

    const {
      title,
      description,
      questions,
    } = req.body;


    // -------------------------------------------------------
    // VALIDATE TITLE
    // -------------------------------------------------------

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {

      return res.status(400).json({
        message:
          "Quiz title is required",
      });

    }


    // -------------------------------------------------------
    // VALIDATE DESCRIPTION
    // -------------------------------------------------------

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {

      return res.status(400).json({
        message:
          "Quiz description must be text",
      });

    }


    // -------------------------------------------------------
    // VALIDATE QUESTIONS
    // -------------------------------------------------------

    if (
      !Array.isArray(
        questions
      ) ||
      questions.length === 0
    ) {

      return res.status(400).json({
        message:
          "At least one question is required",
      });

    }


    // -------------------------------------------------------
    // VALIDATE QUESTIONS
    // -------------------------------------------------------

    for (
      let i = 0;
      i < questions.length;
      i++
    ) {

      const question =
        questions[i];


      if (
        !question ||
        typeof question.question !== "string" ||
        !question.question.trim()
      ) {

        return res.status(400).json({
          message:
            `Question ${i + 1} is required`,
        });

      }


      if (
        !Array.isArray(
          question.options
        ) ||
        question.options.length !== 4
      ) {

        return res.status(400).json({
          message:
            `Question ${i + 1} must have exactly 4 options`,
        });

      }


      for (
        let j = 0;
        j < question.options.length;
        j++
      ) {

        if (
          typeof question.options[j] !== "string" ||
          !question.options[j].trim()
        ) {

          return res.status(400).json({
            message:
              `Option ${j + 1} of question ${i + 1} is required`,
          });

        }

      }


      const correctAnswer =
        Number(
          question.correct_answer
        );


      if (
        !Number.isInteger(
          correctAnswer
        ) ||
        correctAnswer < 0 ||
        correctAnswer > 3
      ) {

        return res.status(400).json({
          message:
            `Correct answer for question ${i + 1} must be 0, 1, 2, or 3`,
        });

      }

    }


    // -------------------------------------------------------
    // TRANSACTION
    // -------------------------------------------------------

    await client.query(
      "BEGIN"
    );


    // -------------------------------------------------------
    // CREATE QUIZ
    // -------------------------------------------------------

    const quizResult =
      await client.query(
        `
        INSERT INTO quizzes
        (
          title,
          description
        )
        VALUES
        (
          $1,
          $2
        )
        RETURNING
          id,
          title,
          description,
          created_at
        `,
        [
          title.trim(),

          typeof description === "string"
            ? description.trim()
            : "",
        ]
      );


    const quiz =
      quizResult.rows[0];


    // -------------------------------------------------------
    // CREATE QUESTIONS
    // -------------------------------------------------------

    const createdQuestions =
      [];


    for (
      const question
      of questions
    ) {

      const options =
        question.options.map(
          (option) =>
            String(option).trim()
        );


      const questionResult =
        await client.query(
          `
          INSERT INTO questions
          (
            quiz_id,
            question,
            options,
            correct_answer
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4
          )
          RETURNING
            id,
            quiz_id,
            question,
            options,
            correct_answer
          `,
          [
            quiz.id,

            question.question.trim(),

            JSON.stringify(
              options
            ),

            Number(
              question.correct_answer
            ),
          ]
        );


      const createdQuestion =
        questionResult.rows[0];


      createdQuestions.push({

        ...createdQuestion,

        options:
          normalizeOptions(
            createdQuestion.options
          ),

      });

    }


    // -------------------------------------------------------
    // COMMIT
    // -------------------------------------------------------

    await client.query(
      "COMMIT"
    );


    console.log(
      `Admin created quiz: ${quiz.title} | ID: ${quiz.id} | Questions: ${createdQuestions.length}`
    );


    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    return res.status(201).json({

      message:
        "Quiz created successfully",

      quiz,

      questions:
        createdQuestions,

    });


  } catch (error) {

    // -------------------------------------------------------
    // ROLLBACK
    // -------------------------------------------------------

    try {

      await client.query(
        "ROLLBACK"
      );

    } catch (rollbackError) {

      console.error(
        "Rollback error:",
        rollbackError
      );

    }


    console.error(
      "Error creating admin quiz:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to create quiz",

      error:
        error.message,

    });


  } finally {

    client.release();

  }

});

// =========================================================
// ADMIN — GET SINGLE QUIZ WITH QUESTIONS
// =========================================================
// GET /api/admin/quizzes/:quizId
// =========================================================

app.get("/api/admin/quizzes/:quizId", async (req, res) => {

  try {

    const quizId = Number(req.params.quizId);

    if (
      !Number.isInteger(quizId) ||
      quizId < 1
    ) {

      return res.status(400).json({
        message: "Invalid quiz ID",
      });

    }


    // -------------------------------------------------------
    // GET QUIZ
    // -------------------------------------------------------

    const quizResult =
      await pool.query(
        `
        SELECT
          id,
          title,
          description,
          created_at
        FROM quizzes
        WHERE id = $1
        `,
        [quizId]
      );


    if (quizResult.rows.length === 0) {

      return res.status(404).json({
        message: "Quiz not found",
      });

    }


    const quiz =
      quizResult.rows[0];


    // -------------------------------------------------------
    // GET QUESTIONS
    // -------------------------------------------------------

    const questionsResult =
      await pool.query(
        `
        SELECT
          id,
          quiz_id,
          question,
          options,
          correct_answer
        FROM questions
        WHERE quiz_id = $1
        ORDER BY id
        `,
        [quizId]
      );


    const questions =
      questionsResult.rows.map(
        (question) => ({

          ...question,

          options:
            normalizeOptions(
              question.options
            ),

        })
      );


    return res.json({

      quiz,

      questions,

    });


  } catch (error) {

    console.error(
      "Error fetching single quiz:",
      error
    );


    return res.status(500).json({
      message:
        "Failed to fetch quiz",
    });

  }

});


// =========================================================
// ADMIN — UPDATE QUIZ
// =========================================================
// PUT /api/admin/quizzes/:quizId
//
// Updates the quiz title, description and questions.
// =========================================================

app.put("/api/admin/quizzes/:quizId", async (req, res) => {

  const client =
    await pool.connect();


  try {

    const quizId =
      Number(req.params.quizId);


    const {
      title,
      description,
      questions,
    } = req.body;


    // -------------------------------------------------------
    // VALIDATE QUIZ ID
    // -------------------------------------------------------

    if (
      !Number.isInteger(quizId) ||
      quizId < 1
    ) {

      return res.status(400).json({
        message:
          "Invalid quiz ID",
      });

    }


    // -------------------------------------------------------
    // VALIDATE TITLE
    // -------------------------------------------------------

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {

      return res.status(400).json({
        message:
          "Quiz title is required",
      });

    }


    // -------------------------------------------------------
    // VALIDATE DESCRIPTION
    // -------------------------------------------------------

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {

      return res.status(400).json({
        message:
          "Quiz description must be text",
      });

    }


    // -------------------------------------------------------
    // VALIDATE QUESTIONS
    // -------------------------------------------------------

    if (
      !Array.isArray(questions) ||
      questions.length === 0
    ) {

      return res.status(400).json({
        message:
          "At least one question is required",
      });

    }


    for (
      let i = 0;
      i < questions.length;
      i++
    ) {

      const question =
        questions[i];


      if (
        !question ||
        typeof question.question !== "string" ||
        !question.question.trim()
      ) {

        return res.status(400).json({
          message:
            `Question ${i + 1} is required`,
        });

      }


      if (
        !Array.isArray(question.options) ||
        question.options.length !== 4
      ) {

        return res.status(400).json({
          message:
            `Question ${i + 1} must have exactly 4 options`,
        });

      }


      for (
        let j = 0;
        j < question.options.length;
        j++
      ) {

        if (
          typeof question.options[j] !== "string" ||
          !question.options[j].trim()
        ) {

          return res.status(400).json({
            message:
              `Option ${j + 1} of question ${i + 1} is required`,
          });

        }

      }


      const correctAnswer =
        Number(
          question.correct_answer
        );


      if (
        !Number.isInteger(correctAnswer) ||
        correctAnswer < 0 ||
        correctAnswer > 3
      ) {

        return res.status(400).json({
          message:
            `Correct answer for question ${i + 1} must be 0, 1, 2, or 3`,
        });

      }

    }


    // -------------------------------------------------------
    // CHECK QUIZ EXISTS
    // -------------------------------------------------------

    const existingQuiz =
      await client.query(
        `
        SELECT
          id
        FROM quizzes
        WHERE id = $1
        `,
        [quizId]
      );


    if (existingQuiz.rows.length === 0) {

      return res.status(404).json({
        message:
          "Quiz not found",
      });

    }


    // -------------------------------------------------------
    // START TRANSACTION
    // -------------------------------------------------------

    await client.query("BEGIN");


    // -------------------------------------------------------
    // UPDATE QUIZ
    // -------------------------------------------------------

    const quizResult =
      await client.query(
        `
        UPDATE quizzes
        SET
          title = $1,
          description = $2
        WHERE id = $3
        RETURNING
          id,
          title,
          description,
          created_at
        `,
        [
          title.trim(),

          typeof description === "string"
            ? description.trim()
            : "",

          quizId,
        ]
      );


    const quiz =
      quizResult.rows[0];


    // -------------------------------------------------------
    // DELETE OLD QUESTIONS
    // -------------------------------------------------------

    await client.query(
      `
      DELETE FROM questions
      WHERE quiz_id = $1
      `,
      [quizId]
    );


    // -------------------------------------------------------
    // INSERT UPDATED QUESTIONS
    // -------------------------------------------------------

    const updatedQuestions = [];


    for (
      const question
      of questions
    ) {

      const options =
        question.options.map(
          (option) =>
            String(option).trim()
        );


      const questionResult =
        await client.query(
          `
          INSERT INTO questions
          (
            quiz_id,
            question,
            options,
            correct_answer
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4
          )
          RETURNING
            id,
            quiz_id,
            question,
            options,
            correct_answer
          `,
          [
            quizId,

            question.question.trim(),

            JSON.stringify(options),

            Number(
              question.correct_answer
            ),
          ]
        );


      const createdQuestion =
        questionResult.rows[0];


      updatedQuestions.push({

        ...createdQuestion,

        options:
          normalizeOptions(
            createdQuestion.options
          ),

      });

    }


    // -------------------------------------------------------
    // COMMIT
    // -------------------------------------------------------

    await client.query("COMMIT");


    console.log(
      `Admin updated quiz: ${quiz.title} | ID: ${quiz.id}`
    );


    return res.json({

      message:
        "Quiz updated successfully",

      quiz,

      questions:
        updatedQuestions,

    });


  } catch (error) {

    try {

      await client.query("ROLLBACK");

    } catch (rollbackError) {

      console.error(
        "Rollback error:",
        rollbackError
      );

    }


    console.error(
      "Error updating quiz:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to update quiz",

      error:
        error.message,

    });


  } finally {

    client.release();

  }

});


// =========================================================
// ADMIN — DELETE QUIZ
// =========================================================
// DELETE /api/admin/quizzes/:quizId
//
// A quiz with existing student attempts cannot be deleted.
// This protects student history.
// =========================================================

app.delete("/api/admin/quizzes/:quizId", async (req, res) => {

  const client =
    await pool.connect();


  try {

    const quizId =
      Number(req.params.quizId);


    // -------------------------------------------------------
    // VALIDATE QUIZ ID
    // -------------------------------------------------------

    if (
      !Number.isInteger(quizId) ||
      quizId < 1
    ) {

      return res.status(400).json({
        message:
          "Invalid quiz ID",
      });

    }


    // -------------------------------------------------------
    // CHECK QUIZ
    // -------------------------------------------------------

    const quizResult =
      await client.query(
        `
        SELECT
          id,
          title
        FROM quizzes
        WHERE id = $1
        `,
        [quizId]
      );


    if (quizResult.rows.length === 0) {

      return res.status(404).json({
        message:
          "Quiz not found",
      });

    }


    const quiz =
      quizResult.rows[0];


    // -------------------------------------------------------
    // CHECK EXISTING ATTEMPTS
    // -------------------------------------------------------

    const attemptsResult =
      await client.query(
        `
        SELECT
          COUNT(*) AS count
        FROM quiz_attempts
        WHERE quiz_id = $1
        `,
        [quizId]
      );


    const attemptCount =
      Number(
        attemptsResult.rows[0].count
      );


    if (attemptCount > 0) {

      return res.status(409).json({

        message:
          `This quiz cannot be deleted because ${attemptCount} student attempt${attemptCount === 1 ? "" : "s"} exist. Student history must be preserved.`,

      });

    }


    // -------------------------------------------------------
    // START TRANSACTION
    // -------------------------------------------------------

    await client.query("BEGIN");


    // -------------------------------------------------------
    // DELETE QUESTIONS
    // -------------------------------------------------------

    await client.query(
      `
      DELETE FROM questions
      WHERE quiz_id = $1
      `,
      [quizId]
    );


    // -------------------------------------------------------
    // DELETE QUIZ
    // -------------------------------------------------------

    await client.query(
      `
      DELETE FROM quizzes
      WHERE id = $1
      `,
      [quizId]
    );


    // -------------------------------------------------------
    // COMMIT
    // -------------------------------------------------------

    await client.query("COMMIT");


    console.log(
      `Admin deleted quiz: ${quiz.title} | ID: ${quizId}`
    );


    return res.json({

      message:
        "Quiz deleted successfully",

      quizId,

    });


  } catch (error) {

    try {

      await client.query("ROLLBACK");

    } catch (rollbackError) {

      console.error(
        "Rollback error:",
        rollbackError
      );

    }


    console.error(
      "Error deleting quiz:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to delete quiz",

      error:
        error.message,

    });


  } finally {

    client.release();

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