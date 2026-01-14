# ☭ Marxism-Leninism Puzzle Game

An asymmetric co-op puzzle game for 2 players to learn Marxism-Leninism philosophy, inspired by "We Were Here" and "Keep Talking and Nobody Explodes".

## 🎮 Game Concept

- **Player A (The Guide)**: Sees ONLY the "Theory" (Definitions, Hints, Questions). They CANNOT interact with the answers.
- **Player B (The Agent)**: Sees ONLY the "Practice" (Images, Symbols, Action Buttons). They CANNOT see the questions.
- **Core Mechanic**: Player A must verbally communicate the theory to Player B. Player B must interpret and click the correct image/button.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Navigate to the game directory:

   ```bash
   cd marxism-puzzle-game
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open **TWO browser windows** and navigate to:

   ```
   http://localhost:3000
   ```

5. Click "JOIN GAME" in both windows - the first player becomes The Guide, the second becomes The Agent.

## 🎯 Level 1: Worker & Farmer Alliance

**Theme**: "Liên minh Công - Nông" (Worker & Farmer Alliance)

### The Guide sees:

- **Target**: Find the symbol of the Worker and Farmer alliance
- **Hint**: Worker = Hammer, Farmer = Sickle

### The Agent sees:

- 4 symbol options to choose from
- Must listen to The Guide to select the correct one

### Symbols:

- ☭ Hammer & Sickle (Correct!)
- 🔨📖 Hammer & Book
- 🌾🔍 Sickle & Magnifying Glass
- 🪙⚖️ Coin & Scale

## 🛠 Tech Stack

- **Backend**: Node.js + Express + Socket.io
- **Frontend**: HTML5 + Tailwind CSS (via CDN)
- **Real-time**: Socket.io rooms for player pairing

## 📁 Project Structure

```
marxism-puzzle-game/
├── server.js           # Node.js server with Socket.io
├── package.json        # Dependencies
├── README.md           # This file
└── public/
    └── index.html      # Game UI (both roles)
```

## 🎨 Design

- Dark theme with Soviet Red (#CC0000) and Gold (#FFD700) color palette
- Responsive design for desktop and mobile
- Real-time chat between players
- Visual feedback (green flash for correct, red flash for wrong)

## 🔧 Adding More Levels

To add new levels, edit the `levels` object in `server.js`:

```javascript
const levels = {
  1: {
    /* existing level */
  },
  2: {
    theme: 'Your Theme',
    themeVi: 'Vietnamese Translation',
    guideInfo: {
      target: 'What the guide should communicate',
      hint: 'Helpful hint',
      additionalInfo: 'Extra context',
    },
    agentOptions: [
      { id: 'option1', icon: '🔥', label: 'Option 1', correct: true },
      { id: 'option2', icon: '💧', label: 'Option 2', correct: false },
      // ... more options
    ],
    correctMessage: 'Success message',
    wrongMessage: 'Failure message',
    explanation: 'Educational explanation',
  },
};
```

## 📜 License

MIT License

---

**"Workers of the world, unite!"** ☭
