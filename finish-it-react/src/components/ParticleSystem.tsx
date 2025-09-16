import React, { useEffect, useState, useCallback } from 'react';
import { BreathingTechnique, ParticleEffect } from '../types';
import { getTechniqueTheme } from '../config/techniques';

interface ParticleSystemProps {
  technique: BreathingTechnique;
  isActive: boolean;
  trigger?: 'completion' | 'start' | 'continuous';
  intensity?: 'low' | 'medium' | 'high';
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: string;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  technique,
  isActive,
  trigger = 'continuous',
  intensity = 'medium',
  onComplete
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [animationId, setAnimationId] = useState<number | null>(null);
  
  const techniqueTheme = getTechniqueTheme(technique);
  
  const getParticleCount = () => {
    const baseCount = {
      low: 10,
      medium: 25,
      high: 50
    }[intensity];
    
    return trigger === 'completion' ? baseCount * 2 : baseCount;
  };

  const createParticle = useCallback((centerX: number = 50, centerY: number = 50): Particle => {
    const spread = trigger === 'completion' ? 30 : 15;
    const angle = Math.random() * Math.PI * 2;
    const speed = trigger === 'completion' ? 2 + Math.random() * 3 : 0.5 + Math.random() * 1.5;
    
    return {
      id: Math.random(),
      x: centerX + (Math.random() - 0.5) * spread,
      y: centerY + (Math.random() - 0.5) * spread,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: trigger === 'completion' ? 120 : 180,
      size: 2 + Math.random() * 4,
      color: [techniqueTheme.colors.primary, techniqueTheme.colors.secondary, techniqueTheme.colors.accent][Math.floor(Math.random() * 3)],
      type: getTechniqueParticleType()
    };
  }, [technique, trigger, techniqueTheme]);

  const getTechniqueParticleType = () => {
    switch (technique) {
      case 'water': return 'droplet';
      case 'flame': return 'spark';
      case 'thunder': return 'bolt';
      case 'wind': return 'leaf';
      case 'flower': return 'petal';
      case 'insect': return 'butterfly';
      case 'stone': return 'debris';
      case 'mist': return 'wisp';
      case 'serpent': return 'scale';
      case 'sound': return 'wave';
      case 'love': return 'heart';
      case 'sun': return 'ray';
      default: return 'spark';
    }
  };

  const updateParticles = useCallback(() => {
    setParticles(prevParticles => {
      const updated = prevParticles.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1/particle.maxLife,
        vy: particle.vy + 0.02, // Gravity effect
        vx: particle.vx * 0.99 // Air resistance
      })).filter(particle => particle.life > 0 && particle.x > -10 && particle.x < 110 && particle.y < 110);

      // Add new particles for continuous effects
      if (isActive && trigger === 'continuous' && updated.length < getParticleCount()) {
        const newParticle = createParticle();
        updated.push(newParticle);
      }

      return updated;
    });
  }, [isActive, trigger, createParticle, getParticleCount]);

  // Animation loop
  useEffect(() => {
    if (isActive) {
      const animate = () => {
        updateParticles();
        const id = requestAnimationFrame(animate);
        setAnimationId(id);
      };
      animate();
    } else {
      if (animationId) {
        cancelAnimationFrame(animationId);
        setAnimationId(null);
      }
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, updateParticles]);

  // Initialize particles on trigger
  useEffect(() => {
    if (isActive) {
      const initialParticles = Array.from({ length: getParticleCount() }, () => createParticle());
      setParticles(initialParticles);

      // Auto-complete for burst effects
      if (trigger === 'completion') {
        setTimeout(() => {
          onComplete?.();
        }, 3000);
      }
    } else {
      setParticles([]);
    }
  }, [isActive, trigger, createParticle, getParticleCount, onComplete]);

  const renderParticle = (particle: Particle) => {
    const opacity = particle.life;
    const transform = `translate(${particle.x}%, ${particle.y}%) scale(${particle.size * particle.life})`;
    
    switch (particle.type) {
      case 'droplet':
        return (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              transform,
              opacity,
              transition: 'none'
            }}
          >
            <div
              className="w-2 h-3 rounded-full"
              style={{ 
                background: `linear-gradient(to bottom, ${particle.color}, ${particle.color}80)`,
                filter: 'blur(0.5px)'
              }}
            />
          </div>
        );

      case 'spark':
        return (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              transform,
              opacity,
              transition: 'none'
            }}
          >
            <div
              className="w-1 h-4 rounded-full animate-pulse"
              style={{ 
                background: `linear-gradient(to top, ${particle.color}, #fbbf24)`,
                boxShadow: `0 0 4px ${particle.color}`
              }}
            />
          </div>
        );

      case 'bolt':
        return (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              transform,
              opacity,
              transition: 'none'
            }}
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path
                d="M4 0 L2 6 L4 6 L3 12 L6 4 L4 4 L4 0"
                fill={particle.color}
                style={{ filter: `drop-shadow(0 0 2px ${particle.color})` }}
              />
            </svg>
          </div>
        );

      case 'petal':
        return (
          <div
            key={particle.id}
            className="absolute pointer-events-none animate-spin-slow"
            style={{
              transform,
              opacity,
              transition: 'none',
              animationDuration: '4s'
            }}
          >
            <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
              <ellipse cx="3" cy="4" rx="3" ry="4" fill={particle.color} opacity="0.8" />
            </svg>
          </div>
        );

      case 'heart':
        return (
          <div
            key={particle.id}
            className="absolute pointer-events-none animate-pulse"
            style={{
              transform,
              opacity,
              transition: 'none'
            }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill={particle.color}
              />
            </svg>
          </div>
        );

      case 'leaf':
        return (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              transform: `${transform} rotate(${particle.vx * 10}deg)`,
              opacity,
              transition: 'none'
            }}
          >
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
              <path
                d="M3 0 Q5 2 3 5 Q1 2 3 0 M3 5 L3 10"
                stroke={particle.color}
                strokeWidth="1"
                fill={particle.color}
                opacity="0.7"
              />
            </svg>
          </div>
        );

      default:
        return (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              transform,
              opacity,
              transition: 'none'
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: particle.color,
                boxShadow: `0 0 4px ${particle.color}60`
              }}
            />
          </div>
        );
    }
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(renderParticle)}
    </div>
  );
};

export default ParticleSystem;