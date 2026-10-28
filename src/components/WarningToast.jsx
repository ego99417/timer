/**
 * @file src/components/WarningToast.jsx
 * @description 퇴근 5분 전 사전 알림 토스트 팝업
 * 
 * [주요 역할]
 * - 퇴근 5분 전에 "퇴근 5분 전입니다! 슬슬 마무리 준비를 시작하세요" 안내창 표출
 */

import React from 'react';
import { Bell, X, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function WarningToast({ onClose }) {
  // Auto-dismiss after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 15000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-3 left-3 right-3 z-[100] max-w-[370px] mx-auto animate-bounce-short pointer-events-auto app-no-drag">
      <div className="p-3 bg-amber-500 text-white dark:bg-amber-600 border border-amber-400 dark:border-amber-500 rounded-2xl shadow-2xl flex items-start gap-2.5 backdrop-blur-md">
        <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-inner animate-pulse">
          <Bell size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-wide text-amber-100 flex items-center gap-1">
              <Sparkles size={12} />
              퇴근 5분 전 알림
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-colors cursor-pointer"
              title="닫기"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs font-bold text-white mt-0.5 leading-snug">
            퇴근까지 5분 남았습니다! 🏃💨
          </p>
          <p className="text-[10px] text-amber-100 mt-0.5 leading-tight">
            슬슬 업무를 마무리하고 퇴근 준비를 시작하세요.
          </p>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Check size={11} />
              <span>확인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
