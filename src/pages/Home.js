// src/pages/Home.js
import React from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import CampridgeProject from "./CampridgeProject";
import DoggleProject from "./DoggleProject";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 3%;
  padding: 0px 20px;
`;

const Home = () => {
  const { language } = useOutletContext();

  return (
    <ContentWrapper>
      <CampridgeProject language={language} />
      <DoggleProject language={language} />
    </ContentWrapper>
  );
};

export default Home;
