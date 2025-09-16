import React from 'react';
import { PatternType } from '../types';

interface PatternLibraryProps {
  pattern: PatternType;
  colors: string[];
  className?: string;
  opacity?: number;
}

const PatternLibrary: React.FC<PatternLibraryProps> = ({ 
  pattern, 
  colors, 
  className = '', 
  opacity = 0.1 
}) => {
  const patternId = `pattern-${pattern}-${Math.random().toString(36).substr(2, 9)}`;

  const renderPattern = () => {
    switch (pattern) {
      case 'asanoha':
        return (
          <defs>
            <pattern id={patternId} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <g fill={colors[0]} opacity={opacity}>
                <path d="M30 0 L45 15 L30 30 L15 15 Z" />
                <path d="M0 30 L15 45 L0 60 L-15 45 Z" />
                <path d="M60 30 L75 45 L60 60 L45 45 Z" />
              </g>
              <g fill="none" stroke={colors[1]} strokeWidth="1" opacity={opacity * 0.5}>
                <path d="M30 15 L30 0 M30 15 L45 15 M30 15 L15 15" />
                <path d="M15 45 L0 30 M15 45 L15 60 M15 45 L30 45" />
                <path d="M45 45 L60 30 M45 45 L45 60 M45 45 L30 45" />
              </g>
            </pattern>
          </defs>
        );

      case 'seigaiha':
        return (
          <defs>
            <pattern id={patternId} x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
              <g fill="none" stroke={colors[0]} strokeWidth="1.5" opacity={opacity}>
                <path d="M0 20 Q10 10 20 20 Q30 10 40 20" />
                <path d="M-10 20 Q0 10 10 20 Q20 10 30 20 Q40 10 50 20" />
              </g>
              <g fill="none" stroke={colors[1]} strokeWidth="1" opacity={opacity * 0.7}>
                <path d="M0 20 Q10 15 20 20 Q30 15 40 20" />
                <path d="M-10 20 Q0 15 10 20 Q20 15 30 20 Q40 15 50 20" />
              </g>
            </pattern>
          </defs>
        );

      case 'hemp-leaf':
        return (
          <defs>
            <pattern id={patternId} x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <g fill={colors[0]} opacity={opacity}>
                <path d="M25 5 L35 15 L25 25 L15 15 Z" />
                <path d="M25 30 L35 40 L25 50 L15 40 Z" />
                <path d="M0 17.5 L10 27.5 L0 37.5 L-10 27.5 Z" />
                <path d="M50 17.5 L60 27.5 L50 37.5 L40 27.5 Z" />
              </g>
              <g fill="none" stroke={colors[1]} strokeWidth="0.5" opacity={opacity * 0.8}>
                <line x1="25" y1="15" x2="25" y2="5" />
                <line x1="25" y1="40" x2="25" y2="30" />
                <line x1="10" y1="27.5" x2="0" y2="17.5" />
                <line x1="40" y1="27.5" x2="50" y2="17.5" />
              </g>
            </pattern>
          </defs>
        );

      case 'flame-pattern':
        return (
          <defs>
            <pattern id={patternId} x="0" y="0" width="30" height="40" patternUnits="userSpaceOnUse">
              <g fill={colors[0]} opacity={opacity}>
                <path d="M15 40 Q10 30 15 20 Q20 25 25 15 Q20 10 15 0 Q10 10 5 15 Q10 25 15 20 Q20 30 15 40" />
              </g>
              <g fill={colors[1]} opacity={opacity * 0.7}>
                <path d="M15 35 Q12 28 15 22 Q18 26 20 18 Q18 15 15 8 Q12 15 10 18 Q12 26 15 22 Q18 28 15 35" />
              </g>
            </pattern>
          </defs>
        );

      case 'lightning-pattern':
        return (
          <defs>
            <pattern id={patternId} x="0" y="0" width="25" height="40" patternUnits="userSpaceOnUse">
              <g fill={colors[0]} opacity={opacity}>
                <path d="M12.5 0 L8 15 L15 15 L10 40 L17 25 L12 25 L12.5 0" />
              </g>
              <g fill={colors[1]} opacity={opacity * 0.6}>
                <circle cx="5" cy="10" r="1" />
                <circle cx="20" cy="30" r="1" />
                <circle cx="3" cy="35" r="0.5" />
                <circle cx="22" cy="8" r="0.5" />
              </g>
            </pattern>
          </defs>
        );

      case 'butterfly-pattern':
        return (
          <defs>
            <pattern id={patternId} x="0" y="0" width="40" height="30" patternUnits="userSpaceOnUse">
              <g fill={colors[0]} opacity={opacity}>
                <path d="M20 15 Q15 10 10 15 Q15 20 20 15 Q25 10 30 15 Q25 20 20 15" />
                <circle cx="18" cy="13" r="1" />
                <circle cx="22" cy="13" r="1" />
              </g>
              <g fill={colors[1]} opacity={opacity * 0.5}>
                <path d="M20 15 Q17 12 15 15 Q17 18 20 15 Q23 12 25 15 Q23 18 20 15" />
              </g>
            </pattern>
          </defs>
        );

      case 'sakura-pattern':
        return (
          <defs>
            <pattern id={patternId} x="0" y="0" width="35" height="35" patternUnits="userSpaceOnUse">
              <g fill={colors[0]} opacity={opacity}>
                <path d="M17.5 17.5 L20 12 L22.5 17.5 L28 15 L22.5 17.5 L25 23 L17.5 17.5 L12 20 L17.5 17.5 L15 12 L17.5 17.5 L10 15 L17.5 17.5" />
              </g>
              <g fill={colors[1]} opacity={opacity * 0.7}>
                <circle cx="17.5" cy="17.5" r="2" />
              </g>
            </pattern>
          </defs>
        );

      default:
        return (
          <defs>
            <pattern id={patternId} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill={colors[0]} opacity={opacity} />
            </pattern>
          </defs>
        );
    }
  };

  return (
    <svg className={`absolute inset-0 w-full h-full ${className}`} style={{ zIndex: -1 }}>
      {renderPattern()}
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

export default PatternLibrary;