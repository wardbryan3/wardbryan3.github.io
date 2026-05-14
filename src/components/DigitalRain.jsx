import { useEffect, useRef } from 'react';
import { useOSStore } from '../stores/osStore';

function getCSSVar(name) {
  if (typeof document === 'undefined') return { r: 0, g: 1, b: 0.4 };
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!val) return { r: 0, g: 1, b: 0.4 };
  const hex = val.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16) / 255,
    g: parseInt(hex.substring(2, 4), 16) / 255,
    b: parseInt(hex.substring(4, 6), 16) / 255,
  };
}

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const FONT_SIZE = 14;
const COLUMN_WIDTH = FONT_SIZE * 1.2;
const FALL_SPEED_MIN = 0.5;
const FALL_SPEED_MAX = 2.5;
const TRAIL_LENGTH = 8;

function createColumn(colIndex, canvasHeight) {
  const x = colIndex * COLUMN_WIDTH + COLUMN_WIDTH / 2;
  const speed = FALL_SPEED_MIN + Math.random() * (FALL_SPEED_MAX - FALL_SPEED_MIN);
  return {
    x,
    y: Math.random() * canvasHeight * -1,
    speed,
    chars: Array.from(
      { length: TRAIL_LENGTH },
      () => CHARS[Math.floor(Math.random() * CHARS.length)],
    ),
  };
}

function drawColumn(ctx, column, accentColor, primaryColor, fontSize) {
  const { x, y, chars } = column;
  for (let i = 0; i < chars.length; i++) {
    const charY = y - i * fontSize;
    if (charY < -fontSize || charY > ctx.canvas.height + fontSize) continue;
    const distance = i;
    const alpha = Math.max(0.05, 1.0 / Math.pow(distance + 1, 1.5));
    const color = distance === 0 ? accentColor : primaryColor;
    ctx.fillStyle = `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${alpha})`;
    ctx.shadowBlur = distance === 0 ? 8 : 3;
    ctx.shadowColor =
      distance === 0
        ? `rgba(${accentColor.r * 255}, ${accentColor.g * 255}, ${accentColor.b * 255}, 0.5)`
        : `rgba(${primaryColor.r * 255}, ${primaryColor.g * 255}, ${primaryColor.b * 255}, 0.2)`;
    ctx.fillText(chars[i], x, charY);
  }
}

export default function DigitalRain() {
  const canvasRef = useRef(null);
  const theme = useOSStore((s) => s.theme);
  const columnsRef = useRef([]);
  const animFrameRef = useRef(null);
  const accentRef = useRef(getCSSVar('--accent'));
  const primaryRef = useRef(getCSSVar('--primary'));

  useEffect(() => {
    accentRef.current = getCSSVar('--accent');
    primaryRef.current = getCSSVar('--primary');
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_SIZE}px monospace`;
      const numCols = Math.ceil(window.innerWidth / COLUMN_WIDTH);
      const oldLen = columnsRef.current.length;
      if (numCols > oldLen) {
        for (let i = oldLen; i < numCols; i++) {
          columnsRef.current.push(createColumn(i, window.innerHeight));
        }
      } else if (numCols < oldLen) {
        columnsRef.current.length = numCols;
      }
    }

    resize();
    window.addEventListener('resize', resize);

    function animate() {
      if (document.hidden) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const col of columnsRef.current) {
        col.y += col.speed;
        if (Math.random() < 0.01) {
          const charIdx = Math.floor(Math.random() * CHARS.length);
          col.chars.unshift(CHARS[charIdx]);
          col.chars.pop();
        }
        if (col.y - TRAIL_LENGTH * FONT_SIZE > window.innerHeight) {
          Object.assign(col, createColumn(Math.floor(col.x / COLUMN_WIDTH), window.innerHeight));
        }
        drawColumn(ctx, col, accentRef.current, primaryRef.current, FONT_SIZE);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
