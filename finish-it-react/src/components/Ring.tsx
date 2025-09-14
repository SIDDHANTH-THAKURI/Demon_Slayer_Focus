import React from 'react';

interface RingProps {
  remainingTime: number;
  initialMinutes: number;
  status: 'pending' | 'active' | 'done' | 'failed';
}

const Ring: React.FC<RingProps> = ({ remainingTime, initialMinutes, status }) => {
  const totalTime = initialMinutes * 60 * 1000;
  const progress = Math.max(0, Math.min(1, remainingTime / totalTime));
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const getColors = () => {
    switch (status) {
      case 'failed':
        return {
          ring: '#f56565',
          background: '#fed7d7',
          text: '#c53030'
        };
      case 'done':
        return {
          ring: '#48bb78',
          background: '#c6f6d5',
          text: '#2f855a'
        };
      case 'pending':
        return {
          ring: '#a8edea',
          background: '#e6fffa',
          text: '#319795'
        };
      default:
        // Active - color based on remaining time
        if (progress > 0.6) {
          return {
            ring: '#667eea',
            background: '#e6f3ff',
            text: '#4c51bf'
          };
        } else if (progress > 0.3) {
          return {
            ring: '#ed8936',
            background: '#fef5e7',
            text: '#c05621'
          };
        } else {
          return {
            ring: '#f56565',
            background: '#fed7d7',
            text: '#c53030'
          };
        }
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
      case 'pending': return '🌸';
      default: return display;
    }
  };

  const getProgressPercentage = () => {
    return Math.round(progress * 100);
  };

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Soft background glow */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 blur-xl"
        style={{
          background: `radial-gradient(circle, ${colors.ring}40 0%, transparent 70%)`,
        }}
      />
      
      {/* Main SVG */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
        {/* Background track */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={colors.background}
          strokeWidth="8"
          fill="transparent"
          className="opacity-50"
        />
        
        {/* Progress circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={colors.ring}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{
            filter: `drop-shadow(0 0 12px ${colors.ring}60)`,
          }}
        />
        
        {/* Inner decorative elements */}
        <circle
          cx="70"
          cy="70"
          r="35"
          stroke={colors.ring}
          strokeWidth="1"
          fill="transparent"
          className="opacity-20"
        />
        
        {/* Floating dots for active state */}
        {status === 'active' && (
          <>
            <circle cx="70" cy="10" r="3" fill={colors.ring} className="opacity-60 animate-pulse" />
            <circle cx="130" cy="70" r="3" fill={colors.ring} className="opacity-60 animate-pulse" style={{animationDelay: '0.5s'}} />
            <circle cx="70" cy="130" r="3" fill={colors.ring} className="opacity-60 animate-pulse" style={{animationDelay: '1s'}} />
            <circle cx="10" cy="70" r="3" fill={colors.ring} className="opacity-60 animate-pulse" style={{animationDelay: '1.5s'}} />
          </>
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div 
          className="text-3xl font-black text-center leading-tight"
          style={{ color: colors.text }}
        >
          {getStatusDisplay()}
        </div>
        {status === 'active' && (
          <div className="text-xs text-gray-500 mt-2 font-semibold">
            {getProgressPercentage()}% flow
          </div>
        )}
        {status === 'pending' && (
          <div className="text-xs text-gray-500 mt-2 font-semibold">
            Ready to bloom
          </div>
        )}
      </div>
      
      {/* Success celebration ring */}
      {status === 'done' && (
        <div className="absolute inset-0 rounded-full border-4 border-green-400 opacity-50 animate-ping" />
      )}
      
      {/* Soft corner accents */}
      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 opacity-40"></div>
      <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br from-blue-300 to-cyan-400 opacity-40"></div>
      <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 opacity-40"></div>
      <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-gradient-to-br from-green-300 to-teal-400 opacity-40"></div>
    </div>
  );
};

export default Ring;