import { useEffect, useState } from 'react';
import './QuizPage.css';

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/quiz')
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error(error));
  }, []);

  const handleAnswer = (questionId, answer) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  const submitQuiz = async () => {
    const formattedAnswers = questions.map((question) => ({
      questionId: question.id,
      selectedAnswer: answers[question.id] || '',
    }));

    const response = await fetch(
      'http://localhost:5001/api/quiz/submit',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: formattedAnswers,
        }),
      }
    );

    const data = await response.json();
    setResult(data);
  };

  return (
    <section className="quiz-page">
      <div className="quiz-container">

        <h2>Industrial IoT Quiz</h2>

        <p className="quiz-subtitle">
          Test your Industrial IoT knowledge.
        </p>

        {questions.map((question, index) => (
          <div className="question-card" key={question.id}>

            <h3>
              {index + 1}. {question.question}
            </h3>

            <div className="options">

              {question.options.map((option) => (
                <label key={option} className="option">

                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[question.id] === option}
                    onChange={() =>
                      handleAnswer(question.id, option)
                    }
                  />

                  <span>{option}</span>

                </label>
              ))}

            </div>

          </div>
        ))}

        <button
          className="submit-quiz"
          onClick={submitQuiz}
        >
          Submit Quiz
        </button>

        {result && ( 
             <div className="quiz-result">
                <h2>Quiz Completed 🎉</h2>

            <p>
              Score: {result.score} / {result.total}
            </p>

            <p>
              Percentage: {result.percentage}%
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

export default QuizPage;