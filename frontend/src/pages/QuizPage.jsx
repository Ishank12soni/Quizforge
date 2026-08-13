import { useEffect, useState } from 'react';
import {
  useSearchParams,
  useNavigate,
} from 'react-router-dom';

import API_BASE_URL from '../api';

import './QuizPage.css';


// =========================================================
// TOPIC INFORMATION
// =========================================================

const topicInfo = {
  1: {
    name: 'IoT Fundamentals',
    icon: '🔗',
    visual:
      'IoT Device → Network → Cloud → Application',
    conceptTitle: 'How an IoT System Works',
    conceptDescription:
      'IoT connects physical devices to networks so data can be collected, communicated, processed, and used by applications.',
    flow: [
      {
        icon: '📟',
        title: 'Device',
        text: 'Collects information',
      },
      {
        icon: '📡',
        title: 'Network',
        text: 'Transfers data',
      },
      {
        icon: '☁️',
        title: 'Cloud',
        text: 'Processes data',
      },
      {
        icon: '💻',
        title: 'Application',
        text: 'Uses information',
      },
    ],
  },

  2: {
    name: 'Sensors & Actuators',
    icon: '📊',
    visual:
      'Physical World → Sensor → Controller → Actuator',
    conceptTitle:
      'Sensor → Controller → Actuator',
    conceptDescription:
      'Sensors collect information from the physical world, controllers make decisions, and actuators perform physical actions.',
    flow: [
      {
        icon: '🌍',
        title: 'Physical World',
        text: 'Physical conditions',
      },
      {
        icon: '📊',
        title: 'Sensor',
        text: 'Collects data',
      },
      {
        icon: '🧠',
        title: 'Controller',
        text: 'Makes decisions',
      },
      {
        icon: '⚙️',
        title: 'Actuator',
        text: 'Performs action',
      },
    ],
  },

  3: {
    name: 'Communication Protocols',
    icon: '📡',
    visual:
      'Device → MQTT / HTTP / CoAP → IoT Platform',
    conceptTitle: 'IoT Communication',
    conceptDescription:
      'Communication protocols allow IoT devices to exchange data with gateways, servers, and cloud platforms.',
    flow: [
      {
        icon: '📟',
        title: 'Device',
        text: 'Creates data',
      },
      {
        icon: '📡',
        title: 'Protocol',
        text: 'Transfers data',
      },
      {
        icon: '🌐',
        title: 'Network',
        text: 'Connects devices',
      },
      {
        icon: '☁️',
        title: 'Platform',
        text: 'Receives data',
      },
    ],
  },

  4: {
    name: 'Industrial Automation',
    icon: '🏭',
    visual:
      'Sensor → PLC → SCADA → Machine',
    conceptTitle:
      'Industrial Automation Flow',
    conceptDescription:
      'Industrial automation uses sensors, controllers, and monitoring systems to control physical machines and industrial processes.',
    flow: [
      {
        icon: '📊',
        title: 'Sensor',
        text: 'Measures conditions',
      },
      {
        icon: '🧠',
        title: 'PLC',
        text: 'Controls process',
      },
      {
        icon: '🖥️',
        title: 'SCADA',
        text: 'Monitors system',
      },
      {
        icon: '🏭',
        title: 'Machine',
        text: 'Performs operation',
      },
    ],
  },

  5: {
    name: 'Cloud & Edge Computing',
    icon: '☁️',
    visual:
      'Device → Edge → Cloud → Analytics',
    conceptTitle:
      'Edge + Cloud Architecture',
    conceptDescription:
      'Edge computing processes data close to the device, while cloud computing provides large-scale storage and analytics.',
    flow: [
      {
        icon: '📟',
        title: 'Device',
        text: 'Generates data',
      },
      {
        icon: '⚡',
        title: 'Edge',
        text: 'Processes locally',
      },
      {
        icon: '☁️',
        title: 'Cloud',
        text: 'Stores information',
      },
      {
        icon: '📈',
        title: 'Analytics',
        text: 'Finds insights',
      },
    ],
  },

  6: {
    name: 'IoT Security',
    icon: '🔒',
    visual:
      'Device → Authentication → Encryption → Secure Network',
    conceptTitle:
      'IoT Security Architecture',
    conceptDescription:
      'IoT security protects devices and data using authentication, encryption, access control, and secure communication.',
    flow: [
      {
        icon: '📟',
        title: 'Device',
        text: 'IoT endpoint',
      },
      {
        icon: '🔐',
        title: 'Authentication',
        text: 'Verifies identity',
      },
      {
        icon: '🛡️',
        title: 'Encryption',
        text: 'Protects data',
      },
      {
        icon: '🌐',
        title: 'Secure Network',
        text: 'Safe communication',
      },
    ],
  },
};


// =========================================================
// QUESTION-SPECIFIC VISUALS
// =========================================================

const visualSets = {
  temperature: [
    {
      icon: '🌡️',
      title: 'Physical Condition',
      text: 'Temperature',
    },
    {
      icon: '📊',
      title: 'Sensor',
      text: 'Measures temperature',
    },
    {
      icon: '📡',
      title: 'Data Signal',
      text: 'Sends measurement',
    },
    {
      icon: '🧠',
      title: 'Controller',
      text: 'Processes data',
    },
  ],

  sensor: [
    {
      icon: '🌍',
      title: 'Physical World',
      text: 'Real condition',
    },
    {
      icon: '📊',
      title: 'Sensor',
      text: 'Detects condition',
    },
    {
      icon: '📡',
      title: 'Data',
      text: 'Measurement',
    },
    {
      icon: '🧠',
      title: 'Controller',
      text: 'Makes decision',
    },
  ],

  actuator: [
    {
      icon: '🧠',
      title: 'Controller',
      text: 'Sends command',
    },
    {
      icon: '📡',
      title: 'Control Signal',
      text: 'Transfers command',
    },
    {
      icon: '⚙️',
      title: 'Actuator',
      text: 'Receives command',
    },
    {
      icon: '🏭',
      title: 'Machine',
      text: 'Performs action',
    },
  ],

  mqtt: [
    {
      icon: '📟',
      title: 'IoT Device',
      text: 'Publishes data',
    },
    {
      icon: '📡',
      title: 'MQTT',
      text: 'Messaging protocol',
    },
    {
      icon: '🔄',
      title: 'Broker',
      text: 'Routes messages',
    },
    {
      icon: '☁️',
      title: 'IoT Platform',
      text: 'Receives data',
    },
  ],

  http: [
    {
      icon: '📟',
      title: 'IoT Device',
      text: 'Sends request',
    },
    {
      icon: '🌐',
      title: 'HTTP',
      text: 'Communication',
    },
    {
      icon: '🖥️',
      title: 'Server',
      text: 'Processes request',
    },
    {
      icon: '☁️',
      title: 'Application',
      text: 'Returns response',
    },
  ],

  plc: [
    {
      icon: '📊',
      title: 'Sensor',
      text: 'Measures process',
    },
    {
      icon: '🧠',
      title: 'PLC',
      text: 'Executes logic',
    },
    {
      icon: '⚡',
      title: 'Control Signal',
      text: 'Sends command',
    },
    {
      icon: '⚙️',
      title: 'Machine',
      text: 'Performs action',
    },
  ],

  scada: [
    {
      icon: '📊',
      title: 'Sensors',
      text: 'Collect data',
    },
    {
      icon: '🧠',
      title: 'PLC',
      text: 'Controls process',
    },
    {
      icon: '🖥️',
      title: 'SCADA',
      text: 'Monitors system',
    },
    {
      icon: '🏭',
      title: 'Plant',
      text: 'Industrial process',
    },
  ],

  edge: [
    {
      icon: '📟',
      title: 'IoT Device',
      text: 'Generates data',
    },
    {
      icon: '⚡',
      title: 'Edge',
      text: 'Processes locally',
    },
    {
      icon: '☁️',
      title: 'Cloud',
      text: 'Stores data',
    },
    {
      icon: '📈',
      title: 'Analytics',
      text: 'Finds insights',
    },
  ],

  cloud: [
    {
      icon: '📟',
      title: 'Device',
      text: 'Creates data',
    },
    {
      icon: '🌐',
      title: 'Internet',
      text: 'Transfers data',
    },
    {
      icon: '☁️',
      title: 'Cloud',
      text: 'Stores data',
    },
    {
      icon: '📈',
      title: 'Analytics',
      text: 'Analyzes data',
    },
  ],

  encryption: [
    {
      icon: '📟',
      title: 'IoT Device',
      text: 'Creates data',
    },
    {
      icon: '🔐',
      title: 'Encryption',
      text: 'Protects data',
    },
    {
      icon: '🌐',
      title: 'Network',
      text: 'Transfers securely',
    },
    {
      icon: '☁️',
      title: 'Server',
      text: 'Receives data',
    },
  ],

  authentication: [
    {
      icon: '📟',
      title: 'Device',
      text: 'Requests access',
    },
    {
      icon: '🔑',
      title: 'Authentication',
      text: 'Checks identity',
    },
    {
      icon: '🛡️',
      title: 'Authorization',
      text: 'Checks permission',
    },
    {
      icon: '🌐',
      title: 'Network',
      text: 'Allows access',
    },
  ],
};


// =========================================================
// FIND VISUAL FOR QUESTION
// =========================================================

function getQuestionVisual(questionText, topic) {
  const text = String(questionText || '').toLowerCase();

  if (
    text.includes('temperature') ||
    text.includes('thermistor') ||
    text.includes('temperature sensor')
  ) {
    return visualSets.temperature;
  }

  if (
    text.includes('actuator') ||
    text.includes('motor') ||
    text.includes('valve')
  ) {
    return visualSets.actuator;
  }

  if (
    text.includes('mqtt') ||
    text.includes('publish') ||
    text.includes('subscribe') ||
    text.includes('broker')
  ) {
    return visualSets.mqtt;
  }

  if (
    text.includes('http') ||
    text.includes('https')
  ) {
    return visualSets.http;
  }

  if (
    text.includes('plc') ||
    text.includes('programmable logic controller')
  ) {
    return visualSets.plc;
  }

  if (
    text.includes('scada') ||
    text.includes('supervisory control')
  ) {
    return visualSets.scada;
  }

  if (
    text.includes('edge') ||
    text.includes('edge computing')
  ) {
    return visualSets.edge;
  }

  if (
    text.includes('cloud') ||
    text.includes('cloud computing')
  ) {
    return visualSets.cloud;
  }

  if (
    text.includes('encryption') ||
    text.includes('encrypt') ||
    text.includes('encrypted')
  ) {
    return visualSets.encryption;
  }

  if (
    text.includes('authentication') ||
    text.includes('authenticate') ||
    text.includes('identity')
  ) {
    return visualSets.authentication;
  }

  if (
    text.includes('sensor') ||
    text.includes('sensing') ||
    text.includes('detect')
  ) {
    return visualSets.sensor;
  }

  return topic.flow;
}


// =========================================================
// QUIZ PAGE
// =========================================================

function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const quizId = searchParams.get('quizId') || '1';

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const topic =
    topicInfo[quizId] ||
    topicInfo[Number(quizId)] ||
    topicInfo[1];


  // =======================================================
  // LOAD QUIZ
  // =======================================================

  useEffect(() => {
    let cancelled = false;

    const loadQuiz = async () => {
      try {
        setLoading(true);
        setQuestions([]);
        setAnswers({});
        setResult(null);
        setCurrentQuestion(0);

        const response = await fetch(
          `${API_BASE_URL}/api/quiz?quizId=${quizId}`
        );

        if (!response.ok) {
          throw new Error('Failed to load quiz');
        }

        const data = await response.json();

        if (!cancelled) {
          setQuestions(
            Array.isArray(data)
              ? data
              : []
          );
        }
      } catch (error) {
        console.error(
          'Quiz loading error:',
          error
        );

        if (!cancelled) {
          setQuestions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [quizId]);


  // =======================================================
  // SELECT ANSWER
  // =======================================================

  const handleAnswer = (
    questionId,
    answer
  ) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };


  // =======================================================
  // SUBMIT QUIZ
  // =======================================================

  const submitQuiz = async () => {
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      // ---------------------------------------------------
      // GET STUDENT NAME
      // ---------------------------------------------------

      const studentName =
        localStorage.getItem(
          'quizforge_student_name'
        ) || '';

      if (!studentName.trim()) {
        alert(
          'Please enter your name before submitting the quiz.'
        );

        setSubmitting(false);
        return;
      }


      // ---------------------------------------------------
      // GET STORED STUDENT ID
      // ---------------------------------------------------

      let studentId =
        Number(
          localStorage.getItem(
            'quizforge_student_id'
          )
        ) || 0;


      // ---------------------------------------------------
      // CREATE STUDENT IF NEEDED
      // ---------------------------------------------------

      if (!studentId) {
        const studentResponse =
          await fetch(
            `${API_BASE_URL}/api/students`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                name:
                  studentName.trim(),
              }),
            }
          );

        if (!studentResponse.ok) {
          const errorData =
            await studentResponse
              .json()
              .catch(() => ({}));

          throw new Error(
            errorData.message ||
              'Failed to save student'
          );
        }

        const student =
          await studentResponse.json();

        studentId =
          Number(
            student.studentId
          );

        if (!studentId) {
          throw new Error(
            'Student ID was not returned by the server.'
          );
        }

        localStorage.setItem(
          'quizforge_student_id',
          String(studentId)
        );
      }


      // ---------------------------------------------------
      // FORMAT ANSWERS
      // ---------------------------------------------------

      const formattedAnswers =
        questions.map((question) => ({
          questionId:
            question.id,

          selectedAnswer:
            answers[
              question.id
            ] || '',
        }));


      // ---------------------------------------------------
      // SUBMIT TO BACKEND
      // ---------------------------------------------------

      const response =
        await fetch(
          `${API_BASE_URL}/api/quiz/submit?quizId=${quizId}`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              studentId:
                studentId,

              answers:
                formattedAnswers,
            }),
          }
        );

      if (!response.ok) {
        const errorData =
          await response
            .json()
            .catch(() => ({}));

        throw new Error(
          errorData.message ||
            'Failed to submit quiz'
        );
      }

      const data =
        await response.json();

      setResult(data);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      console.error(
        'Quiz submission error:',
        error
      );

      alert(
        error.message ||
          'Unable to submit quiz. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };


  // =======================================================
  // RETAKE
  // =======================================================

  const restartQuiz = () => {
    setAnswers({});
    setResult(null);
    setCurrentQuestion(0);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <section className="quiz-page">
        <div className="quiz-container loading-container">

          <div className="loading-icon">
            ⚡
          </div>

          <h2>
            Loading Quiz...
          </h2>

          <p>
            Preparing your Industrial IoT assessment.
          </p>

        </div>
      </section>
    );
  }


  // =======================================================
  // EMPTY QUIZ
  // =======================================================

  if (questions.length === 0) {
    return (
      <section className="quiz-page">
        <div className="quiz-container empty-container">

          <div className="loading-icon">
            ⚠️
          </div>

          <h2>
            No Questions Found
          </h2>

          <p>
            This quiz does not contain any questions yet.
          </p>

          <button
            className="submit-quiz"
            onClick={() =>
              navigate('/student/home')
            }
          >
            🏠 Back to Home
          </button>

        </div>
      </section>
    );
  }


  // =======================================================
  // RESULT SCREEN
  // =======================================================

  if (result) {
    const correctCount =
      Number(result.score) || 0;

    const total =
      Number(result.total) ||
      questions.length;

    const wrongCount =
      Math.max(
        total - correctCount,
        0
      );

    const percentage =
      Number(result.percentage) || 0;


    let performanceTitle =
      'Keep Practicing! 📚';

    if (percentage >= 90) {
      performanceTitle =
        'Outstanding Performance! 🏆';
    } else if (percentage >= 80) {
      performanceTitle =
        'Excellent Work! 🚀';
    } else if (percentage >= 60) {
      performanceTitle =
        'Good Job! 💪';
    }


    return (
      <section className="quiz-page">

        <div className="quiz-container result-container">


          {/* =================================================
              RESULT HERO
              ================================================= */}

          <div className="result-hero">

            <div className="result-icon">
              {percentage >= 80
                ? '🎉'
                : '📚'}
            </div>

            <p className="result-label">
              QUIZ COMPLETED
            </p>

            <h1>
              {performanceTitle}
            </h1>

            <p className="result-topic">
              {topic.icon}{' '}
              {topic.name}
            </p>

            <p className="result-student-name">
              👤{' '}
              {result.studentName ||
                localStorage.getItem(
                  'quizforge_student_name'
                ) ||
                'Student'}
            </p>

            <div className="score-circle">

              <strong>
                {percentage}%
              </strong>

              <span>
                {correctCount} / {total}
              </span>

            </div>

            <p className="result-message">
              You answered{' '}
              {correctCount}{' '}
              out of{' '}
              {total}{' '}
              questions correctly.
            </p>

          </div>


          {/* =================================================
              SCORE SUMMARY
              ================================================= */}

          <div className="score-summary">

            <div className="summary-card summary-card--correct">

              <span className="summary-icon">
                ✓
              </span>

              <div>
                <strong>
                  {correctCount}
                </strong>

                <p>
                  Correct
                </p>
              </div>

            </div>


            <div className="summary-card summary-card--wrong">

              <span className="summary-icon">
                ✕
              </span>

              <div>
                <strong>
                  {wrongCount}
                </strong>

                <p>
                  Wrong
                </p>
              </div>

            </div>


            <div className="summary-card summary-card--score">

              <span className="summary-icon">
                ★
              </span>

              <div>
                <strong>
                  {percentage}%
                </strong>

                <p>
                  Score
                </p>
              </div>

            </div>

          </div>


          {/* =================================================
              PERFORMANCE ANALYSIS
              ================================================= */}

          <div className="performance-section">

            <div className="section-heading">

              <span>
                📊
              </span>

              <div>

                <h2>
                  Performance Analysis
                </h2>

                <p>
                  A quick overview of your quiz performance.
                </p>

              </div>

            </div>


            <div className="performance-card">

              <div className="performance-top">

                <div className="performance-main">

                  <span>
                    Accuracy
                  </span>

                  <strong>
                    {percentage}%
                  </strong>

                </div>


                <div className="performance-main">

                  <span>
                    Questions
                  </span>

                  <strong>
                    {total}
                  </strong>

                </div>

              </div>


              <div className="performance-bar">

                <div
                  className="performance-fill"
                  style={{
                    width:
                      `${Math.min(
                        Math.max(
                          percentage,
                          0
                        ),
                        100
                      )}%`,
                  }}
                />

              </div>


              <div className="performance-stats">

                <div className="performance-stat performance-stat--correct">

                  <span>
                    ✓
                  </span>

                  <div>

                    <strong>
                      {correctCount}
                    </strong>

                    <small>
                      Correct
                    </small>

                  </div>

                </div>


                <div className="performance-stat performance-stat--wrong">

                  <span>
                    ✕
                  </span>

                  <div>

                    <strong>
                      {wrongCount}
                    </strong>

                    <small>
                      Wrong
                    </small>

                  </div>

                </div>

              </div>


              <div className="performance-message">

                <strong>
                  {percentage >= 90
                    ? '🏆 Outstanding Performance'
                    : percentage >= 80
                    ? '🚀 Excellent Performance'
                    : percentage >= 60
                    ? '💪 Good Performance'
                    : '📚 Needs More Practice'}
                </strong>


                <p>
                  {percentage >= 90
                    ? 'Excellent understanding of this Industrial IoT topic.'
                    : percentage >= 80
                    ? 'You have a strong understanding. Keep practicing to reach the top.'
                    : percentage >= 60
                    ? 'Good foundation. Review the explanations below to improve further.'
                    : 'Review the explanations and visual concepts below, then try the quiz again.'}
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              QUICK CONCEPT REVIEW
              ================================================= */}

          <div className="learning-section">

            <div className="section-heading">

              <span>
                💡
              </span>

              <div>

                <h2>
                  {topic.conceptTitle}
                </h2>

                <p>
                  {topic.conceptDescription}
                </p>

              </div>

            </div>


            <div className="iot-flow">

              {topic.flow.map(
                (step, index) => (

                  <div
                    className="iot-flow-group"
                    key={step.title}
                  >

                    <div className="iot-flow-card">

                      <span className="iot-flow-number">
                        {index + 1}
                      </span>

                      <span className="iot-flow-icon">
                        {step.icon}
                      </span>

                      <strong>
                        {step.title}
                      </strong>

                      <small>
                        {step.text}
                      </small>

                    </div>


                    {index <
                      topic.flow.length - 1 && (
                      <div className="iot-arrow">
                        →
                      </div>
                    )}

                  </div>

                )
              )}

            </div>

          </div>


          {/* =================================================
              ANSWER REVIEW
              ================================================= */}

          <div className="review-section">

            <div className="section-heading">

              <span>
                📝
              </span>

              <div>

                <h2>
                  Answer Review
                </h2>

                <p>
                  Review your answers and learn from your mistakes.
                </p>

              </div>

            </div>


            {Array.isArray(result.review) &&
              result.review.map(
                (item, index) => {

                  const questionVisual =
                    getQuestionVisual(
                      item.question || '',
                      topic
                    );


                  return (
                    <div
                      className={`review-card ${
                        item.isCorrect
                          ? 'review-card--correct'
                          : 'review-card--wrong'
                      }`}
                      key={
                        item.questionId ||
                        index
                      }
                    >


                      {/* QUESTION HEADER */}

                      <div className="review-card__header">

                        <div className="question-number">
                          Question {index + 1}
                        </div>

                        <span
                          className={
                            item.isCorrect
                              ? 'answer-status correct'
                              : 'answer-status wrong'
                          }
                        >
                          {item.isCorrect
                            ? '✓ Correct'
                            : '✕ Wrong'}
                        </span>

                      </div>


                      {/* QUESTION */}

                      <h3 className="review-question">
                        {item.question}
                      </h3>


                      {/* ANSWER COMPARISON */}

                      <div className="answer-comparison">

                        <div
                          className={`answer-box ${
                            item.isCorrect
                              ? 'answer-box--correct'
                              : 'answer-box--wrong'
                          }`}
                        >

                          <span className="answer-label">
                            Your Answer
                          </span>

                          <strong>
                            {item.userAnswer ||
                              'Not answered'}
                          </strong>

                        </div>


                        <div className="answer-box answer-box--correct">

                          <span className="answer-label">
                            Correct Answer
                          </span>

                          <strong>
                            {item.correctAnswer}
                          </strong>

                        </div>

                      </div>


                      {/* EXPLANATION */}

                      <div className="review-explanation">

                        <div className="explanation-title">

                          <span>
                            💡
                          </span>

                          Explanation

                        </div>

                        <p>
                          {item.explanation ||
                            'Review this concept carefully and try the question again.'}
                        </p>

                      </div>


                      {/* QUESTION VISUAL */}

                      <div className="learning-section">

                        <div className="section-heading">

                          <span>
                            📊
                          </span>

                          <div>

                            <h2>
                              Visual Concept
                            </h2>

                            <p>
                              Understand the concept behind this question.
                            </p>

                          </div>

                        </div>


                        <div className="iot-flow">

                          {questionVisual.map(
                            (
                              step,
                              visualIndex
                            ) => (

                              <div
                                className="iot-flow-group"
                                key={`${item.questionId || index}-${step.title}`}
                              >

                                <div className="iot-flow-card">

                                  <span className="iot-flow-number">
                                    {visualIndex + 1}
                                  </span>

                                  <span className="iot-flow-icon">
                                    {step.icon}
                                  </span>

                                  <strong>
                                    {step.title}
                                  </strong>

                                  <small>
                                    {step.text}
                                  </small>

                                </div>


                                {visualIndex <
                                  questionVisual.length - 1 && (
                                  <div className="iot-arrow">
                                    →
                                  </div>
                                )}

                              </div>

                            )
                          )}

                        </div>

                      </div>


                      {/* KEY CONCEPT */}

                      <div className="question-visual">

                        <span className="question-visual__icon">
                          {topic.icon}
                        </span>

                        <div>

                          <strong>
                            Key Concept
                          </strong>

                          <p>
                            {topic.visual}
                          </p>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

          </div>


          {/* =================================================
              RESULT ACTIONS
              ================================================= */}

          <div className="quiz-actions result-actions">

            <button
              className="submit-quiz"
              onClick={restartQuiz}
            >
              🔄 Retake Quiz
            </button>


            <button
              className="submit-quiz secondary-action"
              onClick={() =>
                navigate('/student/home')
              }
            >
              🏠 Back to Home
            </button>


            <button
              className="submit-quiz secondary-action"
              onClick={() =>
                navigate('/history')
              }
            >
              📚 View History
            </button>

          </div>

        </div>

      </section>
    );
  }


  // =======================================================
  // CURRENT QUESTION
  // =======================================================

  const question =
    questions[currentQuestion];


  // Safety check
  if (!question) {
    return (
      <section className="quiz-page">
        <div className="quiz-container empty-container">

          <div className="loading-icon">
            ⚠️
          </div>

          <h2>
            Question Not Found
          </h2>

          <p>
            Something went wrong while loading the question.
          </p>

          <button
            className="submit-quiz"
            onClick={() =>
              navigate('/student/home')
            }
          >
            🏠 Back to Home
          </button>

        </div>
      </section>
    );
  }


  // =======================================================
  // QUIZ SCREEN
  // =======================================================

  return (
    <section className="quiz-page">

      <div className="quiz-container">


        {/* =================================================
            QUIZ HEADER
            ================================================= */}

        <div className="quiz-header">

          <span className="quiz-topic-badge">
            {topic.icon}{' '}
            {topic.name}
          </span>


          <h2>
            Industrial IoT Quiz
          </h2>


          <p className="quiz-subtitle">
            Test your{' '}
            {topic.name}{' '}
            knowledge.
          </p>


          {/* STUDENT NAME */}

          <div className="quiz-student-display">
            👤{' '}
            {localStorage.getItem(
              'quizforge_student_name'
            ) || 'Student'}
          </div>

        </div>


        {/* =================================================
            PROGRESS
            ================================================= */}

        <div className="quiz-progress-container">

          <div className="quiz-progress-text">

            <span>
              Question{' '}
              {currentQuestion + 1}{' '}
              of{' '}
              {questions.length}
            </span>


            <strong>
              {Math.round(
                (
                  (currentQuestion + 1) /
                  questions.length
                ) *
                  100
              )}
              %
            </strong>

          </div>


          <div className="quiz-progress-bar">

            <div
              className="quiz-progress-fill"
              style={{
                width:
                  `${
                    (
                      (currentQuestion + 1) /
                      questions.length
                    ) *
                    100
                  }%`,
              }}
            />

          </div>

        </div>


        {/* =================================================
            QUESTION CARD
            ================================================= */}

        <div className="question-card">

          <div className="question-card__number">
            QUESTION{' '}
            {currentQuestion + 1}
          </div>


          <h3>
            {currentQuestion + 1}.{' '}
            {question.question}
          </h3>


          {/* OPTIONS */}

          <div className="options">

            {Array.isArray(question.options) &&
              question.options.map(
                (option, index) => (

                  <label
                    key={option}
                    className={`option ${
                      answers[
                        question.id
                      ] === option
                        ? 'option--selected'
                        : ''
                    }`}
                  >

                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={
                        answers[
                          question.id
                        ] === option
                      }
                      onChange={() =>
                        handleAnswer(
                          question.id,
                          option
                        )
                      }
                    />


                    <span className="option-letter">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>


                    <span className="option-text">
                      {option}
                    </span>

                  </label>

                )
              )}

          </div>

        </div>


        {/* =================================================
            NAVIGATION
            ================================================= */}

        <div className="quiz-actions">


          {currentQuestion > 0 && (
            <button
              className="submit-quiz secondary-action"
              onClick={() =>
                setCurrentQuestion(
                  currentQuestion - 1
                )
              }
            >
              ← Previous
            </button>
          )}


          {currentQuestion <
          questions.length - 1 ? (

            <button
              className="submit-quiz"
              onClick={() =>
                setCurrentQuestion(
                  currentQuestion + 1
                )
              }
            >
              Next →
            </button>

          ) : (

            <button
              className="submit-quiz"
              onClick={submitQuiz}
              disabled={submitting}
            >
              {submitting
                ? 'Submitting...'
                : 'Submit Quiz ✓'}
            </button>

          )}

        </div>

      </div>

    </section>
  );
}


export default QuizPage;