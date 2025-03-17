import { motion } from "framer-motion";
import "./PersonalLandingFinance.css";

export default function PersonalFinanceLanding() {
  return (
    <div className="finance-container">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Take Control of Your Finances Today
        </motion.h1>
        <p className="hero-subtitle">
          Smart, AI-powered financial planning to help you achieve your
          financial goals.
        </p>
        <button className="hero-button">Get Started</button>
      </div>

      {/* Features Section */}
      <div className="features-section">
        {["Budget Planning", "Smart Investments", "Debt Management"].map(
          (feature) => (
            <div key={feature} className="feature-card">
              <h2 className="feature-title">{feature}</h2>
              <p className="feature-description">
                Optimize your financial future with our AI-driven solutions.
              </p>
            </div>
          )
        )}
      </div>

      {/* Finance Tips Section */}
      <div className="finance-tips-section">
        <h2 className="tips-title">Personal Finance Mastery Tips</h2>
        <ul className="tips-list">
          <li>
            <strong>Create a Budget:</strong> Track your income and expenses to
            stay in control of your finances.
          </li>
          <li>
            <strong>Save for Emergencies:</strong> Have at least 3-6 months of
            expenses saved for unexpected situations.
          </li>
          <li>
            <strong>Invest Wisely:</strong> Start investing early to grow your
            wealth through compound interest.
          </li>
          <li>
            <strong>Avoid Unnecessary Debt:</strong> Use credit responsibly and
            pay off high-interest debt quickly.
          </li>
          <li>
            <strong>Set Financial Goals:</strong> Define short-term and
            long-term financial goals for a better future.
          </li>
        </ul>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <h2 className="testimonials-title">What Our Clients Say</h2>
        <p className="testimonials-text">
          "This AI-powered platform transformed my financial life. Highly
          recommended!" - Alex D.
        </p>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">Start your financial journey today.</p>
        <div className="contact-buttons">
          <button className="contact-button">Call Us: (123) 456-7890</button>
          <button className="contact-button">
            Email: support@financeai.com
          </button>
        </div>
      </div>
    </div>
  );
}
