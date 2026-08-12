'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function LandingSequence({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Step 1 -> Step 2: Remove unnecessary letters
    const t1 = setTimeout(() => setStep(2), 2500);
    // Step 2 -> Step 3: Align remaining letters to form "Procrastiview"
    const t2 = setTimeout(() => setStep(3), 3500);
    // Step 3 -> Step 4: Fade the word and reveal the Logo
    const t3 = setTimeout(() => setStep(4), 5500);
    // Finally route away
    const t4 = setTimeout(() => onFinish(), 7500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); }
  }, [onFinish])

  // Complete phrase
  const phrase = "Kill the procrastination by viewing your own progress"

  // The exact letters we want to KEEP to form "Procrastiview"
  // P (13) r (14) o (15) c (16) r (17) a (18) s (19) t (20) i (21) n (22)
  // Wait, let's map them from the phrase intelligently
  // K i l l _ t h e _ p  r  o  c  r  a  s  t  i  n  a  t  i  o  n  _  b  y  _  v  i  e  w  i  n  g  _  y  o  u  r  _  o  w  n  _  p  r  o  g  r  e  s  s
  // 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52
  // We need to keep: P (9), r (10), o (11), c (12), r (13), a (14), s (15), t (16), i (17), v (28), i (29), e (30), w (31) 

  // Custom manual mapping index to form "Procrastiview"
  const keepIndices = [9, 10, 11, 12, 13, 14, 15, 16, 17, 28, 29, 30, 31];

  return (
    <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center p-4 overflow-hidden">
      <AnimatePresence mode="wait">

        {/* Step 1 & 2 & 3: Typography Animation */}
        {step < 4 && (
          <motion.div
            key="typography"
            className="flex flex-wrap justify-center max-w-2xl px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
          >
            {/* Break into words to wrap properly physically on step 1, 
                but using flex wrap container handles individual spans.
                We render every single character as a layout span. */}
            <div className={`flex flex-wrap justify-center font-bold italic leading-relaxed text-center ${step === 3 ? 'gap-0 text-5xl md:text-7xl' : 'gap-[0.2em] md:gap-[0.3em] text-2xl md:text-4xl'}`}>
              {phrase.split(' ').map((word, wordIdx, wordsArr) => {
                // Calculate absolute index logic to match with our keepIndices
                let startIdx = 0;
                for (let i = 0; i < wordIdx; i++) {
                  startIdx += wordsArr[i].length + 1; // +1 for the space
                }

                return (
                  <div key={wordIdx} className="flex whitespace-nowrap">
                    {word.split('').map((char, charIdx) => {
                      const absoluteIdx = startIdx + charIdx;
                      const isKept = keepIndices.includes(absoluteIdx);

                      // For step 3, if it's the P (index 9) or V (index 28), uppercase it dynamically
                      const displayChar = (step === 3 && absoluteIdx === 9) ? 'P' : (step === 3 && absoluteIdx === 28) ? 'V' : char;

                      return (
                        <AnimatePresence key={absoluteIdx}>
                          {(step === 1 || (step >= 2 && isKept)) && (
                            <motion.span
                              layoutId={`char-${absoluteIdx}`}
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                textShadow: (step === 3 && isKept) ? '0 0 20px rgba(79,195,255,0.6)' : 'none'
                              }}
                              exit={{
                                opacity: 0,
                                filter: 'blur(5px)',
                                y: -20,
                                transition: { duration: 0.3 }
                              }}
                              transition={{
                                layout: { type: 'spring', stiffness: 50, damping: 14 }
                              }}
                              className={isKept ? 'text-primary' : 'text-muted-foreground'}
                              style={{
                                display: 'inline-block',
                                // Remove margins if we are in step 3 so the word merges cleanly
                                margin: step === 3 ? '0' : undefined
                              }}
                            >
                              {displayChar}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Step 4: The Logo Reveal */}
        {step === 4 && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <div className="relative w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_25px_rgba(79,195,255,0.4)] animate-glow">
              <img
                src="/favicon.png"
                alt="Procrastiview Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-5xl text-primary font-bold italic tracking-wide"
            >
              ProcastiView
            </motion.h1>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
