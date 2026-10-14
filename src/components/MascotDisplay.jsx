import React, { useState } from 'react';

/**
 * Built-in Cute Pastel Squirrel Mascot ("뽀송이") SVG Components
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
      <filter id="glowPink" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
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

    {/* Cheeks */}
    <circle cx="74" cy="92" r="8" fill="#FF8CA3" opacity="0.6" filter="url(#glowPink)" />
    <circle cx="126" cy="92" r="8" fill="#FF8CA3" opacity="0.6" filter="url(#glowPink)" />

    {/* Focused Eyes (Sparkly & determined) */}
    <ellipse cx="85" cy="78" rx="5.5" ry="7" fill="#2E241E" />
    <circle cx="83" cy="75" r="2.2" fill="#FFFFFF" />
    <circle cx="87" cy="80" r="1.2" fill="#FFFFFF" />

    <ellipse cx="115" cy="78" rx="5.5" ry="7" fill="#2E241E" />
    <circle cx="113" cy="75" r="2.2" fill="#FFFFFF" />
    <circle cx="117" cy="80" r="1.2" fill="#FFFFFF" />

    {/* Cute Nose and Mouth */}
    <polygon points="100,85 96,82 104,82" fill="#8D4315" rx="1" />
    <path d="M 96 87 Q 100 90 100 87 Q 100 90 104 87" stroke="#8D4315" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Mini Desk & Laptop */}
    <rect x="45" y="146" width="110" height="8" rx="4" fill="#E8D5B5" stroke="#BA9C72" strokeWidth="2" />
    
    {/* Laptop base */}
    <path d="M 66 146 L 134 146 L 130 138 L 70 138 Z" fill="#D0D7DE" stroke="#8C959F" strokeWidth="2" />
    {/* Laptop screen */}
    <rect x="72" y="104" width="56" height="34" rx="3" fill="#388BFD" stroke="#1F2328" strokeWidth="2.5" />
    {/* Screen glow code lines */}
    <line x1="77" y1="112" x2="98" y2="112" stroke="#E6EDF3" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="77" y1="118" x2="114" y2="118" stroke="#7EE787" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="77" y1="124" x2="105" y2="124" stroke="#FFA657" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="77" y1="130" x2="92" y2="130" stroke="#D2A8FF" strokeWidth="2.2" strokeLinecap="round" />

    {/* Fast Typing Paws */}
    <ellipse cx="78" cy="136" rx="6" ry="5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="2" />
    <ellipse cx="122" cy="136" rx="6" ry="5" fill="#FFE0B2" stroke="#D2792B" strokeWidth="2" />

    {/* Steaming Coffee Mug */}
    <rect x="138" y="132" width="14" height="14" rx="2" fill="#FF7B72" stroke="#CF222E" strokeWidth="1.5" />
    <path d="M 152 135 Q 156 139 152 143" stroke="#CF222E" strokeWidth="1.5" fill="none" />
    {/* Steam */}
    <path d="M 142 128 Q 140 124 144 120" stroke="#AFB8C1" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M 147 127 Q 149 123 146 119" stroke="#AFB8C1" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
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

    {/* Big Delicious Acorn / Lunch Sandwich in Paws */}
    <g transform="translate(93, 110)">
      {/* Acorn cap */}
      <path d="M 0 10 C 2 -2 22 -2 24 10 Z" fill="#8B5A2B" stroke="#5C3A21" strokeWidth="2" />
      <line x1="12" y1="-2" x2="12" y2="-7" stroke="#5C3A21" strokeWidth="2.5" strokeLinecap="round" />
      {/* Acorn nut */}
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
      <filter id="glowPinkIdle" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Big Fluffy Tail */}
    <path
      d="M 125 150 C 175 160 195 105 170 65 C 150 35 115 50 120 75 C 123 90 145 100 135 125 C 130 138 120 145 110 148"
      fill="url(#squirrelFurIdle)"
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
    <circle cx="74" cy="92" r="8" fill="#FF8CA3" opacity="0.6" filter="url(#glowPinkIdle)" />
    <circle cx="126" cy="92" r="8" fill="#FF8CA3" opacity="0.6" filter="url(#glowPinkIdle)" />

    {/* Bright Welcoming Eyes */}
    <ellipse cx="85" cy="78" rx="5.5" ry="7" fill="#2E241E" />
    <circle cx="83" cy="75" r="2.2" fill="#FFFFFF" />
    <circle cx="87" cy="80" r="1.2" fill="#FFFFFF" />

    <ellipse cx="115" cy="78" rx="5.5" ry="7" fill="#2E241E" />
    <circle cx="113" cy="75" r="2.2" fill="#FFFFFF" />
    <circle cx="117" cy="80" r="1.2" fill="#FFFFFF" />

    {/* Cute Nose and Friendly Smile */}
    <polygon points="100,85 96,82 104,82" fill="#8D4315" />
    <path d="M 95 88 Q 100 93 105 88" stroke="#8D4315" strokeWidth="2.2" strokeLinecap="round" fill="none" />

    {/* Waving Paw (Right) */}
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
 * MascotDisplay Component
 * Displays either user-uploaded custom image or fallback vector mascot SVG
 */
export default function MascotDisplay({ state, customImages = {}, className = '' }) {
  const [imageError, setImageError] = useState(false);

  // Map state to custom image URL if defined
  const customUrl = customImages[state];

  if (customUrl && !imageError) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-full ${className}`}>
        <img
          src={customUrl}
          alt={`Mascot for ${state}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Render built-in animated SVG mascots
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
