import React, { useState } from 'react';
import {
  Image,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
  Layers,
  Sparkle,
  Film,
  Info,
  Download,
  Eye,
  X,
} from 'lucide-react';
import MascotDisplay from './MascotDisplay';
import { soundManager } from '../utils/audio';

export default function MascotSettingsModal({ customImages, setCustomImages, onClose }) {
  // Mode: 'default' (상태별 4종) | 'growth' (성장 6단계)
  const [mode, setMode] = useState(customImages.mode || 'default');

  // Default mode state images
  const [stateUrls, setStateUrls] = useState({
    FOCUS: customImages.stateImages?.FOCUS ?? customImages.FOCUS ?? '',
    REST: customImages.stateImages?.REST ?? customImages.REST ?? '',
    PAUSED: customImages.stateImages?.PAUSED ?? customImages.PAUSED ?? '',
    COMPLETED: customImages.stateImages?.COMPLETED ?? customImages.COMPLETED ?? '',
  });

  const [activeDefaultTab, setActiveDefaultTab] = useState('FOCUS');

  // Growth mode data
  const [growthData, setGrowthData] = useState(() => {
    const existing = customImages.growth || {};
    return {
      spriteSheetUrl: existing.spriteSheetUrl || '',
      spriteRows: existing.spriteRows || 6,
      spriteCols: existing.spriteCols || 6,
      stageImages: {
        1: existing.stageImages?.[1] || '',
        2: existing.stageImages?.[2] || '',
        3: existing.stageImages?.[3] || '',
        4: existing.stageImages?.[4] || '',
        5: existing.stageImages?.[5] || '',
        6: existing.stageImages?.[6] || '',
      },
    };
  });

  const [activeGrowthStage, setActiveGrowthStage] = useState(1);
  const [growthInputType, setGrowthInputType] = useState(
    growthData.spriteSheetUrl ? 'sprite' : 'individual'
  );
  const [showSamplePreviewModal, setShowSamplePreviewModal] = useState(false);

  const stateLabels = {
    FOCUS: { name: '집중 (근무 중)', desc: '열심히 업무에 집중할 때 표시됩니다.' },
    REST: { name: '휴식 (점심시간)', desc: '점심시간이나 휴식 시간대에 표시됩니다.' },
    PAUSED: { name: '정지 (일시정지)', desc: '타이머를 일시정지했을 때 표시됩니다.' },
    COMPLETED: { name: '종료 (퇴근 완료)', desc: '목표 시간을 달성하고 퇴근했을 때 표시됩니다.' },
  };

  const growthStageLabels = {
    1: { name: '1단계: 알 (0~15%)', desc: '알이 흔들리며 부화를 준비합니다.' },
    2: { name: '2단계: 아기 (15~35%)', desc: '갓 태어난 귀여운 아기 다람쥐.' },
    3: { name: '3단계: 성장기 (35~60%)', desc: '도토리 모으며 씩씩하게 뛰노는 다람쥐.' },
    4: { name: '4단계: 열일 직장인 (60~85%)', desc: '노트북으로 집중해서 코딩·열일하는 모습.' },
    5: { name: '5단계: 프로 마스터 (85~99%)', desc: '퇴근 직전 열정을 불태우는 프로 다람쥐.' },
    6: { name: '6단계: 퇴근 완료 (100% 달성)', desc: '목표 달성! 만찬과 파티를 즐기는 다람쥐.' },
  };

  // Upload handlers for Default Mode
  const handleDefaultFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setStateUrls((prev) => ({ ...prev, [activeDefaultTab]: dataUrl }));
        soundManager.playClick();
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload handler for Sprite Sheet (Image 2)
  const handleSpriteSheetUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setGrowthData((prev) => ({
          ...prev,
          spriteSheetUrl: dataUrl,
          spriteRows: 6,
          spriteCols: 6,
        }));
        setGrowthInputType('sprite');
        soundManager.playClick();
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload handler for Individual Growth Stage Image
  const handleStageImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setGrowthData((prev) => ({
          ...prev,
          stageImages: {
            ...prev.stageImages,
            [activeGrowthStage]: dataUrl,
          },
        }));
        soundManager.playClick();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const newConfig = {
      mode,
      ...stateUrls,
      stateImages: stateUrls,
      growth: growthData,
    };
    setCustomImages(newConfig);
    soundManager.playClick();
    onClose();
  };

  const handleResetCurrentDefault = () => {
    setStateUrls((prev) => ({ ...prev, [activeDefaultTab]: '' }));
    soundManager.playClick();
  };

  const handleResetGrowthToDefault = () => {
    setGrowthData({
      spriteSheetUrl: '',
      spriteRows: 6,
      spriteCols: 6,
      stageImages: { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' },
    });
    soundManager.playClick();
  };

  // Temporary config for live preview
  const previewCustomImages = {
    mode,
    stateImages: stateUrls,
    FOCUS: stateUrls.FOCUS,
    REST: stateUrls.REST,
    PAUSED: stateUrls.PAUSED,
    COMPLETED: stateUrls.COMPLETED,
    growth: growthData,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 bg-black/40 dark:bg-black/60 rounded-[28px] overflow-hidden animate-fadeIn">
      <div className="w-full max-w-[365px] max-h-[365px] bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-md border border-slate-200/90 dark:border-slate-700/80 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/60 text-pink-500 flex items-center justify-center">
              <Sparkles size={14} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">캐릭터 및 성장 모드 설정</h3>
              <p className="text-[9.5px] text-slate-400">기본 상태별 또는 시간별 성장 모드를 선택하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>

        {/* Main Mode Toggle Tabs (기본 버전 vs 성장 버전) */}
        <div className="grid grid-cols-2 gap-1 my-1.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl shrink-0">
          <button
            onClick={() => {
              setMode('default');
              soundManager.playClick();
            }}
            className={`py-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'default'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <span>🐾 기본 모드</span>
            <span className="text-[9px] font-normal text-slate-400">(상태별 4종)</span>
          </button>

          <button
            onClick={() => {
              setMode('growth');
              soundManager.playClick();
            }}
            className={`py-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'growth'
                ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <span>🌱 성장 모드</span>
            <span className="text-[9px] font-normal text-slate-400">(시간별 6단계)</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2">
          {/* ===================== MODE 1: 기본 모드 ===================== */}
          {mode === 'default' && (
            <>
              {/* State Tabs */}
              <div className="grid grid-cols-4 gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl">
                {['FOCUS', 'REST', 'PAUSED', 'COMPLETED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setActiveDefaultTab(st);
                      soundManager.playClick();
                    }}
                    className={`py-1 px-1 text-[10.5px] font-semibold rounded-lg transition-all ${
                      activeDefaultTab === st
                        ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {st === 'FOCUS' ? '근무 중' : st === 'REST' ? '휴식·점심' : st === 'PAUSED' ? '일시정지' : '퇴근완료'}
                  </button>
                ))}
              </div>

              {/* Preview and Controls */}
              <div className="flex gap-2.5 items-center">
                <div className="w-20 h-20 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center p-1 relative shrink-0">
                  <MascotDisplay
                    state={activeDefaultTab}
                    customImages={{ stateImages: { [activeDefaultTab]: stateUrls[activeDefaultTab] }, mode: 'default' }}
                    className="w-16 h-16"
                  />
                  <span className="absolute bottom-0.5 text-[8px] font-bold text-slate-400 bg-white/90 dark:bg-slate-800/90 px-1 rounded-full">
                    {stateUrls[activeDefaultTab] ? '커스텀' : '기본 뽀송이'}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {stateLabels[activeDefaultTab].name}
                    </span>
                    {stateUrls[activeDefaultTab] && (
                      <button
                        onClick={handleResetCurrentDefault}
                        className="text-[10px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-1.5 py-0.5 rounded transition-colors flex items-center gap-0.5"
                      >
                        <RotateCcw size={10} />
                        초기화
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="이미지 URL 직접 입력"
                    value={stateUrls[activeDefaultTab]}
                    onChange={(e) => setStateUrls((prev) => ({ ...prev, [activeDefaultTab]: e.target.value }))}
                    className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />

                  <label className="cursor-pointer flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs">
                    <Upload size={12} />
                    <span>내 PC 이미지 파일 업로드</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleDefaultFileUpload} />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* ===================== MODE 2: 성장 모드 ===================== */}
          {mode === 'growth' && (
            <div className="space-y-2">
              {/* Growth Explanation Banner */}
              <div className="p-2 rounded-xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200/60 dark:border-pink-900/40 text-[10px] text-pink-700 dark:text-pink-300 flex items-start gap-1.5 leading-tight">
                <Info size={13} className="shrink-0 mt-0.5 text-pink-500" />
                <div>
                  <strong className="font-bold">시간 경과에 따른 6단계 성장 모드</strong>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    근무 목표 진행률에 따라 알에서 부화하여 퇴근까지 점점 성장합니다. 기본 캐릭터(다람쥐)를 쓰거나 6x6 스프라이트 시트 이미지로 교체할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* Sub-Tabs: Sprite Sheet vs Individual Stages */}
              <div className="flex items-center justify-between gap-1 pt-0.5">
                <div className="flex gap-1 text-[10px]">
                  <button
                    onClick={() => setGrowthInputType('sprite')}
                    className={`px-2 py-0.5 rounded-md border transition-all ${
                      growthInputType === 'sprite'
                        ? 'bg-pink-50 dark:bg-pink-950/50 border-pink-300 dark:border-pink-800 text-pink-600 dark:text-pink-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    스프라이트 시트 (추천)
                  </button>
                  <button
                    onClick={() => setGrowthInputType('individual')}
                    className={`px-2 py-0.5 rounded-md border transition-all ${
                      growthInputType === 'individual'
                        ? 'bg-pink-50 dark:bg-pink-950/50 border-pink-300 dark:border-pink-800 text-pink-600 dark:text-pink-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    단계별 개별 등록
                  </button>
                </div>

                {(growthData.spriteSheetUrl || Object.values(growthData.stageImages).some(Boolean)) && (
                  <button
                    onClick={handleResetGrowthToDefault}
                    className="text-[10px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-1.5 py-0.5 rounded transition-colors flex items-center gap-0.5"
                    title="기본 다람쥐 성장 캐릭터로 복원"
                  >
                    <RotateCcw size={10} />
                    기본 다람쥐로 초기화
                  </button>
                )}
              </div>

              {/* Option A: Sprite Sheet Upload (6x6 Grid) */}
              {growthInputType === 'sprite' && (
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                      <Film size={12} className="text-pink-500" />
                      6x6 스프라이트 시트 이미지 등록
                    </span>
                    {growthData.spriteSheetUrl && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold">
                        스프라이트 적용 중
                      </span>
                    )}
                  </div>
                  <p className="text-[9.5px] text-slate-400 leading-tight">
                    행(Row)별로 1~6단계가 자동 분할되며, 각 행의 6프레임이 부드럽게 움직이는 애니메이션으로 재생됩니다.
                  </p>

                  <div className="flex gap-1.5 items-center pt-0.5">
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-pink-500 hover:bg-pink-600 text-white transition-all shadow-xs active:scale-95">
                      <Upload size={12} />
                      <span>스프라이트 시트 파일 업로드</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleSpriteSheetUpload} />
                    </label>

                    {growthData.spriteSheetUrl && (
                      <button
                        onClick={() => setGrowthData((prev) => ({ ...prev, spriteSheetUrl: '' }))}
                        className="px-2 py-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-200 dark:border-rose-900/50"
                      >
                        시트 제거
                      </button>
                    )}
                  </div>

                  {/* Sample Sprite Sheet Reference Card & Download */}
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs space-y-1.5 mt-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        🎀 6x6 스프라이트 예시 (아기 고양이)
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-100 dark:border-indigo-900/40">
                        샘플 제공
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      {/* Clickable Thumbnail */}
                      <button
                        type="button"
                        onClick={() => setShowSamplePreviewModal(true)}
                        className="w-13 h-13 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:ring-2 hover:ring-pink-400 transition-all shrink-0 relative group bg-slate-100 dark:bg-slate-700"
                        title="클릭하여 예시 이미지 크게 보기"
                      >
                        <img
                          src="./sample-spritesheet.png"
                          alt="고양이 6x6 스프라이트 예시"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye size={12} />
                        </div>
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">
                          1~6행이 각 성장 단계(알 부화부터 퇴근 완료까지)로 구성된 6x6 예시입니다. 다운로드하여 직접 커스텀하거나 바로 적용해보세요!
                        </p>

                        <div className="flex gap-1.5 mt-1.5">
                          {/* Download Button */}
                          <a
                            href="./sample-spritesheet.png"
                            download="sample-kitty-spritesheet.png"
                            className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors border border-slate-200 dark:border-slate-600 shadow-2xs"
                            title="예시 스프라이트 시트 다운로드"
                          >
                            <Download size={10} />
                            <span>다운로드</span>
                          </a>

                          {/* Try Sample Button */}
                          <button
                            type="button"
                            onClick={() => {
                              soundManager.playClick();
                              setGrowthData((prev) => ({
                                ...prev,
                                spriteSheetUrl: './sample-spritesheet.png',
                                spriteRows: 6,
                                spriteCols: 6,
                              }));
                              setGrowthInputType('sprite');
                            }}
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                              growthData.spriteSheetUrl === './sample-spritesheet.png'
                                ? 'bg-emerald-500 text-white shadow-2xs'
                                : 'bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-900/50'
                            }`}
                          >
                            <Sparkles size={10} />
                            <span>
                              {growthData.spriteSheetUrl === './sample-spritesheet.png'
                                ? '예시 적용 중'
                                : '예시 바로 적용'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage Preview Selector (1 to 6) */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block">단계별 미리보기 및 테스트</span>
                <div className="grid grid-cols-6 gap-1">
                  {[1, 2, 3, 4, 5, 6].map((stage) => (
                    <button
                      key={stage}
                      onClick={() => {
                        setActiveGrowthStage(stage);
                        soundManager.playClick();
                      }}
                      className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${
                        activeGrowthStage === stage
                          ? 'bg-pink-500 text-white border-pink-500 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {stage}단계
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage Preview & Controls */}
              <div className="flex gap-2.5 items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70">
                <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center p-1 relative shrink-0 shadow-2xs">
                  <MascotDisplay
                    state="FOCUS"
                    customImages={previewCustomImages}
                    previewStage={activeGrowthStage}
                    className="w-14 h-14"
                  />
                  <span className="absolute bottom-0 text-[7.5px] font-bold text-slate-400 bg-white/90 dark:bg-slate-800/90 px-1 rounded-full">
                    Lv.{activeGrowthStage}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {growthStageLabels[activeGrowthStage].name}
                  </h4>
                  <p className="text-[9.5px] text-slate-400 leading-tight mb-1.5">
                    {growthStageLabels[activeGrowthStage].desc}
                  </p>

                  {growthInputType === 'individual' && (
                    <label className="cursor-pointer inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors">
                      <Upload size={11} />
                      <span>{activeGrowthStage}단계 이미지 교체</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleStageImageUpload} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}
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
            className="px-4 py-1.5 text-xs font-bold bg-pink-500 hover:bg-pink-600 active:scale-95 text-white rounded-lg shadow-sm transition-all flex items-center gap-1"
          >
            <Check size={13} />
            설정 저장하기
          </button>
        </div>
      </div>

      {/* Sample Sprite Sheet Full Preview Modal */}
      {showSamplePreviewModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 max-w-[340px] w-full border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                🎀 6x6 스프라이트 시트 구조
              </span>
              <button
                onClick={() => setShowSamplePreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={14} />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <img
                src="./sample-spritesheet.png"
                alt="고양이 스프라이트 시트 전체 구조"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="text-[9.5px] text-slate-500 dark:text-slate-400 space-y-0.5 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
              <div><strong>1행:</strong> 1단계 - 알 부화 (0~15%)</div>
              <div><strong>2행:</strong> 2단계 - 아기 고양이 (15~35%)</div>
              <div><strong>3행:</strong> 3단계 - 성장기 고양이 (35~60%)</div>
              <div><strong>4행:</strong> 4단계 - 열일 직장인 고양이 (60~85%)</div>
              <div><strong>5행:</strong> 5단계 - 만세 프로 마스터 (85~99%)</div>
              <div><strong>6행:</strong> 6단계 - 퇴근 완료 파티 (100%)</div>
            </div>

            <div className="flex justify-end gap-1.5 pt-1">
              <a
                href="./sample-spritesheet.png"
                download="sample-kitty-spritesheet.png"
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center gap-1"
              >
                <Download size={12} />
                <span>다운로드</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setGrowthData((prev) => ({
                    ...prev,
                    spriteSheetUrl: './sample-spritesheet.png',
                    spriteRows: 6,
                    spriteCols: 6,
                  }));
                  setShowSamplePreviewModal(false);
                }}
                className="px-3 py-1.5 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-lg flex items-center gap-1 shadow-sm"
              >
                <Sparkles size={12} />
                <span>이 예시 바로 적용</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
