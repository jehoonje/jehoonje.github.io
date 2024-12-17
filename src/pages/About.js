// src/pages/About.js
import React from 'react';
import Header from '../components/Header';

const AboutContainer = styled.div`
  padding-top: 60px; /* 헤더 높이만큼 패딩 추가 */
  text-align: center;
`;

function About() {
  return (
    <>
      <Header />
      <AboutContainer>
        <h1>About Page</h1>
        {/* 추가적인 About 페이지 내용 */}
      </AboutContainer>
    </>
  );
}

export default About;
