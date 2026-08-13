import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import API_BASE_URL from '../api';

import './AdminPage.css';


// =========================================================
// QUIZFORGE ADMIN DASHBOARD
// =========================================================

function AdminPage() {

  const navigate = useNavigate();


  // =========================================================
  // STATE
  // =========================================================

  const [activeSection, setActiveSection] =
    useState('dashboard');

  const [results, setResults] =
    useState([]);

  const [performance, setPerformance] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [showCreateQuiz, setShowCreateQuiz] =
    useState(false);


  // =========================================================
  // CREATE QUIZ STATE
  // =========================================================

  const [quizTitle, setQuizTitle] =
    useState('');

  const [quizDescription, setQuizDescription] =
    useState('');

  const [newQuestions, setNewQuestions] =
    useState([
      {
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
      },
    ]);

  const [createQuizLoading, setCreateQuizLoading] =
    useState(false);

  const [createQuizMessage, setCreateQuizMessage] =
    useState('');

  const [createQuizError, setCreateQuizError] =
    useState('');


  // =========================================================
  // LOAD ADMIN DATA
  // =========================================================

  const loadAdminData = async () => {

    try {

      setLoading(true);


      const [
        resultsResponse,
        performanceResponse,
      ] = await Promise.all([

        fetch(
          `${API_BASE_URL}/api/admin/results`
        ),

        fetch(
          `${API_BASE_URL}/api/quiz/performance`
        ),

      ]);


      // =====================================================
      // STUDENT RESULTS
      // =====================================================

      if (resultsResponse.ok) {

        const resultsData =
          await resultsResponse.json();

        setResults(
          Array.isArray(resultsData)
            ? resultsData
            : []
        );

      } else {

        console.error(
          'Failed to fetch admin results'
        );

        setResults([]);

      }


      // =====================================================
      // PERFORMANCE
      // =====================================================

      if (performanceResponse.ok) {

        const performanceData =
          await performanceResponse.json();

        setPerformance(
          performanceData
        );

      } else {

        console.error(
          'Failed to fetch admin performance'
        );

        setPerformance(null);

      }

    } catch (error) {

      console.error(
        'Admin data loading error:',
        error
      );

      setResults([]);
      setPerformance(null);

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadAdminData();

  }, []);


  // =========================================================
  // REFRESH
  // =========================================================

  const refreshData = async () => {

    await loadAdminData();

  };


  // =========================================================
  // RESET CREATE QUIZ FORM
  // =========================================================

  const resetCreateQuizForm = () => {

    setQuizTitle('');

    setQuizDescription('');

    setNewQuestions([
      {
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
      },
    ]);

    setCreateQuizMessage('');

    setCreateQuizError('');

  };


  // =========================================================
  // OPEN CREATE QUIZ
  // =========================================================

  const openCreateQuiz = () => {

    setShowCreateQuiz(true);

    setActiveSection('create');

    setCreateQuizMessage('');

    setCreateQuizError('');

  };


  // =========================================================
  // CLOSE CREATE QUIZ
  // =========================================================

  const closeCreateQuiz = () => {

    setShowCreateQuiz(false);

    setActiveSection('dashboard');

    resetCreateQuizForm();

  };


  // =========================================================
  // CREATE QUIZ
  // =========================================================

  const createQuiz = async () => {

    setCreateQuizMessage('');

    setCreateQuizError('');


    // =====================================================
    // VALIDATE TITLE
    // =====================================================

    if (!quizTitle.trim()) {

      setCreateQuizError(
        'Please enter a quiz title.'
      );

      return;

    }


    // =====================================================
    // VALIDATE QUESTIONS
    // =====================================================

    for (
      let i = 0;
      i < newQuestions.length;
      i++
    ) {

      const item =
        newQuestions[i];


      if (!item.question.trim()) {

        setCreateQuizError(
          `Please enter Question ${i + 1}.`
        );

        return;

      }


      if (
        item.options.some(
          (option) =>
            !option.trim()
        )
      ) {

        setCreateQuizError(
          `Please fill all 4 options for Question ${i + 1}.`
        );

        return;

      }

    }


    try {

      setCreateQuizLoading(true);


      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/quizzes`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({

              title:
                quizTitle.trim(),

              description:
                quizDescription.trim(),

              questions:
                newQuestions.map(
                  (item) => ({

                    question:
                      item.question.trim(),

                    options:
                      item.options.map(
                        (option) =>
                          option.trim()
                      ),

                    correct_answer:
                      Number(
                        item.correct_answer
                      ),

                  })
                ),

            }),

          }
        );


      const data =
        await response
          .json()
          .catch(
            () => ({})
          );


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to create quiz.'
        );

      }


      // =====================================================
      // SUCCESS
      // =====================================================

      setCreateQuizMessage(
        data.quiz?.title
          ? `Quiz "${data.quiz.title}" created successfully!`
          : 'Quiz created successfully!'
      );


      // =====================================================
      // RESET FORM
      // =====================================================

      setQuizTitle('');

      setQuizDescription('');

      setNewQuestions([
        {
          question: '',
          options: ['', '', '', ''],
          correct_answer: 0,
        },
      ]);


      // =====================================================
      // REFRESH DATA
      // =====================================================

      await refreshData();

    } catch (error) {

      console.error(
        'Create quiz error:',
        error
      );

      setCreateQuizError(
        error.message ||
        'Failed to create quiz.'
      );

    } finally {

      setCreateQuizLoading(false);

    }

  };


  // =========================================================
  // ADD QUESTION
  // =========================================================

  const addQuestion = () => {

    setNewQuestions(
      (previous) => [

        ...previous,

        {
          question: '',
          options: ['', '', '', ''],
          correct_answer: 0,
        },

      ]
    );

  };


  // =========================================================
  // REMOVE QUESTION
  // =========================================================

  const removeQuestion = (
    questionIndex
  ) => {

    if (
      newQuestions.length === 1
    ) {

      return;

    }


    setNewQuestions(
      (previous) =>
        previous.filter(
          (_, index) =>
            index !== questionIndex
        )
    );

  };


  // =========================================================
  // UPDATE QUESTION
  // =========================================================

  const updateQuestion = (
    questionIndex,
    value
  ) => {

    setNewQuestions(
      (previous) =>
        previous.map(
          (item, index) =>

            index === questionIndex
              ? {
                  ...item,
                  question: value,
                }
              : item

        )
    );

  };


  // =========================================================
  // UPDATE OPTION
  // =========================================================

  const updateOption = (
    questionIndex,
    optionIndex,
    value
  ) => {

    setNewQuestions(
      (previous) =>

        previous.map(
          (item, index) => {

            if (
              index !== questionIndex
            ) {

              return item;

            }


            const updatedOptions = [
              ...item.options,
            ];


            updatedOptions[
              optionIndex
            ] = value;


            return {
              ...item,
              options:
                updatedOptions,
            };

          }
        )

    );

  };


  // =========================================================
  // UPDATE CORRECT ANSWER
  // =========================================================

  const updateCorrectAnswer = (
    questionIndex,
    value
  ) => {

    setNewQuestions(
      (previous) =>

        previous.map(
          (item, index) =>

            index === questionIndex
              ? {
                  ...item,
                  correct_answer:
                    Number(value),
                }
              : item

        )
    );

  };


  // =========================================================
  // GET STUDENT NAME
  // =========================================================

  const getStudentName = (
    attempt
  ) => {

    return (

      attempt.student_name ||

      attempt.studentName ||

      attempt.name ||

      (
        attempt.student_id
          ? `Student ${attempt.student_id}`
          : 'Unknown Student'
      )

    );

  };


  // =========================================================
  // GET QUIZ NAME
  // =========================================================

  const getQuizName = (
    attempt
  ) => {

    return (

      attempt.quiz_title ||

      attempt.topic ||

      (
        attempt.quiz_id
          ? `Quiz ${attempt.quiz_id}`
          : 'Unknown Quiz'
      )

    );

  };


  // =========================================================
  // UNIQUE STUDENTS
  // =========================================================

  const uniqueStudentIds =
    new Set();


  results.forEach(
    (attempt) => {

      if (
        attempt.student_id !==
          null &&
        attempt.student_id !==
          undefined
      ) {

        uniqueStudentIds.add(
          String(
            attempt.student_id
          )
        );

      } else if (
        attempt.student_name
      ) {

        uniqueStudentIds.add(
          attempt.student_name
        );

      }

    }
  );


  const uniqueStudents =
    uniqueStudentIds.size;


  // =========================================================
  // TOTAL ATTEMPTS
  // =========================================================

  const totalAttempts =
    results.length;


  // =========================================================
  // STUDENT RANKING
  // =========================================================

  const studentMap = {};


  results.forEach(
    (attempt) => {

      const studentKey =

        attempt.student_id !==
          null &&
        attempt.student_id !==
          undefined

          ? String(
              attempt.student_id
            )

          : (
              attempt.student_name ||
              'unknown'
            );


      if (
        !studentMap[studentKey]
      ) {

        studentMap[studentKey] = {

          student_id:
            attempt.student_id,

          student_name:
            getStudentName(
              attempt
            ),

          attempts: 0,

          totalPercentage: 0,

          totalCorrect: 0,

          totalQuestions: 0,

          bestScore: 0,

          latestQuiz:
            getQuizName(
              attempt
            ),

        };

      }


      studentMap[
        studentKey
      ].attempts += 1;


      studentMap[
        studentKey
      ].totalPercentage +=
        Number(
          attempt.percentage || 0
        );


      studentMap[
        studentKey
      ].totalCorrect +=
        Number(
          attempt.score || 0
        );


      studentMap[
        studentKey
      ].totalQuestions +=
        Number(
          attempt.total_questions || 0
        );


      if (
        Number(
          attempt.percentage || 0
        ) >
        studentMap[
          studentKey
        ].bestScore
      ) {

        studentMap[
          studentKey
        ].bestScore =
          Number(
            attempt.percentage || 0
          );

      }


      studentMap[
        studentKey
      ].latestQuiz =
        getQuizName(
          attempt
        );

    }
  );


  const ranking =
    Object.values(
      studentMap
    )

      .map(
        (student) => ({

          ...student,

          averagePercentage:
            student.attempts > 0
              ? Math.round(
                  student.totalPercentage /
                  student.attempts
                )
              : 0,

        })
      )

      .sort(
        (a, b) =>
          b.averagePercentage -
          a.averagePercentage
      )

      .map(
        (student, index) => ({

          ...student,

          rank:
            index + 1,

        })
      );


  // =========================================================
  // SCORE CLASS
  // =========================================================

  const getScoreClass = (
    percentage
  ) => {

    const score =
      Number(
        percentage || 0
      );


    if (score >= 80) {

      return 'score-good';

    }


    if (score >= 60) {

      return 'score-average';

    }


    return 'score-low';

  };


  // =========================================================
  // DASHBOARD
  // =========================================================

  const renderDashboard = () => {

    return (

      <div className="admin-content">


        {/* =================================================
            STATISTICS
            ================================================= */}

        <div className="admin-stat-grid">


          <AdminStat
            icon="👨‍🎓"
            title="Students"
            value={
              uniqueStudents
            }
            description="Students who attempted quizzes"
          />


          <AdminStat
            icon="📝"
            title="Quiz Attempts"
            value={
              totalAttempts
            }
            description="Total submitted attempts"
          />


          <AdminStat
            icon="🎯"
            title="Average Score"
            value={
              performance
                ? `${performance.averageScore || 0}%`
                : '0%'
            }
            description="Overall student performance"
          />


          <AdminStat
            icon="🏆"
            title="Best Score"
            value={
              performance
                ? `${performance.bestScore || 0}%`
                : '0%'
            }
            description="Highest recorded score"
          />


        </div>


        {/* =================================================
            PERFORMANCE OVERVIEW
            ================================================= */}

        <div className="admin-section-card">


          <div className="admin-section-header">


            <div>

              <span className="admin-section-icon">
                📊
              </span>

              <div>

                <h2>
                  Performance Overview
                </h2>

                <p>
                  Monitor how students are performing
                  across Quizforge assessments.
                </p>

              </div>

            </div>


            <button
              className="admin-refresh-button"
              onClick={
                refreshData
              }
            >
              🔄 Refresh
            </button>


          </div>


          <div className="performance-overview">


            <div className="overview-item">

              <span>
                Total Correct Answers
              </span>

              <strong>
                {performance?.totalCorrect || 0}
              </strong>

            </div>


            <div className="overview-item">

              <span>
                Total Questions Attempted
              </span>

              <strong>
                {performance?.totalQuestions || 0}
              </strong>

            </div>


            <div className="overview-item">

              <span>
                Total Attempts
              </span>

              <strong>
                {
                  performance?.totalAttempts ||
                  totalAttempts
                }
              </strong>

            </div>


          </div>

        </div>


        {/* =================================================
            TOP STUDENTS
            ================================================= */}

        <div className="admin-section-card">


          <div className="admin-section-header">


            <div>

              <span className="admin-section-icon">
                🏆
              </span>

              <div>

                <h2>
                  Top Students
                </h2>

                <p>
                  Students with the highest average
                  quiz performance.
                </p>

              </div>

            </div>


            <button
              className="admin-refresh-button"
              onClick={() =>
                setActiveSection(
                  'ranking'
                )
              }
            >
              View Rankings →
            </button>


          </div>


          {ranking.length === 0 ? (

            <div className="admin-empty">
              No student rankings available yet.
            </div>

          ) : (

            <div className="ranking-list">

              {ranking
                .slice(0, 3)
                .map(
                  (student) => (

                    <div
                      className={`ranking-card ${
                        student.rank <= 3
                          ? 'ranking-card--top'
                          : ''
                      }`}
                      key={
                        student.student_id ||
                        student.student_name
                      }
                    >


                      <div
                        className={`ranking-number ${
                          student.rank === 1
                            ? 'gold'
                            : student.rank === 2
                            ? 'silver'
                            : student.rank === 3
                            ? 'bronze'
                            : ''
                        }`}
                      >

                        {student.rank <= 3

                          ? [
                              '🥇',
                              '🥈',
                              '🥉',
                            ][
                              student.rank - 1
                            ]

                          : `#${student.rank}`}

                      </div>


                      <div className="ranking-student">

                        <strong>
                          {student.student_name}
                        </strong>

                        <span>
                          {student.attempts}{' '}
                          {student.attempts === 1
                            ? 'attempt'
                            : 'attempts'}
                        </span>

                      </div>


                      <div className="ranking-score">

                        <strong>
                          {student.averagePercentage}%
                        </strong>

                        <span>
                          Average Score
                        </span>

                      </div>


                    </div>

                  )
                )}

            </div>

          )}

        </div>


        {/* =================================================
            RECENT ACTIVITY
            ================================================= */}

        <div className="admin-section-card">


          <div className="admin-section-header">


            <div>

              <span className="admin-section-icon">
                🕐
              </span>

              <div>

                <h2>
                  Recent Activity
                </h2>

                <p>
                  Latest quiz submissions.
                </p>

              </div>

            </div>


          </div>


          {results.length === 0 ? (

            <div className="admin-empty">
              No quiz attempts available yet.
            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Student
                    </th>

                    <th>
                      Quiz
                    </th>

                    <th>
                      Score
                    </th>

                    <th>
                      Percentage
                    </th>

                    <th>
                      Date
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {results
                    .slice(0, 5)
                    .map(
                      (attempt) => (

                        <tr
                          key={
                            attempt.id
                          }
                        >

                          <td>

                            <strong>
                              {getStudentName(
                                attempt
                              )}
                            </strong>

                          </td>


                          <td>
                            {getQuizName(
                              attempt
                            )}
                          </td>


                          <td>
                            {attempt.score}/
                            {attempt.total_questions}
                          </td>


                          <td>

                            <span
                              className={
                                getScoreClass(
                                  attempt.percentage
                                )
                              }
                            >
                              {attempt.percentage}%
                            </span>

                          </td>


                          <td>

                            {attempt.attempted_at

                              ? new Date(
                                  attempt.attempted_at
                                ).toLocaleDateString()

                              : '—'}

                          </td>

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            </div>

          )}

        </div>


      </div>

    );

  };


  // =========================================================
  // RESULTS
  // =========================================================

  const renderResults = () => {

    return (

      <div className="admin-content">


        <div className="admin-section-card">


          <div className="admin-section-header">


            <div>

              <span className="admin-section-icon">
                📋
              </span>

              <div>

                <h2>
                  Student Results
                </h2>

                <p>
                  View every submitted quiz attempt.
                </p>

              </div>

            </div>


            <button
              className="admin-refresh-button"
              onClick={
                refreshData
              }
            >
              🔄 Refresh
            </button>


          </div>


          {results.length === 0 ? (

            <div className="admin-empty">
              No student results available yet.
            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Student
                    </th>

                    <th>
                      Quiz
                    </th>

                    <th>
                      Correct
                    </th>

                    <th>
                      Questions
                    </th>

                    <th>
                      Score
                    </th>

                    <th>
                      Percentage
                    </th>

                    <th>
                      Date
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {results.map(
                    (
                      attempt,
                      index
                    ) => (

                      <tr
                        key={
                          attempt.id ||
                          `${attempt.student_id}-${attempt.quiz_id}-${index}`
                        }
                      >

                        <td>
                          {index + 1}
                        </td>


                        <td>

                          <strong>
                            {getStudentName(
                              attempt
                            )}
                          </strong>

                        </td>


                        <td>
                          {getQuizName(
                            attempt
                          )}
                        </td>


                        <td>
                          {attempt.score}
                        </td>


                        <td>
                          {attempt.total_questions}
                        </td>


                        <td>
                          {attempt.score}/
                          {attempt.total_questions}
                        </td>


                        <td>

                          <span
                            className={
                              getScoreClass(
                                attempt.percentage
                              )
                            }
                          >
                            {attempt.percentage}%
                          </span>

                        </td>


                        <td>

                          {attempt.attempted_at

                            ? new Date(
                                attempt.attempted_at
                              ).toLocaleString()

                            : '—'}

                        </td>


                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


      </div>

    );

  };


  // =========================================================
  // RANKING
  // =========================================================

  const renderRanking = () => {

    return (

      <div className="admin-content">


        <div className="admin-section-card">


          <div className="admin-section-header">


            <div>

              <span className="admin-section-icon">
                🏆
              </span>

              <div>

                <h2>
                  Student Ranking
                </h2>

                <p>
                  Students ranked by their average quiz
                  performance.
                </p>

              </div>

            </div>


            <button
              className="admin-refresh-button"
              onClick={
                refreshData
              }
            >
              🔄 Refresh
            </button>


          </div>


          {ranking.length === 0 ? (

            <div className="admin-empty">
              No rankings available yet.
            </div>

          ) : (

            <div className="ranking-list">

              {ranking.map(
                (student) => (

                  <div
                    className={`ranking-card ${
                      student.rank <= 3
                        ? 'ranking-card--top'
                        : ''
                    }`}
                    key={
                      student.student_id ||
                      student.student_name
                    }
                  >


                    <div
                      className={`ranking-number ${
                        student.rank === 1
                          ? 'gold'
                          : student.rank === 2
                          ? 'silver'
                          : student.rank === 3
                          ? 'bronze'
                          : ''
                      }`}
                    >

                      {student.rank <= 3

                        ? [
                            '🥇',
                            '🥈',
                            '🥉',
                          ][
                            student.rank - 1
                          ]

                        : `#${student.rank}`}

                    </div>


                    <div className="ranking-student">

                      <strong>
                        {student.student_name}
                      </strong>

                      <span>

                        {student.attempts}{' '}

                        {student.attempts === 1
                          ? 'quiz attempt'
                          : 'quiz attempts'}

                      </span>

                    </div>


                    <div className="ranking-score">

                      <strong>
                        {student.averagePercentage}%
                      </strong>

                      <span>
                        Average
                      </span>

                    </div>


                  </div>

                )
              )}

            </div>

          )}

        </div>


      </div>

    );

  };


  // =========================================================
  // CREATE QUIZ
  // =========================================================

  const renderCreateQuiz = () => {

    return (

      <div className="admin-content">


        <div className="admin-section-card">


          <div className="admin-section-header">


            <div>

              <span className="admin-section-icon">
                ➕
              </span>

              <div>

                <h2>
                  Create New Quiz
                </h2>

                <p>
                  Create an Industrial IoT assessment
                  for students.
                </p>

              </div>

            </div>


            <button
              className="admin-refresh-button"
              onClick={
                closeCreateQuiz
              }
            >
              ← Back
            </button>


          </div>


          {/* =================================================
              QUIZ DETAILS
              ================================================= */}

          <div className="create-quiz-form">


            <div className="create-quiz-field">

              <label>
                Quiz Title
              </label>

              <input
                type="text"
                placeholder="Example: Industrial IoT Fundamentals"
                value={
                  quizTitle
                }
                onChange={
                  (event) =>
                    setQuizTitle(
                      event.target.value
                    )
                }
              />

            </div>


            <div className="create-quiz-field">

              <label>
                Quiz Description
              </label>

              <textarea
                placeholder="Enter a short description for this quiz..."
                value={
                  quizDescription
                }
                onChange={
                  (event) =>
                    setQuizDescription(
                      event.target.value
                    )
                }
                rows="4"
              />

            </div>


          </div>


          {/* =================================================
              QUESTIONS
              ================================================= */}

          <div className="create-quiz-questions">


            <div className="create-quiz-questions-header">

              <div>

                <h3>
                  Questions
                </h3>

                <p>
                  Add questions and select the correct
                  answer.
                </p>

              </div>


              <span>

                {newQuestions.length}{' '}

                question
                {newQuestions.length !== 1
                  ? 's'
                  : ''}

              </span>


            </div>


            {newQuestions.map(
              (
                item,
                questionIndex
              ) => (

                <div
                  className="create-question-card"
                  key={
                    questionIndex
                  }
                >


                  <div className="create-question-header">


                    <div>

                      <span>
                        QUESTION{' '}
                        {questionIndex + 1}
                      </span>

                      <h3>
                        Question{' '}
                        {questionIndex + 1}
                      </h3>

                    </div>


                    {newQuestions.length > 1 && (

                      <button
                        type="button"
                        className="remove-question-button"
                        onClick={() =>
                          removeQuestion(
                            questionIndex
                          )
                        }
                      >
                        🗑 Remove
                      </button>

                    )}


                  </div>


                  {/* QUESTION */}

                  <div className="create-quiz-field">

                    <label>
                      Question
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your question..."
                      value={
                        item.question
                      }
                      onChange={
                        (event) =>
                          updateQuestion(
                            questionIndex,
                            event.target.value
                          )
                      }
                    />

                  </div>


                  {/* OPTIONS */}

                  <div className="options-grid">

                    {item.options.map(
                      (
                        option,
                        optionIndex
                      ) => (

                        <div
                          className={
                            optionIndex ===
                            item.correct_answer
                              ? 'create-option correct'
                              : 'create-option'
                          }
                          key={
                            optionIndex
                          }
                        >


                          <div className="option-label">

                            <span>
                              {String.fromCharCode(
                                65 +
                                optionIndex
                              )}
                            </span>

                            <label>
                              Option{' '}
                              {String.fromCharCode(
                                65 +
                                optionIndex
                              )}
                            </label>

                          </div>


                          <input
                            type="text"
                            placeholder={`Enter option ${String.fromCharCode(
                              65 +
                              optionIndex
                            )}`}
                            value={
                              option
                            }
                            onChange={
                              (event) =>
                                updateOption(
                                  questionIndex,
                                  optionIndex,
                                  event.target.value
                                )
                            }
                          />


                        </div>

                      )
                    )}

                  </div>


                  {/* CORRECT ANSWER */}

                  <div className="correct-answer-row">

                    <label>
                      Correct Answer
                    </label>


                    <select
                      value={
                        item.correct_answer
                      }
                      onChange={
                        (event) =>
                          updateCorrectAnswer(
                            questionIndex,
                            event.target.value
                          )
                      }
                    >

                      <option value={0}>
                        A
                      </option>

                      <option value={1}>
                        B
                      </option>

                      <option value={2}>
                        C
                      </option>

                      <option value={3}>
                        D
                      </option>

                    </select>


                    <span>
                      ✓ Correct answer
                    </span>


                  </div>


                </div>

              )
            )}


          </div>


          {/* =================================================
              ADD QUESTION
              ================================================= */}

          <button
            type="button"
            className="add-question-button"
            onClick={
              addQuestion
            }
          >
            ➕ Add Another Question
          </button>


          {/* =================================================
              MESSAGES
              ================================================= */}

          {createQuizError && (

            <div className="create-quiz-error">
              ⚠️ {createQuizError}
            </div>

          )}


          {createQuizMessage && (

            <div className="create-quiz-success">
              ✅ {createQuizMessage}
            </div>

          )}


          {/* =================================================
              ACTIONS
              ================================================= */}

          <div className="create-quiz-actions">


            <button
              type="button"
              className="create-quiz-cancel"
              onClick={
                closeCreateQuiz
              }
              disabled={
                createQuizLoading
              }
            >
              Cancel
            </button>


            <button
              type="button"
              className="create-quiz-submit"
              onClick={
                createQuiz
              }
              disabled={
                createQuizLoading
              }
            >

              {createQuizLoading

                ? '⏳ Creating Quiz...'

                : '⚡ Create Quiz'}

            </button>


          </div>


        </div>


      </div>

    );

  };


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (

    <div className="admin-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="admin-header">

        <div className="admin-header-inner">


          <div>

            <div className="admin-brand">
              ⚡ QUIZFORGE ADMIN
            </div>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage quizzes, monitor students and
              track assessment performance.
            </p>

          </div>


          <button
            className="student-home-button"
            onClick={() =>
              navigate('/')
            }
          >
            ← Student Portal
          </button>


        </div>

      </header>


      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <nav className="admin-nav">


        <button
          className={
            activeSection ===
            'dashboard'
              ? 'admin-nav-button active'
              : 'admin-nav-button'
          }
          onClick={() => {

            setActiveSection(
              'dashboard'
            );

            setShowCreateQuiz(
              false
            );

          }}
        >
          📊 Dashboard
        </button>


        <button
          className={
            activeSection ===
            'results'
              ? 'admin-nav-button active'
              : 'admin-nav-button'
          }
          onClick={() => {

            setActiveSection(
              'results'
            );

            setShowCreateQuiz(
              false
            );

          }}
        >
          👨‍🎓 Student Results
        </button>


        <button
          className={
            activeSection ===
            'ranking'
              ? 'admin-nav-button active'
              : 'admin-nav-button'
          }
          onClick={() => {

            setActiveSection(
              'ranking'
            );

            setShowCreateQuiz(
              false
            );

          }}
        >
          🏆 Rankings
        </button>


        <button
          className={
            showCreateQuiz
              ? 'admin-nav-button active'
              : 'admin-nav-button'
          }
          onClick={
            openCreateQuiz
          }
        >
          ➕ Create Quiz
        </button>


      </nav>


      {/* =====================================================
          CONTENT
          ===================================================== */}

      <main className="admin-main">


        {loading ? (

          <div className="admin-loading">


            <div className="admin-loading-icon">
              ⚡
            </div>


            <h2>
              Loading Admin Dashboard...
            </h2>


            <p>
              Fetching Quizforge performance data.
            </p>


          </div>

        ) : (

          <>

            {activeSection ===
              'dashboard' &&
              renderDashboard()}


            {activeSection ===
              'results' &&
              renderResults()}


            {activeSection ===
              'ranking' &&
              renderRanking()}


            {activeSection ===
              'create' &&
              renderCreateQuiz()}

          </>

        )}


      </main>


      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="admin-footer">


        <span>
          ⚡ Quizforge
        </span>


        <p>
          Industrial IoT Quiz Management Platform
        </p>


      </footer>


    </div>

  );

}


// =========================================================
// ADMIN STAT CARD
// =========================================================

function AdminStat({
  icon,
  title,
  value,
  description,
}) {

  return (

    <div className="admin-stat-card">


      <div className="admin-stat-icon">
        {icon}
      </div>


      <span className="admin-stat-title">
        {title}
      </span>


      <strong className="admin-stat-value">
        {value}
      </strong>


      <small className="admin-stat-description">
        {description}
      </small>


    </div>

  );

}


export default AdminPage;