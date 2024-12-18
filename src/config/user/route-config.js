import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../../layout/user/RootLayout";
import Home from "../../pages/Home";
import WelcomePage from "../../pages/user/WelcomePage";
import About from "../../pages/About.js";
import Contact from "../../pages/Contact.js";
import Projects from "../../pages/Projects.js";
import ErrorPage from "../../pages/ErrorPage"; // ErrorPage 임포트
import { Navigate } from "react-router-dom";

// homeRouter 배열에 리다이렉트 추가
const homeRouter = [
  {
    index: true,
    element: <Navigate to="/home" replace />, // 기본 경로를 /home으로 리다이렉트
  },
  {
    path: "home",
    element: <Home />,
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "contact",
    element: <Contact />,
  },
  {
    path: "projects",
    element: <Projects />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: homeRouter, // 중첩 라우트 정리
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
