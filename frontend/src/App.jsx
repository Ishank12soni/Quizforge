import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/quiz"
          element={<QuizPage />}
        />

        <Route
          path="/history"
          element={<HistoryPage />}
        />

        <Route
          path="*"
          element={<HomePage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;