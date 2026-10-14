import React, { useState } from 'react';
import { Image, Upload, RotateCcw, Sparkles, Check, ExternalLink } from 'lucide-react';
import MascotDisplay from './MascotDisplay';
import { soundManager } from '../utils/audio';

export default function MascotSettingsModal({ customImages, setCustomImages, onClose }) {
  const [activeTab, setActiveTab] = useState('FOCUS');
  const [urls, setUrls] = useState({
    FOCUS: customImages.FOCUS || '',
    REST: customImages.REST || '',
    PAUSED: customImages.PAUSED || '',
    COMPLETED: customImages.COMPLETED || '',
  });

  const stateLabels = {
    FOCUS: { name: '집중 (근무 중)', desc: '열심히 업무에 집중할 때 표시됩니다.', color: 'text-emerald-500' },
    REST: { name: '휴식 (점심시간)', desc: '점심시간이나 휴식 시간대에 표시됩니다.', color: 'text-amber-500' },
    PAUSED: { name: '정지 (일시정지)', desc: '타이머를 일시정지했을 때 표시됩니다.', color: 'text-indigo-500' },
    COMPLETED: { name: '종료 (퇴근 완료)', desc: '목표 시간을 달성하고 퇴근했을 때 표시됩니다.', color: 'text-rose-500' },
  };

  const presets = {
    FOCUS: [
      { name: '기본 뽀송이', url: '' },
      { name: '귀여운 코딩 냥이', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80' },
      { name: '열일하는 강아지', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80' },
    ],
    REST: [
      { name: '기본 뽀송이', url: '' },
      { name: '따뜻한 라떼 한 잔', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=200&auto=format&fit=crop&q=80' },
      { name: '달콤한 디저트 타임', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&auto=format&fit=crop&q=80' },
    ],
    PAUSED: [
      { name: '기본 뽀송이', url: '' },
      { name: '쿨쿨 자는 고양이', url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200&auto=format&fit=crop&q=80' },
      { name: '낮잠 자는 댕댕이', url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=200&auto=format&fit=crop&q=80' },
    ],
    COMPLETED: [
      { name: '기본 뽀송이', url: '' },
      { name: '행복한 파티 멍멍이', url: 'https://images.unsplash.com/photo-1520087619250-584c0cbd9b78?w=200&auto=format&fit=crop&q=80' },
      { name: '축하 불꽃놀이', url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=200&auto=format&fit=crop&q=80' },
    ],
  };

  const handleUrlChange = (val) => {
    setUrls((prev) => ({ ...prev, [activeTab]: val }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setUrls((prev) => ({ ...prev, [activeTab]: dataUrl }));
        soundManager.playClick();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setCustomImages(urls);
    soundManager.playClick();
    onClose();
  };

  const handleResetCurrent = () => {
    setUrls((prev) => ({ ...prev, [activeTab]: '' }));
    soundManager.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-[365px] max-h-[365px] bg-white/95 dark:bg-slate-900/95 rounded-2xl p-3 shadow-2xl border border-white/60 dark:border-slate-800 backdrop-blur-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/60 text-pink-500 flex items-center justify-center">
              <Image size={14} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">캐릭터 및 이미지 커스텀</h3>
              <p className="text-[10px] text-slate-400">상태별 원하는 캐릭터/이미지를 설정하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>

        {/* State Tabs */}
        <div className="grid grid-cols-4 gap-1 my-1.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl shrink-0">
          {Object.keys(stateLabels).map((st) => (
            <button
              key={st}
              onClick={() => {
                setActiveTab(st);
                soundManager.playClick();
              }}
              className={`py-1 px-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                activeTab === st
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {st === 'FOCUS' ? '근무 중' : st === 'REST' ? '휴식·점심' : st === 'PAUSED' ? '일시정지' : '퇴근완료'}
            </button>
          ))}
        </div>

        {/* Main Content Area - Scrollable with min-h-0 to avoid overflow */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2">
          <div className="flex gap-2.5 items-center">
            {/* Live Preview Card */}
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-50/50 to-pink-50/50 dark:from-slate-800 dark:to-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center justify-center p-1 relative shadow-inner shrink-0">
              <MascotDisplay
                state={activeTab}
                customImages={{ [activeTab]: urls[activeTab] }}
                className="w-16 h-16"
              />
              <span className="absolute bottom-0.5 text-[8px] font-bold text-slate-400 bg-white/80 dark:bg-slate-800/90 px-1 py-0.2 rounded-full leading-none">
                {urls[activeTab] ? '커스텀' : '기본'}
              </span>
            </div>

            {/* Form Controls */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {stateLabels[activeTab].name}
                </span>
                {urls[activeTab] && (
                  <button
                    onClick={handleResetCurrent}
                    className="text-[10px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-1.5 py-0.5 rounded transition-colors flex items-center gap-0.5"
                    title="기본 일러스트로 초기화"
                  >
                    <RotateCcw size={10} />
                    초기화
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="이미지 URL 직접 입력"
                value={urls[activeTab]}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
              />

              <label className="cursor-pointer flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs">
                <Upload size={12} />
                <span>내 PC 이미지 파일 업로드</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-1">
            <span className="text-[10px] font-semibold text-slate-400 block mb-1">추천 프리셋</span>
            <div className="flex flex-wrap gap-1">
              {presets[activeTab].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleUrlChange(p.url);
                    soundManager.playClick();
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                    urls[activeTab] === p.url
                      ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-300 dark:border-pink-800 text-pink-600 dark:text-pink-300 font-medium'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold bg-pink-500 hover:bg-pink-600 active:scale-95 text-white rounded-lg shadow-sm transition-all flex items-center gap-1"
          >
            <Check size={13} />
            설정 저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
