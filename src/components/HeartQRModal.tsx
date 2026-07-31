import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Heart, X, Copy, Check, Share2, ExternalLink, QrCode } from 'lucide-react';

interface HeartQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
}

export const HeartQRModal: React.FC<HeartQRModalProps> = ({
  isOpen,
  onClose,
  nickname,
}) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ai.studio/build';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-lg w-full bg-[#130B1C] border-2 border-amber-300/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] z-10 text-left space-y-6"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-amber-300/20 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-300/30 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-gradient">
                  Heart QR Code &amp; Link Preview
                </h3>
                <p className="font-serif-cormorant text-xs sm:text-sm text-rose-200/80">
                  How your gift looks when pasted &amp; scanned
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-rose-500/20 text-rose-200 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: What It Looks Like When You Paste The Link (WhatsApp / Message Preview Card) */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-amber-300/80 font-bold block">
              💬 Link Preview When Pasted (WhatsApp / iMessage / Socials):
            </span>

            <div className="rounded-2xl bg-[#0F172A] border border-amber-300/30 overflow-hidden shadow-xl hover:border-amber-300/60 transition-all">
              {/* Preview Banner Image */}
              <div className="relative w-full aspect-[1200/630] bg-slate-900 overflow-hidden">
                <img
                  src="/heart-qrcode-preview.svg"
                  alt="Girlfriend's Day Share Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Preview Card Metadata Bottom Box */}
              <div className="p-4 bg-slate-950/90 space-y-1">
                <span className="text-[11px] text-rose-400 font-semibold uppercase tracking-wider block">
                  FOR MY MOMMA • GIRLFRIEND'S DAY
                </span>
                <h4 className="font-serif-cormorant text-lg sm:text-xl font-bold text-amber-100 leading-tight">
                  For My Momma ❤️ • Happy Girlfriend's Day 2026
                </h4>
                <p className="font-serif-cormorant text-sm text-rose-200/80 line-clamp-2">
                  An interactive romantic journey of love, blooming flowers, our songs &amp; a secret letter. Scan the Heart QR Code to enter ❤️
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Live Heart QR Code */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] uppercase tracking-widest text-amber-300/80 font-bold block text-center">
              ❤️ Her Personal Heart QR Code:
            </span>

            <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-[#1E1128] to-[#12091A] border border-amber-300/30 shadow-inner relative">
              {/* White luxury frame around QR code */}
              <div className="p-5 rounded-2xl bg-white shadow-2xl relative flex items-center justify-center">
                <QRCodeSVG
                  value={currentUrl}
                  size={190}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#1C0D24"
                />

                {/* HEART BADGE right in the center of the QR Code */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
                  </div>
                </div>
              </div>

              <p className="mt-3 font-serif-cormorant text-sm text-rose-200/90 italic text-center">
                She can scan this with her phone camera to open her love journey instantly! 🌹
              </p>
            </div>
          </div>

          {/* Copy Link Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopyLink}
              id="copy-preview-link-btn"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-slate-950 font-bold text-base shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-emerald-950" />
                  <span>Link Copied to Clipboard! ❤️</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy App Link to Share 📋</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
