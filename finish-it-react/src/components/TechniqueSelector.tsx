import React, { useState } from 'react';
import { BreathingTechnique } from '../types';
import { getAllTechniques, getTechniqueTheme } from '../config/techniques';
import PatternLibrary from './PatternLibrary';

interface TechniqueSelectorProps {
  selectedTechnique: BreathingTechnique;
  onSelect: (technique: BreathingTechnique) => void;
  className?: string;
}

const TechniqueSelector: React.FC<TechniqueSelectorProps> = ({
  selectedTechnique,
  onSelect,
  className = ''
}) => {
  const [hoveredTechnique, setHoveredTechnique] = useState<BreathingTechnique | null>(null);
  const techniques = getAllTechniques();

  const renderTechniqueCard = (technique: { value: BreathingTechnique; label: string; kanji: string; description: string }) => {
    const theme = getTechniqueTheme(technique.value);
    const isSelected = selectedTechnique === technique.value;
    const isHovered = hoveredTechnique === technique.value;
    
    return (
      <div
        key={technique.value}
        className={`
          relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform
          ${isSelected ? 'scale-105 shadow-2xl' : 'hover:scale-102 shadow-lg'}
          ${isHovered ? 'shadow-xl' : ''}
        `}
        style={{
          background: theme.colors.gradient,
          border: isSelected ? `3px solid ${theme.colors.accent}` : '2px solid transparent'
        }}
        onClick={() => onSelect(technique.value)}
        onMouseEnter={() => setHoveredTechnique(technique.value)}
        onMouseLeave={() => setHoveredTechnique(null)}
      >
        {/* Background pattern */}
        <div className="absolute inset-0">
          <PatternLibrary
            pattern={theme.patterns.background}
            colors={[theme.colors.accent, theme.colors.secondary]}
            opacity={0.15}
          />
        </div>

        {/* Content */}
        <div className="relative p-6 text-center">
          {/* Kanji */}
          <div 
            className="text-4xl font-black mb-3 drop-shadow-lg"
            style={{ color: theme.colors.text }}
          >
            {technique.kanji}
          </div>

          {/* Technique name */}
          <h3 
            className="text-lg font-bold mb-2 drop-shadow-md"
            style={{ color: theme.colors.text }}
          >
            {technique.label}
          </h3>

          {/* Description */}
          <p 
            className="text-sm opacity-90 leading-relaxed mb-4"
            style={{ color: theme.colors.text }}
          >
            {technique.description}
          </p>

          {/* Breathing pattern indicator */}
          <div className="flex justify-center items-center space-x-2 mb-3">
            <div 
              className="text-xs font-medium opacity-80"
              style={{ color: theme.colors.text }}
            >
              {theme.effects.breathingPattern.inhale}-{theme.effects.breathingPattern.hold}-{theme.effects.breathingPattern.exhale}
            </div>
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-3 right-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.colors.accent }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}

          {/* Hover effect overlay */}
          {isHovered && !isSelected && (
            <div className="absolute inset-0 bg-white bg-opacity-10 rounded-2xl" />
          )}
        </div>

        {/* Animated border for selected technique */}
        {isSelected && (
          <div 
            className="absolute inset-0 rounded-2xl animate-pulse"
            style={{
              boxShadow: `0 0 20px ${theme.colors.primary}60, inset 0 0 20px ${theme.colors.accent}30`
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className={`technique-selector ${className}`}>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Choose Your Breathing Technique
        </h2>
        <p className="text-gray-600">
          Each technique offers unique benefits and breathing patterns
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {techniques.map(renderTechniqueCard)}
      </div>

      {/* Selected technique preview */}
      {selectedTechnique && (
        <div className="mt-8 p-6 rounded-2xl" style={{ 
          background: getTechniqueTheme(selectedTechnique).colors.background,
          border: `2px solid ${getTechniqueTheme(selectedTechnique).colors.primary}30`
        }}>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Selected: {getTechniqueTheme(selectedTechnique).name}
            </h3>
            <p className="text-gray-700 mb-4">
              {getTechniqueTheme(selectedTechnique).description}
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Breathing Pattern:</span>
                <span className="px-3 py-1 rounded-full bg-white bg-opacity-50">
                  {getTechniqueTheme(selectedTechnique).effects.breathingPattern.inhale}s inhale - 
                  {getTechniqueTheme(selectedTechnique).effects.breathingPattern.hold}s hold - 
                  {getTechniqueTheme(selectedTechnique).effects.breathingPattern.exhale}s exhale
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniqueSelector;