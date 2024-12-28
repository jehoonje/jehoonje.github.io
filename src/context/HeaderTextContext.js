// src/context/HeaderTextContext.js
import React from 'react';

const HeaderTextContext = React.createContext({
  showHeaderText: false,
  setShowHeaderText: () => {},
});

export default HeaderTextContext;
