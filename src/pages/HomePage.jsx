import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ExploreSection from '../components/ExploreSection';
import WhySection from '../components/WhySection';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ExploreSection />
        <section id="quizzes" className="quizzes-placeholder">
          <div className="container">
            <h2 className="section-title">Quizzes</h2>
            <p className="section-subtitle">
              Quiz functionality will be added in upcoming development days.
            </p>
          </div>
        </section>
        <WhySection />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
