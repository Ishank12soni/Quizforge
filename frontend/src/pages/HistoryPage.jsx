import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './HistoryPage.css';


// =========================================================
// QUIZFORGE HISTORY PAGE
// =========================================================

function HistoryPage() {

  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // =========================================================
  // TOPIC INFORMATION
  // =========================================================

  const topicInfo = {
    1: {
      name: 'IoT Fundamentals',
      icon: '🔗',
    },

    2: {
      name: 'Sensors & Actuators',
      icon: '📊',
    },

    3: {
      name: 'Communication Protocols',
      icon: '📡',
    },

    4: {
      name: 'Industrial Automation',
      icon: '🏭',
    },

    5: {
      name: 'Cloud & Edge Computing',
      icon: '☁️',
    },

    6: {
      name: 'IoT Security',
      icon: '🔒',
    },
  };


  // =========================================================
  // LOAD HISTORY
  // =========================================================

  useEffect(() => {

    const studentId =
      Number(
        localStorage.getItem(
          'quizforge_student_id'
        )
      ) || 0;


    if (!studentId) {

      setError(
        'Student information was not found. Please enter your name again.'
      );

      setLoading(false);

      return;

    }


    const loadHistory = async () => {

      try {

        setLoading(true);
        setError('');


        const response =
          await fetch(
            `http://localhost:5001/api/quiz/history?studentId=${studentId}`
          );


        if (!response.ok) {

          throw new Error(
            'Failed to load quiz history'
          );

        }


        const data =
          await response.json();


        setHistory(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (err) {

        console.error(
          'History loading error:',
          err
        );


        setError(
          err.message ||
            'Unable to load quiz history.'
        );


      } finally {

        setLoading(false);

      }

    };


    loadHistory();

  }, []);


  // =========================================================
  // STUDENT NAME
  // =========================================================

  const studentName =
    localStorage.getItem(
      'quizforge_student_name'
    ) || 'Student';


  // =========================================================
  // GET TOPIC
  // =========================================================

  const getTopic = (attempt) => {

    const quizId =
      Number(
        attempt.quiz_id
      );


    return (
      topicInfo[quizId] || {
        name:
          attempt.topic ||
          `Quiz ${quizId}`,

        icon:
          '📝',
      }
    );

  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {

    if (!date) {
      return 'Unknown date';
    }


    try {

      return new Date(date).toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }
      );

    } catch {

      return 'Unknown date';

    }

  };


  // =========================================================
  // PERFORMANCE LABEL
  // =========================================================

  const getPerformanceLabel = (
    percentage
  ) => {

    if (percentage >= 90) {
      return 'Outstanding';
    }

    if (percentage >= 80) {
      return 'Excellent';
    }

    if (percentage >= 60) {
      return 'Good';
    }

    return 'Needs Practice';

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <section className="history-page">

        <div className="history-container">

          <div className="history-loading">

            <div>
              ⚡
            </div>

            <h2>
              Loading Your History...
            </h2>

            <p>
              Fetching your Industrial IoT quiz attempts.
            </p>

          </div>

        </div>

      </section>

    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (

      <section className="history-page">

        <div className="history-container">

          <div className="history-empty">

            <div className="history-empty-icon">
              ⚠️
            </div>

            <h2>
              Unable to Load History
            </h2>

            <p>
              {error}
            </p>

          </div>

        </div>

      </section>

    );

  }


  // =========================================================
  // EMPTY HISTORY
  // =========================================================

  if (history.length === 0) {

    return (

      <section className="history-page">

        <div className="history-container">


          <div className="history-header">

            <span className="history-badge">
              📚 STUDENT HISTORY
            </span>

            <h1>
              Quiz History
            </h1>

            <p>
              Track your Industrial IoT quiz attempts
              and learning progress.
            </p>

          </div>


          <div className="history-empty">

            <div className="history-empty-icon">
              📝
            </div>

            <h2>
              No Quiz Attempts Yet
            </h2>

            <p>
              Complete your first Industrial IoT quiz
              to see your performance here.
            </p>

          </div>

        </div>

      </section>

    );

  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (

    <section className="history-page">

      <div className="history-container">


        {/* =================================================
            HEADER
            ================================================= */}

        <div className="history-header">

          <span className="history-badge">
            📚 STUDENT HISTORY
          </span>

          <h1>
            Quiz <span>History</span>
          </h1>

          <p>
            Track your Industrial IoT quiz attempts,
            scores, and learning progress.
          </p>

        </div>


        {/* =================================================
            HISTORY LIST
            ================================================= */}

        <div className="history-list">

          {history.map(
            (attempt, index) => {

              const topic =
                getTopic(attempt);


              const percentage =
                Math.min(
                  Math.max(
                    Number(
                      attempt.percentage
                    ) || 0,
                    0
                  ),
                  100
                );


              const score =
                Number(
                  attempt.score
                ) || 0;


              const totalQuestions =
                Number(
                  attempt.total_questions
                ) || 0;


              const performance =
                getPerformanceLabel(
                  percentage
                );


              return (

                <article
                  className="history-card"
                  key={
                    attempt.id ||
                    `${attempt.quiz_id}-${index}`
                  }
                >


                  {/* =================================================
                      CARD TOP
                      ================================================= */}

                  <div className="history-card-top">


                    {/* NUMBER */}

                    <div className="history-card-number">

                      #{index + 1}

                    </div>


                    {/* TOPIC */}

                    <div className="history-card-topic">

                      <span>
                        {topic.icon}
                      </span>

                      <div>

                        <h3>
                          {topic.name}
                        </h3>

                        <p>
                          Industrial IoT Assessment
                        </p>

                      </div>

                    </div>


                    {/* SCORE */}

                    <div className="history-card-score">

                      <strong>
                        {percentage}%
                      </strong>

                      <span>
                        {performance}
                      </span>

                    </div>


                  </div>


                  {/* =================================================
                      PROGRESS BAR
                      ================================================= */}

                  <div className="history-progress">

                    <div
                      style={{
                        width:
                          `${percentage}%`,
                      }}
                    />

                  </div>


                  {/* =================================================
                      DETAILS
                      ================================================= */}

                  <div className="history-details">


                    {/* CORRECT */}

                    <div>

                      <span>
                        ✓
                      </span>

                      <div>

                        <strong>
                          {score} Correct
                        </strong>

                        <small>
                          Answers
                        </small>

                      </div>

                    </div>


                    {/* QUESTIONS */}

                    <div>

                      <span>
                        📚
                      </span>

                      <div>

                        <strong>
                          {totalQuestions} Questions
                        </strong>

                        <small>
                          Quiz Size
                        </small>

                      </div>

                    </div>


                    {/* DATE */}

                    <div>

                      <span>
                        📅
                      </span>

                      <div>

                        <strong>
                          {formatDate(
                            attempt.attempted_at
                          )}
                        </strong>

                        <small>
                          Attempted
                        </small>

                      </div>

                    </div>


                  </div>


                </article>

              );

            }
          )}

        </div>


      </div>

    </section>

  );

}


export default HistoryPage;