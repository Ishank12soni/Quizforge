import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';

function App() {
  const path = window.location.pathname;

  if (path === '/quiz') {
    return <QuizPage />;
  }

  return <HomePage />;
}

export default App;