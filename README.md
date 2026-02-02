# 🎮 Project 1848 - Educational Puzzle Game

An interactive multiplayer educational game about **Scientific Socialism** and **Marxist Philosophy**. Players work together through a series of puzzle mini-games to learn historical concepts in an engaging way.

---

## 🚀 Features

- 🎮 **7 Interactive Mini-Games** - Morse code decoding, cipher puzzles, and more
- 👥 **Multiplayer Support** - Real-time 2-player cooperative gameplay via Socket.IO
- 🏛️ **3D Mirror Hall Gallery** - Immersive Three.js environment for exploration
- 📚 **Educational Content** - Learn about Scientific Socialism through gameplay
- 🏆 **Leaderboard System** - Track scores and compete with other teams
- ⚛️ Built with React 19
- 🎨 Styled using Tailwind CSS v4
- 🎬 Smooth animations powered by GSAP
- 📱 Fully responsive layout
- ⚡ Optimized for performance with Vite

---

## 🎯 Game Overview

### Mini-Games

| Game         | Description                                               |
| ------------ | --------------------------------------------------------- |
| **Game 1**   | Player A & B cooperative puzzle                           |
| **Game 2**   | Team-based challenge                                      |
| **Game 3**   | Morse Code Decoding - Listen to signals and arrange words |
| **Game 4-7** | Progressive difficulty puzzles                            |

### Game 3: Morse Code Challenge

- 🔊 Listen to Morse code signals (dots & dashes)
- 💡 Watch the light flash patterns
- 📝 Decode words and arrange them in correct order
- ⏱️ Beat the timer to score points

---

## 🛠️ Tech Stack

### Frontend

| Technology           | Version | Purpose                 |
| -------------------- | ------- | ----------------------- |
| **React**            | 19.2.3  | UI Framework            |
| **Tailwind CSS**     | 4.1.18  | Styling                 |
| **GSAP**             | 3.14.2  | Animations              |
| **Three.js**         | 0.155.0 | 3D Graphics             |
| **React Router**     | 7.12.0  | Navigation              |
| **Socket.IO Client** | 4.8.3   | Real-time Communication |

### Build Tools

| Technology   | Version | Purpose                 |
| ------------ | ------- | ----------------------- |
| **Vite**     | 7.3.1   | Build Tool & Dev Server |
| **ESLint**   | 9.39.2  | Linting                 |
| **Prettier** | 3.7.4   | Code Formatting         |
| **Husky**    | 9.1.7   | Git Hooks               |

### Additional Libraries

- **canvas-confetti** - Celebration effects
- **react-icons** - Icon library
- **nipplejs** - Mobile joystick controls
- **mitt** - Event emitter

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── games/          # Mini-game components (1-7)
│   ├── navbars/        # Navigation components
│   └── sections/       # Page sections
├── pages/              # Route pages
│   ├── game1/          # Player A & B views
│   ├── game2/          # Player A & B views
│   ├── game3/          # Morse code game
│   ├── Leaderboard.jsx
│   ├── Lobby.jsx
│   └── MirrorHall.jsx
├── gallery/            # 3D Mirror Hall experience
│   ├── character/      # Character controls
│   ├── environment/    # 3D environment
│   └── world/          # World setup
├── config/             # Game configuration
└── data/               # Static data
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd project-1848

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

---

## 🎮 How to Play

1. **Create/Join a Room** - Enter lobby and create or join a game room
2. **Choose Role** - Player A or Player B
3. **Complete Mini-Games** - Work together through all 7 games
4. **Compete** - See your team's score on the leaderboard

---

## 📝 License

This project is for educational purposes.

## 👥 Contributors

Thanks to all the amazing people who have contributed to this project! ✨

<div align="center">

<a href="https://github.com/AnPhuoc2410/Project-1848/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=AnPhuoc2410/Project-1848" />
</a>

<p align="center">
  Made with ❤️ for learning Scientific Socialism
</p>
