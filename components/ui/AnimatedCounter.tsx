'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number | string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parse prefix, number, and suffix from the input value string (e.g. "50+", "100%", "$25k")
  const valString = String(value);
  const numberMatch = valString.match(/^([^\d]*)([\d]+)([^\d]*)$/);

  const prefix = numberMatch ? numberMatch[1] : '';
  const targetNumber = numberMatch ? parseInt(numberMatch[2], 10) : 0;
  const parsedSuffix = numberMatch ? numberMatch[3] : '';
  const isTextOnly = !numberMatch;

  // Use a native Intersection Observer to detect when the counter enters the viewport
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  // Animate the counter once when it becomes visible
  useEffect(() => {
    if (isVisible && !hasAnimated && !isTextOnly) {
      setHasAnimated(true);
      const durationMs = duration * 1000;
      const startTime = performance.now();

      const update = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);

        // Ease-out cubic curve
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * targetNumber));

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    }
  }, [isVisible, targetNumber, duration, hasAnimated, isTextOnly]);

  if (isTextOnly) {
    // Elegant reveal animation for non-numeric stats (e.g. "Multiple")
    return (
      <span ref={ref} className={className}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {valString}
          {suffix}
        </motion.span>
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {parsedSuffix || suffix}
    </span>
  );
}