'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function Cursor() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const springX = useSpring(cursorX, { stiffness: 600, damping: 45 });
  const springY = useSpring(cursorY, { stiffness: 600, damping: 45 });

  useEffect(() => {
    if (isAdmin) return;
    setMounted(true);

    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setVisible(true);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      setHovering(!!t.closest('a, button, [role="button"], [data-cursor="pointer"]'));
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
    };
  }, [cursorX, cursorY, isAdmin]);

  if (!mounted || isAdmin) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        aria-hidden="true"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          scale: clicking ? 0.4 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
        className="fixed top-0 left-0 z-[9999] w-2.5 h-2.5 bg-gold rounded-full pointer-events-none"
      />
      {/* Ring */}
      <motion.div
        aria-hidden="true"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          scale: hovering ? 2.8 : clicking ? 0.7 : 1,
          opacity: visible ? (hovering ? 0.35 : 0.18) : 0,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="fixed top-0 left-0 z-[9998] w-9 h-9 border border-gold rounded-full pointer-events-none"
      />
    </>
  );
}