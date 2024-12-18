// src/pages/Contact.js
import React from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
  padding-top: 60px; /* 헤더 높이만큼 패딩 추가 */
  text-align: center;
`;

function Contact() {
  return (
    <>
      <ContactContainer>
        <h1>Contact Page</h1>
        {/* 추가적인 Contact 페이지 내용 */}
      </ContactContainer>
    </>
  );
}

export default Contact;
