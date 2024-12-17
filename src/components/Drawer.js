// src/components/Drawer.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import styles from '../styles/Drawer.module.scss';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";

import spinnerStyles from "../layout/user/Spinner.module.scss";


const DrawerContainer = styled(motion.div)`
  font-family: 'NotoSansKR';
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  width: 440px;
  height: 100%;
  background-color: #14332C;
  z-index: 1400;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 80px 20px 20px 20px; /* 헤더 높이만큼 패딩 추가 */

  @media (max-width: 400px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const NavItem = styled.a`
  position: relative;
  left: 35%;
  margin-top: 20px;
  color: #fff;
  text-decoration: none;
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 20px;
  cursor: pointer;
  font-family: "Poppins";

  &:hover {
    color: #D88254;
  }

  &.special-spacing {
    margin-top: 100px; /* 간격 조정 */
  }

  &.special-spacing-home {
    margin-top: 120px;
    font-size: 45px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px; /* 아이콘 간격 */
  width: 100%; /* 아이콘 중앙 정렬 */
  z-index: 1800; /* DrawerContainer 위에 표시 */

  &.navIcons {
    position: relative;
    right: 5%;
    margin-top: 50px;
  }
  a {
    color: #fff;
    font-size: 40px;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: #D88254;
    }
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  padding: 0;
  background-color: rgba(216, 130, 84, 0.9);
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1700;

  &:hover {
    background-color: #D88254;
  }

  .x-shape {
    width: 60%;
    height: 60%;
    position: relative;
  }

  .x-shape::before, .x-shape::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #fff;
    top: 50%;
    left: 0;
    transform: rotate(45deg);
  }

  .x-shape::after {
    transform: rotate(-45deg);
  }
`;

const Drawer = ({ open, onClose }) => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate
  const drawerRef = useRef(null);

  const handleNavClick = async (path) => {
    setLoading(true); // 로딩 시작
    try {
      // 비동기 작업 또는 페이지 로딩 처리
      await new Promise(resolve => setTimeout(resolve, 1000)); // 실제 비동기 작업으로 대체 가능
      navigate(path); // 페이지 이동
      setTimeout(() => {
        onClose(); // 페이지 이동 후 Drawer 닫기
      }, 300); // navigate 후 약간의 딜레이 후 onClose 호출
    } finally {
      setLoading(false); // 로딩 종료
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={spinnerStyles.spinnerContainer}>
            <PulseLoader
              className={spinnerStyles.loader}
              color="#0B593F" 
              loading={loading}
              size={18}
            />{" "}
          </div>
        </div>
      )}
      <DrawerContainer
        initial={{ x: '100%' }}  // Drawer가 화면 밖에 시작
        animate={{ x: open ? 0 : '100%' }}  // 열리고 닫힐 때 위치 변화
        transition={{
          type: 'spring',  // inertia 대신 spring 사용
          stiffness: 180,  // 스프링의 강성도
          damping: open ? 25 : 35,     // 감쇠 비율
          mass: 1,         // 질량
          restDelta: 0.001,  // 애니메이션 종료 조건
        }}
        open={open}
        ref={drawerRef}
        >
        <CloseButton
          onClick={onClose}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="x-shape"></div>
        </CloseButton>
        <NavItem onClick={() => handleNavClick("/about")}>About</NavItem>
        <NavItem onClick={() => handleNavClick("/contact")}>Contact</NavItem>
        <IconContainer className="navIcons">
          <a href="mailto:example@example.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </IconContainer>
      </DrawerContainer>
    </>
  );
};

export default Drawer;
