'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Loader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Accumulate progress fast then slow near 100
    let raf: number;
    const startTime = performance.now();
    const totalDuration = 1800;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / totalDuration, 1);
      // Ease-out expo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setProgress(Math.floor(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const timer = setTimeout(() => setVisible(false), 2100);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-8px' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-onyx flex flex-col items-center justify-center select-none"
        >
          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <p className="font-cormorant text-7xl md:text-9xl text-gold tracking-[0.35em]">
              AVAAT
            </p>
            <p className="font-jost text-xs text-muted tracking-[0.5em] uppercase mt-2">
              Design Studio
            </p>
          </motion.div>

          {/* Progress */}
          <div className="absolute bottom-14 flex flex-col items-end w-48 gap-2">
            <span className="font-jost text-[10px] text-muted tracking-widest">
              {progress}%
            </span>
            <div className="w-full h-px bg-gold/15 overflow-hidden">
              <motion.div
                className="h-full bg-gold origin-left"
                style={{ scaleX: progress / 100 }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}