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
  // MAIN STATE
  // =========================================================

  const [activeSection, setActiveSection] =
    useState('dashboard');

  const [results, setResults] =
    useState([]);

  const [performance, setPerformance] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // =========================================================
  // QUIZ MANAGEMENT STATE
  // =========================================================

  const [quizzes, setQuizzes] =
    useState([]);

  const [quizzesLoading, setQuizzesLoading] =
    useState(false);

  const [quizzesError, setQuizzesError] =
    useState('');


  const [selectedQuiz, setSelectedQuiz] =
    useState(null);

  const [selectedQuizLoading, setSelectedQuizLoading] =
    useState(false);

  const [selectedQuizError, setSelectedQuizError] =
    useState('');


  const [quizMode, setQuizMode] =
    useState('list');


  // =========================================================
  // CREATE / EDIT QUIZ STATE
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


  const [editingQuizId, setEditingQuizId] =
    useState(null);

  const [quizFormLoading, setQuizFormLoading] =
    useState(false);

  const [quizFormMessage, setQuizFormMessage] =
    useState('');

  const [quizFormError, setQuizFormError] =
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


      // -----------------------------------------------------
      // RESULTS
      // -----------------------------------------------------

      if (resultsResponse.ok) {

        const resultsData =
          await resultsResponse.json();

        setResults(
          Array.isArray(resultsData)
            ? resultsData
            : []
        );

      } else {

        setResults([]);

      }


      // -----------------------------------------------------
      // PERFORMANCE
      // -----------------------------------------------------

      if (performanceResponse.ok) {

        const performanceData =
          await performanceResponse.json();

        setPerformance(
          performanceData
        );

      } else {

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
  // LOAD QUIZZES
  // =========================================================

  const loadQuizzes = async () => {

    try {

      setQuizzesLoading(true);
      setQuizzesError('');


      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/quizzes`
        );


      const data =
        await response
          .json()
          .catch(
            () => []
          );


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to load quizzes.'
        );

      }


      setQuizzes(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        'Quiz loading error:',
        error
      );

      setQuizzes([]);

      setQuizzesError(
        error.message ||
        'Failed to load quizzes.'
      );

    } finally {

      setQuizzesLoading(false);

    }

  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadAdminData();
    loadQuizzes();

  }, []);


  // =========================================================
  // REFRESH ALL DATA
  // =========================================================

  const refreshData = async () => {

    await Promise.all([
      loadAdminData(),
      loadQuizzes(),
    ]);

  };


  // =========================================================
  // UNIQUE STUDENTS
  // =========================================================

  const uniqueStudentIds =
    new Set();


  results.forEach(
    (attempt) => {

      if (
        attempt.student_id !== null &&
        attempt.student_id !== undefined
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
  // STUDENT RANKING
  // =========================================================

  const studentMap = {};


  results.forEach(
    (attempt) => {

      const studentKey =

        attempt.student_id !== null &&
        attempt.student_id !== undefined

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
  // RESET QUIZ FORM
  // =========================================================

  const resetQuizForm = () => {

    setQuizTitle('');

    setQuizDescription('');

    setNewQuestions([
      {
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
      },
    ]);

    setEditingQuizId(null);

    setQuizFormMessage('');

    setQuizFormError('');

  };


  // =========================================================
  // OPEN CREATE QUIZ
  // =========================================================

  const openCreateQuiz = () => {

    resetQuizForm();

    setQuizMode('create');

    setActiveSection('quizzes');

  };


  // =========================================================
  // LOAD SINGLE QUIZ
  // =========================================================

  const loadSingleQuiz = async (
    quizId
  ) => {

    try {

      setSelectedQuizLoading(true);
      setSelectedQuizError('');


      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/quizzes/${quizId}`
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
          'Failed to load quiz.'
        );

      }


      setSelectedQuiz(
        data
      );


      setQuizMode('view');


    } catch (error) {

      console.error(
        'Single quiz loading error:',
        error
      );

      setSelectedQuiz(null);

      setSelectedQuizError(
        error.message ||
        'Failed to load quiz.'
      );

    } finally {

      setSelectedQuizLoading(false);

    }

  };


  // =========================================================
  // OPEN EDIT QUIZ
  // =========================================================

  const openEditQuiz = async (
    quizId
  ) => {

    try {

      setSelectedQuizLoading(true);
      setSelectedQuizError('');
      setQuizFormError('');
      setQuizFormMessage('');


      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/quizzes/${quizId}`
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
          'Failed to load quiz.'
        );

      }


      const quiz =
        data.quiz;


      const questions =
        Array.isArray(data.questions) &&
        data.questions.length > 0

          ? data.questions.map(
              (question) => ({

                question:
                  question.question ||
                  '',

                options:
                  Array.isArray(
                    question.options
                  )

                    ? [
                        question.options[0] || '',
                        question.options[1] || '',
                        question.options[2] || '',
                        question.options[3] || '',
                      ]

                    : [
                        '',
                        '',
                        '',
                        '',
                      ],

                correct_answer:
                  Number(
                    question.correct_answer
                  ) || 0,

              })
            )

          : [
              {
                question: '',
                options: ['', '', '', ''],
                correct_answer: 0,
              },
            ];


      setQuizTitle(
        quiz?.title || ''
      );


      setQuizDescription(
        quiz?.description || ''
      );


      setNewQuestions(
        questions
      );


      setEditingQuizId(
        Number(quizId)
      );


      setQuizMode('edit');

      setActiveSection('quizzes');


    } catch (error) {

      console.error(
        'Edit quiz loading error:',
        error
      );

      setQuizFormError(
        error.message ||
        'Failed to load quiz.'
      );

    } finally {

      setSelectedQuizLoading(false);

    }

  };


  // =========================================================
  // CREATE / UPDATE QUIZ
  // =========================================================

  const saveQuiz = async () => {

    setQuizFormMessage('');
    setQuizFormError('');


    // -------------------------------------------------------
    // TITLE
    // -------------------------------------------------------

    if (
      !quizTitle.trim()
    ) {

      setQuizFormError(
        'Please enter a quiz title.'
      );

      return;

    }


    // -------------------------------------------------------
    // QUESTIONS
    // -------------------------------------------------------

    if (
      newQuestions.length === 0
    ) {

      setQuizFormError(
        'Please add at least one question.'
      );

      return;

    }


    for (
      let i = 0;
      i < newQuestions.length;
      i++
    ) {

      const item =
        newQuestions[i];


      if (
        !item.question.trim()
      ) {

        setQuizFormError(
          `Please enter Question ${i + 1}.`
        );

        return;

      }


      if (
        item.options.length !== 4 ||
        item.options.some(
          (option) =>
            !option.trim()
        )
      ) {

        setQuizFormError(
          `Please fill all 4 options for Question ${i + 1}.`
        );

        return;

      }


      const correctAnswer =
        Number(
          item.correct_answer
        );


      if (
        !Number.isInteger(
          correctAnswer
        ) ||
        correctAnswer < 0 ||
        correctAnswer > 3
      ) {

        setQuizFormError(
          `Please select a valid correct answer for Question ${i + 1}.`
        );

        return;

      }

    }


    try {

      setQuizFormLoading(true);


      const isEditing =
        editingQuizId !== null;


      const endpoint =
        isEditing

          ? `${API_BASE_URL}/api/admin/quizzes/${editingQuizId}`

          : `${API_BASE_URL}/api/admin/quizzes`;


      const method =
        isEditing
          ? 'PUT'
          : 'POST';


      const response =
        await fetch(
          endpoint,
          {
            method,

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({

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
          (
            isEditing
              ? 'Failed to update quiz.'
              : 'Failed to create quiz.'
          )
        );

      }


      setQuizFormMessage(
        isEditing

          ? 'Quiz updated successfully!'

          : (
              data.quiz?.title
                ? `Quiz "${data.quiz.title}" created successfully!`
                : 'Quiz created successfully!'
            )
      );


      await loadQuizzes();

      await loadAdminData();


      // -----------------------------------------------------
      // AFTER CREATE
      // -----------------------------------------------------

      if (!isEditing) {

        resetQuizForm();

        setQuizFormMessage(
          'Quiz created successfully!'
        );

      }

    } catch (error) {

      console.error(
        'Save quiz error:',
        error
      );


      setQuizFormError(
        error.message ||
        'Failed to save quiz.'
      );

    } finally {

      setQuizFormLoading(false);

    }

  };


  // =========================================================
  // DELETE QUIZ
  // =========================================================

  const deleteQuiz = async (
    quizId,
    quizTitleToDelete
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${quizTitleToDelete}"?\n\nThis action cannot be undone.`
      );


    if (!confirmed) {
      return;
    }


    try {

      setQuizzesError('');


      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/quizzes/${quizId}`,
          {
            method: 'DELETE',
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
          'Failed to delete quiz.'
        );

      }


      setSelectedQuiz(null);

      setQuizMode('list');


      await loadQuizzes();


      setQuizzesError(
        ''
      );


      window.alert(
        'Quiz deleted successfully.'
      );


    } catch (error) {

      console.error(
        'Delete quiz error:',
        error
      );


      window.alert(
        error.message ||
        'Failed to delete quiz.'
      );

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


            const updatedOptions =
              [
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
            PERFORMANCE
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

                        {
                          student.rank <= 3

                            ? [
                                '🥇',
                                '🥈',
                                '🥉',
                              ][
                                student.rank - 1
                              ]

                            : `#${student.rank}`
                        }

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

                      {
                        student.rank <= 3

                          ? [
                              '🥇',
                              '🥈',
                              '🥉',
                            ][
                              student.rank - 1
                            ]

                          : `#${student.rank}`
                      }

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
  // QUIZ LIST
  // =========================================================

  const renderQuizList = () => {

    return (

      <div className="admin-content">

        <div className="admin-section-card">


          <div className="admin-section-header">

            <div>

              <span className="admin-section-icon">
                📝
              </span>

              <div>

                <h2>
                  Quiz Management
                </h2>

                <p>
                  Create, view, edit and manage
                  Industrial IoT quizzes.
                </p>

              </div>

            </div>


            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >

              <button
                className="admin-refresh-button"
                onClick={
                  loadQuizzes
                }
              >
                🔄 Refresh
              </button>


              <button
                className="create-quiz-submit"
                onClick={
                  openCreateQuiz
                }
              >
                ➕ Create Quiz
              </button>

            </div>

          </div>


          {quizzesError && (

            <div className="create-quiz-error">
              ⚠️ {quizzesError}
            </div>

          )}


          {quizzesLoading ? (

            <div className="admin-loading">

              <div className="admin-loading-icon">
                ⚡
              </div>

              <h2>
                Loading Quizzes...
              </h2>

              <p>
                Fetching Quizforge assessments.
              </p>

            </div>

          ) : quizzes.length === 0 ? (

            <div className="admin-empty">

              <div
                style={{
                  fontSize: '40px',
                  marginBottom: '10px',
                }}
              >
                📝
              </div>

              <h3>
                No quizzes found
              </h3>

              <p>
                Create your first Industrial IoT quiz.
              </p>


              <button
                className="create-quiz-submit"
                onClick={
                  openCreateQuiz
                }
              >
                ➕ Create Your First Quiz
              </button>

            </div>

          ) : (

            <div
              className="quiz-management-grid"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >

              {quizzes.map(
                (quiz) => (

                  <article
                    className="admin-section-card"
                    key={
                      quiz.id
                    }
                    style={{
                      margin: 0,
                    }}
                  >

                    <div
                      style={{
                        fontSize: '32px',
                        marginBottom: '12px',
                      }}
                    >
                      📘
                    </div>


                    <h3>
                      {quiz.title}
                    </h3>


                    <p>
                      {quiz.description ||
                        'Industrial IoT assessment'}
                    </p>


                    <div
                      style={{
                        fontSize: '13px',
                        opacity: 0.7,
                        margin:
                          '12px 0',
                      }}
                    >
                      Quiz ID: #{quiz.id}
                    </div>


                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >

                      <button
                        className="admin-refresh-button"
                        onClick={() =>
                          loadSingleQuiz(
                            quiz.id
                          )
                        }
                      >
                        👁️ View
                      </button>


                      <button
                        className="admin-refresh-button"
                        onClick={() =>
                          openEditQuiz(
                            quiz.id
                          )
                        }
                      >
                        ✏️ Edit
                      </button>


                      <button
                        className="remove-question-button"
                        onClick={() =>
                          deleteQuiz(
                            quiz.id,
                            quiz.title
                          )
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </div>

      </div>

    );

  };


  // =========================================================
  // VIEW SINGLE QUIZ
  // =========================================================

  const renderViewQuiz = () => {

    if (
      selectedQuizLoading
    ) {

      return (

        <div className="admin-content">

          <div className="admin-section-card">

            <div className="admin-loading">

              <div className="admin-loading-icon">
                ⚡
              </div>

              <h2>
                Loading Quiz...
              </h2>

              <p>
                Fetching quiz questions.
              </p>

            </div>

          </div>

        </div>

      );

    }


    if (
      selectedQuizError
    ) {

      return (

        <div className="admin-content">

          <div className="admin-section-card">

            <div className="create-quiz-error">
              ⚠️ {selectedQuizError}
            </div>


            <button
              className="admin-refresh-button"
              onClick={() => {
                setSelectedQuizError('');
                setQuizMode('list');
              }}
            >
              ← Back to Quizzes
            </button>

          </div>

        </div>

      );

    }


    if (
      !selectedQuiz
    ) {

      return (

        <div className="admin-content">

          <div className="admin-section-card">

            <div className="admin-empty">
              Quiz information is unavailable.
            </div>

          </div>

        </div>

      );

    }


    const quiz =
      selectedQuiz.quiz;


    const questions =
      Array.isArray(
        selectedQuiz.questions
      )
        ? selectedQuiz.questions
        : [];


    return (

      <div className="admin-content">

        <div className="admin-section-card">


          <div className="admin-section-header">

            <div>

              <span className="admin-section-icon">
                📘
              </span>

              <div>

                <h2>
                  {quiz.title}
                </h2>

                <p>
                  {quiz.description ||
                    'Industrial IoT assessment'}
                </p>

              </div>

            </div>


            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >

              <button
                className="admin-refresh-button"
                onClick={() =>
                  openEditQuiz(
                    quiz.id
                  )
                }
              >
                ✏️ Edit
              </button>


              <button
                className="admin-refresh-button"
                onClick={() => {
                  setSelectedQuiz(null);
                  setQuizMode('list');
                }}
              >
                ← Back
              </button>

            </div>

          </div>


          <div
            style={{
              marginBottom: '20px',
              opacity: 0.7,
            }}
          >
            <strong>
              Quiz ID:
            </strong>{' '}
            #{quiz.id}
            {' • '}
            <strong>
              Questions:
            </strong>{' '}
            {questions.length}
          </div>


          {questions.length === 0 ? (

            <div className="admin-empty">
              This quiz has no questions.
            </div>

          ) : (

            <div>

              {questions.map(
                (
                  question,
                  index
                ) => (

                  <div
                    className="create-question-card"
                    key={
                      question.id ||
                      index
                    }
                  >

                    <div className="create-question-header">

                      <div>

                        <span>
                          QUESTION {index + 1}
                        </span>

                        <h3>
                          {question.question}
                        </h3>

                      </div>

                    </div>


                    <div
                      style={{
                        display: 'grid',
                        gap: '10px',
                      }}
                    >

                      {(
                        Array.isArray(
                          question.options
                        )
                          ? question.options
                          : []
                      ).map(
                        (
                          option,
                          optionIndex
                        ) => (

                          <div
                            key={
                              optionIndex
                            }
                            style={{
                              padding:
                                '12px 15px',
                              borderRadius:
                                '8px',
                              border:
                                optionIndex ===
                                Number(
                                  question.correct_answer
                                )
                                  ? '2px solid #00D9FF'
                                  : '1px solid #1D405C',
                            }}
                          >

                            <strong>
                              {
                                String.fromCharCode(
                                  65 +
                                  optionIndex
                                )
                              }
                              .
                            </strong>{' '}

                            {option}


                            {optionIndex ===
                              Number(
                                question.correct_answer
                              ) && (

                              <span
                                style={{
                                  marginLeft:
                                    '10px',
                                }}
                              >
                                ✓ Correct
                              </span>

                            )}

                          </div>

                        )
                      )}

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
  // QUIZ FORM
  // =========================================================

  const renderQuizForm = () => {

    const isEditing =
      editingQuizId !== null;


    return (

      <div className="admin-content">

        <div className="admin-section-card">


          <div className="admin-section-header">

            <div>

              <span className="admin-section-icon">
                {isEditing
                  ? '✏️'
                  : '➕'}
              </span>

              <div>

                <h2>
                  {isEditing
                    ? 'Edit Quiz'
                    : 'Create New Quiz'}
                </h2>

                <p>
                  {isEditing
                    ? 'Update quiz details and questions.'
                    : 'Create an Industrial IoT assessment for students.'}
                </p>

              </div>

            </div>


            <button
              className="admin-refresh-button"
              onClick={() => {

                resetQuizForm();

                setQuizMode('list');

              }}
              disabled={
                quizFormLoading
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
                        disabled={
                          quizFormLoading
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
                              {
                                String.fromCharCode(
                                  65 +
                                  optionIndex
                                )
                              }
                            </span>

                            <label>
                              Option{' '}
                              {
                                String.fromCharCode(
                                  65 +
                                  optionIndex
                                )
                              }
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
            disabled={
              quizFormLoading
            }
          >
            ➕ Add Another Question
          </button>


          {/* =================================================
              MESSAGES
              ================================================= */}

          {quizFormError && (

            <div className="create-quiz-error">
              ⚠️ {quizFormError}
            </div>

          )}


          {quizFormMessage && (

            <div className="create-quiz-success">
              ✅ {quizFormMessage}
            </div>

          )}


          {/* =================================================
              ACTIONS
              ================================================= */}

          <div className="create-quiz-actions">


            <button
              type="button"
              className="create-quiz-cancel"
              onClick={() => {

                resetQuizForm();

                setQuizMode('list');

              }}
              disabled={
                quizFormLoading
              }
            >
              Cancel
            </button>


            <button
              type="button"
              className="create-quiz-submit"
              onClick={
                saveQuiz
              }
              disabled={
                quizFormLoading
              }
            >

              {quizFormLoading

                ? '⏳ Saving Quiz...'

                : (
                    isEditing
                      ? '💾 Update Quiz'
                      : '⚡ Create Quiz'
                  )}

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

            setQuizMode(
              'list'
            );
git 

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

            setQuizMode(
              'list'
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

            setQuizMode(
              'list'
            );

          }}
        >
          🏆 Rankings
        </button>


        <button
          className={
            activeSection ===
              'quizzes'
              ? 'admin-nav-button active'
              : 'admin-nav-button'
          }
          onClick={() => {

            setActiveSection(
              'quizzes'
            );

            setQuizMode(
              'list'
            );

            setSelectedQuiz(
              null
            );

          }}
        >
          📝 Manage Quizzes
        </button>


        <button
          className="admin-nav-button"
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
              'quizzes' &&

              quizMode === 'list' &&
              renderQuizList()}


            {activeSection ===
              'quizzes' &&

              quizMode === 'view' &&
              renderViewQuiz()}


            {activeSection ===
              'quizzes' &&

              (
                quizMode === 'create' ||
                quizMode === 'edit'
              ) &&
              renderQuizForm()}

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