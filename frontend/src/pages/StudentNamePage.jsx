import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './StudentNamePage.css';

function StudentNamePage() {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  // =========================================================
  // CONTINUE
  // =========================================================

  const handleContinue = async (event) => {

    event.preventDefault();


    // -------------------------------------------------------
    // CLEAN NAME
    // -------------------------------------------------------

    const trimmedName =
      name.trim();


    // -------------------------------------------------------
    // VALIDATE EMPTY
    // -------------------------------------------------------

    if (!trimmedName) {

      setError(
        'Please enter your name to continue.'
      );

      return;

    }


    // -------------------------------------------------------
    // VALIDATE LENGTH
    // -------------------------------------------------------

    if (trimmedName.length < 2) {

      setError(
        'Please enter at least 2 characters.'
      );

      return;

    }


    try {

      setLoading(true);
      setError('');


      // =====================================================
      // CREATE / GET STUDENT FROM BACKEND
      // =====================================================

      const response =
        await fetch(
          'http://localhost:5001/api/students',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              name: trimmedName,
            }),
          }
        );


      // -----------------------------------------------------
      // CHECK RESPONSE
      // -----------------------------------------------------

      if (!response.ok) {

        const errorData =
          await response.json()
            .catch(() => ({}));


        throw new Error(
          errorData.message ||
          'Failed to create student'
        );

      }


      // -----------------------------------------------------
      // READ RESPONSE
      // -----------------------------------------------------

      const data =
        await response.json();


      // -----------------------------------------------------
      // VALIDATE STUDENT ID
      // -----------------------------------------------------

      if (!data.studentId) {

        throw new Error(
          'Student ID was not returned by the server.'
        );

      }


      // =====================================================
      // SAVE STUDENT INFORMATION
      // =====================================================

      localStorage.setItem(
        'quizforge_student_name',
        data.studentName || trimmedName
      );


      localStorage.setItem(
        'quizforge_student_id',
        String(data.studentId)
      );


      // =====================================================
      // GO TO STUDENT HOME
      // =====================================================

      navigate('/student/home');


    } catch (error) {

      console.error(
        'Student registration error:',
        error
      );


      setError(
        error.message ||
        'Unable to connect to Quizforge server. Please try again.'
      );


    } finally {

      setLoading(false);

    }

  };


  return (
    <main className="student-name-page">

      <div className="student-name-container">


        {/* =================================================
            BRAND
            ================================================= */}

        <div className="student-name-brand">

          <div className="student-name-logo">
            ⚡
          </div>


          <h1>
            QUIZ<span>FORGE</span>
          </h1>


          <p>
            Industrial IoT Assessment Platform
          </p>

        </div>


        {/* =================================================
            NAME CARD
            ================================================= */}

        <form
          className="student-name-card"
          onSubmit={handleContinue}
        >


          <div className="student-welcome-icon">
            👨‍🎓
          </div>


          <span className="student-name-label">
            STUDENT PORTAL
          </span>


          <h2>
            Welcome to Quizforge
          </h2>


          <p className="student-name-description">
            Enter your name to start your Industrial IoT
            learning journey and track your quiz progress.
          </p>


          {/* =================================================
              NAME INPUT
              ================================================= */}

          <div className="student-input-group">

            <label htmlFor="student-name">
              Your Name
            </label>


            <input
              id="student-name"
              type="text"
              value={name}

              onChange={(event) => {

                setName(
                  event.target.value
                );

                setError('');

              }}

              placeholder="Enter your full name"

              autoComplete="name"

              autoFocus

              maxLength={60}

              disabled={loading}
            />

          </div>


          {/* =================================================
              ERROR
              ================================================= */}

          {error && (

            <div className="student-name-error">
              ⚠️ {error}
            </div>

          )}


          {/* =================================================
              CONTINUE
              ================================================= */}

          <button
            type="submit"
            className="student-continue-button"
            disabled={loading}
          >

            {loading ? (
              <>
                Creating Student Profile...
                <span>⚡</span>
              </>
            ) : (
              <>
                Continue to Student Portal
                <span>→</span>
              </>
            )}

          </button>


          {/* =================================================
              BACK
              ================================================= */}

          <button
            type="button"
            className="student-back-button"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            ← Back to Role Selection
          </button>

        </form>


        {/* =================================================
            FOOTER
            ================================================= */}

        <div className="student-name-footer">
          🔒 Your name is used to track your quiz progress.
        </div>


      </div>

    </main>
  );
}

export default StudentNamePage;