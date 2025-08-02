"use client";

import { useEffect, useState } from 'react';

export function useNavbarHeight() {
    const [navbarHeight, setNavbarHeight] = useState(90); // Default fallback

    useEffect(() => {
        const updateNavbarHeight = () => {
            // Try to get the actual navbar element
            const navbar = document.querySelector('[data-navbar="true"]') as HTMLElement;
            if (navbar) {
                const height = navbar.offsetHeight;
                setNavbarHeight(height);
            } else {
                // Fallback calculation based on screen size
                const width = window.innerWidth;
                if (width <= 480) {
                    setNavbarHeight(80);
                } else if (width <= 768) {
                    setNavbarHeight(85);
                } else {
                    setNavbarHeight(90);
                }
            }
        };

        // Initial calculation
        updateNavbarHeight();

        // Update on resize
        window.addEventListener('resize', updateNavbarHeight);
        
        // Clean up
        return () => window.removeEventListener('resize', updateNavbarHeight);
    }, []);

    return navbarHeight;
}