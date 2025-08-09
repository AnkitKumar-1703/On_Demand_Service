import "./SignUpTradesman.css";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NewNavbar from "../../Components/NewNavbar/NewNavbar.jsx";
import Footer from "../../Components/Footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import { useTranslation } from "react-i18next";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLock,
  FaVenusMars,
  FaCity,
  FaGlobeAsia,
  FaIdCard,
  FaTools,
  FaHammer,
  FaWrench,
  FaBolt,
  FaCog,
} from "react-icons/fa";

const SignUpTradesman = () => {
  const navigate = useNavigate();

  const {t}=useTranslation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phoneNumber: "",
    email: "",
    houseNumber: "",
    streetName: "",
    state: "",
    pincode: "",
    country: "India",
    photoLink: null,
    gender: "",
    aadharNumber: "",
    workType: "",
    password: "",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
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
      [name]: value,
    });
  };

  const setWorkType = (type) => {
    setFormData({
      ...formData,
      workType: type,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("hello");
    // console.log(e.target.photoLink.files[0]);
    // console.log("hi");

    // Validate work type is selected
    if (!formData.workType || formData.workType === "WorkType") {
      toast.error("Please select your work type");
      return;
    }

    // Validate Aadhar number
    if (!formData.aadharNumber || formData.aadharNumber.length !== 12) {
      toast.error("Please enter a valid 12-digit Aadhar number");
      return;
    }
    let data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("dob", formData.dob);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("email", formData.email);
    data.append("gender", formData.gender);
    data.append("password", formData.password);
    data.append("houseNumber", formData.houseNumber);
    data.append("streetName", formData.streetName);
    data.append("state", formData.state);
    data.append("country", formData.country);
    data.append("pincode", formData.pincode);
    data.append("longitude", formData.longitude);
    data.append("latitude", formData.latitude);
    data.append("aadharNumber", formData.aadharNumber);
    data.append("workType", formData.workType);
    if (e.target.photoLink.files[0]) {
      data.append("photoLink", e.target.photoLink.files[0]);
    }


    // let data = JSON.stringify({
    //   firstName: formData.firstName,
    //   lastName: formData.lastName,
    //   dob: formData.dob,
    //   phoneNumber: formData.phoneNumber,
    //   email: formData.email,
    //   houseNumber: formData.houseNumber,
    //   streetName: formData.streetName,
    //   state: formData.state,
    //   pincode: formData.pincode,
    //   country: formData.country,
    //   photoLink: formData.photoLink,
    //   longitude: formData.longitude,
    //   latitude: formData.latitude,
    //   workType: formData.workType,
    //   gender: formData.gender,
    //   password: formData.password,
    //   aadharNumber: formData.aadharNumber,
    // });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_APP_BACKEND}/provider/signup`,
      data: data,
    };

    try {
      const response = await axios.request(config);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        localStorage.setItem("providerToken", response.data.token);
        navigate("/provider/dashboard", {
          state: { success: "You have signed up successfully" },
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  // Render the appropriate icon based on work type
  const getWorkTypeIcon = (type) => {
    switch (type) {
      case "Carpenter":
        return <FaHammer />;
      case "Plumber":
        return <FaWrench />;
      case "Electrician":
        return <FaBolt />;
      case "Mechanic":
        return <FaCog />;
      default:
        return <FaTools />;
    }
  };

  return (
    <>
      <NewNavbar />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        theme="colored"
      />

      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-header">
            <h1 className="signup-title">{t("Join as a Professional")}</h1>
            <p className="signup-subtitle">
              {t("Register as a service provider and connect with customers in your area who need your expertise.")}
            </p>
          </div>

          <div className="signup-form-container">
            <form className="signup-tradesman-wrapper" onSubmit={handleSubmit}>
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
                <div className="form-field-icon">
                  <FaUser />
                </div>
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
                <div className="form-field-icon">
                  <FaUser />
                </div>
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
                <div className="form-field-icon">
                  <FaEnvelope />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="phoneNumber">{t("Mobile Number")}</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder={t("Enter your mobile number")}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                <div className="form-field-icon">
                  <FaPhone />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="dob">{t("Date of Birth")}</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  placeholder="YYYY-MM-DD"
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                  value={formData.dob}
                  onChange={handleChange}
                  required
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
                <div className="form-field-icon">
                  <FaVenusMars />
                </div>
              </div>

              <div className="image-upload-container">
                <label htmlFor="photoLink">{t("Profile Image")} : </label>
                <div className="image-upload">
                  <input
                    type="file"
                    id="photoLink"
                    name="photoLink"
                    onChange={handleChange}
                  />
                </div>
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
                <div className="form-field-icon">
                  <FaHome />
                </div>
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
                <div className="form-field-icon">
                  <FaMapMarkerAlt />
                </div>
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
                <div className="form-field-icon">
                  <FaMapMarkerAlt />
                </div>
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
                <div className="form-field-icon">
                  <FaCity />
                </div>
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
                <div className="form-field-icon">
                  <FaGlobeAsia />
                </div>
              </div>

              <h3 className="signup-section-title">{t("Professional Information")}</h3>

              <div className="form-field full-width">
                <label htmlFor="aadharNumber">{t("Aadhar Number")}</label>
                <input
                  type="text"
                  id="aadharNumber"
                  name="aadharNumber"
                  placeholder={t("Enter your 12-digit Aadhar number")}
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  required
                  maxLength="12"
                  pattern="\d{12}"
                />
                <div className="form-field-icon">
                  <FaIdCard />
                </div>
              </div>

              <div className="form-field full-width">
                <label htmlFor="workType">{t("Work Type")}</label>
                <select
                  id="workType"
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t("Select Your Work Type")}</option>
                  <option value="Carpenter">{t("Carpenter")}</option>
                  <option value="Plumber">{t("Plumber")}</option>
                  <option value="Electrician">{t("Electrician")}</option>
                  <option value="Mechanic">{t("Mechanic")}</option>
                </select>
                <div className="form-field-icon">
                  <FaTools />
                </div>
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
                <div className="form-field-icon">
                  <FaLock />
                </div>
              </div>

              <div className="submit-button-container">
                <button type="submit" className="submit-button">
                  {t("Register as Professional")}
                </button>
              </div>
            </form>
          </div>

          <div className="signup-footer">
            <p>
              {t("Already have a professional account?")}{" "}
              <Link to="/signintradesman">{t("Sign in")}</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignUpTradesman;
