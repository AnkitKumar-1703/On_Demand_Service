import React from 'react';
import { Link } from 'react-router-dom';
import "./SignUp.css";
import NewNavbar from '../../Components/NewNavbar/NewNavbar.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import { FaUser, FaTools, FaChevronRight } from 'react-icons/fa';

import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { t } = useTranslation();
  return (
    <>
      <NewNavbar />
      <div className="signin-wrapper">
        <div className='signin-container'>
          <h1>{t("Create Account")}</h1>

          <div className="buttons">
            <Link to="/signupcustomer" className="signin-button button-customer">
              <div className="button-icon">
                <FaUser size={20} />
              </div>
              <div className="button-content">
                <div className="button-title">{t("Customer")}</div>
                <div className="button-subtitle">{t("Register for home services & support")}</div>
              </div>
              <div className="button-arrow">
                <FaChevronRight />
              </div>
            </Link>

            <Link to="/signuptradesman" className="signin-button button-tradesman">
              <div className="button-icon">
                <FaTools size={20} />
              </div>
              <div className="button-content">
                <div className="button-title">{t("Professional")}</div>
                <div className="button-subtitle">{t("Register as a service provider")}</div>
              </div>
              <div className="button-arrow">
                <FaChevronRight />
              </div>
            </Link>
          </div>

          <div className="signin-footer">
            <p>{t("Already have an account?")} <Link to='/signin'>{t("Sign In")}</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SignUp;