"use client";

import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import PostItNote from '@/components/PostItNote/PostItNote';
import FloatingAddButton from '@/components/FloatingAddButton';

type TaskType = 'todo' | 'progress' | 'done' | 'bug' | 'feature';

interface PostItData {
  id: string;
  x: number;
  y: number;
  text: string;
  type: TaskType;
}

interface EditingState {
  id: string;
  x: number;
  y: number;
  text: string;
  type: TaskType;
}

export interface KonvaBoardRef {
  addPostIt: (type?: TaskType) => void;
}

const KonvaBoard = forwardRef<KonvaBoardRef>((props, ref) => {
  const [postIts, setPostIts] = useState<PostItData[]>([
    { id: 'default', x: 250, y: 180, text: 'Task description...', type: 'todo' }
  ]);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addPostIt = (type: TaskType = 'todo') => {
    const newPostIt: PostItData = {
      id: `postit-${Date.now()}`,
      x: Math.random() * (window.innerWidth - 280) + 50,
      y: Math.random() * (window.innerHeight - 200) + 50,
      text: 'Task description...',
      type
    };
    setPostIts(prev => [...prev, newPostIt]);
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    setPostIts(prev => prev.map(postit => 
      postit.id === id ? { ...postit, x, y } : postit
    ));
  };

  const handleTextChange = (id: string, text: string) => {
    setPostIts(prev => prev.map(postit => 
      postit.id === id ? { ...postit, text } : postit
    ));
  };

  const handleClick = (id: string) => {
    const postit = postIts.find(p => p.id === id);
    if (postit) {
      const editText = postit.text === 'Task description...' ? '' : postit.text;
      setEditing({ ...postit, text: editText });
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          if (editText) {
            textareaRef.current.select();
          }
        }
      }, 0);
    }
  };

  const handleEditSubmit = () => {
    if (editing) {
      const finalText = editing.text.trim() === '' ? 'Task description...' : editing.text;
      handleTextChange(editing.id, finalText);
      setEditing(null);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setEditing(null);
    }
  };

  const handleEditCancel = () => {
    setEditing(null);
  };

  useImperativeHandle(ref, () => ({
    addPostIt
  }));

  return (
    <>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {postIts.map(postit => (
            <PostItNote
              key={postit.id}
              id={postit.id}
              x={postit.x}
              y={postit.y}
              text={postit.text}
              type={postit.type}
              onDragEnd={handleDragEnd}
              onClick={handleClick}
            />
          ))}
        </Layer>
      </Stage>
      
      {editing && (
        <textarea
          ref={textareaRef}
          value={editing.text}
          onChange={(e) => setEditing({ ...editing, text: e.target.value })}
          onBlur={handleEditSubmit}
          onKeyDown={handleEditKeyDown}
          placeholder="Enter task description..."
          style={{
            position: 'absolute',
            left: editing.x + 12,
            top: editing.y + 50,
            width: 240 - 24,
            height: 160 - 62,
            backgroundColor: 'rgba(31, 27, 46, 0.95)',
            color: '#e5e7eb',
            border: '1px solid #8b5cf6',
            borderRadius: '4px',
            padding: '4px',
            fontSize: '13px',
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            resize: 'none',
            outline: 'none',
            zIndex: 1000,
            lineHeight: '1.4',
          }}
        />
      )}
      
      <FloatingAddButton onAddPostIt={addPostIt} />
    </>
  );
});

KonvaBoard.displayName = 'KonvaBoard';

export default KonvaBoard;