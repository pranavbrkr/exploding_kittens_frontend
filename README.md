# Exploding Kittens Frontend

A React-based frontend for the Exploding Kittens multiplayer card game with real-time WebSocket communication.

## Features

- **Real-time Multiplayer**: Live gameplay with WebSocket updates
- **Card Management**: Drag-and-drop card interactions
- **Turn-based System**: Automatic turn progression
- **Action Notifications**: Real-time game event notifications
- **Cat Combinations**: Advanced stealing mechanics with feral cats
- **Modern UI**: Clean interface with Material-UI components

## Technologies Used

- React 18
- Material-UI
- Zustand (State Management)
- WebSocket (STOMP/SockJS)
- @hello-pangea/dnd (Drag & Drop)
- Axios

## How to Run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

## Game Rules

- Avoid drawing Exploding Kitten cards
- Use action cards to manipulate the game
- Combine cat cards to steal from opponents
- Be the last player remaining to win

**Cat Combinations:**
- 2 same cats OR 1 feral + 1 regular = Steal random card
- 3 same cats OR 2 feral + 1 regular OR 1 feral + 2 same = Steal defuse
