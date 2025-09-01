"use client"; 
import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { boardStyles } from "./board.styles";
import dynamic from 'next/dynamic';
import type { KonvaBoardRef } from '@/components/KonvaBoard';

const KonvaBoard = dynamic(() => import('@/components/KonvaBoard'), {
  ssr: false,
});

export default function Board() {
  const konvaBoardRef = useRef<KonvaBoardRef>(null);
  const [isSketchMode, setIsSketchMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSketchMode = () => {
    konvaBoardRef.current?.toggleSketchMode();
    setIsSketchMode(!isSketchMode);
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const success = await konvaBoardRef.current?.saveBoard();
      if (success) {
        console.log('Board saved to PostgreSQL successfully!');
        // You could add a toast notification here
      } else {
        console.error('Failed to save board to PostgreSQL');
        // You could add error notification here
      }
    } catch (error) {
      console.error('Error saving board:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={boardStyles.board}>
      <div style={{...boardStyles.buttonContainer, zIndex: 1000}}>
        <Button 
          buttonType="SketchMode" 
          onClick={handleSketchMode}
          variant={isSketchMode ? "secondary" : "default"}
          style={isSketchMode ? { 
            backgroundColor: '#10b981', 
            borderColor: '#059669',
            color: 'white'
          } : undefined}
        />
        <Button 
          buttonType="Save" 
          onClick={handleSave}
          disabled={isSaving}
          style={isSaving ? { opacity: 0.6 } : undefined}
        />
      </div>
      <div style={{position: 'absolute', top: 0, left: 0, zIndex: 1}}>
        <KonvaBoard ref={konvaBoardRef} />
      </div>
    </div>
  );
}
