import React, { useState, useEffect } from 'react';
import NewCustomerNavbar from '../../Components/NewNavbar/NewCustomerNavbar.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import axios from 'axios';
import "./Profile.css";
import { useTranslation } from "react-i18next";
import { 
    FaUser, 
    FaEnvelope, 
    FaPhone, 
    FaVenusMars, 
    FaCalendarAlt, 
    FaBirthdayCake,
    FaMapMarkerAlt, 
    FaHistory, 
    FaHeart, 
    FaCommentDots 
} from 'react-icons/fa';

const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
        }
        return age;
};

const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
};

// Updated avatar image handling function
const getProfileImage = (user) => {
    // Check if user has a profile image
    if (user?.profileImage) {
        return user.profileImage;
    }
    
    // If no profile image, use a realistic default image based on gender
    if (user?.gender?.toLowerCase() === 'female') {
        return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop";
    } else if (user?.gender?.toLowerCase() === 'male') {
        return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop";
    }
    
    // Final fallback to the current avatar generator
    const name = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User';
    return `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(name)}`;
};

const CustomerProfile = () => {
        const { t } = useTranslation();
        const [user, setUser] = useState({});
        const [loading, setLoading] = useState(true);

        useEffect(() => {
                let config = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: `${import.meta.env.VITE_APP_BACKEND}/customer/auth/profile`,
                        headers: {
                                "Authorization": `bearer ${localStorage.getItem('customerToken')}`
                        }
                };
                async function makeRequest() {
                        try {
                                const response = await axios.request(config);
                                setUser(response.data.customer);
                                setLoading(false);
                        } catch (err) {
                                console.log(err);
                                setLoading(false);
                        }
                }
                makeRequest();
        }, []);

        // Skeleton loading component
        const ProfileSkeleton = () => (
                <div className="customer-profile-container">
                        <div className="customer-profile-skeleton">
                                <div className="customer-profile-skeleton-banner">
                                        <div className="customer-profile-skeleton-avatar"></div>
                                </div>
                                <div className="customer-profile-skeleton-welcome">
                                        <div className="customer-profile-skeleton-heading"></div>
                                        <div className="customer-profile-skeleton-text"></div>
                                </div>
                                <div className="customer-profile-skeleton-content">
                                        <div className="customer-profile-skeleton-section">
                                                <div className="customer-profile-skeleton-section-title"></div>
                                                {[...Array(4)].map((_, i) => (
                                                        <div className="customer-profile-skeleton-item" key={i}>
                                                                <div className="customer-profile-skeleton-item-icon"></div>
                                                                <div className="customer-profile-skeleton-item-content">
                                                                        <div className="customer-profile-skeleton-item-label"></div>
                                                                        <div className="customer-profile-skeleton-item-value"></div>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </div>
                </div>
        );

        if (loading) {
                return (
                        <>
                                <NewCustomerNavbar />
                                <ProfileSkeleton />
                                <Footer />
                        </>
                );
        }

        return (
                <div className="customer-profile-page">
                        <NewCustomerNavbar />
                        <div className="customer-profile-container">
                                <div className="customer-profile-header">
                                        <h1 className="customer-profile-title">{t('Your Profile')}</h1>
                                        <p className="customer-profile-subtitle">{t('View and manage your personal information')}</p>
                                </div>
                                
                                <div className="customer-profile-card">
                                        <div className="customer-profile-banner">
                                                <div className="customer-profile-avatar">
                                                        <img 
                                                                src={getProfileImage(user)} 
                                                                alt={`${user.firstName || 'User'}'s profile`} 
                                                        />
                                                </div>
                                        </div>
                                        
                                        <div className="customer-profile-welcome">
                                                <h2 className="customer-profile-welcome-name">{t(`Hi, ${t(user.firstName)}!`)}</h2>
                                                <p className="customer-profile-welcome-message">{t('Welcome to your profile dashboard')}</p>
                                        </div>
                                        
                                        <div className="customer-profile-content">
                                                <div className="customer-profile-main">
                                                        <div className="customer-profile-section">
                                                                <h3 className="customer-profile-section-title">
                                                                        <FaUser /> {t('Personal Information')}
                                                                </h3>
                                                                
                                                                <div className="customer-profile-item">
                                                                        <div className="customer-profile-item-icon">
                                                                                <FaUser />
                                                                        </div>
                                                                        <div className="customer-profile-item-content">
                                                                                <div className="customer-profile-item-label">{t('Full Name')}</div>
                                                                                <div className="customer-profile-item-value">{t(user.firstName)} {t(user.lastName)}</div>
                                                                        </div>
                                                                </div>
                                                                
                                                                <div className="customer-profile-item">
                                                                        <div className="customer-profile-item-icon">
                                                                                <FaEnvelope />
                                                                        </div>
                                                                        <div className="customer-profile-item-content">
                                                                                <div className="customer-profile-item-label">{t('Email Address')}</div>
                                                                                <div className="customer-profile-item-value">{user.email}</div>
                                                                        </div>
                                                                </div>
                                                                
                                                                <div className="customer-profile-item">
                                                                        <div className="customer-profile-item-icon">
                                                                                <FaPhone />
                                                                        </div>
                                                                        <div className="customer-profile-item-content">
                                                                                <div className="customer-profile-item-label">{t('Phone Number')}</div>
                                                                                <div className="customer-profile-item-value">{user.phoneNumber}</div>
                                                                        </div>
                                                                </div>
                                                                
                                                                <div className="customer-profile-item">
                                                                        <div className="customer-profile-item-icon">
                                                                                <FaVenusMars />
                                                                        </div>
                                                                        <div className="customer-profile-item-content">
                                                                                <div className="customer-profile-item-label">{t('Gender')}</div>
                                                                                <div className="customer-profile-item-value">{t(user.gender)}</div>
                                                                        </div>
                                                                </div>
                                                                
                                                                <div className="customer-profile-item">
                                                                        <div className="customer-profile-item-icon">
                                                                                <FaCalendarAlt />
                                                                        </div>
                                                                        <div className="customer-profile-item-content">
                                                                                <div className="customer-profile-item-label">{t('Date of Birth')}</div>
                                                                                <div className="customer-profile-item-value">{formatDate(user.dob)}</div>
                                                                        </div>
                                                                </div>
                                                                
                                                                <div className="customer-profile-item">
                                                                        <div className="customer-profile-item-icon">
                                                                                <FaBirthdayCake />
                                                                        </div>
                                                                        <div className="customer-profile-item-content">
                                                                                <div className="customer-profile-item-label">{t('Age')}</div>
                                                                                <div className="customer-profile-item-value">{calculateAge(user.dob)} {t('years')}</div>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        
                                                        <div className="customer-profile-address">
                                                                <h3 className="customer-profile-address-title">
                                                                        <FaMapMarkerAlt /> {t('Address')}
                                                                </h3>
                                                                <p className="customer-profile-address-content">
                                                                        {t(user?.address?.houseNumber)}, {t(user?.address?.streetName)}, {t(user?.address?.state)}, {t(user?.address?.country)}
                                                                </p>
                                                        </div>
                                                </div>
                                                
                                                <div className="customer-profile-sidebar">
                                                        <div className="customer-profile-section">
                                                                <h3 className="customer-profile-section-title">
                                                                        <FaHistory /> {t('Your Activity')}
                                                                </h3>
                                                                
                                                                <div className="customer-profile-stats">
                                                                        <div className="customer-profile-stat-card">
                                                                                <div className="customer-profile-stat-icon">
                                                                                        <img src="https://img.icons8.com/fluency/96/service.png" alt="Services" />
                                                                                </div>
                                                                                <div className="customer-profile-stat-content">
                                                                                        <div className="customer-profile-stat-value">
                                                                                                {user?.orders?.length || 0}
                                                                                        </div>
                                                                                        <div className="customer-profile-stat-label">
                                                                                                {t('Services Availed')}
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                        
                                                                        <div className="customer-profile-stat-card">
                                                                                <div className="customer-profile-stat-icon">
                                                                                        <img src="https://img.icons8.com/fluency/96/like.png" alt="Favorites" />
                                                                                </div>
                                                                                <div className="customer-profile-stat-content">
                                                                                        <div className="customer-profile-stat-value">
                                                                                                {user?.favorites?.length || 0}
                                                                                        </div>
                                                                                        <div className="customer-profile-stat-label">
                                                                                                {t('Favorites')}
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                        
                                                                        <div className="customer-profile-stat-card">
                                                                                <div className="customer-profile-stat-icon">
                                                                                        <img src="https://img.icons8.com/fluency/96/comments.png" alt="Feedback" />
                                                                                </div>
                                                                                <div className="customer-profile-stat-content">
                                                                                        <div className="customer-profile-stat-value">
                                                                                                {user?.feedbacks?.length || 0}
                                                                                        </div>
                                                                                        <div className="customer-profile-stat-label">
                                                                                                {t('Feedbacks Given')}
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                        <Footer />
                </div>
        );
};

export default CustomerProfile;