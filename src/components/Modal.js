// src/components/Modal.js
import React, { useState } from "react";
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
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  max-height: 90vh; /* 세로 최대 높이 */
  overflow-y: auto; /* 내용이 길어질 경우 스크롤 */
  background-color: #fff;
  border-radius: 8px;
  z-index: 10000;

  animation: ${({ isOpen }) =>
    isOpen
      ? css`${fadeIn} 0.3s forwards`
      : css`${fadeOut} 0.3s forwards`};
`;

const ModalHeader = styled.div`
  position: relative;
  padding: 16px;
  background-color: #333;
  color: #fff;
  font-size: 18px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 24px;
`;

const ModalBody = styled.div`
  padding: 16px;

  /* 예: 슬라이드 부분(임시 구역) */
  .slide-container {
    margin-bottom: 20px;
    /* react-slick이나 Swiper 같은 라이브러리의 클래스에 맞춰 스타일링 가능 */
  }

  /* 예: 내용(문단 등) */
  .content-section {
    margin-bottom: 20px;
  }

  /* 예: 타이틀 */
  .section-title {
    font-weight: bold;
    margin: 16px 0 8px;
  }
`;

const ModalFooter = styled.div`
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  background-color: #f4f4f4;
`;

/* 모달 컴포넌트 */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = () => onClose();
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer isOpen={isOpen} onClick={stopPropagation}>
        <ModalHeader>
          <CloseButton onClick={onClose}><IoClose /></CloseButton>
          {title}
        </ModalHeader>

        {/* children이나 추가 데이터 */}
        <ModalBody>
          {children}
        </ModalBody>

        <ModalFooter>
          {/* 닫기 버튼 혹은 추가 버튼 */}
          <button onClick={onClose} style={{ marginRight: '8px' }}>
            닫기
          </button>
          {/* 필요 시 다음 보기, 페이지 이동 등 다른 버튼 추가 */}
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;
