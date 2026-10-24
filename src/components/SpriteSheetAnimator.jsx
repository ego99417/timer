/**
 * @file src/components/SpriteSheetAnimator.jsx
 * @description 스프라이트 시트 애니메이션 렌더러 컴포넌트
 * 
 * [주요 역할]
 * - 행/열(N x M) 격자 형태의 스프라이트 이미지 시트를 CSS background-position을 이용해 프레임별로 연속 재생
 */

import React, { useState, useEffect } from 'react';

/**
 * SpriteSheetAnimator
 * Renders an animated sprite from a grid sprite sheet (e.g., 6 rows x 6 columns)
 * using CSS background position.
 * 
 * @param {string} src - Image URL or Data URL
 * @param {number} row - Zero-indexed row to animate (e.g., 0 to rows - 1)
 * @param {number} rows - Total rows in sprite sheet (default 6)
 * @param {number} cols - Total columns/frames in sprite sheet (default 6)
 * @param {number} fps - Frames per second (default 4)
 * @param {boolean} isPlaying - Whether the animation is running (default true)
 * @param {string} className - Additional CSS classes
 */
export default function SpriteSheetAnimator({
  src,
  row = 0,
  rows = 6,
  cols = 6,
  fps = 4,
  isPlaying = true,
  className = '',
  style = {},
}) {
  const [col, setCol] = useState(0);

  useEffect(() => {
    if (!isPlaying || cols <= 1) {
      setCol(0);
      return;
    }

    const interval = setInterval(() => {
      setCol((prev) => (prev + 1) % cols);
    }, Math.round(1000 / fps));

    return () => clearInterval(interval);
  }, [isPlaying, cols, fps, row]);

  // Safe clamping
  const safeRow = Math.max(0, Math.min(rows - 1, row));
  const safeCol = Math.max(0, Math.min(cols - 1, col));

  // CSS percentage alignment: (index / (total - 1)) * 100%
  const xPercent = cols > 1 ? (safeCol / (cols - 1)) * 100 : 0;
  const yPercent = rows > 1 ? (safeRow / (rows - 1)) * 100 : 0;

  return (
    <div
      className={`relative select-none overflow-hidden ${className}`}
      style={{
        ...style,
        backgroundImage: `url("${src}")`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundPosition: `${xPercent}% ${yPercent}%`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
