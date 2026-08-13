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

  const [performanceLoading, setPerformanceLoading] =
    useState(true);

  // =========================================================
  // STUDENT INFORMATION
  // =========================================================

  const studentName =
    localStorage.getItem(
      'quizforge_student_name'
    ) || 'Student';


  const studentId =
    localStorage.getItem(
      'quizforge_student_id'
    );


  // =========================================================
  // EXPLORE
  // =========================================================

  const handleExplore = () => {

    setShowExplore(true);

    setTimeout(() => {

      document
        .getElementById('explore')
        ?.scrollIntoView({
          behavior: 'smooth',
        });

    }, 50);

  };


  // =========================================================
  // LOAD STUDENT PERFORMANCE
  // =========================================================

  useEffect(() => {

    const loadPerformance = async () => {

      // -----------------------------------------------------
      // CHECK STUDENT ID
      // -----------------------------------------------------

      if (!studentId) {

        console.warn(
          'No student ID found in localStorage.'
        );

        setPerformance({
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          totalCorrect: 0,
          totalQuestions: 0,
        });

        setHistory([]);

        setPerformanceLoading(false);

        return;
      }


      try {

        setPerformanceLoading(true);


        // ---------------------------------------------------
        // STUDENT-SPECIFIC API REQUESTS
        // ---------------------------------------------------

        const [
          performanceResponse,
          historyResponse,
        ] = await Promise.all([

          fetch(
            `http://localhost:5001/api/quiz/performance?studentId=${studentId}`
          ),

          fetch(
            `http://localhost:5001/api/quiz/history?studentId=${studentId}`
          ),

        ]);


        // ---------------------------------------------------
        // PERFORMANCE
        // ---------------------------------------------------

        if (performanceResponse.ok) {

          const performanceData =
            await performanceResponse.json();

          setPerformance(
            performanceData
          );

        } else {

          console.error(
            'Failed to load student performance'
          );

          setPerformance({
            totalAttempts: 0,
            averageScore: 0,
            bestScore: 0,
            totalCorrect: 0,
            totalQuestions: 0,
          });

        }


        // ---------------------------------------------------
        // HISTORY
        // ---------------------------------------------------

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
            'Failed to load student history'
          );

          setHistory([]);

        }

      } catch (error) {

        console.error(
          'Student performance loading error:',
          error
        );

        setPerformance({
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          totalCorrect: 0,
          totalQuestions: 0,
        });

        setHistory([]);

      } finally {

        setPerformanceLoading(false);

      }

    };


    loadPerformance();

  }, [studentId]);


  return (
    <>
      <Navbar />


      <main>

        {/* =====================================================
            STUDENT WELCOME
            ===================================================== */}

        <section className="student-welcome">

          <div className="student-welcome-container">

            <span className="student-welcome-badge">
              👨‍🎓 STUDENT PORTAL
            </span>


            <h1>

              Welcome,{' '}

              <span>
                {studentName}
              </span>

              {' '}👋

            </h1>


            <p>
              Continue your Industrial IoT learning
              journey and improve your quiz performance.
            </p>

          </div>

        </section>


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
                HEADER
                ================================================= */}

            <div className="home-performance-header">

              <div className="home-performance-badge">

                📊{' '}

                {studentName.toUpperCase()}

                {' '}PERFORMANCE

              </div>


              <h2>

                Track Your{' '}

                <span>
                  Industrial IoT
                </span>

                {' '}Progress

              </h2>


              <p>
                Monitor your quiz attempts, scores,
                and learning progress in one place.
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
                        {performance.totalAttempts ?? 0}
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
                        {performance.averageScore ?? 0}%
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
                        {performance.bestScore ?? 0}%
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
                        {performance.totalCorrect ?? 0}
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
                        Based on all your completed quizzes.
                      </p>

                    </div>


                    <strong>
                      {performance.averageScore ?? 0}%
                    </strong>

                  </div>


                  <div className="home-performance-progress">

                    <div
                      style={{
                        width: `${Math.min(
                          Math.max(
                            Number(
                              performance.averageScore
                            ) || 0,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />

                  </div>


                  <div className="home-performance-overview-stats">

                    <span>

                      🎯{' '}

                      {performance.totalCorrect ?? 0}

                      {' '}correct answers

                    </span>


                    <span>

                      📚{' '}

                      {performance.totalQuestions ?? 0}

                      {' '}questions attempted

                    </span>

                  </div>

                </div>


                {/* =================================================
                    RECENT HISTORY
                    ================================================= */}

                <div className="home-history">

                  <div className="home-history-header">

                    <div>

                      <h3>
                        {studentName}'s Recent Quiz Attempts
                      </h3>

                      <p>
                        Your latest Industrial IoT assessments.
                      </p>

                    </div>

                  </div>


                  {history.length > 0 ? (

                    <div className="home-history-list">

                      {history
                        .slice(0, 5)
                        .map((attempt) => (

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
                                  {attempt.total_questions}

                                  {' '}correct

                                </span>

                              </div>

                            </div>


                            {/* RIGHT */}

                            <div className="home-history-right">

                              <strong>
                                {attempt.percentage}%
                              </strong>


                              <div className="home-history-bar">

                                <div
                                  style={{
                                    width: `${Math.min(
                                      Math.max(
                                        Number(
                                          attempt.percentage
                                        ) || 0,
                                        0
                                      ),
                                      100
                                    )}%`,
                                  }}
                                />

                              </div>

                            </div>

                          </div>

                        ))}

                    </div>

                  ) : (

                    <div className="home-history-empty">

                      <span>
                        📝
                      </span>


                      <h4>
                        No quiz attempts yet
                      </h4>


                      <p>
                        Complete your first quiz to
                        start tracking your progress.
                      </p>

                    </div>

                  )}

                </div>

              </>

            ) : (

              <div className="home-performance-empty">

                <div>
                  📊
                </div>


                <h3>
                  Start Your Learning Journey
                </h3>


                <p>
                  Complete a quiz and your performance
                  statistics will appear here.
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


      <Footer />

    </>
  );
}

export default HomePage;