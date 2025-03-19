// src/pages/Projects.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";


import CampridgeProject from "./CampridgeProject";
import DoggleProject from "./DoggleProject";
import PosProject from "./PosProject";
import MainTitle from "./MainTitle";
import MainIntro from "./MainIntro";

// 프로젝트들을 감싸는 래퍼
const ProjectsWrapper = styled.div`
  width: 100%;
  padding: 20px 10px;
  /* 추가적인 스타일이 필요하면 여기에 추가 */
`;

const ContentWrapper = styled.div`
  margin-top: 20px;
`;

const Projects = ({ language }) => {
  // 작은 MainIntro와 콘텐츠의 페이드 인 상태
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후 작은 인트로를 페이드 인
    setShowContent(true);
  }, []);

  return (
    <ProjectsWrapper>
      {/* 작은 메인 인트로 부분 */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            key="small-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
          >
            <MainIntro language={language} variant="small" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1초 뒤에 페이드 인되는 나머지 콘텐츠 */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            key="projects-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <ContentWrapper>
              <MainTitle language={language} />
              <PosProject language={language} />
              <CampridgeProject language={language} />
              <DoggleProject language={language} />
            </ContentWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </ProjectsWrapper>
  );
};

export default Projects;
