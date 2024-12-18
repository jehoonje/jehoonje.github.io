// CustomHamburgerButton.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const accentColor = 'hsl(0, 0.00%, 11.80%)';

const Span = styled.span`
  position: absolute;
  width: 35px;
  height: 4px;
  top: 50%;
  right: -25px;
  background: hsl(0, 0%, 15%);
  border-radius: 2px;
  overflow: hidden;
  transition: all 0.3s linear;

  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 100%;
    top: 0;
    right: 0;
    background: ${accentColor};
    transition: all 0.3s linear;
  }

  &:nth-child(1) {
    animation: ${(props) => (props.open ? spanFirstOn : spanFirstOff)} 0.5s ease-in-out forwards;
  }

  &:nth-child(2) {
    animation: ${(props) => (props.open ? spanSecondOn : spanSecondOff)} 0.5s ease-in-out forwards;
  }

  &:nth-child(3) {
    animation: ${(props) => (props.open ? spanThirdOn : spanThirdOff)} 0.5s ease-in-out forwards;
  }
`;

const Button = styled.button`
  position: relative;
  width: 20px;
  height: 35px;
  background: none;
  border: none;
  cursor: pointer;

  &:hover span::before {
    width: 100%;
    transition: all 0.3s linear;
  }
`;

// 애니메이션 키프레임 정의
const spanFirstOn = keyframes`
  0% {
    transform: translate(-50%, -300%);
  }
  30% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

const spanFirstOff = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
  30% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -300%);
  }
`;

const spanSecondOn = keyframes`
  0% {
    transform: translate(-50%, -50%);
  }
  25% {
    background: ${accentColor};
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    transform: translate(-150%, -50%) scale(0);
  }
`;

const spanSecondOff = keyframes`
  0% {
    transform: translate(-150%, -50%) scale(0);
  }
  25% {
    background: ${accentColor};
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    transform: translate(-50%, -50%);
  }
`;

const spanThirdOn = keyframes`
  0% {
    transform: translate(-50%, 200%);
  }
  30% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
`;

const spanThirdOff = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  30% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, 200%);
  }
`;

const CustomHamburgerButton = ({ open, onClick }) => {
  return (
    <Button onClick={onClick}>
      <Span open={open} />
      <Span open={open} />
      <Span open={open} />
    </Button>
  );
};

export default CustomHamburgerButton;
