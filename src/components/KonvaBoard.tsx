"use client";

import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import PostItNote from '@/components/PostItNote/PostItNote';
import FloatingAddButton from '@/components/FloatingAddButton';
import Loader from '@/components/Loader';

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

interface DrawingLine {
  points: number[];
  id: string;
}

export interface KonvaBoardRef {
  addPostIt: (type?: TaskType) => void;
  toggleSketchMode: () => void;
  saveBoard: () => Promise<boolean>;
  clearBoard: () => void;
}

const KonvaBoard = forwardRef<KonvaBoardRef>((props, ref) => {
  const [postIts, setPostIts] = useState<PostItData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [isSketchMode, setIsSketchMode] = useState(false);
  const [drawingLines, setDrawingLines] = useState<DrawingLine[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<DrawingLine | null>(null);
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

  const toggleSketchMode = () => {
    setIsSketchMode(!isSketchMode);
    if (editing) {
      setEditing(null); // Close any open editing when entering sketch mode
    }
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (!isSketchMode) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    
    const newLine: DrawingLine = {
      id: `line-${Date.now()}`,
      points: [pos.x, pos.y]
    };
    
    setIsDrawing(true);
    setCurrentLine(newLine);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isSketchMode || !isDrawing || !currentLine) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    const point = stage.getPointerPosition();
    if (!point) return;
    
    const updatedLine = {
      ...currentLine,
      points: [...currentLine.points, point.x, point.y]
    };
    
    setCurrentLine(updatedLine);
  };

  const handleMouseUp = () => {
    if (!isSketchMode || !isDrawing || !currentLine) return;
    
    setDrawingLines(prev => [...prev, currentLine]);
    setCurrentLine(null);
    setIsDrawing(false);
  };

  // Load board state on mount
  useEffect(() => {
    loadBoard();
  }, []);

  const loadBoard = async () => {
    try {
      const response = await fetch('/api/board');
      if (response.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = '/login';
        return;
      }
      if (response.ok) {
        const boardState = await response.json();
        if (boardState.postIts && boardState.postIts.length > 0) {
          setPostIts(boardState.postIts);
        } else {
          // Set default post-it if no saved data
          setPostIts([{ id: 'default', x: 250, y: 180, text: 'Task description...', type: 'todo' }]);
        }
        if (boardState.drawingLines) {
          setDrawingLines(boardState.drawingLines);
        }
      } else {
        // Set default post-it on load error
        setPostIts([{ id: 'default', x: 250, y: 180, text: 'Task description...', type: 'todo' }]);
      }
    } catch (error) {
      console.error('Error loading board:', error);
      // Set default post-it on load error
      setPostIts([{ id: 'default', x: 250, y: 180, text: 'Task description...', type: 'todo' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBoard = async (): Promise<boolean> => {
    try {
      const boardData = {
        postIts,
        drawingLines
      };

      const response = await fetch('/api/board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(boardData),
      });

      if (response.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = '/login';
        return false;
      }
      if (response.ok) {
        const result = await response.json();
        console.log('Board saved successfully:', result.timestamp);
        return true;
      } else {
        const error = await response.json();
        console.error('Failed to save board:', error.error);
        return false;
      }
    } catch (error) {
      console.error('Error saving board:', error);
      return false;
    }
  };

  const clearBoard = () => {
    setPostIts([]);
    setDrawingLines([]);
    setEditing(null);
  };

  useImperativeHandle(ref, () => ({
    addPostIt,
    toggleSketchMode,
    saveBoard,
    clearBoard
  }));

  if (isLoading) {
    return <Loader message="Loading board data..." />;
  }

  return (
    <>
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        style={{ cursor: isSketchMode ? 'crosshair' : 'default' }}
      >
        {/* Drawing layer - behind post-its */}
        <Layer>
          {drawingLines.map(line => (
            <Line
              key={line.id}
              points={line.points}
              stroke="white"
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {currentLine && (
            <Line
              points={currentLine.points}
              stroke="white"
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </Layer>
        
        {/* Post-its layer - in front of drawings */}
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
              onClick={isSketchMode ? undefined : handleClick}
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