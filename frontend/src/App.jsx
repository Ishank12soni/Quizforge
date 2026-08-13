import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RoleSelectionPage from './pages/RoleSelectionPage';
import StudentNamePage from './pages/StudentNamePage';

import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';


function App() {

  return (
    <BrowserRouter>

      <Routes>


        {/* =================================================
            ROLE SELECTION
            ================================================= */}

        <Route
          path="/"
          element={<RoleSelectionPage />}
        />


        {/* =================================================
            STUDENT NAME
            ================================================= */}

        <Route
          path="/student"
          element={<StudentNamePage />}
        />


        {/* =================================================
            STUDENT HOME
            ================================================= */}

        <Route
          path="/student/home"
          element={<HomePage />}
        />


        {/* =================================================
            STUDENT QUIZ
            ================================================= */}

        <Route
          path="/student/quiz"
          element={<QuizPage />}
        />


        {/* =================================================
            QUIZ RESULT
            ================================================= */}

        <Route
          path="/student/result"
          element={<ResultPage />}
        />


        {/* =================================================
            OLD QUIZ ROUTE
            =================================================
            Kept so existing links don't break.
            ================================================= */}

        <Route
          path="/quiz"
          element={<QuizPage />}
        />


        {/* =================================================
            QUIZ HISTORY
            ================================================= */}

        <Route
          path="/history"
          element={<HistoryPage />}
        />


        {/* =================================================
            ADMIN DASHBOARD
            ================================================= */}

        <Route
          path="/admin"
          element={<AdminPage />}
        />


        {/* =================================================
            FALLBACK
            ================================================= */}

        <Route
          path="*"
          element={<RoleSelectionPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;