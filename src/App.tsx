import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppSection, LoveReason } from './types';
import {
  DEFAULT_NICKNAME,
  DEFAULT_REASONS,
  DEFAULT_SONGS,
  DEFAULT_LETTER,
} from './data/defaultData';
import { NightSkyCanvas } from './components/NightSkyCanvas';
import { FlowerBloomOverlay } from './components/FlowerBloomOverlay';
import { FloatingPetals } from './components/FloatingPetals';
import { MusicController } from './components/MusicController';
import { Section1Countdown } from './components/Section1Countdown';
import { Section2Unlock } from './components/Section2Unlock';
import { Section3Reasons } from './components/Section3Reasons';
import { Section4Songs } from './components/Section4Songs';
import { Section5Letter } from './components/Section5Letter';
import { SectionFinale } from './components/SectionFinale';
import { CustomizerModal } from './components/CustomizerModal';
import { DateLockScreen } from './components/DateLockScreen';

export default function App() {
  const [isBypassed, setIsBypassed] = useState(false);
  const [section, setSection] = useState<AppSection>(AppSection.COUNTDOWN);
  const [isBloomTriggered, setIsBloomTriggered] = useState(false);
  const [transitionType, setTransitionType] = useState<'bloom' | 'sparkle' | 'petal' | 'envelope' | 'dreamy'>('bloom');
  const [nickname, setNickname] = useState<string>(DEFAULT_NICKNAME);
  const [reasons, setReasons] = useState<LoveReason[]>(DEFAULT_REASONS);
  const [unlockedReasons, setUnlockedReasons] = useState<number[]>([]);
  const [letterText, setLetterText] = useState<string>(DEFAULT_LETTER);

  // Scroll to the very top of the page whenever a new page/section is entered
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [section]);

  // Trigger full blooming transition between sections
  const triggerTransition = (
    nextSection: AppSection,
    type: 'bloom' | 'sparkle' | 'petal' | 'envelope' | 'dreamy' = 'bloom'
  ) => {
    setTransitionType(type);
    setIsBloomTriggered(true);
    const delay = 2000; // Constantly 2 seconds across all transitions
    setTimeout(() => {
      setSection(nextSection);
    }, delay);
  };

  const handleReasonClick = (id: number) => {
    if (!unlockedReasons.includes(id)) {
      setUnlockedReasons((prev) => [...prev, id]);
    }
  };

  const handleUpdateReason = (id: number, newTitle: string, newReason: string) => {
    setReasons((prev) =>
      prev.map((r) => (r.id === id ? { ...r, title: newTitle, reason: newReason } : r))
    );
  };

  const handleResetProgress = () => {
    setUnlockedReasons([]);
    setSection(AppSection.COUNTDOWN);
  };

  // Date lock check: Lock the app until August 1st, 2026 unless bypassed for testing
  if (!isBypassed) {
    const targetDate = new Date('2026-08-01T00:00:00');
    if (new Date() < targetDate) {
      return <DateLockScreen onUnlockBypass={() => setIsBypassed(true)} />;
    }
  }

  // Theme calculation: 'night' for early sections, warming up to 'sunset' after reasons!
  const themeMode =
    section === AppSection.SONGS ||
    section === AppSection.LETTER ||
    section === AppSection.FINALE
      ? 'sunset'
      : 'night';

  return (
    <div className="relative min-h-screen w-full bg-[#0B1026] text-slate-100 font-sans selection:bg-rose-500/30 selection:text-rose-200 overflow-x-hidden">
      {/* Background canvas particle system */}
      <NightSkyCanvas themeMode={themeMode} />

      {/* Floating Petals Particle Effect */}
      <FloatingPetals />

      {/* Floating Audio Controller */}
      <MusicController />

      {/* Floating Customizer Drawer Button & Modal */}
      <CustomizerModal
        currentSection={section}
        onNavigateSection={(sec) => {
          let type: 'bloom' | 'sparkle' | 'petal' | 'envelope' | 'dreamy' = 'bloom';
          if (sec === AppSection.UNLOCK) type = 'sparkle';
          else if (sec === AppSection.REASONS) type = 'bloom';
          else if (sec === AppSection.SONGS) type = 'petal';
          else if (sec === AppSection.LETTER) type = 'envelope';
          else if (sec === AppSection.FINALE) type = 'dreamy';
          triggerTransition(sec, type);
        }}
        onResetProgress={handleResetProgress}
      />

      {/* Full-Screen Flower Bloom Screen Cover Transition */}
      <FlowerBloomOverlay
        isTriggered={isBloomTriggered}
        type={transitionType}
        onBloomComplete={() => setIsBloomTriggered(false)}
      />

      {/* Main Storytelling Views */}
      <main className="relative z-10 min-h-screen w-full">
        <AnimatePresence mode="wait">
          {section === AppSection.COUNTDOWN && (
            <motion.div
              key="section-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Section1Countdown
                nickname={nickname}
                onOpenSurprise={() => triggerTransition(AppSection.UNLOCK, 'sparkle')}
              />
            </motion.div>
          )}

          {section === AppSection.UNLOCK && (
            <motion.div
              key="section-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Section2Unlock
                expectedAnswer={nickname}
                onUnlocked={() => triggerTransition(AppSection.REASONS, 'bloom')}
              />
            </motion.div>
          )}

          {section === AppSection.REASONS && (
            <motion.div
              key="section-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Section3Reasons
                reasons={reasons}
                unlockedIds={unlockedReasons}
                onReasonClick={handleReasonClick}
                onAllCompleted={() => triggerTransition(AppSection.SONGS, 'petal')}
              />
            </motion.div>
          )}

          {section === AppSection.SONGS && (
            <motion.div
              key="section-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Section4Songs
                songs={DEFAULT_SONGS}
                onContinueToLetter={() => triggerTransition(AppSection.LETTER, 'envelope')}
              />
            </motion.div>
          )}

          {section === AppSection.LETTER && (
            <motion.div
              key="section-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Section5Letter
                nickname={nickname}
                letterText={letterText}
                onFinishReading={() => triggerTransition(AppSection.FINALE, 'dreamy')}
              />
            </motion.div>
          )}

          {section === AppSection.FINALE && (
            <motion.div
              key="section-finale"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionFinale nickname={nickname} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
