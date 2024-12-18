// useIsMobile.js
import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth <= 480;
        }
        return false;
    });

    useEffect(() => {
        const handleResize = debounce(() => {
            setIsMobile(window.innerWidth <= 480);
        }, 200); // Adjust debounce delay as needed

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            handleResize.cancel(); // Cancel any pending debounced calls
        };
    }, []);

    return isMobile;
};

export default useIsMobile;
