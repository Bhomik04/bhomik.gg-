# Bhomik Goyal - Living Portfolio RPG 🎮

A real-time, **Cyberpunk 2077-inspired** portfolio website that functions as an RPG character sheet. Track skills, level up, and showcase your journey as a developer in style.

## ✨ Features

- **3D Avatar**: Interactive 3D character model with Cyberpunk lighting
- **Real-time Skill Tree**: Dynamic skill graph with locked/unlocked/mastered states
- **HUD Overlay**: Cyberpunk-style stats display with pentagon skill chart
- **Admin Dashboard**: Manage skills, quests, and activity logs
- **Live Updates**: Real-time Firebase integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Firebase account (for backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/Bhomik04/bhomik.gg-.git
cd bhomik.gg-

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Firebase credentials to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **3D Graphics**: React Three Fiber + Three.js
- **Backend**: Firebase (Firestore + Auth)
- **UI Components**: Framer Motion, React Flow
- **Icons**: Lucide React

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── canvas/      # 3D scene components
│   │   ├── features/    # Feature-specific components
│   │   └── ui/          # UI components
│   └── lib/             # Utilities and configurations
├── public/              # Static assets
└── .env.local          # Environment variables
```

## 🎨 Cyberpunk Theme

The UI features:
- Neon cyan, red, and purple color palette
- Scanline effects and vignettes
- Custom fonts (Orbitron, Rajdhani)
- Glassmorphism and glowing elements

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ by Bhomik Goyal
