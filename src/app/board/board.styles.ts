import { CSSProperties } from 'react';

interface BoardStyles {
  board: CSSProperties;
  buttonContainer: CSSProperties;
}

export const boardStyles: BoardStyles = {
  board: {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    position: 'fixed',
    top: 0,
    left: 0,
    background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #2d1b69 100%)',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    position: 'absolute',
    marginTop: '10px',
    marginLeft: '10px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};