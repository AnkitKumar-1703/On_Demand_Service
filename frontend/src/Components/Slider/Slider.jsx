import React, { useEffect, useState } from "react";
import "./Slider.css";

import plumber from "../../assets/LandingPageImages/plumber.jpg";
import electrician from "../../assets/LandingPageImages/electrician.jpg";
import painter from "../../assets/LandingPageImages/painter.jpg";
import mechanic from "../../assets/LandingPageImages/mechanic.jpg";
import carpenter from "../../assets/LandingPageImages/carpenter.jpeg";

const images = [
        { src: plumber, caption: "Plumber" },
        { src: electrician, caption: "Electrician" },
        { src: painter, caption: "Painter" },
        { src: mechanic, caption: "Mechanic" },
        { src: carpenter, caption: "Carpenter" },
];

export default function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="slideshow-container">
        {images.map((image, index) => (
          <div
            className={`mySlides ${index === currentSlide ? "show" : ""}`}
            key={index}
          >
            <div className="numbertext">{index + 1} / {images.length}</div>
            <div 
              className="slide-image" 
              style={{ backgroundImage: `url(${image.src})` }}
              aria-label={`Slide ${index + 1}`}
            ></div>
            <div className="text">{image.caption}</div>
          </div>
        ))}
      </div>

      <br />

      <div className="dots-container">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
