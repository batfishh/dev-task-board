"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/board');
      } else {
        setError('Invalid password');
        setPassword('');
      }
    } catch (error) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f1b2e 0%, #2a1f3d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
    }}>
      <div style={{
        background: 'rgba(31, 27, 46, 0.9)',
        border: '1px solid #4c4556',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        minWidth: '320px'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={isLoading}
            autoFocus
            style={{
              background: 'rgba(76, 69, 86, 0.3)',
              border: error ? '2px solid #f87171' : '2px solid #8b5cf6',
              borderRadius: '8px',
              padding: '1rem',
              color: '#e5e7eb',
              fontSize: '16px',
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'all 0.2s ease',
              ...(isLoading && { opacity: 0.6 })
            }}
            onFocus={(e) => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = '#a78bfa';
              target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
            }}
            onBlur={(e) => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = error ? '#f87171' : '#8b5cf6';
              target.style.boxShadow = 'none';
            }}
          />
          
          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            style={{
              background: isLoading || !password.trim() 
                ? 'rgba(139, 92, 246, 0.3)' 
                : 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '1rem',
              color: isLoading || !password.trim() ? '#9ca3af' : 'white',
              fontSize: '16px',
              fontFamily: 'inherit',
              fontWeight: '600',
              cursor: isLoading || !password.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && password.trim()) {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-1px)';
                target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
            }}
          >
            {isLoading ? 'Checking...' : 'Enter'}
          </button>

          {error && (
            <div style={{
              color: '#f87171',
              fontSize: '14px',
              textAlign: 'center',
              marginTop: '-0.5rem'
            }}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}