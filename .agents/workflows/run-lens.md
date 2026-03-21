---
description: Start the Atlas Lens Visualizer locally
---

# Run Atlas Lens Local Environment

This workflow safely initiates the Vite development server for the Markdown Relationship Visualizer. 
It must be launched from within the `atlas-lens` repository.

## Step 1: Start the Developer Server

// turbo
```bash
echo "🧹 Stopping any orphaned Vite servers..."
npx kill-port 5173 5174 5175 || true

echo "⬇️  Pulling the latest build from Jules via git..."
git pull origin main

echo "📦 Ensuring all dependencies are installed..."
npm install

echo "🚀 Starting the Atlas Lens Visualizer..."
npm run dev
```

If the port `5173` is already in use, Vite will automatically assign the next available port (e.g., `5174`).
