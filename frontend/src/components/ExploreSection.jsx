import { useEffect, useState } from 'react';

import TopicCard from './TopicCard';
import './ExploreSection.css';

const topicIcons = [
  '🔗',
  '📊',
  '📡',
  '🏭',
  '☁️',
  '🔒',
  '⚙️',
  '🤖',
  '🛰️',
  '🧠',
];

const defaultDescriptions = [
  'Learn the core concepts of Internet of Things and how devices connect in industrial environments.',
  'Understand how sensors collect data and actuators control physical processes in IoT systems.',
  'Explore MQTT, CoAP, HTTP, and other protocols used for IoT device communication.',
  'Discover how IoT enables smart factories, PLCs, SCADA systems, and automated workflows.',
  'Learn about cloud platforms and edge computing for processing IoT data efficiently.',
  'Study security challenges, encryption, authentication, and best practices for IoT networks.',
];

function ExploreSection() {

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  /* =========================================================
     LOAD QUIZZES
     ========================================================= */

  useEffect(() => {

    const loadQuizzes = async () => {

      try {

        setLoading(true);
        setError('');

        const response = await fetch(
          'http://localhost:5001/api/admin/quizzes'
        );


        if (!response.ok) {
          throw new Error(
            'Failed to load quizzes'
          );
        }


        const data =
          await response.json();


        setQuizzes(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (err) {

        console.error(
          'Quiz loading error:',
          err
        );

        setError(
          'Unable to load quizzes. Please try again.'
        );

      } finally {

        setLoading(false);

      }

    };


    loadQuizzes();

  }, []);


  /* =========================================================
     PREPARE QUIZ DATA
     ========================================================= */

  const topics = quizzes.map(
    (quiz, index) => ({

      quizId: quiz.id,

      icon:
        topicIcons[index] ||
        '⚡',

      title:
        quiz.title ||
        `Quiz ${quiz.id}`,

      description:
        quiz.description ||
        defaultDescriptions[index] ||
        'Test your Industrial IoT knowledge with this assessment.',

    })
  );


  return (

    <section
      id="explore"
      className="explore"
    >

      <div className="container">

        {/* =================================================
            HEADER
            ================================================= */}

        <h2 className="section-title">
          Explore Industrial IoT
        </h2>

        <p className="section-subtitle">
          Browse key topics covered in our Industrial IoT quiz platform.
        </p>


        {/* =================================================
            LOADING
            ================================================= */}

        {loading && (

          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#9FB3C8',
            }}
          >

            <div
              style={{
                fontSize: '32px',
                marginBottom: '10px',
              }}
            >
              ⚡
            </div>

            <p>
              Loading available quizzes...
            </p>

          </div>

        )}


        {/* =================================================
            ERROR
            ================================================= */}

        {!loading && error && (

          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#FF8080',
            }}
          >

            <div
              style={{
                fontSize: '30px',
                marginBottom: '10px',
              }}
            >
              ⚠️
            </div>

            <p>
              {error}
            </p>

          </div>

        )}


        {/* =================================================
            NO QUIZZES
            ================================================= */}

        {!loading &&
          !error &&
          topics.length === 0 && (

            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#9FB3C8',
              }}
            >

              <div
                style={{
                  fontSize: '35px',
                  marginBottom: '10px',
                }}
              >
                📝
              </div>

              <h3>
                No quizzes available
              </h3>

              <p>
                New Industrial IoT quizzes will appear here.
              </p>

            </div>

          )}


        {/* =================================================
            QUIZ GRID
            ================================================= */}

        {!loading &&
          !error &&
          topics.length > 0 && (

            <div className="explore__grid">

              {topics.map((topic) => (

                <TopicCard

                  key={topic.quizId}

                  quizId={topic.quizId}

                  icon={topic.icon}

                  title={topic.title}

                  description={topic.description}

                />

              ))}

            </div>

          )}

      </div>

    </section>

  );

}

export default ExploreSection;