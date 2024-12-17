// src/pages/Home.js
import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';

const HomeContainer = styled.div`
  padding-top: 60px; /* 헤더 높이만큼 패딩 추가 */
  text-align: center;
`;

function Home() {
  return (
    <>
      <Header />
      <HomeContainer>
        <h1>Home Page</h1>
        {/* 추가적인 홈 페이지 내용 */}
      </HomeContainer>
    </>
  );
}

export default Home;
