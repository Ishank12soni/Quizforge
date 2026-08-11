import { useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import './HistoryPage.css';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD HISTORY
     ========================================================= */

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          'http://localhost:5001/api/quiz/history'
        );

        if (!response.ok) {
          throw new Error(
            'Failed to load quiz history'
          );
        }

        const data = await response.json();

        setHistory(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          'History loading error:',
          error
        );

        setHistory([]);

      } finally {

        setLoading(false);

      }
    };

    loadHistory();
  }, []);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="history-page">

          <div className="history-container">

            <div className="history-loading">

              <div>
                ⚡
              </div>

              <h2>
                Loading Quiz History...
              </h2>

              <p>
                Fetching your previous Industrial
                IoT assessments.
              </p>

            </div>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  /* =========================================================
     HISTORY PAGE
     ========================================================= */

  return (
    <>
      <Navbar />

      <main className="history-page">

        <div className="history-container">

          {/* =================================================
              HEADER
              ================================================= */}

          <div className="history-header">

            <div className="history-badge">
              📚 QUIZ HISTORY
            </div>

            <h1>
              Your Quiz{' '}
              <span>History</span>
            </h1>

            <p>
              Review your previous Industrial IoT
              assessments and track your progress.
            </p>

          </div>


          {/* =================================================
              EMPTY
              ================================================= */}

          {history.length === 0 ? (

            <div className="history-empty">

              <div className="history-empty-icon">
                📝
              </div>

              <h2>
                No Quiz Attempts Yet
              </h2>

              <p>
                Complete your first Industrial IoT
                quiz and your results will appear
                here.
              </p>

            </div>

          ) : (

            /* =================================================
               HISTORY LIST
               ================================================= */

            <div className="history-list">

              {history.map((attempt, index) => {

                const percentage = Math.min(
                  Math.max(
                    Number(
                      attempt.percentage
                    ) || 0,
                    0
                  ),
                  100
                );

                let status = 'Needs Practice';

                if (percentage >= 90) {
                  status = 'Outstanding';
                } else if (percentage >= 80) {
                  status = 'Excellent';
                } else if (percentage >= 60) {
                  status = 'Good';
                }

                return (

                  <div
                    className="history-card"
                    key={attempt.id}
                  >

                    {/* TOP */}

                    <div className="history-card-top">

                      <div className="history-card-number">
                        #{index + 1}
                      </div>

                      <div className="history-card-topic">

                        <span>
                          📊
                        </span>

                        <div>

                          <h3>
                            {attempt.topic ||
                              `Quiz ${attempt.quiz_id}`}
                          </h3>

                          <p>
                            Industrial IoT Assessment
                          </p>

                        </div>

                      </div>

                      <div className="history-card-score">

                        <strong>
                          {percentage}%
                        </strong>

                        <span>
                          {status}
                        </span>

                      </div>

                    </div>


                    {/* PROGRESS */}

                    <div className="history-progress">

                      <div
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>


                    {/* DETAILS */}

                    <div className="history-details">

                      <div>

                        <span>
                          ✓
                        </span>

                        <strong>
                          {attempt.score}
                        </strong>

                        <small>
                          Correct
                        </small>

                      </div>


                      <div>

                        <span>
                          📚
                        </span>

                        <strong>
                          {attempt.total_questions}
                        </strong>

                        <small>
                          Questions
                        </small>

                      </div>


                      <div>

                        <span>
                          📅
                        </span>

                        <strong>
                          {attempt.attempted_at
                            ? new Date(
                                attempt.attempted_at
                              ).toLocaleDateString()
                            : '—'}
                        </strong>

                        <small>
                          Attempted
                        </small>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>

      </main>

      <Footer />
    </>
  );
}

export default HistoryPage;