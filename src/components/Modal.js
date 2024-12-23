// src/components/Modal.jsx
import React from "react";
import styled, { keyframes, css } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 9999;

  /* 모달 열리고 닫힐 때 애니메이션 */
  animation: ${({ isOpen }) =>
    isOpen
      ? css`
          ${fadeIn} 0.3s forwards
        `
      : css`
          ${fadeOut} 0.3s forwards
        `};

  /* 모달이 열리지 않았을 때는 클릭 이벤트 막기 */
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  background-color: #fff;
  z-index: 10000;

  /* 모달 열리고 닫힐 때 애니메이션 */
  animation: ${({ isOpen }) =>
    isOpen
      ? css`
          ${fadeIn} 0.3s forwards
        `
      : css`
          ${fadeOut} 0.3s forwards
        `};
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
  top: 8px;
  right: 16px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 24px;
`;

const ModalContent = styled.div`
  padding: 16px;
`;

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  // 오버레이를 클릭하면 모달 닫기
  const handleOverlayClick = () => {
    onClose();
  };

  // 모달 안쪽 클릭 시 이벤트 전파 중단
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer isOpen={isOpen} onClick={stopPropagation}>
        <ModalHeader>
          <CloseButton onClick={onClose}>X</CloseButton>
          {title}
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;
