// MainNavigation.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "./MainNavigation.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styled from 'styled-components';
import CustomHamburgerButton from './CustomHamburgerButton'; // 커스텀 버튼 임포트

const MainNavigation = ({ drawerOpen, onToggleDrawer }) => {
  const [openNotice, setOpenNotice] = useState(false);
  const noticeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noticeRef.current && !noticeRef.current.contains(event.target)) {
        setOpenNotice(false);
      }
    };

    if (openNotice) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openNotice]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggleDrawer();
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.right}>
          {isMobile ? (
            <CustomHamburgerButton open={isOpen} onClick={handleToggle} />
          ) : (
            <StyledHamburgerButton
              className={`${styles.icon} ${styles.hamburger}`}
              onClick={onToggleDrawer}
            >
              <FontAwesomeIcon icon={faBars} />
            </StyledHamburgerButton>
          )}
        </div>
      </nav>
    </header>
  );
};

// 기존 styled-components 버튼 유지
const StyledHamburgerButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 30px;
  cursor: pointer;

  &:hover {
    color: #D88254;
  }

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

export default MainNavigation;
