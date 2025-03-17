import { CheckCircle, PhoneCall, Mail } from "lucide-react";
import { motion } from "framer-motion";
import "./NutritionistLandingPage.css";

export default function NutritionistLandingPage() {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Personalized Nutrition for a Healthier You
        </motion.h1>
        <p className="hero-subtitle">
          Expert guidance to achieve your wellness goals through tailored
          nutrition plans.
        </p>
        <button className="hero-button">Get Started</button>
      </div>

      {/* Services Section */}
      <div className="services-section">
        {["Weight Management", "Sports Nutrition", "Meal Planning"].map(
          (service) => (
            <div key={service} className="service-card">
              <CheckCircle className="service-icon" size={40} />
              <h2 className="service-title">{service}</h2>
              <p className="service-description">
                Achieve optimal health with customized nutrition plans.
              </p>
            </div>
          )
        )}
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <h2 className="testimonials-title">What Our Clients Say</h2>
        <p className="testimonials-text">
          "Thanks to their expertise, I reached my fitness goals and feel
          healthier than ever!" - Sarah J.
        </p>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">Schedule a consultation today.</p>
        <div className="contact-buttons">
          <button className="contact-button">
            <PhoneCall size={20} /> <span>(123) 456-7890</span>
          </button>
          <button className="contact-button">
            <Mail size={20} /> <span>contact@nutritionist.com</span>
          </button>
        </div>
      </div>
    </div>
  );
}
