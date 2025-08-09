import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ReportBugUser.css";
import NewNavbar from "../../Components/NewNavbar/NewCustomerNavbar.jsx";
import Footer from "../../Components/Footer/Footer.jsx";

// Icons for better UX
import { FaBug, FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import {  useTranslation } from "react-i18next";

const ReportBugUser = () => {
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
          message: `Bug Report Details
                        Title: ${bugReport.title}
                        Description: ${bugReport.description}
                        Severity: ${bugReport.severity}
                        Device Info: ${bugReport.deviceInfo}
                        Email: ${bugReport.email}
                        Reported At: ${new Date().toLocaleString()}`,
        },
        `${import.meta.env.VITE_APP_EMAIL_PUBLIC_KEY}`
      );

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("🐛 Bug report submitted successfully! We'll review it soon.", {
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
      toast.error("❌ Failed to submit bug report. Please try again or contact support.", {
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
              <FaBug className="bug-report__icon" />
              <h1 className="bug-report__title">{t("Report a Bug")}</h1>
            </div>
            <p className="bug-report__subtitle">
              {t("Help us improve by reporting bugs you encounter. Your feedback makes our platform better!")}
            </p>
            
            <form onSubmit={handleSubmit} className="bug-report__form">
              <div className="bug-report__form-group">
                <label htmlFor="title" className="bug-report__label">
                  {t("Bug Title")} *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={bugReport.title}
                  onChange={handleInputChange}
                  className="bug-report__input"
                  placeholder={t("Enter a short, descriptive title")}
                  required
                  maxLength="100"
                />
                <small className="bug-report__helper">
                  {bugReport.title.length}/100 {t("characters")}
                </small>
              </div>

              <div className="bug-report__form-group">
                <label htmlFor="description" className="bug-report__label">
                  {t("Description")} *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={bugReport.description}
                  onChange={handleInputChange}
                  className="bug-report__textarea"
                  placeholder={t("Describe the bug in detail. Include steps to reproduce, expected behavior, and actual behavior.")}
                  required
                  maxLength="1000"
                  rows="6"
                />
                <small className="bug-report__helper">
                  {bugReport.description.length}/1000 {t("characters")}
                </small>
              </div>

              <div className="bug-report__form-group">
                <label htmlFor="severity" className="bug-report__label">
                  {t("Severity Level")}
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
                    <option value="low">🟢 {t("Low - Minor cosmetic issues")}</option>
                    <option value="medium">🟡 {t("Medium - Affects functionality")}</option>
                    <option value="high">🟠 {t("High - Major feature broken")}</option>
                    <option value="critical">🔴 {t("Critical - System unusable")}</option>
                  </select>
                </div>
              </div>

              <div className="bug-report__form-group">
                <label htmlFor="deviceInfo" className="bug-report__label">
                  {t("Device & Browser Information")}
                </label>
                <div className="bug-report__device-input">
                  <input
                    type="text"
                    id="deviceInfo"
                    name="deviceInfo"
                    value={bugReport.deviceInfo}
                    onChange={handleInputChange}
                    className="bug-report__input"
                    placeholder={t("e.g., Windows 11, Chrome 119, iPhone 14 Pro")}
                  />
                  <button
                    type="button"
                    onClick={autoFillDeviceInfo}
                    className="bug-report__auto-fill"
                    title={t("Auto-fill device information")}
                  >
                    {t("Auto-fill")}
                  </button>
                </div>
                <small className="bug-report__helper">
                  {t("This helps us reproduce and fix the issue faster")}
                </small>
              </div>

              <div className="bug-report__form-group">
                <label htmlFor="email" className="bug-report__label">
                  {t("Your Email Address")} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={bugReport.email}
                  onChange={handleInputChange}
                  className="bug-report__input"
                  placeholder={t("Enter your email for follow-up communication")}
                  required
                />
                <small className="bug-report__helper">
                  {t("We'll contact you if we need more information")}
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
                      <span>{t("Submitting...")}</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>{t("Submit Bug Report")}</span>
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
                    toast.info(t("Form cleared!"), {
                      position: "bottom-right",
                      autoClose: 2000,
                    });
                  }}
                  className="bug-report__clear"
                  disabled={isSubmitting}
                >
                  {t("Clear Form")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
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

export default ReportBugUser;