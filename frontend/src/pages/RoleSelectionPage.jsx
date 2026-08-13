import { useNavigate } from 'react-router-dom';
import './RoleSelectionPage.css';

function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <main className="role-page">

      <div className="role-container">

        {/* HEADER */}

        <div className="role-header">

          <div className="role-logo">
            ⚡
          </div>

          <h1>
            QUIZ<span>FORGE</span>
          </h1>

          <p>
            Industrial IoT Assessment Platform
          </p>

        </div>


        {/* ROLE SELECTION */}

        <div className="role-selection">

          {/* STUDENT */}

          <button
            className="role-card role-card--student"
            onClick={() => navigate('/student')}
          >

            <div className="role-icon">
              👨‍🎓
            </div>

            <div className="role-content">

              <span className="role-label">
                STUDENT
              </span>

              <h2>
                Student Portal
              </h2>

              <p>
                Take Industrial IoT quizzes,
                check your results and track
                your learning progress.
              </p>

            </div>

            <span className="role-arrow">
              →
            </span>

          </button>


          {/* ADMIN */}

          <button
            className="role-card role-card--admin"
            onClick={() => navigate('/admin')}
          >

            <div className="role-icon">
              👨‍💼
            </div>

            <div className="role-content">

              <span className="role-label">
                ADMIN
              </span>

              <h2>
                Admin Portal
              </h2>

              <p>
                Create quizzes, manage questions,
                view student performance and
                rankings.
              </p>

            </div>

            <span className="role-arrow">
              →
            </span>

          </button>

        </div>


        {/* FOOTER */}

        <div className="role-footer">

          <span>
            🔒
          </span>

          Secure Industrial IoT Assessment System

        </div>

      </div>

    </main>
  );
}

export default RoleSelectionPage;