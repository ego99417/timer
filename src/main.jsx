/**
 * @file src/main.jsx
 * @description React 앱의 진입점(Entry Point)
 * 
 * [주요 역할]
 * - index.html의 root DOM 엘리먼트에 최상위 App 컴포넌트를 마운트
 * - 전역 스타일(index.css) 로드
 */

import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("FluffyWork uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-900 text-white rounded-[28px] text-center select-none">
          <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl mb-2">
            ⚠️
          </div>
          <h2 className="text-xs font-bold mb-1">일시적인 오류가 발생했습니다</h2>
          <p className="text-[10px] text-slate-400 mb-3 max-w-[280px] break-words">
            {this.state.error?.message || "알 수 없는 오류"}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
          >
            다시 시도하기
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
