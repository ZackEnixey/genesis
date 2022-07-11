import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: customWidth, innerHeight: customHeight } = window;
    return {
      customWidth,
      customHeight
    };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
