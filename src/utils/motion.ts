import { CSSProperties } from 'react';

/**
 * Nervel Entrance Motion Helper
 * Adheres strictly to the Design Specification:
 * - 100ms duration
 * - cubic-bezier(0.16, 1, 0.3, 1)
 * - 20px initial vertical offset to 0
 * - 33ms stagger (1/3 overlap)
 */
export function getStaggerStyle(index: number = 0): CSSProperties {
  return {
    animationDelay: `${index * 33}ms`,
    animationFillMode: 'both',
  };
}

export const NERVEL_ENTER_CLASS = 'animate-nervel-enter';
