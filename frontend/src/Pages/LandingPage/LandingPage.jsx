import "./LandingPage.css";
import Footer from "../../Components/Footer/Footer.jsx";

import plumber from "../../assets/LandingPageImages/plumber.jpg";
import electrician from "../../assets/LandingPageImages/electrician.jpg";
import painter from "../../assets/LandingPageImages/painter.jpg";
import mechanic from "../../assets/LandingPageImages/mechanic.jpg";
import carpenter from "../../assets/LandingPageImages/carpenter.jpeg";

import carpenterlogo from "../../assets/LandingPageImages/carpenter_logo.png";
import electricianlogo from "../../assets/LandingPageImages/electrician_logo.png";
import mechaniclogo from "../../assets/LandingPageImages/mechanic_logo.png";
import plumberlogo from "../../assets/LandingPageImages/plumber_logo.png";

import Navbar from "../../Components/Navbar/Navbar.jsx";
import NewNavbar from "../../Components/NewNavbar/NewNavbar.jsx";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useEffect , useState} from "react";

import { useTranslation } from "react-i18next";


// import ImageSlider from "../../Components/Slider/Slider.jsx";
const LandingPage = () => {
  const location=useLocation();
  useEffect(()=>{
    if(location.state?.logout){
      // console.log("logout");
      
      toast.success("Logout Successful");
      window.history.replaceState({}, document.title);
    }


  },[location])
  
  const languages = [
    { value: "", text: "Options" },
    { value: "en", text: "English" },
    { value: "hi", text: "Hindi" },
    { value: "bn", text: "Bengali" },
    { value: "ta", text: "Tamil" },
    { value: "gu", text: "Gujarati" },
    { value: "kn", text: "Kannada" },
    { value: "mr", text: "Marathi" }
];

const { t, i18n } = useTranslation();

    // Initialize state with the current language
    const [lang, setLang] = useState(i18n.language || "en");

    // This function changes the language
    const handleChange = (e) => {
        const selectedLang = e.target.value;
        setLang(selectedLang);
        
        // Change language through i18n instead of page reload
        if (selectedLang) {
            i18n.changeLanguage(selectedLang);
        }
    };


  return (


    <>
      {/* <Navbar/> */}
      <NewNavbar/>
      {/* <ImageSlider/> */}
      <ToastContainer position="bottom-right"/>
      <hr className="horizontal-rule" />

      <div className="Landing-Page">
        <select className = "language-selector" value={lang} onChange={handleChange}>
                {languages.map((item) => {
                    return (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.text}
                        </option>
                    );
                })}
            </select>
        <div className="info-services">
          <div className="text">
            <h1>{t("Find the best services near you")}</h1>
            <p>{t("Fast , Reliable , On-Demand")}</p>
          </div>

          <div className="services">
            <p>{t("What are you looking for?")}</p>
            <div className="services-logo">
              <figure>
                <img src={plumberlogo} alt="" />
                <figcaption>{t("Plumber")}</figcaption>
              </figure>
              <figure>
                <img src={electricianlogo} alt="" />
                <figcaption>{t("Electrician")}</figcaption>

              </figure>
              <figure>
                <img src={mechaniclogo} alt="" />
                <figcaption>{t("Mechanic")}</figcaption>
              </figure>
              <figure>
                <img src={carpenterlogo} alt="" />
                <figcaption>{t("Carpenter")}</figcaption>
              </figure>
            </div>
          </div>

          <div className="info"></div>
        </div>
        <div className="images">
          <div className="holder">
            <img src={plumber} alt="" className="plumber" />

            <img src={electrician} alt="" className="electrician" />
            <img src={painter} alt="" className="painter" />

            <img src={mechanic} alt="" className="mechanic" />
            <img src={carpenter} alt="" className="carpenter" />

          </div>
        </div>
      </div>
      <hr className="horizontal-rule" />
       <Footer></Footer> 
    </>
  );
};

export default LandingPage;
