/**
 * @file src/main.jsx
 * @description React 앱의 진입점(Entry Point)
 * 
 * [주요 역할]
 * - index.html의 root DOM 엘리먼트에 최상위 App 컴포넌트를 마운트
 * - 전역 스타일(index.css) 로드
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
