import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ReportBugWorker.css";
import NewNavbar from "../../Components/NewNavbar/NewTradesmanNavbar";
import Footer from "../../Components/Footer/Footer";

// Icons for better UX
import { FaBug, FaPaperPlane, FaCheckCircle, FaExclamationTriangle, FaTools } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { useTranslation } from "react-i18next";

const ReportBugWorker = () => {
  const [bugReport, setBugReport] = useState({
    title: "",
    description: "",
    severity: "low",
    deviceInfo: "",
    email: "",
  });

  const { t } = useTranslation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBugReport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Auto-fill device info
  const autoFillDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const deviceInfo = `${platform} - ${userAgent.split('(')[1]?.split(')')[0] || 'Unknown'} - ${userAgent.match(/Chrome\/[\d.]+|Firefox\/[\d.]+|Safari\/[\d.]+|Edge\/[\d.]+/)?.[0] || 'Unknown Browser'}`;
    
    setBugReport(prev => ({
      ...prev,
      deviceInfo: deviceInfo
    }));
    
    toast.info("Device information auto-filled!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Submitting your bug report...", {
      position: "bottom-right",
    });

    try {
      await emailjs.send(
        `${import.meta.env.VITE_APP_EMAIL_SERVER_ID}`,
        `${import.meta.env.VITE_APP_EMAIL_TEMPLATE_ID}`,
        {
          message: `Bug Report Details (Professional User)
                        Title: ${bugReport.title}
                        Description: ${bugReport.description}
                        Severity: ${bugReport.severity}
                        Device Info: ${bugReport.deviceInfo}
                        Email: ${bugReport.email}
                        User Type: Service Professional
                        Reported At: ${new Date().toLocaleString()}`,
        },
        `${import.meta.env.VITE_APP_EMAIL_PUBLIC_KEY}`
      );

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("🔧 Bug report submitted successfully! Our tech team will review it soon.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
          color: "white",
        },
      });

      // Reset form
      setBugReport({
        title: "",
        description: "",
        severity: "low",
        deviceInfo: "",
        email: "",
      });

    } catch (error) {
      console.error("Error sending bug report:", error);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error("❌ Failed to submit bug report. Please try again or contact technical support.", {
        position: "bottom-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
          color: "white",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <FaExclamationTriangle style={{ color: '#e53e3e' }} />;
      case 'high':
        return <FaExclamationTriangle style={{ color: '#f56565' }} />;
      case 'medium':
        return <FaExclamationTriangle style={{ color: '#ed8936' }} />;
      case 'low':
        return <FaCheckCircle style={{ color: '#48bb78' }} />;
      default:
        return <FaBug />;
    }
  };

  return (
    <>
      <NewNavbar />
      <div className="bug-report">
        <div className="bug-report__wrapper">
          <div className="bug-report__container">
            <div className="bug-report__header">
              <FaTools className="bug-report__icon" />
              <h1 className="bug-report__title">{t("Report a Technical Issue")}</h1>
            </div>
            <p className="bug-report__subtitle">
              {t("As a service professional, your feedback helps us improve the platform for everyone. Report any technical issues you encounter while managing your work.")}
            </p>
            
            <form onSubmit={handleSubmit} className="bug-report__form">
              <div className="bug-report__form-group">
                <label htmlFor="title" className="bug-report__label">
                  Issue Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={bugReport.title}
                  onChange={handleInputChange}
                  className="bug-report__input"
                  placeholder="Enter a short, descriptive title"
                  required
                  maxLength="100"
                />
                <small className="bug-report__helper">
                  {bugReport.title.length}/100 characters
                </small>
              </div>

              <div className="bug-report__form-group">
                <label htmlFor="description" className="bug-report__label">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={bugReport.description}
                  onChange={handleInputChange}
                  className="bug-report__textarea"
                  placeholder="Describe the technical issue in detail. Include what you were trying to do, what happened, and what you expected to happen. Mention if this affects your work or customer interactions."
                  required
                  maxLength="1000"
                  rows="6"
                />
                <small className="bug-report__helper">
                  {bugReport.description.length}/1000 characters
                </small>
              </div>

              <div className="bug-report__form-group">
                <label htmlFor="severity" className="bug-report__label">
                  Impact Level
                </label>
                <div className="bug-report__select-wrapper">
                  {getSeverityIcon(bugReport.severity)}
                  <select
                    id="severity"
                    name="severity"
                    value={bugReport.severity}
                    onChange={handleInputChange}
                    className="bug-report__select"
                  >
                    <option value="low">🟢 Low - Minor inconvenience</option>
                    <option value="medium">🟡 Medium - Affects work efficiency</option>
                    <option value="high">🟠 High - Blocks important tasks</option>
                    <option value="critical">🔴 Critical - Cannot work properly</option>
                  </select>
                </div>
              </div>

              <div className="bug-report__form-group">
                <label htmlFor="deviceInfo" className="bug-report__label">
                  Device & Browser Information
                </label>
                <div className="bug-report__device-input">
                  <input
                    type="text"
                    id="deviceInfo"
                    name="deviceInfo"
                    value={bugReport.deviceInfo}
                    onChange={handleInputChange}
                    className="bug-report__input"
                    placeholder="e.g., Android 13, Chrome 119, iPad Air, Safari"
                  />
                  <button
                    type="button"
                    onClick={autoFillDeviceInfo}
                    className="bug-report__auto-fill"
                    title="Auto-fill device information"
                  >
                    Auto-fill
                  </button>
                </div>
                <small className="bug-report__helper">
                  This helps our technical team reproduce and fix the issue faster
                </small>
              </div>

              <div className="bug-report__form-group">
                <label htmlFor="email" className="bug-report__label">
                  Professional Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={bugReport.email}
                  onChange={handleInputChange}
                  className="bug-report__input"
                  placeholder="Enter your professional email address"
                  required
                />
                <small className="bug-report__helper">
                  We'll contact you for updates and may need additional details
                </small>
              </div>

              <div className="bug-report__actions">
                <button 
                  type="submit" 
                  className="bug-report__submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <AiOutlineLoading3Quarters className="bug-report__loading" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Submit Technical Report</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setBugReport({
                      title: "",
                      description: "",
                      severity: "low",
                      deviceInfo: "",
                      email: "",
                    });
                    toast.info("Form cleared!", {
                      position: "bottom-right",
                      autoClose: 2000,
                    });
                  }}
                  className="bug-report__clear"
                  disabled={isSubmitting}
                >
                  Clear Form
                </button>
              </div>
            </form>
            
            <div className="bug-report__support-info">
              <h3>Need Immediate Help?</h3>
              <p>For urgent technical issues that prevent you from working, please contact our support team directly.</p>
              <div className="bug-report__contact-methods">
                <span>📞 Support: 1-800-HELP-NOW</span>
                <span>💬 Live Chat: Available 24/7</span>
                <span>📧 Email: tech-support@platform.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Container with custom styling */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: "12px",
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        }}
      />
      
      <Footer />
    </>
  );
};

export default ReportBugWorker;