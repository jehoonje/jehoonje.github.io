// src/routes.js
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
];

export default routes;
