import React from "react";
import NewTradesmanNavbar from "../../Components/NewNavbar/NewTradesmanNavbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { 
  FaUser, 
  FaRegEdit, 
  FaPhone, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaTools, 
  FaSave, 
  FaTimes, 
  FaVenusMars, 
  FaBriefcase,
  FaStar
} from "react-icons/fa";

import "./WorkerProfile.css";

import { useTranslation } from "react-i18next";

const WorkerProfile = () => {

const {t}=useTranslation();

  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function makeRequest() {
      setLoading(true);
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_APP_BACKEND}/provider/auth/profile`,
        headers: {
          Authorization: `bearer ${localStorage.getItem("providerToken")}`,
        },
      };
      try {
        let response = await axios.request(config);
        setUserData(response.data);
        setFormData(response.data);
        let cnt=0;
        response.data.orders.forEach((task) => {
          if (task.state === "COMPLETED") {
            cnt++;
          }
        });
        setFormData((prev) => ({
          ...prev,
          completedJobs: cnt,
        }));
      } catch (err) {
        console.log(err);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }

    makeRequest();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "houseNumber" || name === "streetName" || name === "state" || name === "pincode") {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleEdit() {
    setEdit(true);
  }

  function handleCancel() {
    setEdit(false);
    setFormData(userData);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formattedDob = formData.dob;
  if (formData.dob && typeof formData.dob === 'string') {
    // Ensure we're sending a properly formatted ISO string
    formattedDob = new Date(formData.dob).toISOString();
  }
  
  const updatedData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    dob: formattedDob,
    phoneNumber: formData.phoneNumber,
    address: formData.address,
    gender: formData.gender,
    workType: formData.workType,
  };
    console.log(updatedData);
    
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_APP_BACKEND}/provider/auth/updateProfile`,
      headers: {
        Authorization: "bearer " + localStorage.getItem("providerToken"),
        "Content-Type": "application/json",
      },
      data: updatedData,
    };

    try {
      const response = await axios.request(config);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Profile updated successfully");
        setEdit(false);
        setUserData({...formData});
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <>
        <NewTradesmanNavbar />
        <div className="profile-container">
          <div className="loading-spinner">Loading profile data...</div>
        </div>
      </>
    );
  }

  // Calculate years of experience (placeholder)
  const experience = formData.experience || "5 years";
  const jobsCompleted = formData.completedJobs || 48;

  return (
    <>
      <ToastContainer position="bottom-right" />
      <NewTradesmanNavbar />
      <div className="worker-profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>{t("My Professional Profile")}</h1>
            {!edit && (
              <button className="edit-profile-btn" onClick={handleEdit}>
                <FaRegEdit /> {t("Edit Profile")}
              </button>
            )}
          </div>

          <div className="profile-layout">
            <div className="profile-sidebar">
              <div className="profile-card">
                <div className="profile-image-wrapper">
                  <img
                    src="https://randomuser.me/api/portraits/men/43.jpg" 
                    alt="Profile"
                    className="profile-image"
                  />
                </div>
                <h2 className="profile-name">
                  {formData.firstName} {formData.lastName}
                </h2>
                <div className="profile-occupation">
                  <FaTools /> {formData.workType || t("Professional")}
                </div>
                
                <div className="profile-badge">
                  <FaStar style={{ marginRight: '5px' }} /> 
                  {formData.rating ? parseFloat(formData.rating).toFixed(2) : "4.80"} {t("Rating")}
                </div>
                
                <div className="profile-stats">
                  <div className="stat-item">
                    <div className="stat-value">{experience}</div>
                    <div className="stat-label">{t("Experience")}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{jobsCompleted}</div>
                    <div className="stat-label">{t("Jobs")}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-content">
              <form onSubmit={handleSubmit} className="form-container">
                <div className="form-section">
                  <h3 className="form-section-title">
                    <FaUser /> {t("Personal Information")}
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">{t("First Name")}</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className={`form-control ${edit ? 'editable' : ''}`}
                        value={formData.firstName || ""}
                        onChange={handleChange}
                        readOnly={!edit}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName">{t("Last Name")}</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className={`form-control ${edit ? 'editable' : ''}`}
                        value={formData.lastName || ""}
                        onChange={handleChange}
                        readOnly={!edit}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="dob">
                        <FaCalendarAlt style={{ marginRight: '5px' }} /> {t("Date of Birth")}
                      </label>
                      <input
                        className={`form-control ${edit ? 'editable' : ''}`}
                        type="date"
                        name="dob"
                        value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ""}
                        placeholder="YYYY-MM-DD"
                        required
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                        onChange={handleChange}
                        readOnly={!edit}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="gender">
                        <FaVenusMars style={{ marginRight: '5px' }} /> {t("Gender")}
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        className={`form-control ${edit ? 'editable' : ''}`}
                        value={formData.gender || ""}
                        onChange={handleChange}
                        disabled={!edit}
                      >
                        <option value="">{t("Select Gender")}</option>
                        <option value="Male">{t("Male")}</option>
                        <option value="Female">{t("Female")}</option>
                        <option value="Others">{t("Prefer not to say")}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">
                    <FaPhone /> {t("Contact Details")}
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">{t("Phone Number")}</label>
                      <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        className={`form-control ${edit ? 'editable' : ''}`}
                        value={formData.phoneNumber || ""}
                        onChange={handleChange}
                        readOnly={!edit}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">{t("Email Address")}</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={formData.email || ""}
                        readOnly={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">
                    <FaMapMarkerAlt /> {t("Address Information")}
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="houseNumber">{t("House Number")}</label>
                      <input
                        type="text"
                        id="houseNumber"
                        name="houseNumber"
                        className={`form-control ${edit ? 'editable' : ''}`}
                        value={formData?.address?.houseNumber || ""}
                        onChange={handleChange}
                        readOnly={!edit}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="streetName">{t("Street Name")}</label>
                      <input
                        type="text"
                        id="streetName"
                        name="streetName"
                        className={`form-control ${edit ? 'editable' : ''}`}
                        value={formData?.address?.streetName || ""}
                        onChange={handleChange}
                        readOnly={!edit}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="state">{t("State")}</label>
                      <select
                        id="state"
                        name="state"
                        className={`form-control ${edit ? 'editable' : ''}`}
                        value={formData?.address?.state || ""}
                        onChange={handleChange}
                        disabled={!edit}
                      >
                        <option value="">{t("Select state")}</option>
                        <option value="Andaman and Nicobar Islands">{t("Andaman and Nicobar Islands")}</option>
                        <option value="Andhra Pradesh">{t("Andhra Pradesh")}</option>
                        <option value="Arunachal Pradesh">{t("Arunachal Pradesh")}</option>
                        <option value="Assam">{t("Assam")}</option>
                        <option value="Bihar">{t("Bihar")}</option>
                        <option value="Chandigarh">{t("Chandigarh")}</option>
                        <option value="Chhattisgarh">{t("Chhattisgarh")}</option>
                        <option value="Dadra and Nagar Haveli">{t("Dadra and Nagar Haveli")}</option>
                        <option value="Daman and Diu">{t("Daman and Diu")}</option>
                        <option value="Delhi">{t("Delhi")}</option>
                        <option value="Goa">{t("Goa")}</option>
                        <option value="Gujarat">{t("Gujarat")}</option>
                        <option value="Haryana">{t("Haryana")}</option>
                        <option value="Himachal Pradesh">{t("Himachal Pradesh")}</option>
                        <option value="Jammu and Kashmir">{t("Jammu and Kashmir")}</option>
                        <option value="Jharkhand">{t("Jharkhand")}</option>
                        <option value="Karnataka">{t("Karnataka")}</option>
                        <option value="Kerala">{t("Kerala")}</option>
                        <option value="Ladakh">{t("Ladakh")}</option>
                        <option value="Lakshadweep">{t("Lakshadweep")}</option>
                        <option value="Madhya Pradesh">{t("Madhya Pradesh")}</option>
                        <option value="Maharashtra">{t("Maharashtra")}</option>
                        <option value="Manipur">{t("Manipur")}</option>
                        <option value="Meghalaya">{t("Meghalaya")}</option>
                        <option value="Mizoram">{t("Mizoram")}</option>
                        <option value="Nagaland">{t("Nagaland")}</option>
                        <option value="Odisha">{t("Odisha")}</option>
                        <option value="Puducherry">{t("Puducherry")}</option>
                        <option value="Punjab">{t("Punjab")}</option>
                        <option value="Rajasthan">{t("Rajasthan")}</option>
                        <option value="Sikkim">{t("Sikkim")}</option>
                        <option value="Tamil Nadu">{t("Tamil Nadu")}</option>
                        <option value="Telangana">{t("Telangana")}</option>
                        <option value="Tripura">{t("Tripura")}</option>
                        <option value="Uttar Pradesh">{t("Uttar Pradesh")}</option>
                        <option value="Uttarakhand">{t("Uttarakhand")}</option>
                        <option value="West Bengal">{t("West Bengal")}</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="pincode">{t("PIN Code")}</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        className={`form-control ${edit ? 'editable' : ''}`}
                        value={formData?.address?.pincode || ""}
                        onChange={handleChange}
                        readOnly={!edit}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="country">{t("Country")}</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        className="form-control"
                        value={t("India")}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">
                    <FaBriefcase /> {t("Professional Information")}
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="workType">{t("Specialization")}</label>
                      <select
                        id="workType"
                        name="workType"
                        className={`form-control ${edit ? 'editable' : ''}`}
                        value={formData.workType || ""}
                        onChange={handleChange}
                        disabled={!edit}
                      >
                        <option value="">{t("Select Specialization")}</option>
                        <option value="Carpenter">{t("Carpenter")}</option>
                        <option value="Plumber">{t("Plumber")}</option>
                        <option value="Mechanic">{t("Mechanic")}</option>
                        <option value="Electrician">{t("Electrician")}</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="aadharNumber">{t("Aadhar Card Number")}</label>
                      <input
                        type="text"
                        id="aadharNumber"
                        name="aadharNumber"
                        className="form-control"
                        value={formData.aadharNumber ? 
                          formData.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, "XXXX XXXX $3") : 
                          ""}
                        readOnly={true}
                      />
                    </div>
                  </div>
                </div>

                {edit && (
                  <div className="button-container">
                    <button type="submit" className="btn btn-primary">
                      <FaSave /> {t("Save Changes")}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={handleCancel}
                    >
                      <FaTimes /> {t("Cancel")}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkerProfile;
