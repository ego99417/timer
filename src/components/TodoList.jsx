import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function TodoList({ todos, setTodos, onClose }) {
  const [inputVal, setInputVal] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newTodo = {
      id: Date.now().toString(),
      text: inputVal.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
    setInputVal('');
    soundManager.playClick();
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) soundManager.playClick();
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
    soundManager.playClick();
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="w-[320px] max-w-full max-h-[365px] flex flex-col p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/90 dark:border-slate-700/80 overflow-hidden">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
            <ListTodo size={14} />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">오늘의 할 일</h3>
            <p className="text-[10px] text-slate-400">
              {todos.length > 0 ? `${completedCount} / ${todos.length} 완료` : '등록된 할 일 없음'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {todos.length > 0 && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full my-2 overflow-hidden shrink-0">
          <div
            className="bg-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / todos.length) * 100}%` }}
          />
        </div>
      )}

      {/* Add Input */}
      <form onSubmit={handleAdd} className="flex gap-1.5 my-1.5 shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="새로운 할 일 입력 (Enter)"
          className="flex-1 px-2.5 py-1 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="px-2 py-1 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white rounded-xl text-xs font-medium flex items-center justify-center transition-all shadow-sm"
        >
          <Plus size={13} />
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-1.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-lg shrink-0">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-0.5 text-[10.5px] font-medium rounded-md transition-all ${
              filter === f
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {f === 'all' ? '전체' : f === 'active' ? '진행 중' : '완료'}
          </button>
        ))}
      </div>

      {/* Todo Item List */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
        {filteredTodos.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            {filter === 'completed'
              ? '완료된 항목이 없습니다.'
              : filter === 'active'
              ? '진행 중인 항목이 없습니다.'
              : '새로운 할 일을 추가해보세요!'}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-center justify-between p-2 rounded-xl border transition-all ${
                todo.completed
                  ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/50 text-slate-400'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:shadow-xs'
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="flex items-center gap-2 text-left flex-1 min-w-0"
              >
                {todo.completed ? (
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                ) : (
                  <Circle size={16} className="text-slate-300 dark:text-slate-600 shrink-0 hover:text-indigo-400" />
                )}
                <span className={`text-xs truncate ${todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                  {todo.text}
                </span>
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 rounded-md transition-opacity"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
