// MainNavigation.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "./MainNavigation.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import CustomHamburgerButton from "./CustomHamburgerButton"; // 커스텀 버튼 임포트

const MainNavigation = ({ drawerOpen, onToggleDrawer, language, setLanguage }) => {
  const [openNotice, setOpenNotice] = useState(false);
  const noticeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [isOpen, setIsOpen] = useState(false);

  // RootLayout에서 받은 language 사용
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // 언어 변경에 따른 제목과 소개 텍스트
  const titleText = language === "English" ? "Jehoon Lim" : "임제훈";
  const introText =
    language === "English"
      ? "I am a developer who helps businesses grow through web and app development. I focus on creating simple."
      : "웹과 앱을 통해 비즈니스의 성장을 돕는 개발자입니다. 심플하면서도 최적의 사용자 경험과 성능을 추구하며 사용자들의 문제 해결에 집중합니다.";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        noticeRef.current &&
        !noticeRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.language}`)
      ) {
        setOpenNotice(false);
        setIsLanguageDropdownOpen(false);
      }
    };

    if (openNotice || isLanguageDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openNotice, isLanguageDropdownOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggleDrawer();
  };

  const handleLanguageToggle = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.menu}>
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
          <div className={styles.title}>{titleText}</div>
        </div>
        <div className={styles.menu}>
          {/* Email 버튼: 클릭 시 이메일 클라이언트 열림 */}
          <button
            className={styles.menuButton}
            onClick={() =>
              (window.location.href = "mailto:limjhoon8@gmail.com")
            }
          >
            Email
          </button>

          {/* Blog 버튼: 클릭 시 Blog 링크로 이동 */}
          <button
            className={styles.menuButton}
            onClick={() =>
              window.open("https://bluebellybird.bearblog.dev", "_blank")
            }
          >
            Blog
          </button>

          {/* GitHub 버튼: 클릭 시 GitHub 링크로 이동 */}
          <button
            className={styles.menuButton}
            onClick={() => window.open("https://github.com/jehoonje", "_blank")}
          >
            GitHub
          </button>

          {/* Language 드롭다운 메뉴 */}
          <div className={styles.languageWrapper}>
            <button className={styles.language} onClick={handleLanguageToggle}>
              Language <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {isLanguageDropdownOpen && (
              <div className={styles.languageDropdown}>
                <button
                  className={styles.dropdownButton}
                  onClick={() => handleLanguageSelect("English")}
                >
                  English
                </button>
                <button
                  className={styles.dropdownButton}
                  onClick={() => handleLanguageSelect("한국어")}
                >
                  한국어
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.intro}>{introText}</div>
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
    color: #d88254;
  }

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

export default MainNavigation;
