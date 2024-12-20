// src/pages/Home.js
import React from "react";
import styled from "styled-components";
import styles from "../styles/Layout.module.scss";
import { useOutletContext } from "react-router-dom";
import IntroduceProject from "./IntroduceProject";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 3%;
  border: 1px solid #f5f5f5;
  padding: 20px;
`;

const Home = () => {
  const { language } = useOutletContext();

  return (
    <ContentWrapper>
      <div className={styles.category}>
        <p>APP</p>
      </div>
      {/* IntroduceProject를 사용하여 영상+설명 섹션 렌더링 */}
      <IntroduceProject language={language} />
    </ContentWrapper>
  );
};

export default Home;
