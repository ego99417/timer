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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 shadow-2xl border border-white/60 dark:border-slate-800 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-500 flex items-center justify-center">
              <Image size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">캐릭터 및 이미지 커스텀</h3>
              <p className="text-[11px] text-slate-400">상태별로 원하는 GIF, PNG, 또는 기본 뽀송이를 설정하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>

        {/* State Tabs */}
        <div className="grid grid-cols-4 gap-1.5 my-3 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl">
          {Object.keys(stateLabels).map((st) => (
            <button
              key={st}
              onClick={() => {
                setActiveTab(st);
                soundManager.playClick();
              }}
              className={`py-1.5 px-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === st
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {st === 'FOCUS' ? '근무 중' : st === 'REST' ? '휴식·점심' : st === 'PAUSED' ? '일시정지' : '퇴근완료'}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col sm:flex-row gap-4 my-3 items-center">
          {/* Live Preview Card */}
          <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-pink-50/50 dark:from-slate-800 dark:to-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center justify-center p-2 relative shadow-inner shrink-0">
            <MascotDisplay
              state={activeTab}
              customImages={{ [activeTab]: urls[activeTab] }}
              className="w-28 h-28"
            />
            <span className="absolute bottom-1.5 text-[10px] font-bold text-slate-400 bg-white/70 dark:bg-slate-800/80 px-2 py-0.5 rounded-full">
              {urls[activeTab] ? '커스텀 이미지' : '기본 일러스트'}
            </span>
          </div>

          {/* Form Controls */}
          <div className="flex-1 w-full space-y-2.5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">
                {stateLabels[activeTab].name}
              </label>
              <p className="text-[11px] text-slate-400 mb-2">{stateLabels[activeTab].desc}</p>
              
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="이미지 URL 직접 입력 (https://... .gif/.png)"
                  value={urls[activeTab]}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                />

                <div className="flex gap-2">
                  <label className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs">
                    <Upload size={13} />
                    <span>로컬 파일 업로드</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {urls[activeTab] && (
                    <button
                      onClick={handleResetCurrent}
                      className="px-2.5 py-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors flex items-center gap-1"
                      title="기본 일러스트로 초기화"
                    >
                      <RotateCcw size={12} />
                      초기화
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">추천 프리셋</span>
              <div className="flex flex-wrap gap-1.5">
                {presets[activeTab].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleUrlChange(p.url);
                      soundManager.playClick();
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
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
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold bg-pink-500 hover:bg-pink-600 active:scale-95 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Check size={14} />
            설정 저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
