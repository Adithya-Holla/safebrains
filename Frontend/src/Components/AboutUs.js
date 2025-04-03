import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="hero-about">
        <div className="hero-content" data-aos="fade-up">
          <h1>About <span className="highlight">Safebrains</span></h1>
          <p>Empowering early detection and saving lives through innovative AI technology.</p>
          <div className="hero-cta">
            <Link to="/tools" className="primary-btn">Try Our Tools</Link>
          </div>
        </div>
        <div className="hero-pattern"></div>
      </section>
      
      {/* Mission Vision Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card" data-aos="fade-right">
              <div className="card-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h2>Our Mission</h2>
              <p>
                To save lives by enabling early detection of tumors. We believe that early diagnosis is the key to successful treatment, and our cutting-edge tools are designed to make this process faster, easier, and more reliable.
              </p>
            </div>
            
            <div className="mission-card" data-aos="fade-up">
              <div className="card-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h2>Our Vision</h2>
              <p>
                To create a world where AI-powered healthcare tools are accessible to everyone, reducing the global impact of late-stage cancer diagnoses and improving patient outcomes worldwide.
              </p>
            </div>
            
            <div className="mission-card" data-aos="fade-left">
              <div className="card-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h2>Our Values</h2>
              <p>
                We are guided by accuracy, innovation, empathy, and accessibility. These core values ensure we deliver solutions that truly make a difference in people's lives.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Who We Are Section with Image */}
      <section className="who-we-are-section">
        <div className="container">
          <div className="who-we-are-content">
            <div className="image-side" data-aos="fade-right">
              <div className="image-container">
                <img src="https://img.freepik.com/free-photo/medical-researcher-looking-brain-scan-working-laboratory-team-scientists-developing-medicine-using-high-tech-scanning-disease-treatment-evolution_482257-13201.jpg" alt="Our team working" />
              </div>
            </div>
            
            <div className="text-side" data-aos="fade-left">
              <h2>Who We Are</h2>
              <p>
                At Safebrains, we are dedicated to revolutionizing cancer diagnosis and treatment through advanced AI-powered tools. Our multidisciplinary team combines expertise in artificial intelligence, medical imaging, and healthcare to create innovative solutions.
              </p>
              <p>
                Founded in 2025, our platform has already assisted thousands of healthcare professionals in detecting early signs of tumors, potentially saving countless lives through timely interventions.
              </p>
              <div className="stats-container">
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Accuracy Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Scans Analyzed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Members Section */}
      <section className="team-section" data-aos="fade-up">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>The brilliant minds behind Safebrains's technology</p>
          </div>
          
          <div className="team-members">
            <div className="team-member" data-aos="fade-up" data-aos-delay="100">
              <div className="member-image">
                <img src="/Memberpics/Coder1.jpg" alt="Team Member 1" />
              </div>
              <div className="member-info">
                <h3>Aditya Sharma</h3>
                <p className="role">Lead AI Developer</p>
              </div>
            </div>
            
            <div className="team-member" data-aos="fade-up" data-aos-delay="200">
              <div className="member-image">
                <img src="/Memberpics/Coder2.jpg" alt="Team Member 2" />
              </div>
              <div className="member-info">
                <h3>Archita Patel</h3>
                <p className="role">ML Engineer</p>
              </div>
            </div>
            
            <div className="team-member" data-aos="fade-up" data-aos-delay="300">
              <div className="member-image">
                <img src="/Memberpics/Coder3.jpg" alt="Team Member 3" />
              </div>
              <div className="member-info">
                <h3>Shashwat</h3>
                <p className="role">ML Engineer</p>
              </div>
            </div>
            
            <div className="team-member" data-aos="fade-up" data-aos-delay="400">
              <div className="member-image">
                <img src="/Memberpics/Coder4.jpg" alt="Team Member 4" />
              </div>
              <div className="member-info">
                <h3>Adithya V Holla</h3>
                <p className="role">Fullstack Developer</p>

              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials-about-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>What Our Users Say</h2>
            <p>Success stories from medical professionals and patients</p>
          </div>
          
          <div className="testimonials-carousel">
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="100">
              <div className="quote-icon">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="testimonial-text">
                "Safebrains saved my life! Their AI tool detected early signs of a brain tumor that I wouldn't have noticed otherwise. The early diagnosis allowed for prompt treatment with a much better prognosis."
              </p>
              <div className="testimonial-author">
                <img src="https://xsgames.co/randomusers/assets/avatars/female/2.jpg" alt="Testimonial Author" />
                <div>
                  <h4>Sarah Johnson</h4>
                  <p>Patient</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="200">
              <div className="quote-icon">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="testimonial-text">
                "As a radiologist, I've found Safebrains to be an invaluable second opinion. The platform is intuitive and provides accurate results with impressive speed. It has improved our diagnostic workflow significantly."
              </p>
              <div className="testimonial-author">
                <img src="https://xsgames.co/randomusers/assets/avatars/male/4.jpg" alt="Testimonial Author" />
                <div>
                  <h4>Dr. Robert Chen</h4>
                  <p>Radiologist, Mayo Clinic</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="300">
              <div className="quote-icon">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="testimonial-text">
                "Implementing Safebrains in our hospital has reduced diagnostic time by 60% and improved our accuracy rate. The ROI has been tremendous, both in terms of cost savings and patient outcomes."
              </p>
              <div className="testimonial-author">
                <img src="https://xsgames.co/randomusers/assets/avatars/female/3.jpg" alt="Testimonial Author" />
                <div>
                  <h4>Emma Rodriguez</h4>
                  <p>Hospital Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section" data-aos="zoom-in">
        <div className="container">
          <h2>Ready to experience the future of tumor detection?</h2>
          <p>Try our AI-powered tools today and take a proactive step towards better health.</p>
          <div className="cta-buttons">
            <Link to="/tools" className="primary-btn">Try Our Tools</Link>
            <a href="mailto:adithyavholla23@gmail.com" className="secondary-btn">Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;