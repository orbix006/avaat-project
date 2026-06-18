'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function AuthShowcase() {
  return (
    <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-16 overflow-hidden border-r border-[#262626] bg-[#0F0F10]">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f22_1px,transparent_1px),linear-gradient(to_bottom,#1f1f22_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-35 pointer-events-none" />

      {/* Floating Premium Gradient Lighting & Blobs */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#D4AF37]/15 to-transparent blur-[120px] pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 40, -50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#E6C26E]/10 to-transparent blur-[140px] pointer-events-none"
      />

      {/* Brand Header */}
      <div className="z-10">
        <span className="font-cormorant text-2xl tracking-[0.25em] text-[#F5EFE6] block">
          AVAAT
        </span>
        <span className="font-jost text-[9px] tracking-[0.45em] text-[#D4AF37] uppercase mt-1.5 block">
          DESIGNS
        </span>
      </div>

      {/* Core Architectural Text & Floating Glass Cards */}
      <div className="my-auto z-10 space-y-16">
        
        {/* Headline & Body */}
        <div className="space-y-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-[1px] w-32 bg-gradient-to-r from-[#D4AF37] to-transparent origin-left"
          />
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-cormorant text-7xl font-bold text-[#F5EFE6] leading-[1.1]"
          >
            Designing Spaces <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#E6C26E] via-[#D4AF37] to-[#E6C26E] animate-pulse">
              That Tell Stories.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base text-[#F5EFE6]/70 max-w-md font-jost leading-relaxed"
          >
            AVAAT Designs creates timeless interior and architectural experiences that blend luxury, functionality, and thoughtful craftsmanship.
          </motion.p>
        </div>

        {/* Editorial Architectural Wireframe & Light Streak Visuals */}
        <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
          {/* Depth Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_75%)] pointer-events-none" />

          {/* Premium Ambient Light Streaks */}
          {/* Streak 1: Diagonal scan */}
          <motion.div
            animate={{
              x: [-300, 300],
              y: [-150, 150],
              opacity: [0, 0.4, 0.6, 0.4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 12,
              ease: 'easeInOut',
            }}
            className="absolute w-[450px] h-[1px] bg-gradient-to-r from-transparent via-[#E6C26E]/40 to-transparent rotate-[-25deg] blur-[1px] pointer-events-none"
          />

          {/* Streak 2: Subtle Horizontal scan */}
          <motion.div
            animate={{
              x: [250, -250],
              opacity: [0, 0.3, 0.5, 0.3, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: 'easeInOut',
              delay: 2,
            }}
            className="absolute bottom-24 w-[350px] h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent blur-[2px] pointer-events-none"
          />

          {/* Streak 3: Vertical soft ambient glow bar */}
          <motion.div
            animate={{
              y: [-100, 150],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: 'easeInOut',
            }}
            className="absolute left-1/3 w-[80px] h-[300px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent blur-[40px] pointer-events-none"
          />

          {/* Premium Floating Particles for depth */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#E6C26E]"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                opacity: 0.15 + (i % 3) * 0.1,
                filter: 'blur(0.5px)',
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, (i % 2 === 0 ? 15 : -15), 0],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            />
          ))}

          {/* Main Architectural Wireframe Vector Plan (SVG) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex items-center justify-center z-10"
          >
            {/* Minimal Parallax / Drift wrapper */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 0.5, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-11/12 h-5/6 relative flex items-center justify-center"
            >
              <svg className="w-full h-full text-[#D4AF37]/15 stroke-1" viewBox="0 0 400 240" fill="none">
                {/* Clean Blueprint Axis & Coordinate Lines */}
                <line x1="40" y1="120" x2="360" y2="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />
                <line x1="200" y1="20" x2="200" y2="220" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />
                
                {/* Perspective Convergence Guide Lines */}
                <line x1="40" y1="40" x2="360" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                <line x1="40" y1="200" x2="360" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                
                {/* Structural Grid Details (Boxes / Perspective Projection) */}
                <rect x="80" y="50" width="240" height="140" stroke="currentColor" strokeWidth="0.75" opacity="0.7" />
                
                {/* Intersecting geometrical planes */}
                <motion.polygon 
                  points="120,70 280,70 300,100 100,100" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  opacity="0.3"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                
                <motion.polygon 
                  points="100,140 300,140 280,170 120,170" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  opacity="0.3"
                  animate={{ opacity: [0.4, 0.2, 0.4] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Concentric proportion circles */}
                <circle cx="200" cy="120" r="65" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />
                <circle cx="200" cy="120" r="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                
                {/* Focus/alignment marks (crosshairs) */}
                <circle cx="200" cy="120" r="2" fill="currentColor" opacity="0.8" />
                <circle cx="100" cy="100" r="1.5" fill="currentColor" opacity="0.6" />
                <circle cx="300" cy="140" r="1.5" fill="currentColor" opacity="0.6" />
                
                {/* Technical dimension markers */}
                <line x1="80" y1="38" x2="320" y2="38" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                <line x1="80" y1="34" x2="80" y2="42" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                <line x1="320" y1="34" x2="320" y2="42" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                
                {/* Golden spiral approximation segment */}
                <motion.path 
                  d="M200,120 A 5,5 0 0,0 200,125 A 10,10 0 0,0 210,120 A 20,20 0 0,0 200,100 A 40,40 0 0,0 160,120 A 80,80 0 0,0 200,200 A 160,160 0 0,0 360,120"
                  stroke="#E6C26E" 
                  strokeWidth="0.5" 
                  opacity="0.25"
                  strokeDasharray="2 2"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="z-10 text-[11px] text-[#F5EFE6]/30 tracking-wider">
        <span>© {new Date().getFullYear()} AVAAT DESIGNS.</span>
      </div>
    </div>
  );
}
