// src/pages/Home.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import MainIntro from "./MainIntro";
import Projects from "./Projects";

// MainIntro를 감싸는 래퍼 (절대 위치 제거)
const IntroWrapper = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: center;
  height: 80vh; /* 전체 뷰포트 높이 */
  background: white;
  z-index: 10;
  @media (max-width: 768px) {
    height: 90vh;
  }
`;

const HomeContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 70vh;
`;

const Home = () => {
  const { language } = useOutletContext();
  const [showProjects, setShowProjects] = useState(false);

  // "더 보기" 버튼 클릭 시 Projects 표시
  const handleShowProjects = () => {
    setShowProjects(true);
  };

  return (
    <HomeContainer>
      <AnimatePresence mode="wait">
        {!showProjects && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <IntroWrapper>
              <MainIntro language={language} onClickMore={handleShowProjects} />
            </IntroWrapper>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showProjects && (
          <motion.div
            key="projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Projects language={language} />
          </motion.div>
        )}
      </AnimatePresence>
    </HomeContainer>
  );
};

export default Home;
