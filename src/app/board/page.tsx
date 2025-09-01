"use client"; 
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { boardStyles } from "./board.styles";
import dynamic from 'next/dynamic';
import type { KonvaBoardRef } from '@/components/KonvaBoard';

const KonvaBoard = dynamic(() => import('@/components/KonvaBoard'), {
  ssr: false,
});

export default function Board() {
  const konvaBoardRef = useRef<KonvaBoardRef>(null);


  return (
    <div style={boardStyles.board}>
      <div style={{...boardStyles.buttonContainer, zIndex: 1000}}>
        <Button buttonType="SketchMode" />
        <Button buttonType="Save" />
      </div>
      <div style={{position: 'absolute', top: 0, left: 0, zIndex: 1}}>
        <KonvaBoard ref={konvaBoardRef} />
      </div>
    </div>
  );
}
