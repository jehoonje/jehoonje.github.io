import React, { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./config/user/route-config";
import './App.css'; // CSS 파일 임포트

const App = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후에 fade-in 클래스 추가
    const timer = setTimeout(() => setFadeIn(true), 0);
    return () => clearTimeout(timer); // 타이머 정리
  }, []);

  return (
    <div className={fadeIn ? "fade-in" : ""}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
