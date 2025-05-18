import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './components/store/index';
import { Provider } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

// LoadingScreen Component with centered "L" shape animation

const LoadingScreen = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'white',
        overflow: 'hidden',
      }}
    >
      <style>
        {`
          .l-shape {
            fill: none;
            stroke: black;
            stroke-width: 2;
          }
          .l-shape-highlight {
            fill: none;
            stroke: #000;
            stroke-width: 6;
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: draw 10s linear forwards;
          }
          .circle-outline {
            fill: none;
            stroke: black;
            stroke-width: 3;
            stroke-dasharray: 314; /* Approximate circumference of circle with r=50 */
            stroke-dashoffset: 314;
            animation: draw 5s linear forwards;
          }
          @keyframes draw {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
      <motion.div
        initial={{ x: 25, y: -80 }}
        animate={{ x: 2000 }}
        transition={{ delay: 4, duration: 3, ease: 'easeOut' }}
      >
        <motion.svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          style={{ transformOrigin: 'center' }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: 80,
            opacity: 0,
          }}
          transition={{
            scale: { delay: 4, duration: 3, ease: 'easeOut' },
            opacity: { delay: 4, duration: 3, ease: 'linear' },
          }}
        >
          {/* Circle around the L */}
          <circle
            cx="36" // Adjusted to center around the L
            cy="50" // Adjusted to center around the L
            r="34"
            className="circle-outline"
          />
          <text
            x="20"
            y="71"
            fontSize="60"
            stroke="black"
            strokeWidth="4"
            fill="black"
            fillOpacity="0"
            className="l-shape"
          >
            L
          </text>
          <path className="l-shape-highlight" d="M 27.5 27 L 27 66.5 L 48 66.5" />
        </motion.svg>
      </motion.div>
    </div>
  );
};

// AppWrapper Component to manage loading screen and app transition
const AppWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingScreen />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <App />
          </motion.div>
        )}
      </AnimatePresence>
    </Provider>
  );
};

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWrapper />);