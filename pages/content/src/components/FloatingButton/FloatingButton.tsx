import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSidebarState } from '@src/hooks';
import { Icon } from '../sidebar/ui';
import { cn } from '@src/lib/utils';

export const FloatingButton: React.FC = () => {
  const { toggleSidebar, isVisible } = useSidebarState();
  const [position, setPosition] = useState({ x: window.innerWidth - 60, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  // Handle window resize to keep button on screen
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 60),
        y: Math.min(prev.y, window.innerHeight - 60),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 50, dragRef.current.initialX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 50, dragRef.current.initialY + dy)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Don't show if sidebar is visible (optional, usually kept for toggling back)
  // if (isVisible) return null;

  return (
    <div
      className={cn(
        'fixed z-[10000] cursor-pointer transition-transform hover:scale-110 active:scale-95',
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
      )}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onClick={e => {
        // Prevent click if dragging occurred
        if (!dragRef.current) {
          // Simplified check, ideally check distance moved
          toggleSidebar();
        }
      }}>
      <div
        className={cn(
          'w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors border-2',
          isVisible
            ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
            : 'bg-blue-600 text-white border-transparent',
        )}>
        <Icon name={isVisible ? 'x' : 'menu'} size="lg" />
      </div>
    </div>
  );
};
