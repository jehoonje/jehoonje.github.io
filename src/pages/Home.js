// src/pages/Home.js
import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import MainIntro from "./MainIntro";
import CampridgeProject from "./CampridgeProject";
import DoggleProject from "./DoggleProject";
import MainTitle from "./MainTitle";

// 공통 페이드 인/아웃 스타일
const fadeTransition = css`
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 2s ease-in-out;
  pointer-events: ${(props) => (props.show ? "auto" : "none")};
`;

// MainIntro를 감싸는 래퍼 (절대 위치로 프로젝트 위에 표시)
const IntroWrapper = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: center;
  position: absolute; /* 프로젝트 위에 겹치도록 */
  top: -10px;
  left: 0;
  height: 100%;
  background: white; /* 배경색을 설정하여 프로젝트를 가리지 않게 조정 가능 */
  z-index: 10;
`;

// 프로젝트들을 감싸는 래퍼
const ProjectsWrapper = styled.div`
  ${fadeTransition}
  margin-top: 3%;
  padding: 0px 10px;
  position: relative; /* IntroWrapper와 겹치지 않도록 상대 위치 지정 */
  z-index: 1;
`;

// 전체 컨테이너
const HomeContainer = styled.div`
  position: relative; /* IntroWrapper의 절대 위치 기준 */
  width: 100%;
  min-height: 100vh; /* 화면 전체를 덮도록 설정 */
`;

const Home = () => {
  const { language } = useOutletContext();

  // 처음에는 인트로(showIntro)를 보여준다.
  const [showIntro, setShowIntro] = useState(true);

  // 타이머 ID를 저장하기 위한 ref
  const timerIdRef = useRef(null);

  // 사용자 이벤트가 이미 처리되었는지 추적하기 위한 ref
  const userEventHandledRef = useRef(false);

  useEffect(() => {
    // 인트로를 숨기는 함수
    const hideIntro = () => {
      setShowIntro(false);
      timerIdRef.current = null; // 타이머 ID 초기화
    };

    timerIdRef.current = setTimeout(hideIntro, 500);

    // 사용자 이벤트 발생 시 1초 후에 인트로를 페이드 아웃
    const handleUserEvent = () => {
      if (!userEventHandledRef.current) {
        userEventHandledRef.current = true; // 사용자 이벤트가 처리되었음을 표시
        if (timerIdRef.current) {
          clearTimeout(timerIdRef.current); // 기존 타이머 취소
        }
        timerIdRef.current = setTimeout(hideIntro, 1000); // 1초 후 인트로 숨김
      }
    };

    // 사용자 이벤트 종류: 스크롤, 클릭, 키보드 입력
    window.addEventListener("scroll", handleUserEvent);
    window.addEventListener("click", handleUserEvent);
    window.addEventListener("keydown", handleUserEvent);

    return () => {
      // 컴포넌트 언마운트 시 타이머와 이벤트 리스너 정리
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
      window.removeEventListener("scroll", handleUserEvent);
      window.removeEventListener("click", handleUserEvent);
      window.removeEventListener("keydown", handleUserEvent);
    };
  }, []);

  return (
    <HomeContainer>
      {/* 인트로 페이드인/아웃 */}
      <AnimatePresence>
        {showIntro && (
          <IntroWrapper show={showIntro}>
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ layout: { duration: 0.2 } }}
            >
              <MainIntro language={language} />
            </motion.div>
          </IntroWrapper>
        )}
      </AnimatePresence>

      {/* 페이드아웃된 후(즉 showIntro=false) 프로젝트 노출 */}
        <MainIntro 
        styles={{
          marginTop: "40px !important",
        }} 
        language={language} />
      <ProjectsWrapper show={!showIntro}>
        <MainTitle language={language} />
        <CampridgeProject language={language} />
        <DoggleProject language={language} />
      </ProjectsWrapper>
    </HomeContainer>
  );
};

export default Home;
