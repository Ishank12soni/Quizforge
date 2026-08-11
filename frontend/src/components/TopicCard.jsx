import { useNavigate } from 'react-router-dom';
import './TopicCard.css';

function TopicCard({ quizId, icon, title, description }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/quiz?quizId=${quizId}`);
  };

  return (
    <article
      className="topic-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="topic-card__icon">
        {icon}
      </div>

      <h3 className="topic-card__title">
        {title}
      </h3>

      <p className="topic-card__description">
        {description}
      </p>
    </article>
  );
}

export default TopicCard;