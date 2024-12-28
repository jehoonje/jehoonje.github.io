// src/pages/MainTitle.js
import React from "react";
import styled from "styled-components";
import styles from "../styles/MainIntro.module.scss"

const AboutContainer = styled.div`
  text-align: center;
`;


function MainTitle() {

  return (
    <>
      <AboutContainer>
        <div className={styles.title}>Projects</div>
      </AboutContainer>
    </>
  );
}

export default MainTitle;
