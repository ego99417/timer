/**
 * @file vite.config.js
 * @description Vite 개발 서버 및 빌더 환경설정 파일
 * 
 * [주요 역할]
 * - React 및 Tailwind CSS v4 플러그인 연결
 * - Electron 로컬 파일 로드를 위해 base 상대경로('./') 설정
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
