"use client";

import React, { useState } from 'react';

type TaskType = 'todo' | 'progress' | 'done' | 'bug' | 'feature';

interface FloatingAddButtonProps {
  onAddPostIt: (type: TaskType) => void;
}

const taskTypes = [
  { type: 'todo' as TaskType, icon: '📋', name: 'TODO', color: '#8b5cf6' },
  { type: 'progress' as TaskType, icon: '⚡', name: 'IN PROGRESS', color: '#a78bfa' },
  { type: 'done' as TaskType, icon: '✅', name: 'DONE', color: '#34d399' },
  { type: 'bug' as TaskType, icon: '🐛', name: 'BUG FIX', color: '#f87171' },
  { type: 'feature' as TaskType, icon: '✨', name: 'FEATURE', color: '#60a5fa' },
];

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onAddPostIt }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeClick = (type: TaskType) => {
    onAddPostIt(type);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {/* Task type options */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '0',
          background: 'rgba(31, 27, 46, 0.95)',
          border: '1px solid #4c4556',
          borderRadius: '8px',
          padding: '8px',
          backdropFilter: 'blur(10px)',
          minWidth: '180px',
        }}>
          {taskTypes.map(({ type, icon, name, color }) => (
            <button
              key={type}
              onClick={() => handleTypeClick(type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                background: 'transparent',
                color: '#e5e7eb',
                border: 'none',
                padding: '10px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(76, 69, 86, 0.5)';
                e.currentTarget.style.borderLeft = `3px solid ${color}`;
                e.currentTarget.style.paddingLeft = '9px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderLeft = 'none';
                e.currentTarget.style.paddingLeft = '12px';
              }}
            >
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main add button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          background: isOpen ? '#7c3aed' : '#8b5cf6',
          color: 'white',
          border: '1px solid #a78bfa',
          borderRadius: '50%',
          fontSize: '28px',
          fontWeight: '300',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          lineHeight: '0',
          padding: '0',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
          top: '-1px',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = '#a78bfa';
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = '#8b5cf6';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.3)';
          }
        }}
      >
        +
      </button>

      {/* Backdrop to close menu */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        />
      )}
    </div>
  );
};

export default FloatingAddButton;