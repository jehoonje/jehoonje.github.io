// src/pages/Home.js
import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: 20px;
  height: 85vh;
  text-align: center;
`;

const Home = () => {

  return (
    <HomeContainer>
      <h2>Home Page</h2>
    </HomeContainer>
  );
};

export default Home;
