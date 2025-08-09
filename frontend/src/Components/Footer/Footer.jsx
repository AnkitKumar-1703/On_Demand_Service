import React from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/LandingPageImages/Company-Logo.png";
import facebook from "../../assets/LandingPageImages/facebook.png";
import instagram from "../../assets/LandingPageImages/instagram.png";
import twitter from "../../assets/LandingPageImages/twitter.png";
import linkedin from "../../assets/LandingPageImages/linkedin.png";

import "./Footer.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer>
      <div className="image-container">
        <img src={logo} alt={t("Company Logo")} />
      </div>
      <div className="content">
        <div className="container">
          <h1>{t("Company")}</h1>
          <p>{t("About Us")}</p>
          <p>{t("Terms & Condition")}</p>
          <p>{t("Privacy Policy")}</p>
        </div>
        <div className="container">
          <h1>{t("For Customer")}</h1>
          <p>{t("Contact Us")}</p>
          <p>{t("On Demand Service Reviews")}</p>
        </div>
        <div className="container">
          <h1>{t("For Professionals")}</h1>
          <p>{t("Register as a Professional")}</p>
        </div>
        <div className="container">
          <h1>{t("Social Links")}</h1>
          <div className="links">
            <a href=""><img src={twitter} alt={t("Twitter")} /></a>
            <a href=""><img src={instagram} alt={t("Instagram")} /></a>
            <a href=""><img src={facebook} alt={t("Facebook")} /></a>
            <a href=""><img src={linkedin} alt={t("LinkedIn")} /></a>
          </div>
        </div>
      </div>
      <div className="copyright">
        {t("Copyright © 2024 All Rights Reserved")}
      </div>
    </footer>
  );
};

export default Footer;
