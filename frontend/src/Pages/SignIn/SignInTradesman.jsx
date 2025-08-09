import React from "react";
import "./SignInTradesman.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import NewNavbar from "../../Components/NewNavbar/NewNavbar.jsx";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaTools, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
const SignInTradesman = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if(localStorage.getItem("providerToken")){
      navigate('/provider/dashboard',{
        state:{
          info:"You were already signed in"
        }
      });
    }
    
    if (location.state?.error) {
      toast.error(location.state.error);
      window.history.replaceState({}, document.title);
    }
  }, [location, navigate]);

  async function handleClick(e) {
    e.preventDefault();
    
    if (!data.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    
    if (!data.password) {
      toast.error("Please enter your password");
      return;
    }
    
    setIsSubmitting(true);
    
    let newData = JSON.stringify({
      email: data.email,
      password: data.password,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_APP_BACKEND}/provider/signin`,
      headers: {
        "Content-Type": "application/json",
      },
      data: newData,
    };

    try {
      const response = await axios.request(config);
      
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        localStorage.setItem("providerToken", response.data.token);
        navigate("/provider/dashboard", {state:{success:"You have signed in successfully"}});
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <NewNavbar />
      <ToastContainer position="bottom-right" autoClose={5000} theme="colored" />
      
      <div className="signin-tradesman-page">
        <div className="signin-tradesman-container">
          <div className="signin-card">
            <div className="signin-card-header">
              <div className="signin-card-icon">
                <FaTools />
              </div>
              <h2>{t("Professional Sign In")}</h2>
              <p>{t("Access your service provider account")}</p>
            </div>
            
            <form className="signin-form" onSubmit={handleClick}>
              <div className="form-group">
                <label htmlFor="email">{t("Email Address")}</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="email"
                  placeholder="Enter your email" 
                  value={data.email}
                  onChange={(e) => setData({...data, email: e.target.value})}
                />
                <div className="form-icon">
                  <FaEnvelope />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">{t("Password")}</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="password" 
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={(e) => setData({...data, password: e.target.value})}
                />
                <div className="form-icon">
                  <FaLock />
                </div>
                <a href="#!" className="forgot-password">{t("Forgot password?")}</a>
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('Signing In...') : t('Sign In')} {!isSubmitting && <FaArrowRight style={{marginLeft: '5px'}} />}
              </button>
            </form>
          </div>
          
          <div className="signin-footer">
            <p>{t("Don't have an account?")} <Link to="/signuptradesman">{t("Register as Professional")}</Link></p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default SignInTradesman;