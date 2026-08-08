import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">Quizforge</span>
          <p className="footer__tagline">Industrial IoT Quiz Platform</p>
          <p className="footer__project">B.Tech IoT Project</p>
        </div>
        <p className="footer__copyright">
          &copy; {new Date().getFullYear()} Quizforge. Built for educational purposes.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
