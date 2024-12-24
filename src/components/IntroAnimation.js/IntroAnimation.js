import React, { useEffect, useState } from 'react';
import './IntroAnimation.css';

const IntroAnimation = ({ onFadeOut }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 인트로 애니메이션 시간 후 페이드아웃 시작 (예: 5초 후)
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 5000); // 5초

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fadeOut) {
      // 페이드아웃 애니메이션이 끝난 후 부모에게 알림
      const timer = setTimeout(() => {
        onFadeOut();
      }, 2000); // 페이드아웃 시간과 일치 (IntroAnimation.css의 transition 시간)

      return () => clearTimeout(timer);
    }
  }, [fadeOut, onFadeOut]);

  useEffect(() => {
    const updateSvgSize = () => {
      const svg = document.querySelector('.intro-container svg');
      if (svg) {
        const maxDim = Math.max(window.innerWidth, window.innerHeight);
        svg.setAttribute('viewBox', `0 0 ${maxDim} ${maxDim}`);
      }
    };

    updateSvgSize();
    window.addEventListener('resize', updateSvgSize);

    return () => {
      window.removeEventListener('resize', updateSvgSize);
    };
  }, []);

  return (
    <div className={`intro-container ${fadeOut ? 'fade-out' : ''}`}>
      <main></main>
      <article></article>
      
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <filter id="heavycloud" color-interpolation-filters="sRGB" x="0%" y="0%" height="100%" width="100%">
            <feTurbulence type="fractalNoise" result="cloudbase" baseFrequency=".0025" numOctaves="2" seed="24"/>
            
            <feColorMatrix in="cloudbase" type="hueRotate" values="0" result="cloud">
              <animate attributeName="values" from="0" to="360" dur="20s" repeatCount="indefinite"/>
            </feColorMatrix>
            
            <feColorMatrix in="cloud" result="wispy" type="matrix" 
                               values="4 0 0 0 -1
                                       4 0 0 0 -1
                                       4 0 0 0 -1
                                       1 0 0 0 0   
                                       "/>

            <feFlood flood-color="#61c2d6" result="blue"/>
            <feBlend mode="screen" in2="blue" in="wispy"/>
            <feGaussianBlur stdDeviation="4"/>
            <feComposite operator="in" in2="SourceGraphic"/>
          </filter>
        </defs>
      
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          filter="url(#heavycloud)" />
      </svg>
    </div>
  );
};

export default IntroAnimation;
