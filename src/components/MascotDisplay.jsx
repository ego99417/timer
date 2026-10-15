import React, { useState } from 'react';
import SpriteSheetAnimator from './SpriteSheetAnimator';

/**
 * Built-in Cute Pastel Squirrel Mascot ("뽀송이") SVG Components
 */

/**
 * Focus Mascot:
 * The squirrel is actively working on its laptop.
 * The laptop screen is facing the squirrel (casting a soft glow on its focused face).
 * The viewer sees the sleek back lid of the laptop with a glowing acorn logo,
 * and the squirrel's cute paws typing on the keyboard.
 */
export const FocusMascotSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md select-none">
    <defs>
      <radialGradient id="squirrelFur" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FBBF72" />
        <stop offset="100%" stopColor="#E08B3E" />
      </radialGradient>
      <radialGradient id="bellyFur" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF7E6" />
        <stop offset="100%" stopColor="#FFE0B2" />
      </radialGradient>
      <linearGradient id="laptopLidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="60%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <filter id="glowPink" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="screenGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Big Fluffy Tail */}
    <path
      d="M 125 150 C 175 160 195 105 170 65 C 150 35 115 50 120 75 C 123 90 145 100 135 125 C 130 138 120 145 110 148"
      fill="url(#squirrelFur)"
      stroke="#D2792B"
      strokeWidth="3.5"
      strokeLinecap="round"
      className="animate-gentle-sway origin-bottom"
    />
    <path
      d="M 135 70 C 150 85 155 110 140 130"
      stroke="#FFF3D6"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
      opacity="0.8"
    />

    {/* Body */}
    <ellipse cx="100" cy="130" rx="42" ry="46" fill="url(#squirrelFur)" stroke="#D2792B" strokeWidth="3.5" />
    <ellipse cx="100" cy="135" rx="28" ry="32" fill="url(#bellyFur)" />

    {/* Ears */}
    <path d="M 68 62 C 60 38 78 30 84 50 Z" fill="url(#squirrelFur)" stroke="#D2792B" strokeWidth="3" />
    <path d="M 72 56 C 68 45 76 40 79 50 Z" fill="#FFC9D4" />

    <path d="M 132 62 C 140 38 122 30 116 50 Z" fill="url(#squirrelFur)" stroke="#D2792B" strokeWidth="3" />
    <path d="M 128 56 C 132 45 124 40 121 50 Z" fill="#FFC9D4" />

    {/* Head */}
    <ellipse cx="100" cy="80" rx="42" ry="36" fill="url(#squirrelFur)" stroke="#D2792B" strokeWidth="3.5" />

    {/* Soft screen light reflection on squirrel's face */}
    <ellipse cx="100" cy="94" rx="34" ry="18" fill="#38BDF8" opacity="0.14" filter="url(#screenGlow)" />

    {/* Cheeks */}
    <circle cx="74" cy="92" r="8" fill="#FF8CA3" opacity="0.65" filter="url(#glowPink)" />
    <circle cx="126" cy="92" r="8" fill="#FF8CA3" opacity="0.65" filter="url(#glowPink)" />

    {/* Focused Eyes (Looking downward into the laptop screen) */}
    <ellipse cx="85" cy="80" rx="5.2" ry="6.5" fill="#2E241E" />
    <circle cx="83.5" cy="78" r="2.2" fill="#FFFFFF" />
    <circle cx="86.5" cy="82" r="1.2" fill="#FFFFFF" />
    {/* Screen reflection highlight */}
    <ellipse cx="85" cy="81" rx="2" ry="1" fill="#38BDF8" opacity="0.8" />

    <ellipse cx="115" cy="80" rx="5.2" ry="6.5" fill="#2E241E" />
    <circle cx="113.5" cy="78" r="2.2" fill="#FFFFFF" />
    <circle cx="116.5" cy="82" r="1.2" fill="#FFFFFF" />
    <ellipse cx="115" cy="81" rx="2" ry="1" fill="#38BDF8" opacity="0.8" />

    {/* Cute Nose and Focused Mouth */}
    <polygon points="100,86 96,83 104,83" fill="#8D4315" rx="1" />
    <path d="M 97 88 Q 100 90 103 88" stroke="#8D4315" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Mini Desk */}
    <rect x="36" y="146" width="128" height="9" rx="4.5" fill="#E8D5B5" stroke="#BA9C72" strokeWidth="2.2" />

    {/* Soft ambient screen light cone shining up from the keyboard */}
    <polygon points="76,116 124,116 138,92 62,92" fill="#38BDF8" opacity="0.08" />

    {/* Laptop Base (Keyboard area where paws rest) */}
    <path d="M 64 146 L 136 146 L 130 139 L 70 139 Z" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
    <line x1="75" y1="142" x2="125" y2="142" stroke="#64748B" strokeWidth="1.8" strokeDasharray="3 2" />

    {/* Laptop Lid (Back of the screen facing the viewer!) */}
    <path
      d="M 72 115 L 128 115 L 131 140 L 69 140 Z"
      fill="url(#laptopLidGrad)"
      stroke="#475569"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />

    {/* Glowing Acorn Logo on the back of the laptop lid */}
    <g transform="translate(100, 128) scale(0.7)">
      {/* Acorn cap */}
      <path d="M -8 -3 C -8 -9 8 -9 8 -3 Z" fill="#38BDF8" filter="url(#screenGlow)" />
      <path d="M -8 -3 C -8 -9 8 -9 8 -3 Z" fill="#FFFFFF" />
      {/* Tiny stem */}
      <line x1="0" y1="-9" x2="0" y2="-12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      {/* Acorn body */}
      <path d="M -7 -3 C -7 7 0 9 0 9 C 0 9 7 7 7 -3 Z" fill="#FFFFFF" />
    </g>

    {/* Fast Typing Paws (Resting / actively tapping on the keyboard) */}
    <ellipse cx="68" cy="141" rx="5.5" ry="4.5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="1.8" />
    <ellipse cx="132" cy="141" rx="5.5" ry="4.5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="1.8" />

    {/* Steaming Coffee Mug on Right Desk */}
    <rect x="144" y="132" width="14" height="14" rx="2.5" fill="#FF7B72" stroke="#CF222E" strokeWidth="1.5" />
    <path d="M 158 135 Q 162 139 158 143" stroke="#CF222E" strokeWidth="1.5" fill="none" />
    {/* Steam */}
    <path d="M 148 127 Q 146 123 150 119" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75" />
    <path d="M 153 126 Q 155 122 152 118" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75" />
  </svg>
);

export const RestMascotSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md select-none">
    <defs>
      <radialGradient id="squirrelFurRest" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FBBF72" />
        <stop offset="100%" stopColor="#E08B3E" />
      </radialGradient>
      <radialGradient id="bellyFurRest" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF7E6" />
        <stop offset="100%" stopColor="#FFE0B2" />
      </radialGradient>
    </defs>

    {/* Cozy Cushion */}
    <ellipse cx="100" cy="162" rx="68" ry="18" fill="#A7F3D0" stroke="#34D399" strokeWidth="3" />
    <ellipse cx="100" cy="160" rx="60" ry="14" fill="#D1FAE5" />

    {/* Tail Wrapped Around */}
    <path
      d="M 50 155 C 30 130 35 85 70 65 C 78 60 85 64 80 75 C 65 95 60 125 75 145"
      fill="url(#squirrelFurRest)"
      stroke="#D2792B"
      strokeWidth="3.5"
    />

    {/* Body */}
    <ellipse cx="105" cy="125" rx="38" ry="42" fill="url(#squirrelFurRest)" stroke="#D2792B" strokeWidth="3.5" />
    <ellipse cx="105" cy="130" rx="25" ry="28" fill="url(#bellyFurRest)" />

    {/* Ears */}
    <path d="M 78 55 C 70 34 86 28 92 46 Z" fill="url(#squirrelFurRest)" stroke="#D2792B" strokeWidth="3" />
    <path d="M 82 50 C 78 40 85 36 88 45 Z" fill="#FFC9D4" />

    <path d="M 132 55 C 140 34 124 28 118 46 Z" fill="url(#squirrelFurRest)" stroke="#D2792B" strokeWidth="3" />
    <path d="M 128 50 C 132 40 125 36 122 45 Z" fill="#FFC9D4" />

    {/* Head */}
    <ellipse cx="105" cy="75" rx="38" ry="34" fill="url(#squirrelFurRest)" stroke="#D2792B" strokeWidth="3.5" />

    {/* Cheeks */}
    <circle cx="80" cy="85" r="9" fill="#FF8CA3" opacity="0.65" />
    <circle cx="130" cy="85" r="9" fill="#FF8CA3" opacity="0.65" />

    {/* Content Happy Eyes (^_^) */}
    <path d="M 86 76 Q 92 70 98 76" stroke="#2E241E" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M 112 76 Q 118 70 124 76" stroke="#2E241E" strokeWidth="3" strokeLinecap="round" fill="none" />

    {/* Nose and Munching Mouth */}
    <polygon points="105,80 101,77 109,77" fill="#8D4315" />
    <path d="M 101 83 Q 105 88 109 83" stroke="#8D4315" strokeWidth="2.2" strokeLinecap="round" fill="#FFC9D4" />

    {/* Big Delicious Acorn */}
    <g transform="translate(93, 110)">
      <path d="M 0 10 C 2 -2 22 -2 24 10 Z" fill="#8B5A2B" stroke="#5C3A21" strokeWidth="2" />
      <line x1="12" y1="-2" x2="12" y2="-7" stroke="#5C3A21" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 1 10 C 0 25 12 32 12 32 C 12 32 24 25 23 10 Z" fill="#D2995B" stroke="#5C3A21" strokeWidth="2" />
    </g>

    {/* Paws holding food */}
    <circle cx="91" cy="122" r="6" fill="#FFE0B2" stroke="#D2792B" strokeWidth="2" />
    <circle cx="119" cy="122" r="6" fill="#FFE0B2" stroke="#D2792B" strokeWidth="2" />

    {/* Tea Cup on side */}
    <ellipse cx="148" cy="150" rx="10" ry="4" fill="#E2E8F0" />
    <rect x="141" y="140" width="14" height="10" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
    <path d="M 148 136 Q 146 132 150 128" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
  </svg>
);

export const PausedMascotSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md select-none">
    <defs>
      <radialGradient id="squirrelFurSleep" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FBBF72" />
        <stop offset="100%" stopColor="#E08B3E" />
      </radialGradient>
      <radialGradient id="pillowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E0E7FF" />
      </radialGradient>
    </defs>

    {/* Fluffy Pillow */}
    <rect x="35" y="130" width="130" height="38" rx="19" fill="url(#pillowGrad)" stroke="#C7D2FE" strokeWidth="3" />
    <path d="M 45 140 Q 60 148 45 158" stroke="#C7D2FE" strokeWidth="2" fill="none" />
    <path d="M 155 140 Q 140 148 155 158" stroke="#C7D2FE" strokeWidth="2" fill="none" />

    {/* Body curled up */}
    <ellipse cx="95" cy="132" rx="44" ry="28" fill="url(#squirrelFurSleep)" stroke="#D2792B" strokeWidth="3.5" />

    {/* Tail covering back */}
    <path
      d="M 130 135 C 165 130 170 85 140 75 C 120 70 105 85 110 105 C 113 118 125 128 135 135"
      fill="url(#squirrelFurSleep)"
      stroke="#D2792B"
      strokeWidth="3.5"
    />

    {/* Head resting on pillow */}
    <ellipse cx="75" cy="120" rx="32" ry="26" fill="url(#squirrelFurSleep)" stroke="#D2792B" strokeWidth="3.5" />

    {/* Nightcap / Sleep Hat */}
    <path d="M 52 110 C 45 75 75 70 85 98 Z" fill="#818CF8" stroke="#4F46E5" strokeWidth="2.5" />
    <circle cx="45" cy="75" r="7" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="2" />

    {/* Sleeping Eyes (-_-) */}
    <path d="M 60 124 Q 66 128 72 124" stroke="#2E241E" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    <path d="M 80 124 Q 86 128 92 124" stroke="#2E241E" strokeWidth="2.8" strokeLinecap="round" fill="none" />

    {/* Cheek */}
    <circle cx="56" cy="126" r="6" fill="#FF8CA3" opacity="0.6" />
    <circle cx="94" cy="126" r="6" fill="#FF8CA3" opacity="0.6" />

    {/* Sleeping bubbles / Zzz floating */}
    <text x="135" y="70" fill="#6366F1" fontSize="18" fontWeight="bold" fontFamily="sans-serif" className="animate-zzz-1">
      z
    </text>
    <text x="150" y="52" fill="#818CF8" fontSize="24" fontWeight="bold" fontFamily="sans-serif" className="animate-zzz-2">
      Z
    </text>
  </svg>
);

export const CompletedMascotSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md select-none">
    <defs>
      <radialGradient id="squirrelFurDone" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FBBF72" />
        <stop offset="100%" stopColor="#E08B3E" />
      </radialGradient>
      <radialGradient id="bellyFurDone" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF7E6" />
        <stop offset="100%" stopColor="#FFE0B2" />
      </radialGradient>
    </defs>

    {/* Celebration Sparkles */}
    <polygon points="35,45 38,35 48,38 38,41" fill="#FBBF24" />
    <polygon points="165,45 162,35 152,38 162,41" fill="#F43F5E" />
    <polygon points="100,20 103,12 111,15 103,18" fill="#10B981" />
    <circle cx="48" cy="65" r="3" fill="#A855F7" />
    <circle cx="155" cy="70" r="3" fill="#3B82F6" />

    {/* Big Tail waving excitedly */}
    <path
      d="M 125 150 C 185 160 200 95 165 55 C 145 28 115 45 125 75 C 130 90 150 100 138 128"
      fill="url(#squirrelFurDone)"
      stroke="#D2792B"
      strokeWidth="3.5"
    />

    {/* Party Cone Hat */}
    <polygon points="100,28 88,60 112,60" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
    <circle cx="100" cy="27" r="5" fill="#FDE047" />
    <line x1="90" y1="48" x2="110" y2="48" stroke="#FDE047" strokeWidth="2.5" />

    {/* Body */}
    <ellipse cx="100" cy="130" rx="40" ry="44" fill="url(#squirrelFurDone)" stroke="#D2792B" strokeWidth="3.5" />
    <ellipse cx="100" cy="135" rx="26" ry="30" fill="url(#bellyFurDone)" />

    {/* Cheerful Ears */}
    <path d="M 70 65 C 60 42 78 35 84 55 Z" fill="url(#squirrelFurDone)" stroke="#D2792B" strokeWidth="3" />
    <path d="M 130 65 C 140 42 122 35 116 55 Z" fill="url(#squirrelFurDone)" stroke="#D2792B" strokeWidth="3" />

    {/* Head */}
    <ellipse cx="100" cy="85" rx="40" ry="34" fill="url(#squirrelFurDone)" stroke="#D2792B" strokeWidth="3.5" />

    {/* Cheerful Blushing Cheeks */}
    <circle cx="74" cy="94" r="8.5" fill="#FF6B8B" opacity="0.7" />
    <circle cx="126" cy="94" r="8.5" fill="#FF6B8B" opacity="0.7" />

    {/* Big Sparkling Happy Eyes */}
    <path d="M 80 82 Q 86 74 92 82" stroke="#2E241E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M 108 82 Q 114 74 120 82" stroke="#2E241E" strokeWidth="3.5" strokeLinecap="round" fill="none" />

    {/* Wide Open Happy Mouth */}
    <polygon points="100,88 96,85 104,85" fill="#8D4315" />
    <path d="M 94 92 Q 100 106 106 92 Z" fill="#F43F5E" stroke="#8D4315" strokeWidth="2" />
    <path d="M 97 98 Q 100 95 103 98" fill="#FFB7B2" />

    {/* Cheering Arms in Air (Hooray!) */}
    <path d="M 70 120 C 50 95 48 85 40 90" stroke="#D2792B" strokeWidth="6" strokeLinecap="round" fill="none" />
    <circle cx="40" cy="90" r="5" fill="#FFE0B2" />

    <path d="M 130 120 C 150 95 152 85 160 90" stroke="#D2792B" strokeWidth="6" strokeLinecap="round" fill="none" />
    <circle cx="160" cy="90" r="5" fill="#FFE0B2" />

    {/* Commuter Briefcase / Bag on ground */}
    <rect x="42" y="146" width="28" height="20" rx="3" fill="#92400E" stroke="#78350F" strokeWidth="2" />
    <path d="M 50 146 C 50 140 62 140 62 146" stroke="#78350F" strokeWidth="2" fill="none" />
    <rect x="54" y="152" width="4" height="4" fill="#FCD34D" />
  </svg>
);

export const IdleMascotSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md select-none">
    <defs>
      <radialGradient id="squirrelFurIdle" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FBBF72" />
        <stop offset="100%" stopColor="#E08B3E" />
      </radialGradient>
      <radialGradient id="bellyFurIdle" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF7E6" />
        <stop offset="100%" stopColor="#FFE0B2" />
      </radialGradient>
    </defs>

    {/* Fluffy Tail */}
    <path
      d="M 125 150 C 175 160 195 105 170 65 C 150 35 115 50 120 75 C 123 90 145 100 135 125 C 130 138 120 145 110 148"
      fill="url(#squirrelFurIdle)"
      stroke="#D2792B"
      strokeWidth="3.5"
      strokeLinecap="round"
      className="animate-gentle-sway origin-bottom"
    />

    {/* Body */}
    <ellipse cx="100" cy="130" rx="42" ry="46" fill="url(#squirrelFurIdle)" stroke="#D2792B" strokeWidth="3.5" />
    <ellipse cx="100" cy="135" rx="28" ry="32" fill="url(#bellyFurIdle)" />

    {/* Ears */}
    <path d="M 68 62 C 60 38 78 30 84 50 Z" fill="url(#squirrelFurIdle)" stroke="#D2792B" strokeWidth="3" />
    <path d="M 72 56 C 68 45 76 40 79 50 Z" fill="#FFC9D4" />

    <path d="M 132 62 C 140 38 122 30 116 50 Z" fill="url(#squirrelFurIdle)" stroke="#D2792B" strokeWidth="3" />
    <path d="M 128 56 C 132 45 124 40 121 50 Z" fill="#FFC9D4" />

    {/* Head */}
    <ellipse cx="100" cy="80" rx="42" ry="36" fill="url(#squirrelFurIdle)" stroke="#D2792B" strokeWidth="3.5" />

    {/* Cheeks */}
    <circle cx="74" cy="92" r="8" fill="#FF8CA3" opacity="0.6" />
    <circle cx="126" cy="92" r="8" fill="#FF8CA3" opacity="0.6" />

    {/* Eyes */}
    <ellipse cx="85" cy="78" rx="5.5" ry="7" fill="#2E241E" />
    <circle cx="83" cy="75" r="2.2" fill="#FFFFFF" />
    <circle cx="87" cy="80" r="1.2" fill="#FFFFFF" />

    <ellipse cx="115" cy="78" rx="5.5" ry="7" fill="#2E241E" />
    <circle cx="113" cy="75" r="2.2" fill="#FFFFFF" />
    <circle cx="117" cy="80" r="1.2" fill="#FFFFFF" />

    {/* Mouth */}
    <polygon points="100,85 96,82 104,82" fill="#8D4315" />
    <path d="M 95 88 Q 100 93 105 88" stroke="#8D4315" strokeWidth="2.2" strokeLinecap="round" fill="none" />

    {/* Waving paw */}
    <path d="M 125 115 Q 148 95 142 85" stroke="#D2792B" strokeWidth="6" strokeLinecap="round" fill="none" />
    <circle cx="142" cy="85" r="5.5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="2" />

    {/* Acorn in left paw */}
    <g transform="translate(62, 118)">
      <path d="M 0 8 C 2 -2 18 -2 20 8 Z" fill="#8B5A2B" stroke="#5C3A21" strokeWidth="1.8" />
      <path d="M 1 8 C 0 20 10 26 10 26 C 10 26 20 20 19 8 Z" fill="#D2995B" stroke="#5C3A21" strokeWidth="1.8" />
      <circle cx="10" cy="14" r="5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="1.5" />
    </g>
  </svg>
);

/**
 * ----------------------------------------------------
 * Built-in 6 Growth Stage Squirrel SVGs (Copyright-free)
 * ----------------------------------------------------
 */

// Stage 1: 알 (Egg wobbling with cracks & sparkles)
export const GrowthStage1SVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md select-none">
    <defs>
      <radialGradient id="eggGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFDF7" />
        <stop offset="60%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#FDE68A" />
      </radialGradient>
      <linearGradient id="crackGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>

    {/* Cozy Straw Nest Base */}
    <ellipse cx="100" cy="160" rx="60" ry="16" fill="#D97706" opacity="0.3" />
    <ellipse cx="100" cy="158" rx="55" ry="13" fill="#FDE68A" stroke="#B45309" strokeWidth="2" strokeDasharray="6 3" />

    {/* Wobbling Egg with gentle sway */}
    <g className="animate-gentle-sway origin-bottom">
      <path
        d="M 100 45 C 132 45 148 88 148 126 C 148 158 128 162 100 162 C 72 162 52 158 52 126 C 52 88 68 45 100 45 Z"
        fill="url(#eggGrad)"
        stroke="#D97706"
        strokeWidth="3.5"
      />

      {/* Cute Pastel Polka Dots on Egg */}
      <circle cx="78" cy="85" r="7" fill="#F472B6" opacity="0.5" />
      <circle cx="122" cy="90" r="8" fill="#FBBF24" opacity="0.6" />
      <circle cx="95" cy="120" r="6" fill="#60A5FA" opacity="0.5" />
      <circle cx="72" cy="128" r="5" fill="#34D399" opacity="0.5" />
      <circle cx="125" cy="132" r="7" fill="#F472B6" opacity="0.5" />

      {/* Cracking Light Lines (Egg hatching soon!) */}
      <path
        d="M 98 68 L 105 76 L 96 84 L 108 92 L 100 102"
        stroke="url(#crackGlow)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>

    {/* Sparkles around egg */}
    <polygon points="45,65 48,55 58,58 48,61" fill="#F59E0B" />
    <polygon points="152,70 149,60 139,63 149,66" fill="#EC4899" />
    <circle cx="155" cy="115" r="2.5" fill="#3B82F6" />
    <circle cx="42" cy="110" r="2.5" fill="#10B981" />
  </svg>
);

// Stage 2: 아기 다람쥐 (Baby Squirrel hatched in eggshell, holding sprout)
export const GrowthStage2SVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md select-none">
    <defs>
      <radialGradient id="babyFur" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#F59E0B" />
      </radialGradient>
    </defs>

    {/* Half Eggshell Base */}
    <path
      d="M 52 130 C 52 165 148 165 148 130 L 136 136 L 122 128 L 108 137 L 92 127 L 78 136 L 64 128 Z"
      fill="#FEF3C7"
      stroke="#D97706"
      strokeWidth="3"
    />

    {/* Tiny Baby Squirrel Body */}
    <ellipse cx="100" cy="122" rx="34" ry="32" fill="url(#babyFur)" stroke="#D2792B" strokeWidth="3" />
    <ellipse cx="100" cy="126" rx="20" ry="22" fill="#FFFBEB" />

    {/* Tiny Ears */}
    <path d="M 72 70 C 66 52 80 48 85 64 Z" fill="url(#babyFur)" stroke="#D2792B" strokeWidth="2.5" />
    <path d="M 76 66 C 72 58 78 54 81 64 Z" fill="#FFC9D4" />

    <path d="M 128 70 C 134 52 120 48 115 64 Z" fill="url(#babyFur)" stroke="#D2792B" strokeWidth="2.5" />
    <path d="M 124 66 C 128 58 122 54 119 64 Z" fill="#FFC9D4" />

    {/* Round Baby Head */}
    <ellipse cx="100" cy="88" rx="36" ry="30" fill="url(#babyFur)" stroke="#D2792B" strokeWidth="3" />

    {/* Giant Innocent Baby Eyes */}
    <circle cx="86" cy="86" r="6.5" fill="#1E293B" />
    <circle cx="84" cy="83" r="2.8" fill="#FFFFFF" />
    <circle cx="88" cy="88" r="1.5" fill="#FFFFFF" />

    <circle cx="114" cy="86" r="6.5" fill="#1E293B" />
    <circle cx="112" cy="83" r="2.8" fill="#FFFFFF" />
    <circle cx="116" cy="88" r="1.5" fill="#FFFFFF" />

    {/* Rosy Cheeks */}
    <circle cx="75" cy="94" r="7" fill="#FF8CA3" opacity="0.75" />
    <circle cx="125" cy="94" r="7" fill="#FF8CA3" opacity="0.75" />

    {/* Tiny Nose & Mouth */}
    <circle cx="100" cy="91" r="2.5" fill="#8D4315" />
    <path d="M 96 95 Q 100 98 104 95" stroke="#8D4315" strokeWidth="1.8" strokeLinecap="round" fill="none" />

    {/* Paws holding a fresh acorn sprout */}
    <circle cx="90" cy="120" r="5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="1.5" />
    <circle cx="110" cy="120" r="5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="1.5" />

    {/* Green Sprout 🌱 */}
    <path d="M 100 120 L 100 108" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 100 110 C 92 105 92 114 100 112" fill="#22C55E" />
    <path d="M 100 108 C 108 103 108 112 100 110" fill="#22C55E" />
  </svg>
);

// Stage 3: 성장기 다람쥐 (Young child squirrel with cute backpack & golden acorn)
export const GrowthStage3SVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md select-none">
    <defs>
      <radialGradient id="childFur" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FBBF72" />
        <stop offset="100%" stopColor="#E08B3E" />
      </radialGradient>
    </defs>

    {/* Bushy Tail */}
    <path
      d="M 120 145 C 165 155 185 105 160 70 C 145 45 118 60 122 80 C 125 95 140 105 130 125 Z"
      fill="url(#childFur)"
      stroke="#D2792B"
      strokeWidth="3.5"
      className="animate-gentle-sway origin-bottom"
    />

    {/* Body */}
    <ellipse cx="100" cy="132" rx="38" ry="40" fill="url(#childFur)" stroke="#D2792B" strokeWidth="3.5" />
    <ellipse cx="100" cy="136" rx="24" ry="26" fill="#FFF7E6" />

    {/* Yellow Backpack Straps on shoulders */}
    <path d="M 76 118 Q 70 134 78 144" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    <path d="M 124 118 Q 130 134 122 144" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" fill="none" />

    {/* Ears */}
    <path d="M 70 60 C 62 40 78 34 84 52 Z" fill="url(#childFur)" stroke="#D2792B" strokeWidth="3" />
    <path d="M 74 55 C 70 45 76 42 79 52 Z" fill="#FFC9D4" />

    <path d="M 130 60 C 138 40 122 34 116 52 Z" fill="url(#childFur)" stroke="#D2792B" strokeWidth="3" />
    <path d="M 126 55 C 130 45 124 42 121 52 Z" fill="#FFC9D4" />

    {/* Head */}
    <ellipse cx="100" cy="80" rx="40" ry="34" fill="url(#childFur)" stroke="#D2792B" strokeWidth="3.5" />

    {/* Cute Cheerful Eyes */}
    <ellipse cx="85" cy="78" rx="5" ry="6.5" fill="#2E241E" />
    <circle cx="83.5" cy="75" r="2" fill="#FFFFFF" />
    <circle cx="87" cy="80" r="1.2" fill="#FFFFFF" />

    <ellipse cx="115" cy="78" rx="5" ry="6.5" fill="#2E241E" />
    <circle cx="113.5" cy="75" r="2" fill="#FFFFFF" />
    <circle cx="117" cy="80" r="1.2" fill="#FFFFFF" />

    {/* Cheerful Blushing Cheeks */}
    <circle cx="74" cy="88" r="8" fill="#FF8CA3" opacity="0.65" />
    <circle cx="126" cy="88" r="8" fill="#FF8CA3" opacity="0.65" />

    {/* Wide Happy Smile */}
    <polygon points="100,84 96,81 104,81" fill="#8D4315" />
    <path d="M 94 88 Q 100 98 106 88 Z" fill="#F43F5E" stroke="#8D4315" strokeWidth="1.8" />

    {/* Holding Big Shiny Golden Acorn */}
    <g transform="translate(90, 114)">
      <path d="M 0 8 C 2 -2 18 -2 20 8 Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
      <line x1="10" y1="-2" x2="10" y2="-6" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <path d="M 1 8 C 0 22 10 28 10 28 C 10 28 20 22 19 8 Z" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
    </g>

    {/* Paws */}
    <circle cx="88" cy="125" r="5.5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="1.8" />
    <circle cx="112" cy="125" r="5.5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="1.8" />
  </svg>
);

// Stage 4: 열일 다람쥐 (Worker squirrel with laptop - matches FocusMascotSVG)
export const GrowthStage4SVG = FocusMascotSVG;

// Stage 5: 프로 마스터 다람쥐 (Pro squirrel with focus glasses, double espresso, burning passion)
export const GrowthStage5SVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md select-none">
    <defs>
      <radialGradient id="proFur" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FBBF72" />
        <stop offset="100%" stopColor="#E08B3E" />
      </radialGradient>
      <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>

    {/* Passion Fire Sparkles in background */}
    <polygon points="30,50 34,35 44,40 34,44" fill="#EF4444" />
    <polygon points="170,50 166,35 156,40 166,44" fill="#F59E0B" />
    <circle cx="45" cy="75" r="3" fill="#F59E0B" />
    <circle cx="160" cy="75" r="3" fill="#EF4444" />

    {/* Bushy Tail */}
    <path
      d="M 125 150 C 175 160 195 105 170 65 C 150 35 115 50 120 75 C 123 90 145 100 135 125 Z"
      fill="url(#proFur)"
      stroke="#D2792B"
      strokeWidth="3.5"
    />

    {/* Body */}
    <ellipse cx="100" cy="130" rx="42" ry="46" fill="url(#proFur)" stroke="#D2792B" strokeWidth="3.5" />
    <ellipse cx="100" cy="135" rx="28" ry="32" fill="#FFE0B2" />

    {/* Ears */}
    <path d="M 68 62 C 60 38 78 30 84 50 Z" fill="url(#proFur)" stroke="#D2792B" strokeWidth="3" />
    <path d="M 132 62 C 140 38 122 30 116 50 Z" fill="url(#proFur)" stroke="#D2792B" strokeWidth="3" />

    {/* Passion Headband (열정 머리띠 🔥) */}
    <path d="M 60 70 Q 100 60 140 70" stroke="url(#fireGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Headband knot tie on left */}
    <polygon points="56,70 42,66 48,76" fill="#EF4444" />
    <polygon points="56,70 44,78 40,70" fill="#F59E0B" />

    {/* Head */}
    <ellipse cx="100" cy="80" rx="42" ry="36" fill="url(#proFur)" stroke="#D2792B" strokeWidth="3.5" />

    {/* Stylish Smart Focus Glasses */}
    <circle cx="85" cy="80" r="10" fill="rgba(56, 189, 248, 0.2)" stroke="#1E293B" strokeWidth="2.5" />
    <circle cx="115" cy="80" r="10" fill="rgba(56, 189, 248, 0.2)" stroke="#1E293B" strokeWidth="2.5" />
    <line x1="95" y1="80" x2="105" y2="80" stroke="#1E293B" strokeWidth="2.5" />

    {/* Laser Focused Eyes behind glasses */}
    <ellipse cx="85" cy="80" rx="4.5" ry="5.5" fill="#1E293B" />
    <circle cx="83.5" cy="78" r="1.8" fill="#FFFFFF" />
    <circle cx="86" cy="82" r="1" fill="#FFFFFF" />

    <ellipse cx="115" cy="80" rx="4.5" ry="5.5" fill="#1E293B" />
    <circle cx="113.5" cy="78" r="1.8" fill="#FFFFFF" />
    <circle cx="116" cy="82" r="1" fill="#FFFFFF" />

    {/* Determined Smile */}
    <polygon points="100,86 96,83 104,83" fill="#8D4315" />
    <path d="M 97 88 Q 100 91 103 88" stroke="#8D4315" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Desk & Dual Coffee Cups */}
    <rect x="36" y="146" width="128" height="9" rx="4.5" fill="#E8D5B5" stroke="#BA9C72" strokeWidth="2.2" />

    {/* Laptop base & lid facing away */}
    <path d="M 64 146 L 136 146 L 130 139 L 70 139 Z" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
    <path d="M 72 115 L 128 115 L 131 140 L 69 140 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="2.2" />
    {/* Blazing Flame / Acorn Logo */}
    <circle cx="100" cy="128" r="4.5" fill="#EF4444" />
    <circle cx="100" cy="128" r="2.5" fill="#FCD34D" />

    {/* Double Coffee Mugs for ultimate overtime power */}
    <rect x="142" y="132" width="12" height="14" rx="2" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.2" />
    <rect x="156" y="134" width="10" height="12" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.2" />

    {/* Paws */}
    <ellipse cx="68" cy="141" rx="5.5" ry="4.5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="1.8" />
    <ellipse cx="132" cy="141" rx="5.5" ry="4.5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="1.8" />
  </svg>
);

// Stage 6: 퇴근 완료 (Goal Champion Celebration Squirrel)
export const GrowthStage6SVG = CompletedMascotSVG;

/**
 * MascotDisplay Component
 * Displays either user-uploaded custom image or fallback vector mascot SVG
 */
export default function MascotDisplay({
  state = 'IDLE',
  customImages = {},
  className = '',
  progressPercent = 0,
  previewStage = null,
}) {
  const [imageError, setImageError] = useState(false);

  // Check if growth mode is active
  const isGrowthMode = customImages?.mode === 'growth';

  // Determine Growth Stage (1 to 6)
  let growthStage = 1;
  if (previewStage !== null && previewStage !== undefined) {
    growthStage = Math.max(1, Math.min(6, previewStage));
  } else if (state === 'COMPLETED' || progressPercent >= 100) {
    growthStage = 6;
  } else if (progressPercent >= 85) {
    growthStage = 5;
  } else if (progressPercent >= 60) {
    growthStage = 4;
  } else if (progressPercent >= 35) {
    growthStage = 3;
  } else if (progressPercent >= 15) {
    growthStage = 2;
  } else {
    growthStage = 1;
  }

  // 1. If Growth Mode
  if (isGrowthMode) {
    const growth = customImages?.growth || {};

    // A. Sprite sheet active
    if (growth.spriteSheetUrl && !imageError) {
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className}`}>
          <SpriteSheetAnimator
            src={growth.spriteSheetUrl}
            row={growthStage - 1}
            rows={growth.spriteRows || 6}
            cols={growth.spriteCols || 6}
            isPlaying={state !== 'PAUSED'}
            fps={4}
            className="w-full h-full"
          />
        </div>
      );
    }

    // B. Individual stage image
    const stageImageUrl = growth.stageImages?.[growthStage];
    if (stageImageUrl && !imageError) {
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className}`}>
          <img
            src={stageImageUrl}
            alt={`성장 ${growthStage}단계`}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
          />
        </div>
      );
    }

    // C. Built-in Squirrel Growth SVGs (Copyright-free)
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {growthStage === 1 && <GrowthStage1SVG />}
        {growthStage === 2 && <GrowthStage2SVG />}
        {growthStage === 3 && <GrowthStage3SVG />}
        {growthStage === 4 && <GrowthStage4SVG />}
        {growthStage === 5 && <GrowthStage5SVG />}
        {growthStage === 6 && <GrowthStage6SVG />}
      </div>
    );
  }

  // 2. Default Mode (State-based 4-character mode)
  const customUrl = customImages?.stateImages?.[state] || customImages?.[state];

  if (customUrl && !imageError) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-full ${className}`}>
        <img
          src={customUrl}
          alt={`Mascot for ${state}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Render built-in animated SVG mascots for default state
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {state === 'FOCUS' && <FocusMascotSVG />}
      {state === 'REST' && <RestMascotSVG />}
      {state === 'PAUSED' && <PausedMascotSVG />}
      {state === 'COMPLETED' && <CompletedMascotSVG />}
      {(!state || state === 'IDLE') && <IdleMascotSVG />}
    </div>
  );
}
