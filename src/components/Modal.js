// src/components/Modal.js

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom"; // 포털을 사용하기 위한 임포트
import styled, { keyframes, css } from "styled-components";
import { IoClose } from "react-icons/io5";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 9999;

  animation: ${({ isOpen }) =>
    isOpen
      ? css`${fadeIn} 0.3s forwards`
      : css`${fadeOut} 0.3s forwards`};

  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  line-height: 1.5;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  // 아래 추가
  max-height: 80vh;       /* 화면 높이 대비 최대 높이 지정 */
  overflow-y: auto;       /* 내부 스크롤 */
  background-color: #fff;
  border-radius: 8px;
  z-index: 10000;
  display: flex;
  flex-direction: column;

  /* 스크롤은 내부 Body에서만 */
  overflow: hidden;

  animation: ${({ isOpen }) =>
    isOpen
      ? css`${fadeIn} 0.3s forwards`
      : css`${fadeOut} 0.3s forwards`};
`;

/* 
  헤더 부분을 고정(스크롤 시에도 상단 고정)
  position: sticky + top: 0  
*/
const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  padding: 10px;
  background-color: #2f2f2f;
  color: #fff;
  font-size: 16px;
  z-index: 10001; /* 헤더가 Body 내용 위로 보이도록 */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 4px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 24px;
`;

const ModalBody = styled.div`
  padding: 16px;
  overflow-y: auto; /* Body 영역만 스크롤 가능 */

  overscroll-behavior-y: contain; /* 모달 내부 스크롤이 끝나도 이벤트가 바깥으로 전파되지 않게 함 */

  
  /* 스크롤바 숨기기 (옵션) */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE10+ */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
`;

const ModalFooter = styled.div`
  position: relative; /* ProgressBar 위치 조정을 위해 relative 설정 */
  padding: 10px;
  background-color: #f4f4f4;
`;

/* ProgressBar 컴포넌트 */
const ProgressBarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px; /* 원하는 높이 설정 */
  background-color: #e0e0e0; /* 배경색 */
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color:rgb(236, 219, 24); /* 진행 바 색상 */
  transition: width 0.2s ease-out;
`;

/* 모달 컴포넌트 */
const Modal = ({ isOpen, onClose, title, children }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // 배경 스크롤 비활성화
    } else {
      document.body.style.overflow = "auto"; // 스크롤 복원
    }

    return () => {
      document.body.style.overflow = "auto"; // 컴포넌트 언마운트 시 복원
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const element = bodyRef.current;
      if (element) {
        const { scrollTop, scrollHeight, clientHeight } = element;
        const totalScroll = scrollHeight - clientHeight;
        const currentScroll = scrollTop;
        const scrolled = (currentScroll / totalScroll) * 100;
        setScrollProgress(isNaN(scrolled) ? 0 : scrolled);
      }
    };

    const element = bodyRef.current;
    if (isOpen && element) {
      element.addEventListener("scroll", handleScroll);
      // 초기 상태 설정
      handleScroll();
    }

    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isOpen]);

  const handleOverlayClick = () => onClose();
  const stopPropagation = (e) => e.stopPropagation();

  if (!isOpen) return null;

  // 포털을 사용하여 모달을 #modal-root에 렌더링
  return ReactDOM.createPortal(
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer isOpen={isOpen} onClick={stopPropagation}>
        <ModalHeader>
          <CloseButton onClick={onClose}>
            <IoClose />
          </CloseButton>
          {title}
        </ModalHeader>

        {/* children이나 추가 데이터 */}
        <ModalBody ref={bodyRef}>
          {children}
        </ModalBody>

        <ModalFooter>
          <ProgressBarContainer>
            <ProgressBar progress={scrollProgress} />
          </ProgressBarContainer>
        </ModalFooter>
      </ModalContainer>
    </Overlay>,
    document.getElementById('modal-root') // 포털 타겟 지정
  );
};

export default Modal;
