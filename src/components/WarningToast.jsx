import React from 'react';
import { Bell, X, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function WarningToast({ onClose }) {
  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-bounce-short">
      <div className="p-3.5 bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-700/80 rounded-2xl shadow-md flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
          <Bell size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-800 dark:text-amber-200 flex items-center gap-1">
              <Sparkles size={12} />
              퇴근 5분 전 알림
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 p-0.5 rounded-md"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-1">
            퇴근 5분 전입니다! 🏃💨
          </p>
          <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 mt-0.5 leading-snug">
            슬슬 업무를 마무리하고 퇴근 준비를 시작하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
