import './WhySection.css';

const features = [
  {
    icon: '✅',
    title: 'Interactive Quizzes',
    description: 'Engage with multiple-choice questions designed for Industrial IoT topics.',
  },
  {
    icon: '⚡',
    title: 'Instant Results',
    description: 'Get immediate feedback on your answers to learn faster and improve quickly.',
  },
  {
    icon: '📚',
    title: 'Topic-Based Learning',
    description: 'Focus on specific IoT areas like sensors, protocols, automation, and security.',
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    description: 'Monitor your quiz performance and track improvement over time.',
  },
];

function WhySection() {
  return (
    <section id="about" className="why">
      <div className="container">
        <h2 className="section-title">Why Quizforge?</h2>
        <p className="section-subtitle">
          A simple and effective way to prepare for your Industrial IoT course
        </p>
        <div className="why__grid">
          {features.map((feature) => (
            <article key={feature.title} className="why__item">
              <div className="why__icon">{feature.icon}</div>
              <h3 className="why__title">{feature.title}</h3>
              <p className="why__description">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhySection;
