import { useCallback, useEffect, useRef } from 'react';

export default function useResizable({ onResize, minW = 280, minH = 200 }) {
  const resizeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const r = resizeRef.current;
      if (!r) return;
      const newW = Math.max(minW, r.origW + (e.clientX - r.startX));
      const newH = Math.max(minH, r.origH + (e.clientY - r.startY));
      onResize(newW, newH);
    };
    const handleMouseUp = () => {
      resizeRef.current = null;
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize, minW, minH]);

  const startResize = useCallback((e, currentPos, currentSize) => {
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: currentSize.width || currentSize.w,
      origH: currentSize.height || currentSize.h,
      posX: currentPos.x,
      posY: currentPos.y,
    };
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return { startResize };
}
