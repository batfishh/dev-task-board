"use client";
import React, { useState, useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';

type TaskType = 'todo' | 'progress' | 'done' | 'bug' | 'feature';

interface PostItNoteProps {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  type?: TaskType;
  onDragEnd?: (id: string, x: number, y: number) => void;
  onClick?: (id: string) => void;
}

const taskTypeConfig = {
  todo: {
    icon: '📋',
    name: 'TODO',
    leftBorderColor: '#8b5cf6',
    gradientStart: '#1f1b2e',
    gradientEnd: '#2a1f3d'
  },
  progress: {
    icon: '⚡',
    name: 'IN PROGRESS',
    leftBorderColor: '#a78bfa',
    gradientStart: '#1f1b2e',
    gradientEnd: '#2a1f3d'
  },
  done: {
    icon: '✅',
    name: 'DONE',
    leftBorderColor: '#34d399',
    gradientStart: '#1f1b2e',
    gradientEnd: '#2a1f3d'
  },
  bug: {
    icon: '🐛',
    name: 'BUG FIX',
    leftBorderColor: '#f87171',
    gradientStart: '#1f1b2e',
    gradientEnd: '#2a1f3d'
  },
  feature: {
    icon: '✨',
    name: 'FEATURE',
    leftBorderColor: '#60a5fa',
    gradientStart: '#1f1b2e',
    gradientEnd: '#2a1f3d'
  }
};

export const PostItNote: React.FC<PostItNoteProps> = ({
  id,
  x,
  y,
  width = 240,
  height = 160,
  text = 'Task description...',
  type = 'todo',
  onDragEnd,
  onClick,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const config = taskTypeConfig[type];

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setIsDragging(false);
    const node = e.target;
    onDragEnd?.(id, node.x(), node.y());
  };

  const handleClickEvent = () => {
    if (!isDragging) {
      onClick?.(id);
    }
  };

  return (
    <>
      <Group
        x={x}
        y={y}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClickEvent}
      >
        {/* Main background */}
        <Rect
          width={width}
          height={height}
          fill="rgba(31, 27, 46, 0.85)"
          stroke="#4c4556"
          strokeWidth={1}
          cornerRadius={8}
          shadowColor="rgba(0, 0, 0, 0.6)"
          shadowBlur={10}
          shadowOffset={{ x: 0, y: 4 }}
          shadowOpacity={0.4}
        />
        
        {/* Left border accent */}
        <Rect
          x={0}
          y={0}
          width={4}
          height={height}
          fill={config.leftBorderColor}
          cornerRadius={[8, 0, 0, 8]}
        />
        
        {/* Header background */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={38}
          fill="rgba(76, 69, 86, 0.15)"
          strokeWidth={0}
          cornerRadius={[8, 8, 0, 0]}
        />
        
        {/* Header separator line */}
        <Rect
          x={0}
          y={37}
          width={width}
          height={1}
          fill="#4c4556"
        />
        
        {/* Title text */}
        <Text
          text={`${config.icon} ${config.name}`}
          x={12}
          y={14}
          fontSize={11}
          fontFamily="'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
          fill="#9ca3af"
          fontStyle="600"
        />
        
        {/* Content text */}
        <Text
          text={text}
          x={12}
          y={50}
          width={width - 24}
          height={height - 62}
          fontSize={13}
          fontFamily="'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
          fill="#e5e7eb"
          wrap="word"
          align="left"
          verticalAlign="top"
          lineHeight={1.4}
        />
      </Group>

    </>
  );
};

export default PostItNote;