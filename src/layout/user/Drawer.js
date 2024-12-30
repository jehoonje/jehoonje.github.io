// src/components/Drawer.js
import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

// Define breakpoints for responsiveness
const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
};

// NavItem 스타일 정의
const NavItem = styled(motion.a)`
  margin: 25px 0;
  color: #333;
  font-size: 55px;
  cursor: pointer;
  text-decoration: none; /* 링크의 밑줄 제거 */

  &:hover {
    color: #FFC107;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 80px;
    // padding: 1.5rem 0.75rem;
    margin: 5px 0;
  }

  @media (max-width: ${breakpoints.mobile}) {  
    display: flex;
    justify-content: center;
  }
`;

// 아이콘 애니메이션 변형 정의
const iconVariants = {
  hidden: { 
    opacity: 0, 
    y: 0 // 초기 위치
  },
  visible: (i) => ({
    opacity: 1,
    y: [20, -15, 10, 0], // 애니메이션 키프레임
    transition: {
      delay: i * 0.2, // 각 아이콘마다 지연 시간 설정
      duration: 1.5, // 전체 애니메이션 지속 시간
      ease: [0.22, 1, 0.36, 1], // 커스텀 easing
      type: "spring",
      stiffness: 600, // 스프링 강도
      damping: 15, // 감쇠 비율
    },
  }),
};

// 바운스 호버 애니메이션 제거 및 슬라이드 호버 애니메이션 정의
const slideHover = {
  x: 20, // 왼쪽으로 20px 이동
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
};



const TopDrawerContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background-color: #333;
  z-index: 2000;

  @media (max-width: ${breakpoints.desktop}) {
    display: none;
  }

  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }

  @media (max-width: ${breakpoints.mobile}) {
    display: none;
  }
`;

const LeftDrawerContainer = styled(motion.div)`
  position: fixed;
  justify-content: center;
      align-items: center !important;
  top: 0;
  left: 30px;
  bottom: 0;
  width: 66px;
  background-color: #none;
  z-index: 1500; /* Increased z-index */

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;

  @media (max-width: ${breakpoints.tablet}) {
    width: 0px;
    padding: 1.5rem 0.75rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    
  }
`;

const Drawer = ({ open, onClose }) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate
  const drawerRef = useRef(null);
  const drawerRefRight = useRef(null);
  const drawerRefLeft = useRef(null);
  
  const handleNavClick = async (path) => {
    // 페이지 이동
    await navigate(path);
    // 0.3초 후 Drawer 닫고, 햄버거 아이콘을 false로 (onClose 내부에서 toggleDrawerHandler가 불리겠죠)
    setTimeout(() => {
      onClose(); // => toggleDrawerHandler => setDrawerOpen(false) => 햄버거 open도 false
    }, 300);
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        drawerRefRight.current &&
        !drawerRefRight.current.contains(e.target) &&
        drawerRefLeft.current &&
        !drawerRefLeft.current.contains(e.target)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <>
      <TopDrawerContainer
        initial={{ y: "-100%" }} // 위에서 시작
        animate={{ y: open ? 0 : "-100%" }} // 열리고 닫힐 때 위치 변화
        transition={{
          type: "spring", // inertia 대신 spring 사용
          stiffness: 180, // 스프링의 강성도
          damping: open ? 27 : 33, // 감쇠 비율
          mass: 1, // 질량
          restDelta: 0.001, // 애니메이션 종료 조건
        }}
        open={open}
      ></TopDrawerContainer>
      <LeftDrawerContainer
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: open ? 25 : 35,
          mass: 1,
          restDelta: 0.001,
        }}
        open={open}
        ref={drawerRef}
      >
        {[
          { icon: faHome, path: "/", label: "Home" },
          { icon: faUser, path: "/about", label: "About Me" },
        ].map((item, index) => (
          <NavItem
            key={index}
            custom={index}
            initial="hidden"
            animate={open ? "visible" : "hidden"}
            variants={iconVariants}
            onClick={() => item.path && handleNavClick(item.path)}
            aria-label={item.label}
            href={item.href || "#"}
            target={item.href ? "_blank" : "_self"}
            rel={item.href ? "noopener noreferrer" : ""}
            whileHover={slideHover}
          >
            <FontAwesomeIcon icon={item.icon} />
          </NavItem>
        ))}
        {/* <CloseButton
          open={open}
          onClick={onClose}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="x-shape"></div>
        </CloseButton> */}
      </LeftDrawerContainer>
    </>
  );
};

export default Drawer;
