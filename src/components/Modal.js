// src/components/Modal.js

import React, { useEffect } from "react";
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
  max-height: 80vh; /* 세로 최대 높이 */
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
  top: 6px;
  right: 8px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 24px;
`;

const ModalBody = styled.div`
  padding: 16px;
  overflow-y: auto; /* Body 영역만 스크롤 가능 */

  /* 스크롤바 숨기기 (옵션) */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE10+ */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
`;

const ModalFooter = styled.div`
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  background-color: #f4f4f4;
`;

/* 모달 컴포넌트 */
const Modal = ({ isOpen, onClose, title, children }) => {
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

  const handleOverlayClick = () => onClose();
  const stopPropagation = (e) => e.stopPropagation();

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer isOpen={isOpen} onClick={stopPropagation}>
        <ModalHeader>
          <CloseButton onClick={onClose}>
            <IoClose />
          </CloseButton>
          {title}
        </ModalHeader>

        {/* children이나 추가 데이터 */}
        <ModalBody>
          {children}
        </ModalBody>

        <ModalFooter>
          {/* 닫기 버튼 혹은 추가 버튼 */}
          <button onClick={onClose} style={{ 
            marginRight: '8px',
             
            }}
            >
            exit
          </button>
          {/* 필요 시 다른 버튼 추가 가능 */}
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;
