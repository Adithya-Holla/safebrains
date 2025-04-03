import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animation on component mount
    setVisible(true);
  }, []);

  // Modal Component (defined inline)
  const Modal = ({ onClose }) => {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Understanding Tumors</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <p>
            A brain tumor is an abnormal growth of cells in the brain or central spinal canal, classified as benign (non-cancerous) or malignant (cancerous). Benign tumors, like meningiomas, grow slowly and are often encapsulated but can still cause symptoms such as headaches, seizures, or cognitive issues if they press on critical areas. Malignant tumors, such as glioblastomas, are aggressive and invasive, requiring intensive treatments like surgery, radiation, or chemotherapy.
            </p>
            <p>
            The exact cause of brain tumors is unclear, but risk factors include genetic conditions, radiation exposure, and possibly environmental toxins. Diagnosis involves imaging (MRI or CT scans) and biopsies to determine tumor type and grade, guiding treatment decisions. While surgery is often the first step, complete removal isn't always possible, especially near vital brain regions, necessitating additional therapies.
            </p>
          </div>
          <div className="modal-footer">
            <button className="primary-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="home">
      {/* Hero Section */}
      <section className={`hero-section ${visible ? 'visible' : ''}`}>
        <div className="hero-content">
          <h1 className="slide-up">Empowering Early Detection</h1>
          <p className="slide-up delay-1">Tumors are complex, but early detection saves lives.</p>
          <div className="hero-btns slide-up delay-2">
            <button className="cta-btn" onClick={() => setIsModalOpen(true)}>
              Learn More
            </button>
            <Link to="/tools" className="secondary-btn">
              Try Our Tools
            </Link>
          </div>
        </div>
        <div className="hero-image slide-up delay-3">
          <div className="blob"></div>
          <div className="image-container">
            <img src="/safebrain-homepage.png" alt="Brain Scan" />
          </div>
        </div>
      </section>

      {/* Conditionally Render the Modal */}
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
      
      {/* Facts Section */}
      <section className="facts-section">
        <h2 className="section-title">Did You Know?</h2>
        <div className="fact-cards">
          <div className="fact-card" data-aos="fade-up">
            <div className="fact-icon">
              <span role="img" aria-label="chart">📊</span>
            </div>
            <h3>Fact #1</h3>
            <p>
              Early detection of tumors can increase survival rates by up to 90% in some cases.
            </p>
          </div>
          <div className="fact-card" data-aos="fade-up" data-aos-delay="200">
            <div className="fact-icon">
              <span role="img" aria-label="globe">🌎</span>
            </div>
            <h3>Fact #2</h3>
            <p>
              Over 18 million new cancer cases are diagnosed globally each year, according to WHO.
            </p>
          </div>
          <div className="fact-card" data-aos="fade-up" data-aos-delay="400">
            <div className="fact-icon">
              <span role="img" aria-label="robot">🤖</span>
            </div>
            <h3>Fact #3</h3>
            <p>
              AI-powered tools are revolutionizing tumor detection, making it faster and more accurate.
            </p>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How Our Tools Work</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Your Scan</h3>
            <p>Simply upload your MRI or CT scan through our secure platform.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our advanced algorithms analyze the scan to detect potential anomalies.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Results</h3>
            <p>Receive a detailed report with visualizations to share with your doctor.</p>
          </div>
        </div>
        <div className="cta-container">
          <Link to="/tools" className="primary-btn">
            Try It Now
          </Link>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="testimonials">
        <h2 className="section-title">What Healthcare Professionals Say</h2>
        <div className="testimonial-carousel">
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"This platform has significantly improved our diagnostic workflow. The accuracy and speed are impressive."</p>
            </div>
            <div className="testimonial-author">
              <p className="name">Dr. Sarah Johnson</p>
              <p className="title">Neurologist, Mayo Clinic</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;