import { useLocation, useNavigate } from 'react-router-dom';

import './ResultPage.css';

function ResultPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;


  // =========================================================
  // NO RESULT PROTECTION
  // =========================================================

  if (!result) {

    return (
      <main className="result-page">

        <div className="result-empty">

          <div className="result-empty-icon">
            📊
          </div>

          <h1>
            No Quiz Result Found
          </h1>

          <p>
            Please complete a quiz first to view your result.
          </p>

          <button
            onClick={() => navigate('/student/home')}
          >
            ← Back to Student Portal
          </button>

        </div>

      </main>
    );

  }


  const review = Array.isArray(result.review)
    ? result.review
    : [];


  const correctAnswers = review.filter(
    (item) => item.isCorrect
  ).length;


  const wrongAnswers =
    review.length - correctAnswers;


  const percentage =
    Number(result.percentage) || 0;


  // =========================================================
  // PERFORMANCE MESSAGE
  // =========================================================

  let performanceMessage = '';
  let performanceIcon = '📊';

  if (percentage >= 90) {

    performanceMessage =
      'Outstanding! You have excellent Industrial IoT knowledge.';

    performanceIcon = '🏆';

  } else if (percentage >= 75) {

    performanceMessage =
      'Great work! Your Industrial IoT fundamentals are strong.';

    performanceIcon = '🎯';

  } else if (percentage >= 50) {

    performanceMessage =
      'Good effort! Keep practicing to improve your score.';

    performanceIcon = '📈';

  } else {

    performanceMessage =
      'Keep learning! Review the answers and try the quiz again.';

    performanceIcon = '💪';

  }


  // =========================================================
  // RESTART QUIZ
  // =========================================================

  const handleRetry = () => {

    navigate(
      `/student/quiz?quizId=${result.quizId}`
    );

  };


  // =========================================================
  // HOME
  // =========================================================

  const handleHome = () => {

    navigate('/student/home');

  };


  return (
    <main className="result-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <section className="result-header">

        <span className="result-badge">
          🏆 QUIZ COMPLETED
        </span>

        <h1>
          Quiz Result
        </h1>

        <p>
          Well done,{' '}
          <strong>
            {result.studentName || 'Student'}
          </strong>
          !
        </p>

      </section>


      {/* =====================================================
          SCORE CARD
          ===================================================== */}

      <section className="result-score-card">

        <div className="result-score-circle">

          <div className="result-score-percentage">
            {percentage}%
          </div>

          <span>
            Score
          </span>

        </div>


        <div className="result-score-content">

          <div className="result-performance-icon">
            {performanceIcon}
          </div>

          <h2>
            {performanceMessage}
          </h2>

          <p>
            You scored{' '}
            <strong>
              {result.score}
            </strong>
            {' '}out of{' '}
            <strong>
              {result.total}
            </strong>
            {' '}questions.
          </p>

        </div>

      </section>


      {/* =====================================================
          STATISTICS
          ===================================================== */}

      <section className="result-stats">

        <div className="result-stat">

          <div className="result-stat-icon">
            📝
          </div>

          <strong>
            {result.total}
          </strong>

          <span>
            Total Questions
          </span>

        </div>


        <div className="result-stat result-stat-correct">

          <div className="result-stat-icon">
            ✓
          </div>

          <strong>
            {correctAnswers}
          </strong>

          <span>
            Correct Answers
          </span>

        </div>


        <div className="result-stat result-stat-wrong">

          <div className="result-stat-icon">
            ✕
          </div>

          <strong>
            {wrongAnswers}
          </strong>

          <span>
            Incorrect Answers
          </span>

        </div>


        <div className="result-stat">

          <div className="result-stat-icon">
            📈
          </div>

          <strong>
            {percentage}%
          </strong>

          <span>
            Percentage
          </span>

        </div>

      </section>


      {/* =====================================================
          ACTION BUTTONS
          ===================================================== */}

      <section className="result-actions">

        <button
          className="result-retry-button"
          onClick={handleRetry}
        >
          🔄 Try Quiz Again
        </button>


        <button
          className="result-home-button"
          onClick={handleHome}
        >
          ← Student Portal
        </button>

      </section>


      {/* =====================================================
          ANSWER REVIEW
          ===================================================== */}

      <section className="result-review">

        <div className="result-review-header">

          <span className="result-review-badge">
            📚 ANSWER REVIEW
          </span>

          <h2>
            Review Your Answers
          </h2>

          <p>
            Learn from your answers and understand
            the Industrial IoT concepts.
          </p>

        </div>


        <div className="result-review-list">

          {review.map((item, index) => (

            <article
              className={`result-review-item ${
                item.isCorrect
                  ? 'correct'
                  : 'wrong'
              }`}
              key={item.questionId}
            >


              {/* QUESTION HEADER */}

              <div className="result-question-header">

                <div className="result-question-number">

                  {item.isCorrect
                    ? '✓'
                    : '✕'}

                </div>

                <div>

                  <span>
                    QUESTION {index + 1}
                  </span>

                  <h3>
                    {item.question}
                  </h3>

                </div>

              </div>


              {/* YOUR ANSWER */}

              <div className="result-answer-box">

                <span className="result-answer-label">
                  Your Answer
                </span>

                <p
                  className={
                    item.isCorrect
                      ? 'correct-answer'
                      : 'wrong-answer'
                  }
                >
                  {item.userAnswer ||
                    'Not answered'}
                </p>

              </div>


              {/* CORRECT ANSWER */}

              {!item.isCorrect && (

                <div className="result-answer-box">

                  <span className="result-answer-label">
                    Correct Answer
                  </span>

                  <p className="correct-answer">
                    {item.correctAnswer}
                  </p>

                </div>

              )}


              {/* EXPLANATION */}

              <div className="result-explanation">

                <span>
                  💡 Explanation
                </span>

                <p>
                  {item.explanation}
                </p>

              </div>


            </article>

          ))}

        </div>

      </section>


    </main>
  );
}

export default ResultPage;