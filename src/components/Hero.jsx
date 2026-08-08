import Button from './Button';
import './Hero.css';

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__badge">Industrial IoT Learning Platform</span>
          <h1 className="hero__title">Test Your Industrial IoT Knowledge</h1>
          <p className="hero__subtitle">
            Learn, practice, and test your knowledge of Industrial Internet of Things
            through interactive quizzes.
          </p>
          <div className="hero__actions">
            <Button href="#quizzes" size="large">
              Start Quiz
            </Button>
            <Button href="#explore" variant="outline" size="large">
              Explore Topics
            </Button>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__card hero__card--1">
            <span className="hero__card-icon">📡</span>
            <span>IoT Sensors</span>
          </div>
          <div className="hero__card hero__card--2">
            <span className="hero__card-icon">⚙️</span>
            <span>Automation</span>
          </div>
          <div className="hero__card hero__card--3">
            <span className="hero__card-icon">☁️</span>
            <span>Cloud Edge</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
