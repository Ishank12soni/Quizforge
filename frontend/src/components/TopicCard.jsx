import './TopicCard.css';

function TopicCard({ icon, title, description }) {
  return (
    <article className="topic-card">
      <div className="topic-card__icon">{icon}</div>
      <h3 className="topic-card__title">{title}</h3>
      <p className="topic-card__description">{description}</p>
    </article>
  );
}

export default TopicCard;
