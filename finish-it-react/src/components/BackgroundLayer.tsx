import React, { useEffect, useState } from 'react';
import { BreathingTechnique } from '../types';
import { getTechniqueTheme } from '../config/techniques';

interface BackgroundLayerProps {
  activeTechnique?: BreathingTechnique;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
}

const BackgroundLayer: React.FC<BackgroundLayerProps> = ({ 
  activeTechnique, 
  season = 'spring',
  timeOfDay = 'day' 
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  // Generate floating particles based on season and technique
  useEffect(() => {
    const particleCount = 20;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10,
      size: Math.random() * 0.5 + 0.5
    }));
    setParticles(newParticles);
  }, [season, activeTechnique]);

  const getSeasonalColors = () => {
    switch (season) {
      case 'spring':
        return {
          primary: '#fecaca', // Light pink
          secondary: '#fed7d7', // Lighter pink
          accent: '#fef2f2' // Very light pink
        };
      case 'summer':
        return {
          primary: '#bfdbfe', // Light blue
          secondary: '#dbeafe', // Lighter blue
          accent: '#eff6ff' // Very light blue
        };
      case 'autumn':
        return {
          primary: '#fed7aa', // Light orange
          secondary: '#fde68a', // Light yellow
          accent: '#fef3c7' // Very light yellow
        };
      case 'winter':
        return {
          primary: '#e5e7eb', // Light gray
          secondary: '#f3f4f6', // Lighter gray
          accent: '#f9fafb' // Very light gray
        };
    }
  };

  const getTimeOfDayGradient = () => {
    switch (timeOfDay) {
      case 'dawn':
        return 'linear-gradient(180deg, #fef3c7 0%, #fed7aa 50%, #fecaca 100%)';
      case 'day':
        return 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)';
      case 'dusk':
        return 'linear-gradient(180deg, #fed7aa 0%, #f59e0b 50%, #dc2626 100%)';
      case 'night':
        return 'linear-gradient(180deg, #1f2937 0%, #374151 50%, #4b5563 100%)';
    }
  };

  const getTechniqueParticleType = () => {
    if (!activeTechnique) return 'cherry-blossom';
    
    switch (activeTechnique) {
      case 'water': return 'water-droplet';
      case 'flame': return 'flame-spark';
      case 'thunder': return 'lightning-spark';
      case 'wind': return 'leaf';
      case 'flower': return 'petal';
      case 'mist': return 'mist-wisp';
      default: return 'cherry-blossom';
    }
  };

  const renderParticle = (particle: { id: number; x: number; y: number; delay: number; size: number }) => {
    const particleType = getTechniqueParticleType();
    const seasonalColors = getSeasonalColors();
    const techniqueTheme = activeTechnique ? getTechniqueTheme(activeTechnique) : null;
    
    const baseStyle = {
      position: 'absolute' as const,
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      animationDelay: `${particle.delay}s`,
      transform: `scale(${particle.size})`,
    };

    switch (particleType) {
      case 'cherry-blossom':
        return (
          <div
            key={particle.id}
            className="animate-float-gentle"
            style={baseStyle}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L14 8L20 6L16 12L22 14L16 16L20 18L14 16L12 22L10 16L4 18L8 12L2 10L8 8L4 6L10 8L12 2Z"
                fill={seasonalColors.primary}
                opacity="0.7"
              />
            </svg>
          </div>
        );

      case 'water-droplet':
        return (
          <div
            key={particle.id}
            className="animate-float-water"
            style={baseStyle}
          >
            <div
              className="w-2 h-3 rounded-full"
              style={{ 
                background: techniqueTheme?.colors.primary || '#3b82f6',
                opacity: 0.6
              }}
            />
          </div>
        );

      case 'flame-spark':
        return (
          <div
            key={particle.id}
            className="animate-flicker"
            style={baseStyle}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{ 
                background: techniqueTheme?.colors.gradient || 'linear-gradient(to top, #f59e0b, #dc2626)',
                opacity: 0.8
              }}
            />
          </div>
        );

      case 'leaf':
        return (
          <div
            key={particle.id}
            className="animate-float-leaf"
            style={baseStyle}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 15.5C2 15.5 2 16.75 3 16.75C3 16.75 3.75 16 5 16C6.25 16 7 16.75 7 16.75C7 16.75 7.75 16 9 16C10.25 16 11 16.75 11 16.75C11 16.75 11.75 16 13 16C14.25 16 15 16.75 15 16.75C15 16.75 15.75 16 17 16C18.25 16 19 16.75 19 16.75C19 16.75 19.75 16 21 16C21.25 16 21.5 16.05 21.71 16.13L22.58 14.24C21.25 11.1 20 9.5 17 8Z"
                fill={techniqueTheme?.colors.secondary || '#10b981'}
                opacity="0.6"
              />
            </svg>
          </div>
        );

      default:
        return (
          <div
            key={particle.id}
            className="animate-float-gentle"
            style={baseStyle}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ 
                background: seasonalColors.primary,
                opacity: 0.5
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -2 }}>
      {/* Base gradient background */}
      <div 
        className="absolute inset-0"
        style={{ background: getTimeOfDayGradient() }}
      />

      {/* Traditional Japanese architectural silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          {/* Pagoda silhouette */}
          <path
            d="M100 200 L100 120 L80 120 L80 100 L120 100 L120 120 L100 120 L100 80 L70 80 L70 60 L130 60 L130 80 L100 80 L100 40 L60 40 L60 20 L140 20 L140 40 L100 40"
            fill="currentColor"
            opacity="0.3"
          />
          
          {/* Mountain silhouette */}
          <path
            d="M200 200 L300 100 L400 150 L500 80 L600 120 L700 60 L800 100 L900 40 L1000 80 L1100 120 L1200 200"
            fill="currentColor"
            opacity="0.2"
          />
          
          {/* Temple roofline */}
          <path
            d="M800 200 L800 140 L750 140 L750 120 L850 120 L850 140 L800 140 L800 100 L720 100 L720 80 L880 80 L880 100 L800 100"
            fill="currentColor"
            opacity="0.25"
          />
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map(renderParticle)}
      </div>

      {/* Technique-specific atmospheric effects */}
      {activeTechnique && (
        <div className="absolute inset-0">
          {activeTechnique === 'mist' && (
            <div className="absolute inset-0 bg-gradient-radial from-gray-300 via-transparent to-transparent opacity-20 animate-pulse" />
          )}
          {activeTechnique === 'thunder' && (
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/3 w-1 h-32 bg-purple-400 opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
              <div className="absolute top-1/3 right-1/4 w-1 h-24 bg-yellow-400 opacity-40 animate-pulse" style={{ animationDelay: '4s' }} />
            </div>
          )}
          {activeTechnique === 'sun' && (
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-radial from-yellow-300 via-orange-400 to-transparent opacity-30 animate-pulse" />
          )}
        </div>
      )}

      {/* Seasonal overlay effects */}
      {season === 'winter' && (
        <div className="absolute inset-0">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={`snow-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BackgroundLayer;