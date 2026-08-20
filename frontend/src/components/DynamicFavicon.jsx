'use client';

import { useEffect } from 'react';

export default function DynamicFavicon() {
  useEffect(() => {
    const applyLogo = () => {
      const savedLogo = localStorage.getItem('school_logo');
      if (savedLogo) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = savedLogo;
      }
    };

    applyLogo();

    // Listen for custom event from SettingsManager
    window.addEventListener('logoChanged', applyLogo);
    return () => window.removeEventListener('logoChanged', applyLogo);
  }, []);

  return null;
}
