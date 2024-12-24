// src/components/SimpleSlider.jsx
import React from "react";
import Slider from "react-slick"; // from react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SimpleSlider = ({ images = [] }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  
  return (
    <Slider {...settings}>
      {images.map((imgSrc, index) => (
        <div key={index}>
          <img
            src={imgSrc}
            alt={`slide-${index}`}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default SimpleSlider;
