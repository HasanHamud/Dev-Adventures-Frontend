// src/Components/PageTransition.js
import  { useEffect, useState } from 'react';

// eslint-disable-next-line react/prop-types
const NavigatorEffects = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timeout = setTimeout(() => {
            setIsVisible(false);
        }, 500); // Duration of the fade out

        return () => clearTimeout(timeout);
    }, [children]);

    return (
        <div
            className={`transition-opacity duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {children}
        </div>
    );
};

export default NavigatorEffects;
