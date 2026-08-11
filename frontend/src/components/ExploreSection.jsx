import TopicCard from './TopicCard';
import './ExploreSection.css';

const topics = [
  {
    quizId: 1,
    icon: '🔗',
    title: 'IoT Fundamentals',
    description:
      'Learn the core concepts of Internet of Things and how devices connect in industrial environments.',
  },
  {
    quizId: 2,
    icon: '📊',
    title: 'Sensors & Actuators',
    description:
      'Understand how sensors collect data and actuators control physical processes in IoT systems.',
  },
  {
    quizId: 3,
    icon: '📡',
    title: 'Communication Protocols',
    description:
      'Explore MQTT, CoAP, HTTP, and other protocols used for IoT device communication.',
  },
  {
    quizId: 4,
    icon: '🏭',
    title: 'Industrial Automation',
    description:
      'Discover how IoT enables smart factories, PLCs, SCADA systems, and automated workflows.',
  },
  {
    quizId: 5,
    icon: '☁️',
    title: 'Cloud & Edge Computing',
    description:
      'Learn about cloud platforms and edge computing for processing IoT data efficiently.',
  },
  {
    quizId: 6,
    icon: '🔒',
    title: 'IoT Security',
    description:
      'Study security challenges, encryption, authentication, and best practices for IoT networks.',
  },
];

function ExploreSection() {
  return (
    <section id="explore" className="explore">
      <div className="container">

        <h2 className="section-title">
          Explore Industrial IoT
        </h2>

        <p className="section-subtitle">
          Browse key topics covered in our Industrial IoT quiz platform.
        </p>

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

      </div>
    </section>
  );
}

export default ExploreSection;