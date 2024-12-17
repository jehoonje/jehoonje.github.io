// src/components/Header.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Drawer from './Drawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const HeaderContainer = styled.header`
  width: 100%;
  height: 60px;
  background-color: #14332C;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  z-index: 1100;
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 30px;
  cursor: pointer;

  &:hover {
    color: #D88254;
  }
`;

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  }

  return (
    <>
      <HeaderContainer>
        <HamburgerButton onClick={handleDrawerOpen}>
          <FontAwesomeIcon icon={faBars} />
        </HamburgerButton>
      </HeaderContainer>
      <Drawer open={drawerOpen} onClose={handleDrawerClose} />
    </>
  );
}

export default Header;
