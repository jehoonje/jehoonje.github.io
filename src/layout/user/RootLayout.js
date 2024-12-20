// RootLayout.jsx
import React, { useState, useEffect } from "react";
import MainNavigation from "./MainNavigation";
import { Outlet } from "react-router-dom";
import Drawer from "./Drawer";
import styled from "styled-components";
import { motion } from "framer-motion";
import useIsMobile from "./useIsMobile.js";

// Define breakpoints for responsiveness
const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
};

// Container 컴포넌트가 fullHeight prop을 DOM 요소에 전달하지 않도록 설정
const Container = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !["fullHeight"].includes(prop),
})`
  display: flex;
  flex-direction: column;
  border: 2px solid #f5f5f5;
  margin-top: 100px !important;
  transform-origin: center center;
  height: ${(props) => (props.fullHeight ? "100vh" : "auto")}; /* 변경된 부분 */
  padding: 0;
  width: 92%; /* 기본 너비 설정 */
  max-width: 1200px; /* 최대 너비 제한 */
  margin: 0 auto; /* 중앙 정렬 */

  @media (max-width: ${breakpoints.desktop}) {
    height: ${(props) => (props.fullHeight ? "100vh" : "auto")};
    padding: 0 0.75rem;
    margin-top: 20px !important;
    border: 2px solid #f5f5f5; /* 테블릿 이하에서 border 두께 줄이기 */
    width: 95%; /* 너비를 조금 더 줄임 */
  }

  @media (max-width: ${breakpoints.tablet}) {
    height: ${(props) => (props.fullHeight ? "100vh" : "auto")};
    padding: 0 0.75rem;
    margin-top: 10px !important;
    border: 2px solid #f5f5f5; /* 테블릿 이하에서 border 두께 줄이기 */
    width: 95%; /* 너비를 조금 더 줄임 */
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 0 0.5rem;
    border: none; /* 모바일에서는 border 제거 */
    width: 92%; /* 모바일에서는 전체 너비 사용 */
    margin-top: 3px !important;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const RootLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fullHeight, setFullHeight] = useState(false);
  const isMobile = useIsMobile(); // Use the custom hook

  // 여기서 언어 상태 관리
  const [language, setLanguage] = useState("한국어");

  useEffect(() => {
    if (drawerOpen) {
      setFullHeight(true); // Apply fullHeight when drawer is open
    } else {
      const timer = setTimeout(() => {
        setFullHeight(false); // Remove fullHeight 1 second after drawer is closed
      }, 500);

      return () => clearTimeout(timer); // Clear timer on cleanup
    }
  }, [drawerOpen]);

  const toggleDrawerHandler = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  // Define animation variants
  const variants = {
    open: {
      scale: 0.85,
      translateY: "-5vh",
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 25,
        mass: 1,
        restDelta: 0.001,
      },
    },
    closed: {
      scale: 1,
      translateY: "0",
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 35,
        mass: 1,
        restDelta: 0.001,
      },
    },
  };

  return (
    <>
      <Container
        fullHeight={fullHeight}
        initial="closed"
        animate={isMobile ? "closed" : drawerOpen ? "open" : "closed"}
        variants={variants}
      >
        <MainNavigation
          drawerOpen={drawerOpen}
          onToggleDrawer={toggleDrawerHandler}
          language={language}
          setLanguage={setLanguage}
        />
        <MainContent>
          <Outlet context={{ language }} />
        </MainContent>
      </Container>
      <Drawer open={drawerOpen} onClose={toggleDrawerHandler} />
    </>
  );
};

export default RootLayout;
