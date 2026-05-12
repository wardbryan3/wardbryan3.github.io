import { useCallback, useEffect, useRef } from 'react';

export default function useDraggable({ onMove, constraints }) {
  const dragRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      let newX = d.origX + dx;
      let newY = d.origY + dy;
      if (constraints) {
        const clamped = constraints(newX, newY);
        newX = clamped.x;
        newY = clamped.y;
      }
      onMove(newX, newY);
    };
    const handleMouseUp = () => {
      dragRef.current = null;
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onMove, constraints]);

  const startDrag = useCallback((e, currentPos) => {
    if (dragRef.current) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: currentPos.x,
      origY: currentPos.y,
    };
    e.preventDefault();
  }, []);

  return { startDrag };
}
