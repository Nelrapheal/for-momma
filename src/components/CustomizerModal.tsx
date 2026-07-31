import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Navigation, RotateCcw, Heart } from 'lucide-react';
import { AppSection } from '../types';

interface CustomizerModalProps {
  currentSection: AppSection;
  onNavigateSection: (section: AppSection) => void;
  onResetProgress: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  currentSection,
  onNavigateSection,
  onResetProgress,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating gear button top-left */}
      <div className="fixed top-3.5 sm:top-5 left-3.5 sm:left-5 z-40">
        <button
          onClick={() => setIsOpen(true)}
          id="open-settings-button"
          aria-label="Navigate Experience"
          className="p-2.5 rounded-full glass-card hover:border-amber-300/40 text-amber-200 transition-all duration-300 active:scale-95 shadow-lg cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <Settings className="w-5 h-5 hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-md w-full glass-card p-6 rounded-3xl relative max-h-[85vh] flex flex-col border border-amber-300/30 shadow-2xl text-left"
            >
              <button
                onClick={() => setIsOpen(false)}
                id="close-settings-button"
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 hover:bg-slate-700 text-rose-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <Navigation className="w-6 h-6 text-amber-300" />
                <h3 className="font-display text-2xl text-gold-gradient font-bold">
                  Jump To Chapter
                </h3>
              </div>

              {/* Navigation Content */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                <div className="space-y-3">
                  <p className="text-xs text-rose-200/70 italic">
                    Explore different parts of your special gift:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.values(AppSection).map((sec) => (
                      <button
                        key={sec}
                        onClick={() => {
                          onNavigateSection(sec);
                          setIsOpen(false);
                        }}
                        className={`p-3 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between border ${
                          currentSection === sec
                            ? 'bg-amber-400/20 border-amber-300 text-amber-100'
                            : 'bg-slate-900/60 border-rose-300/10 text-rose-200/80 hover:bg-slate-800'
                        }`}
                      >
                        <span className="capitalize">{sec.toLowerCase().replace('_', ' ')}</span>
                        {currentSection === sec && <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300/50" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-rose-300/10">
                    <button
                      onClick={() => {
                        onResetProgress();
                        setIsOpen(false);
                      }}
                      className="w-full py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restart Journey From Beginning</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

