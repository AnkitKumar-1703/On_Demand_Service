import "./SignUpCustomer.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import NewNavbar from '../../Components/NewNavbar/NewNavbar.jsx';
import Footer from "../../Components/Footer/Footer";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { 
  FaUser, FaEnvelope, FaPhone, FaHome, FaMapMarkerAlt, 
  FaCalendarAlt, FaLock, FaVenusMars, FaCity, FaGlobeAsia
} from "react-icons/fa";

import { useTranslation } from "react-i18next";

const SignUpCustomer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    mobileNo: "",
    email: "",
    houseNumber: "",
    streetName: "",
    state: "",
    country: "India",
    gender: "",
    password: "",
    longitude: "",
    latitude: "",
    pincode: ""
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          }));
        },
        (error) => {
          console.error("Error obtaining geolocation", error);
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      phoneNumber: formData.mobileNo,
      email: formData.email,
      houseNumber: formData.houseNumber,
      streetName: formData.streetName,
      state: formData.state,
      country: formData.country,
      password: formData.password,
      longitude: formData.longitude,
      latitude: formData.latitude,
      gender: formData.gender,
      pincode: formData.pincode
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:5000/customer/signup',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };
    
    try {
      const response = await axios.request(config);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        localStorage.setItem("customerToken", response.data.token);
        navigate("/customer/dashboard", {state:{success:"You have signed up successfully"}});
      }
    } catch (error) {
      console.log(error);
      toast.error(t("Registration failed. Please try again."));
    }
  };

  return (
    <>
      <NewNavbar/>
      <ToastContainer position="bottom-right" autoClose={5000} theme="colored"/>
      
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-header">
            <h1 className="signup-title">{t("Create Your Customer Account")}</h1>
            <p className="signup-subtitle">{t("Join our platform to access reliable home services provided by trusted professionals in your area.")}</p>
          </div>
          
          <div className="signup-form-container">
            <form className="signup-customer-wrapper" onSubmit={handleSubmit}>
              <h3 className="signup-section-title">{t("Personal Information")}</h3>
              
              <div className="form-field">
                <label htmlFor="firstName">{t("First Name")}</label>
                <input 
                  type="text" 
                  id="firstName"
                  name="firstName" 
                  placeholder={t("Enter your first name")} 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                />
                <div className="form-field-icon"><FaUser /></div>
              </div>
              
              <div className="form-field">
                <label htmlFor="lastName">{t("Last Name")}</label>
                <input 
                  type="text" 
                  id="lastName"
                  name="lastName" 
                  placeholder={t("Enter your last name")} 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                />
                <div className="form-field-icon"><FaUser /></div>
              </div>
              
              <div className="form-field">
                <label htmlFor="email">{t("Email Address")}</label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  placeholder={t("Enter your email")} 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
                <div className="form-field-icon"><FaEnvelope /></div>
              </div>
              
              <div className="form-field">
                <label htmlFor="mobileNo">{t("Mobile Number")}</label>
                <input 
                  type="tel" 
                  id="mobileNo"
                  name="mobileNo" 
                  placeholder={t("Enter your mobile number")} 
                  value={formData.mobileNo} 
                  onChange={handleChange} 
                  required 
                />
                <div className="form-field-icon"><FaPhone /></div>
              </div>
              
              <div className="form-field">
                <label htmlFor="dob">{t("Date of Birth")}</label>
                <input 
                  type="date" 
                  id="dob"
                  name="dob" 
                  placeholder="YYYY-MM-DD" 
                  required 
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" 
                  value={formData.dob} 
                  onChange={handleChange} 
                />
                
              </div>
              
              <div className="form-field">
                <label htmlFor="gender">{t("Gender")}</label>
                <select 
                  id="gender"
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  required
                >
                  <option value="">{t("Select Gender")}</option>
                  <option value="Male">{t("Male")}</option>
                  <option value="Female">{t("Female")}</option>
                  <option value="Others">{t("Prefer not to say")}</option>
                </select>
                <div className="form-field-icon"><FaVenusMars /></div>
              </div>
              
              <h3 className="signup-section-title">{t("Address Information")}</h3>
              
              <div className="form-field">
                <label htmlFor="houseNumber">{t("House Number")}</label>
                <input 
                  type="text" 
                  id="houseNumber"
                  name="houseNumber" 
                  placeholder={t("Enter house number")} 
                  value={formData.houseNumber} 
                  onChange={handleChange} 
                  required 
                />
                <div className="form-field-icon"><FaHome /></div>
              </div>
              
              <div className="form-field">
                <label htmlFor="streetName">{t("Street Name")}</label>
                <input 
                  type="text" 
                  id="streetName"
                  name="streetName" 
                  placeholder={t("Enter street name")} 
                  value={formData.streetName} 
                  onChange={handleChange} 
                  required 
                />
                <div className="form-field-icon"><FaMapMarkerAlt /></div>
              </div>
              
              <div className="form-field">
                <label htmlFor="pincode">{t("PIN Code")}</label>
                <input 
                  type="text" 
                  id="pincode"
                  name="pincode" 
                  placeholder={t("Enter pincode")} 
                  value={formData.pincode} 
                  onChange={handleChange} 
                  required 
                />
                <div className="form-field-icon"><FaMapMarkerAlt /></div>
              </div>
              
              <div className="form-field">
                <label htmlFor="state">{t("State")}</label>
                <select 
                  id="state"
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange}
                  required
                >
                  <option value="">{t("Select State")}</option>
                  <option value="AN">{t("Andaman and Nicobar Islands")}</option>
                  <option value="AP">{t("Andhra Pradesh")}</option>
                  <option value="AR">{t("Arunachal Pradesh")}</option>
                  <option value="AS">{t("Assam")}</option>
                  <option value="BR">{t("Bihar")}</option>
                  <option value="CH">{t("Chandigarh")}</option>
                  <option value="CT">{t("Chhattisgarh")}</option>
                  <option value="DN">{t("Dadra and Nagar Haveli")}</option>
                  <option value="DD">{t("Daman and Diu")}</option>
                  <option value="DL">{t("Delhi")}</option>
                  <option value="GA">{t("Goa")}</option>
                  <option value="GJ">{t("Gujarat")}</option>
                  <option value="HR">{t("Haryana")}</option>
                  <option value="HP">{t("Himachal Pradesh")}</option>
                  <option value="JK">{t("Jammu and Kashmir")}</option>
                  <option value="JH">{t("Jharkhand")}</option>
                  <option value="KA">{t("Karnataka")}</option>
                  <option value="KL">{t("Kerala")}</option>
                  <option value="LA">{t("Ladakh")}</option>
                  <option value="LD">{t("Lakshadweep")}</option>
                  <option value="MP">{t("Madhya Pradesh")}</option>
                  <option value="MH">{t("Maharashtra")}</option>
                  <option value="MN">{t("Manipur")}</option>
                  <option value="ML">{t("Meghalaya")}</option>
                  <option value="MZ">{t("Mizoram")}</option>
                  <option value="NL">{t("Nagaland")}</option>
                  <option value="OR">{t("Odisha")}</option>
                  <option value="PY">{t("Puducherry")}</option>
                  <option value="PB">{t("Punjab")}</option>
                  <option value="RJ">{t("Rajasthan")}</option>
                  <option value="SK">{t("Sikkim")}</option>
                  <option value="TN">{t("Tamil Nadu")}</option>
                  <option value="TG">{t("Telangana")}</option>
                  <option value="TR">{t("Tripura")}</option>
                  <option value="UP">{t("Uttar Pradesh")}</option>
                  <option value="UT">{t("Uttarakhand")}</option>
                  <option value="WB">{t("West Bengal")}</option>
                </select>
                <div className="form-field-icon"><FaCity /></div>
              </div>
              
              <div className="form-field">
                <label htmlFor="country">{t("Country")}</label>
                <input 
                  type="text" 
                  id="country"
                  name="country" 
                  value={t("India")} 
                  readOnly 
                  className="readonly-input"
                />
                <div className="form-field-icon"><FaGlobeAsia /></div>
              </div>
              
              <h3 className="signup-section-title">{t("Security")}</h3>
              
              <div className="form-field full-width">
                <label htmlFor="password">{t("Password")}</label>
                <input 
                  type="password" 
                  id="password"
                  name="password" 
                  placeholder={t("Create a secure password")} 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
                <div className="form-field-icon"><FaLock /></div>
              </div>
              
              <div className="submit-button-container">
                <button type="submit" className="submit-button">{t("Create Account")}</button>
              </div>
            </form>
          </div>
          
          <div className="signup-footer">
            <p>{t("Already have an account?")} <Link to="/signincustomer">{t("Sign in")}</Link></p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default SignUpCustomer;