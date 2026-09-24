import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function Home() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <main>

        <section className="home-hero">
          <div className="home-hero-content">

            <div className="home-hero-text">
              <p className="hero-label">
                STUDENT COURSE MANAGEMENT SYSTEM
              </p>

              <h1>
                Learn. Track.
                <br />
                Grow.
              </h1>

              <p className="hero-description">
                Manage your courses, track your learning progress,
                and stay organized throughout your academic journey.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-button"
                  onClick={() => navigate("/courses")}
                >
                  Explore Courses
                </button>

                <button
                  className="secondary-button"
                  onClick={() => navigate("/register")}
                >
                  Create Account
                </button>
              </div>
            </div>

            <div className="home-hero-card">

              <div className="hero-card-header">
                <span>SCMS</span>
                <span>2026</span>
              </div>

              <h2>
                Your Learning
                <br />
                Journey
              </h2>

              <p>
                Access courses, monitor your progress and
                manage your learning activities from one place.
              </p>

              <div className="hero-stat-row">
                <div>
                  <strong>15+</strong>
                  <span>Courses</span>
                </div>

                <div>
                  <strong>24/7</strong>
                  <span>Access</span>
                </div>

                <div>
                  <strong>100%</strong>
                  <span>Progress</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        <section className="home-section">

          <div className="section-title">
            <p className="hero-label">WHAT YOU CAN DO</p>
            <h2>Everything You Need to Learn</h2>
            <p>
              A simple platform for managing courses and
              monitoring your academic progress.
            </p>
          </div>

          <div className="feature-grid">

            <div className="home-feature">
              <span className="feature-number">01</span>
              <h3>Explore Courses</h3>
              <p>
                Browse available courses and find subjects
                that match your learning goals.
              </p>
            </div>

            <div className="home-feature">
              <span className="feature-number">02</span>
              <h3>Track Progress</h3>
              <p>
                Monitor your course progress and keep track
                of your completed learning activities.
              </p>
            </div>

            <div className="home-feature">
              <span className="feature-number">03</span>
              <h3>Manage Learning</h3>
              <p>
                Keep your enrolled courses and learning
                information organized in one place.
              </p>
            </div>

          </div>

        </section>

        <section className="home-cta">

          <div>
            <p className="hero-label">START LEARNING</p>

            <h2>
              Ready to begin your
              <br />
              learning journey?
            </h2>

            <p>
              Create your account and start exploring
              the available courses.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>

        </section>

      </main>
    </PageShell>
  );
}

export default Home;