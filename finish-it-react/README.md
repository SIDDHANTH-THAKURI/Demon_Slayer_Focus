# 🗾 Demon Slayer Focus

<div align="center">

![Demon Slayer Focus](https://img.shields.io/badge/Demon%20Slayer-Focus-red?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5+-purple?style=for-the-badge&logo=vite)

**Master your focus through the breathing techniques of the Demon Slayer Corps**

*A beautifully crafted Pomodoro timer inspired by the anime Demon Slayer (Kimetsu no Yaiba)*

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🎨 Screenshots](#screenshots)

</div>

---

## ✨ Features

### 🌊 **12 Breathing Techniques**
Choose from all the iconic breathing styles from the series:
- **水 Water Breathing** - Fluid and adaptable focus
- **炎 Flame Breathing** - Passionate and intense concentration  
- **雷 Thunder Breathing** - Swift and decisive action
- **蟲 Insect Breathing** - Graceful and precise movements
- **岩 Stone Breathing** - Steadfast and unbreakable endurance
- **風 Wind Breathing** - Free and untamed energy
- **霞 Mist Breathing** - Elusive and mysterious flow
- **蛇 Serpent Breathing** - Flexible and cunning approach
- **花 Flower Breathing** - Beautiful and graceful strength
- **音 Sound Breathing** - Explosive and rhythmic power
- **恋 Love Breathing** - Passionate and flexible focus
- **日 Sun Breathing** - The original and most powerful technique

### 🎯 **Smart Task Management**
- **Japanese Scroll Design** - Tasks displayed as traditional scrolls
- **Technique-Specific Themes** - Each breathing style has unique colors and patterns
- **Mastery Levels** - Track your progress with each technique
- **Breathing Patterns** - Visual breathing guides (4-7-8, etc.)

### 🏆 **Demon Slayer Corps Ranking System**
Progress through the official ranks:
- 癸 **Mizunoto** (Lowest)
- 壬 **Mizunoe** 
- 辛 **Kanoto**
- 庚 **Kanoe**
- 己 **Tsuchinoto**
- 戊 **Tsuchinoe**
- 丁 **Hinoto**
- 丙 **Hinoe**
- 乙 **Kinoto**
- 甲 **Kinoe**
- 柱 **Hashira** (Highest)

### 🎨 **Beautiful Japanese Aesthetics**
- **Traditional Patterns** - Asanoha, Seigaiha, and Hemp Leaf designs
- **Tsuba-Style Timer** - Progress rings inspired by sword guards
- **Particle Effects** - Technique-specific animations (water drops, flame sparks, etc.)
- **Seasonal Backgrounds** - Dynamic backgrounds with floating elements
- **Japanese Typography** - Authentic kanji and traditional styling

### 🧘 **Focus Enhancement**
- **Breathing Ring** - Visual breathing rhythm guide
- **Focus Mode** - Distraction-free full-screen experience
- **Technique Mastery** - Track your proficiency with each style
- **Achievement System** - Unlock milestones in your journey

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/demon-slayer-focus.git

# Navigate to project directory
cd demon-slayer-focus

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

---

## 🎮 How to Use

### 1. **Choose Your Breathing Technique**
Select from 12 different breathing styles, each with unique:
- Color schemes and gradients
- Traditional Japanese patterns
- Breathing rhythm patterns
- Visual effects and animations

### 2. **Create Your Mission**
- Enter your task description
- Set focus duration (default: 25 minutes)
- Click "Begin Training" to start

### 3. **Focus with Breathing**
- Watch the Tsuba-style timer count down
- Follow the breathing pattern guide
- Use Focus Mode for distraction-free experience

### 4. **Track Your Progress**
- Earn mastery points for completed tasks
- Advance through Demon Slayer Corps ranks
- View detailed statistics for each technique

---

## 🎨 Screenshots

<div align="center">

### Main Interface
*Beautiful Japanese-inspired design with technique selection*

### Task Cards
*Traditional scroll-style task cards with technique themes*

### Focus Mode
*Distraction-free experience with breathing guides*

### Stats Dashboard
*Track your progress through the Demon Slayer Corps ranks*

</div>

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + Custom CSS
- **Animations**: CSS Animations + Particle Systems
- **State Management**: React Hooks
- **Icons**: Heroicons + Custom SVG

---

## 🎯 Key Components

### Core Components
- `App.tsx` - Main application logic and state management
- `TaskCard.tsx` - Japanese scroll-style task display
- `BreathingRing.tsx` - Tsuba-inspired timer with breathing guides
- `TechniqueSelector.tsx` - Visual technique selection grid

### Visual Components  
- `PatternLibrary.tsx` - Traditional Japanese pattern system
- `ParticleSystem.tsx` - Technique-specific particle effects
- `BackgroundLayer.tsx` - Dynamic seasonal backgrounds
- `StatsRankDashboard.tsx` - Demon Slayer Corps ranking system

### Configuration
- `techniques.ts` - All 12 breathing techniques with themes
- `types.ts` - TypeScript interfaces and types

---

## 🌸 Breathing Techniques Guide

Each technique offers unique benefits:

| Technique | Kanji | Pattern | Best For |
|-----------|-------|---------|----------|
| Water | 水 | 4-2-6 | Adaptable tasks |
| Flame | 炎 | 3-1-4 | High-energy work |
| Thunder | 雷 | 2-1-3 | Quick bursts |
| Wind | 風 | 4-1-5 | Creative flow |
| Stone | 岩 | 6-4-8 | Long endurance |
| Mist | 霞 | 5-3-7 | Deep focus |

---

## 🏆 Achievement System

Unlock achievements as you progress:
- **First Steps** - Complete your first task
- **Technique Master** - Master all breathing techniques  
- **Hashira** - Reach the highest rank
- **Focused Warrior** - Complete 100 tasks
- **Breathing Expert** - Use all 12 techniques

---

## 🎨 Customization

### Adding New Techniques
1. Add technique to `BreathingTechnique` type in `types.ts`
2. Define theme in `TECHNIQUE_THEMES` in `techniques.ts`
3. Add patterns to `PatternLibrary.tsx`
4. Create particle effects in `ParticleSystem.tsx`

### Custom Patterns
Create new traditional Japanese patterns by extending the `PatternLibrary` component with SVG definitions.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Koyoharu Gotouge** - Creator of Demon Slayer (Kimetsu no Yaiba)
- **Traditional Japanese Art** - Inspiration for patterns and aesthetics
- **Pomodoro Technique** - Time management methodology by Francesco Cirillo
- **React Community** - For the amazing ecosystem and tools

---

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/demon-slayer-focus/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/demon-slayer-focus/discussions)
- 📧 **Contact**: your.email@example.com

---

<div align="center">

**Made with ❤️ and ⚔️ by [Your Name]**

*"The blade that cuts demons is forged through focus and discipline"*

[![GitHub stars](https://img.shields.io/github/stars/yourusername/demon-slayer-focus?style=social)](https://github.com/yourusername/demon-slayer-focus)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/demon-slayer-focus?style=social)](https://github.com/yourusername/demon-slayer-focus)

</div>