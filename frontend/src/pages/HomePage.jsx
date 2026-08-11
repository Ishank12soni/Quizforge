import { useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ExploreSection from '../components/ExploreSection';
import WhySection from '../components/WhySection';
import Footer from '../components/Footer';

import './HomePage.css';

function HomePage() {
  const [showExplore, setShowExplore] = useState(false);

  const [performance, setPerformance] = useState(null);
  const [history, setHistory] = useState([]);

  const [performanceLoading, setPerformanceLoading] = useState(true);

  /* =========================================================
     EXPLORE
     ========================================================= */

  const handleExplore = () => {
    setShowExplore(true);

    setTimeout(() => {
      document.getElementById('explore')?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 50);
  };

  /* =========================================================
     LOAD PERFORMANCE + HISTORY
     ========================================================= */

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        setPerformanceLoading(true);

        const [
          performanceResponse,
          historyResponse,
        ] = await Promise.all([
          fetch(
            'http://localhost:5001/api/quiz/performance'
          ),

          fetch(
            'http://localhost:5001/api/quiz/history'
          ),
        ]);

        /* ---------------------------------------------------
           PERFORMANCE
           --------------------------------------------------- */

        if (performanceResponse.ok) {
          const performanceData =
            await performanceResponse.json();

          setPerformance(performanceData);
        } else {
          console.error(
            'Failed to load performance data'
          );

          setPerformance(null);
        }

        /* ---------------------------------------------------
           HISTORY
           --------------------------------------------------- */

        if (historyResponse.ok) {
          const historyData =
            await historyResponse.json();

          setHistory(
            Array.isArray(historyData)
              ? historyData
              : []
          );
        } else {
          console.error(
            'Failed to load quiz history'
          );

          setHistory([]);
        }
      } catch (error) {
        console.error(
          'Performance loading error:',
          error
        );

        setPerformance(null);
        setHistory([]);
      } finally {
        setPerformanceLoading(false);
      }
    };

    loadPerformance();
  }, []);

  /* =========================================================
     SAFE VALUES
     ========================================================= */

  const averageScore = Math.min(
    Math.max(
      Number(performance?.averageScore) || 0,
      0
    ),
    100
  );

  const bestScore = Math.min(
    Math.max(
      Number(performance?.bestScore) || 0,
      0
    ),
    100
  );

  const totalAttempts =
    Number(performance?.totalAttempts) || 0;

  const totalCorrect =
    Number(performance?.totalCorrect) || 0;

  const totalQuestions =
    Number(performance?.totalQuestions) || 0;

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <>
      <Navbar />

      <main>

        {/* =====================================================
            HERO
            ===================================================== */}

        <Hero
          onExplore={handleExplore}
        />


        {/* =====================================================
            EXPLORE
            ===================================================== */}

        {showExplore && (
          <ExploreSection />
        )}


        {/* =====================================================
            PERFORMANCE DASHBOARD
            ===================================================== */}

        <section className="home-performance">

          <div className="home-performance-container">

            {/* =================================================
                PERFORMANCE HEADER
                ================================================= */}

            <div className="home-performance-header">

              <div className="home-performance-badge">
                📊 YOUR PERFORMANCE
              </div>

              <h2>
                Track Your{' '}
                <span>
                  Industrial IoT
                </span>{' '}
                Progress
              </h2>

              <p>
                Monitor your quiz attempts,
                scores, and learning progress
                in one place.
              </p>

            </div>


            {/* =================================================
                LOADING
                ================================================= */}

            {performanceLoading ? (

              <div className="performance-loading">

                <div className="performance-loading-icon">
                  ⚡
                </div>

                <p>
                  Loading your performance...
                </p>

              </div>

            ) : performance ? (

              <>

                {/* =================================================
                    PERFORMANCE CARDS
                    ================================================= */}

                <div className="home-performance-grid">

                  {/* TOTAL ATTEMPTS */}

                  <div className="home-performance-card">

                    <div className="home-performance-icon">
                      📝
                    </div>

                    <div>

                      <strong>
                        {totalAttempts}
                      </strong>

                      <span>
                        Total Attempts
                      </span>

                    </div>

                  </div>


                  {/* AVERAGE SCORE */}

                  <div className="home-performance-card">

                    <div className="home-performance-icon">
                      📈
                    </div>

                    <div>

                      <strong>
                        {averageScore}%
                      </strong>

                      <span>
                        Average Score
                      </span>

                    </div>

                  </div>


                  {/* BEST SCORE */}

                  <div className="home-performance-card">

                    <div className="home-performance-icon">
                      🏆
                    </div>

                    <div>

                      <strong>
                        {bestScore}%
                      </strong>

                      <span>
                        Best Score
                      </span>

                    </div>

                  </div>


                  {/* CORRECT ANSWERS */}

                  <div className="home-performance-card">

                    <div className="home-performance-icon">
                      ✓
                    </div>

                    <div>

                      <strong>
                        {totalCorrect}
                      </strong>

                      <span>
                        Correct Answers
                      </span>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    OVERALL PROGRESS
                    ================================================= */}

                <div className="home-performance-overview">

                  <div className="home-performance-overview-header">

                    <div>

                      <h3>
                        Overall Learning Progress
                      </h3>

                      <p>
                        Based on all your completed
                        quizzes.
                      </p>

                    </div>

                    <strong>
                      {averageScore}%
                    </strong>

                  </div>


                  {/* PROGRESS BAR */}

                  <div className="home-performance-progress">

                    <div
                      style={{
                        width: `${averageScore}%`,
                      }}
                    />

                  </div>


                  {/* PROGRESS STATS */}

                  <div className="home-performance-overview-stats">

                    <span>
                      🎯 {totalCorrect}{' '}
                      correct answers
                    </span>

                    <span>
                      📚 {totalQuestions}{' '}
                      questions attempted
                    </span>

                  </div>

                </div>


                {/* =================================================
                    RECENT QUIZ HISTORY
                    ================================================= */}

                <div className="home-history">

                  <div className="home-history-header">

                    <div>

                      <h3>
                        Recent Quiz Attempts
                      </h3>

                      <p>
                        Your latest Industrial IoT
                        assessments.
                      </p>

                    </div>

                  </div>


                  {/* HISTORY EXISTS */}

                  {history.length > 0 ? (

                    <div className="home-history-list">

                      {history
                        .slice(0, 5)
                        .map((attempt) => {

                          const percentage = Math.min(
                            Math.max(
                              Number(
                                attempt.percentage
                              ) || 0,
                              0
                            ),
                            100
                          );

                          return (

                            <div
                              className="home-history-item"
                              key={attempt.id}
                            >

                              {/* LEFT */}

                              <div className="home-history-left">

                                <div className="home-history-icon">
                                  📊
                                </div>

                                <div>

                                  <strong>
                                    {attempt.topic ||
                                      `Quiz ${attempt.quiz_id}`}
                                  </strong>

                                  <span>
                                    {attempt.score}/
                                    {attempt.total_questions}{' '}
                                    correct
                                  </span>

                                </div>

                              </div>


                              {/* RIGHT */}

                              <div className="home-history-right">

                                <strong>
                                  {percentage}%
                                </strong>

                                <div className="home-history-bar">

                                  <div
                                    style={{
                                      width: `${percentage}%`,
                                    }}
                                  />

                                </div>

                              </div>

                            </div>

                          );
                        })}

                    </div>

                  ) : (

                    /* =================================================
                       NO HISTORY
                       ================================================= */

                    <div className="home-history-empty">

                      <span>
                        📝
                      </span>

                      <h4>
                        No quiz attempts yet
                      </h4>

                      <p>
                        Complete your first quiz
                        to start tracking your
                        progress.
                      </p>

                    </div>

                  )}

                </div>

              </>

            ) : (

              /* =================================================
                 NO PERFORMANCE
                 ================================================= */

              <div className="home-performance-empty">

                <div>
                  📊
                </div>

                <h3>
                  Start Your Learning Journey
                </h3>

                <p>
                  Complete a quiz and your
                  performance statistics
                  will appear here.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* =====================================================
            WHY QUIZFORGE
            ===================================================== */}

        <WhySection />

      </main>


      {/* =======================================================
          FOOTER
          ======================================================= */}

      <Footer />

    </>
  );
}

export default HomePage;