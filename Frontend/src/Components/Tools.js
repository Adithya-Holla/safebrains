import React, { useState, useRef } from 'react';
import './Tools.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Base API URL - adjust based on environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin  // Use the same origin in production
  : 'http://localhost:5000';

const Tools = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    
    // Comment out mock response for now
    /*
    setTimeout(() => {
      // Mock response
      const mockResult = {
        tumor_type: "Meningioma",
        risk_level: "Low",
        probability: 87.5,
        processed_images: [
          "https://www.hopkinsmedicine.org/-/media/images/health/1_-conditions/brain/brain-tumor-awareness/braincancerbraintumor.jpg"
        ]
      };
      setResult(mockResult);
      setIsLoading(false);
    }, 2000);
    */
    
    // Use actual API integration
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process the files.");
      }
      
      const data = await response.json();
      // Transform the processed_images array to include full URL
      if (data.processed_images && data.processed_images.length > 0) {
        data.processed_images = data.processed_images.map(filename => 
          `${API_BASE_URL}/api/processed_images/${filename}`
        );
      }
      setResult(data);
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message || "An error occurred while processing the files.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!result) return;
    
    setIsDownloading(true);
    
    try {
      const resultsElement = resultsRef.current;
      const canvas = await html2canvas(resultsElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Set PDF metadata
      pdf.setProperties({
        title: 'Brain Tumor Detection Report',
        subject: 'AI Analysis Results',
        author: 'TumorDetect AI',
        creator: 'TumorDetect'
      });
      
      // Add header
      pdf.setFillColor(106, 13, 173);
      pdf.rect(0, 0, pdfWidth, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.text('Brain Tumor Detection Report', pdfWidth / 2, 15, { align: 'center' });
      
      // Add timestamp
      const date = new Date().toLocaleString();
      pdf.setFontSize(10);
      pdf.text(`Generated: ${date}`, pdfWidth - 15, 25, { align: 'right' });
      
      // Add image of results
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 10, 40, imgWidth, imgHeight);
      
      // Add notes and disclaimer
      const noteY = imgHeight + 50;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.text('Analysis Notes:', 10, noteY);
      pdf.setFontSize(10);
      pdf.text(`Tumor Type: ${result.tumor_type}`, 15, noteY + 10);
      pdf.text(`Risk Level: ${result.risk_level === "RISK" ? "High" : result.risk_level}`, 15, noteY + 20);
      pdf.text(`Probability: ${result.probability}%`, 15, noteY + 30);
      
      // Disclaimer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('DISCLAIMER: This report is generated by an AI system for educational purposes only.', 10, pdfHeight - 10);
      pdf.text('It is not a substitute for professional medical diagnosis. Please consult a healthcare professional.', 10, pdfHeight - 5);
      
      // Save PDF
      pdf.save('tumor-detection-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleShareResults = async () => {
    if (!result) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Brain Tumor Detection Results',
          text: `Tumor Type: ${result.tumor_type}, Risk Level: ${result.risk_level}, Probability: ${result.probability}%`,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `Brain Tumor Detection Results - Tumor Type: ${result.tumor_type}, Risk Level: ${result.risk_level}, Probability: ${result.probability}%`;
        await navigator.clipboard.writeText(shareText);
        alert('Results copied to clipboard! You can now paste and share them.');
      }
    } catch (error) {
      console.error('Error sharing results:', error);
      alert('Failed to share results. Please try manually sharing the information.');
    }
  };

  return (
    <div className="tools-container">
      <div className="tools-header" data-aos="fade-up">
        <h1>AI-Powered <span className="highlight">Tumor Detection</span></h1>
        <p>Upload your MRI or CT scan reports for immediate analysis using our cutting-edge AI algorithms.</p>
      </div>
      
      <div className="tools-grid">
        <div className="upload-container" data-aos="fade-right">
          <form 
            onSubmit={handleSubmit} 
            className="upload-form"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`drop-zone ${dragActive ? 'active' : ''} ${files.length > 0 ? 'has-files' : ''}`}>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                multiple 
                accept="image/*" 
                className="file-input" 
              />
              
              <div className="drop-zone-content" onClick={openFileDialog}>
                <div className="upload-icon">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                {files.length > 0 ? (
                  <div className="selected-files">
                    <p><strong>{files.length}</strong> file(s) selected</p>
                    <ul>
                      {files.map((file, index) => (
                        <li key={index}>
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <>
                    <p className="drop-text">Drag & drop your files here</p>
                    <p className="or-text">- OR -</p>
                    <button type="button" className="browse-btn">Browse Files</button>
                  </>
                )}
              </div>
            </div>
            
            <button type="submit" className="analyze-btn" disabled={isLoading || files.length === 0}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-brain"></i>
                  Analyze Scan
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="info-container" data-aos="fade-left">
          <div className="info-card">
            <h2><i className="fas fa-info-circle"></i> How It Works</h2>
            <ol>
              <li>
                <strong>Upload:</strong> 
                <p>Upload one or more brain scan images (MRI or CT).</p>
              </li>
              <li>
                <strong>Analysis:</strong> 
                <p>Our AI system analyzes the images using advanced convolutional neural networks.</p>
              </li>
              <li>
                <strong>Results:</strong> 
                <p>Receive detailed analysis including tumor type, risk level, and probability.</p>
              </li>
            </ol>
            <div className="disclaimer">
              <p><i className="fas fa-exclamation-triangle"></i> This tool is for educational purposes only and not a substitute for professional medical diagnosis.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      {result && (
        <div className="results-container" data-aos="zoom-in">
          <div className="results-card">
            <div className="results-header">
              <h2>Analysis Results</h2>
              <button className="close-results" onClick={() => setResult(null)}>×</button>
            </div>
            
            <div className="results-content" ref={resultsRef}>
              <div className="results-summary">
                <div className="result-item">
                  <h3>Tumor Type</h3>
                  <p>{result.tumor_type}</p>
                </div>
                <div className="result-item">
                  <h3>Risk Level</h3>
                  <div className={`risk-badge ${result.risk_level === "RISK" ? "high" : "low"}`}>
                    {result.risk_level === "RISK" ? "High" : result.risk_level}
                  </div>
                </div>
                <div className="result-item">
                  <h3>Probability</h3>
                  <div className="probability-bar">
                    <div 
                      className="probability-fill" 
                      style={{ 
                        width: `${result.probability}%`,
                        background: result.probability > 50 
                          ? 'linear-gradient(to right, #F44336, #FF9800)' // Red to orange for high probability
                          : 'linear-gradient(to right, #4CAF50, #8BC34A)'  // Green for low probability
                      }}
                    ></div>
                    <span>{result.probability}%</span>
                  </div>
                </div>
              </div>
              
              {result.processed_images && result.processed_images.length > 0 && (
                <div className="results-images">
                  <h3>Analyzed Image</h3>
                  <div className="image-gallery">
                    {result.processed_images.map((imagePath, index) => (
                      <div className="image-card" key={index} id={`image-card-${index}`}>
                        <img
                          src={imagePath}
                          alt={`Processed MRI Scan with Detection ${index + 1}`}
                          onError={(e) => {
                            console.error("Image failed to load:", imagePath);
                            document.getElementById(`image-card-${index}`).classList.add('error');
                            e.target.style.display = 'none';
                          }}
                          onClick={(e) => {
                            // Open image in full screen when clicked
                            const img = e.target;
                            if (img.requestFullscreen) {
                              img.requestFullscreen();
                            } else if (img.webkitRequestFullscreen) { /* Safari */
                              img.webkitRequestFullscreen();
                            } else if (img.msRequestFullscreen) { /* IE11 */
                              img.msRequestFullscreen();
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="image-hint">Click on the image to view in full screen</p>
                </div>
              )}
            </div>
            
            <div className="results-actions">
              <button 
                className="download-btn" 
                onClick={handleDownloadReport}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <div className="spinner-small"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-download"></i> Download Report
                  </>
                )}
              </button>
              <button className="share-btn" onClick={handleShareResults}>
                <i className="fas fa-share-alt"></i> Share Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tools;