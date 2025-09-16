import React, { useEffect, useState } from 'react';
import { BreathingTechnique } from '../types';
import { getTechniqueTheme } from '../config/techniques';

interface RingProps {
  remainingTime: number;
  initialMinutes: number;
  status: 'pending' | 'active' | 'done' | 'failed';
  technique: BreathingTechnique;
  isBreathing?: boolean;
}

const BreathingRing: React.FC<RingProps> = ({ 
  remainingTime, 
  initialMinutes, 
  status, 
  technique,
  isBreathing = false 
}) => {
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingProgress, setBreathingProgress] = useState(0);
  
  const totalTime = initialMinutes * 60 * 1000;
  const progress = Math.max(0, Math.min(1, remainingTime / totalTime));
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  
  const techniqueTheme = getTechniqueTheme(technique);
  const breathingPattern = techniqueTheme.effects.breathingPattern;

  // Breathing animation logic
  useEffect(() => {
    if (!isBreathing || status !== 'active') return;

    const totalCycleTime = (breathingPattern.inhale + breathingPattern.hold + breathingPattern.exhale) * 1000;
    const inhaleTime = breathingPattern.inhale * 1000;
    const holdTime = breathingPattern.hold * 1000;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const cyclePosition = now % totalCycleTime;
      
      if (cyclePosition < inhaleTime) {
        setBreathingPhase('inhale');
        setBreathingProgress(cyclePosition / inhaleTime);
      } else if (cyclePosition < inhaleTime + holdTime) {
        setBreathingPhase('hold');
        setBreathingProgress(1);
      } else {
        setBreathingPhase('exhale');
        setBreathingProgress(1 - ((cyclePosition - inhaleTime - holdTime) / (breathingPattern.exhale * 1000)));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isBreathing, status, breathingPattern]);

  const getColors = () => {
    switch (status) {
      case 'failed':
        return {
          ring: '#f56565',
          background: '#fed7d7',
          text: '#c53030',
          glow: '#f56565'
        };
      case 'done':
        return {
          ring: '#48bb78',
          background: '#c6f6d5',
          text: '#2f855a',
          glow: '#48bb78'
        };
      case 'pending':
        return {
          ring: techniqueTheme.colors.primary,
          background: techniqueTheme.colors.background,
          text: techniqueTheme.colors.text,
          glow: techniqueTheme.colors.primary
        };
      default:
        return {
          ring: techniqueTheme.colors.primary,
          background: techniqueTheme.colors.background,
          text: techniqueTheme.colors.text,
          glow: techniqueTheme.colors.primary
        };
    }
  };

  const colors = getColors();
  const seconds = Math.ceil(remainingTime / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const getStatusDisplay = () => {
    switch (status) {
      case 'done': return '✨';
      case 'failed': return '💫';
      case 'pending': return techniqueTheme.kanji;
      default: return display;
    }
  };

  const getBreathingInstruction = () => {
    if (!isBreathing || status !== 'active') return null;
    
    switch (breathingPhase) {
      case 'inhale': return 'Inhale';
      case 'hold': return 'Hold';
      case 'exhale': return 'Exhale';
    }
  };

  const renderTsubaPattern = () => {
    const tsubaStyle = techniqueTheme.tsuba.style;
    const innerRadius = 45;
    
    switch (tsubaStyle) {
      case 'circular-waves':
        return (
          <g className="tsuba-pattern">
            {[35, 40, 45].map((r, i) => (
              <circle
                key={i}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={colors.ring}
                strokeWidth="0.5"
                opacity={0.3 - i * 0.1}
              />
            ))}
          </g>
        );
      
      case 'flame-guard':
        return (
          <g className="tsuba-pattern">
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45) * (Math.PI / 180);
              const x1 = 70 + Math.cos(angle) * 35;
              const y1 = 70 + Math.sin(angle) * 35;
              const x2 = 70 + Math.cos(angle) * 45;
              const y2 = 70 + Math.sin(angle) * 45;
              
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} Q ${70 + Math.cos(angle + 0.2) * 40} ${70 + Math.sin(angle + 0.2) * 40} ${x2} ${y2}`}
                  fill="none"
                  stroke={colors.ring}
                  strokeWidth="1"
                  opacity={0.4}
                />
              );
            })}
          </g>
        );
      
      default:
        return (
          <g className="tsuba-pattern">
            <circle
              cx="70"
              cy="70"
              r={innerRadius}
              fill="none"
              stroke={colors.ring}
              strokeWidth="1"
              opacity={0.2}
            />
          </g>
        );
    }
  };

  const breathingScale = isBreathing && status === 'active' 
    ? 1 + (breathingProgress * 0.1) 
    : 1;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Technique-specific background glow */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 blur-2xl transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${colors.glow}60 0%, transparent 70%)`,
          transform: `scale(${breathingScale})`,
        }}
      />
      
      {/* Main SVG with tsuba styling */}
      <svg 
        className="w-full h-full transform -rotate-90 transition-transform duration-300" 
        viewBox="0 0 140 140"
        style={{ transform: `rotate(-90deg) scale(${breathingScale})` }}
      >
        {/* Outer tsuba ring */}
        <circle
          cx="70"
          cy="70"
          r="65"
          fill="none"
          stroke={colors.ring}
          strokeWidth="2"
          opacity={0.3}
          className="tsuba-outer"
        />
        
        {/* Background track */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={colors.background}
          strokeWidth="6"
          fill="transparent"
          className="opacity-30"
        />
        
        {/* Progress circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={colors.ring}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${colors.ring}80)`,
          }}
        />
        
        {/* Tsuba decorative pattern */}
        {renderTsubaPattern()}
        
        {/* Breathing rhythm indicators */}
        {isBreathing && status === 'active' && (
          <g className="breathing-indicators">
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const baseRadius = 75;
              const pulseRadius = baseRadius + (breathingProgress * 5);
              const x = 70 + Math.cos(angle) * pulseRadius;
              const y = 70 + Math.sin(angle) * pulseRadius;
              
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill={colors.ring}
                  opacity={0.6}
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              );
            })}
          </g>
        )}
        
        {/* Technique-specific particle effects */}
        {status === 'active' && (
          <g className="technique-particles">
            {technique === 'water' && (
              <>
                <circle cx="85" cy="55" r="2" fill={colors.ring} opacity={0.4} className="animate-bounce" />
                <circle cx="55" cy="85" r="1.5" fill={colors.ring} opacity={0.3} className="animate-bounce" style={{animationDelay: '0.5s'}} />
              </>
            )}
            {technique === 'flame' && (
              <>
                <path d="M85 55 Q87 50 85 45 Q83 50 85 55" fill={colors.ring} opacity={0.5} className="animate-pulse" />
                <path d="M55 85 Q57 80 55 75 Q53 80 55 85" fill={colors.ring} opacity={0.4} className="animate-pulse" style={{animationDelay: '0.3s'}} />
              </>
            )}
          </g>
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div 
          className="text-2xl font-black text-center leading-tight mb-1"
          style={{ color: colors.text }}
        >
          {getStatusDisplay()}
        </div>
        
        {/* Breathing instruction */}
        {getBreathingInstruction() && (
          <div 
            className="text-xs font-medium opacity-70 mb-1"
            style={{ color: colors.text }}
          >
            {getBreathingInstruction()}
          </div>
        )}
        
        {status === 'active' && !isBreathing && (
          <div className="text-xs text-gray-500 font-semibold">
            {Math.round(progress * 100)}% complete
          </div>
        )}
        
        {status === 'pending' && (
          <div className="text-xs text-gray-500 font-semibold">
            {techniqueTheme.name}
          </div>
        )}
      </div>
      
      {/* Success celebration effects */}
      {status === 'done' && (
        <>
          <div className="absolute inset-0 rounded-full border-4 border-green-400 opacity-50 animate-ping" />
          <div className="absolute inset-0 rounded-full border-2 border-yellow-300 opacity-30 animate-ping" style={{animationDelay: '0.5s'}} />
        </>
      )}
    </div>
  );
};

export default BreathingRing;