// src/App.tsx
import React, { useState } from 'react';
import GameComponent from './components/GameComponent';

const App: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState('User');
  const [websocketUrl, setWebsocketUrl] = useState('ws://localhost:8080');
  const [gameStarted, setGameStarted] = useState(false);

  const roles = ['Admin', 'Manager', 'Developer', 'Designer', 'User', 'Guest'];

  const startGame = () => {
    if (playerName.trim()) {
      setGameStarted(true);
    }
  };

  if (gameStarted) {
    return (
      <GameComponent
        websocketUrl={websocketUrl}
        playerName={playerName}
        playerRole={playerRole}
      />
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#333',
          fontSize: '24px'
        }}>
          Join the Game
        </h1>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#555',
            fontWeight: 'bold'
          }}>
            Your Name:
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            onKeyPress={(e) => e.key === 'Enter' && startGame()}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#555',
            fontWeight: 'bold'
          }}>
            Role:
          </label>
          <select
            value={playerRole}
            onChange={(e) => setPlayerRole(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
              background: 'white'
            }}
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#555',
            fontWeight: 'bold'
          }}>
            WebSocket Server:
          </label>
          <input
            type="text"
            value={websocketUrl}
            onChange={(e) => setWebsocketUrl(e.target.value)}
            placeholder="ws://localhost:8080"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={startGame}
          disabled={!playerName.trim()}
          style={{
            width: '100%',
            padding: '14px',
            background: playerName.trim() 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: playerName.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease'
          }}
        >
          Start Game
        </button>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Controls:</h3>
          <p style={{ margin: '0.25rem 0' }}>• WASD or Arrow keys to move</p>
          <p style={{ margin: '0.25rem 0' }}>• + / - buttons to zoom</p>
          <p style={{ margin: '0.25rem 0' }}>• Your name and role will appear above your character</p>
        </div>
      </div>
    </div>
  );
};

export default App;