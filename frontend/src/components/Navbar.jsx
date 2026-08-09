import { useState } from 'react';
import Button from './Button';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#home" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-icon">Q</span>
          <span className="navbar__logo-text">Quizforge</span>
        </a>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <span className="navbar__toggle-bar"></span>
          <span className="navbar__toggle-bar"></span>
          <span className="navbar__toggle-bar"></span>
        </button>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          <ul className="navbar__links">
            <li>
              <a href="#home" onClick={closeMenu}>Home</a>
            </li>
            <li>
              <a href="#quizzes" onClick={closeMenu}>Quizzes</a>
            </li>
            <li>
              <a href="#about" onClick={closeMenu}>About</a>
            </li>
          </ul>
          <Button href="#quizzes" size="small" className="navbar__cta" onClick={closeMenu}>
            Start Quiz
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
