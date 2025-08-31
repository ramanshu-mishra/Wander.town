// server.js - Simple WebSocket server for multiplayer game
const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected players
const players = new Map();

// Broadcast message to all clients except sender
function broadcast(message, excludeClient = null) {
  const messageStr = JSON.stringify(message);
  wss.clients.forEach(client => {
    if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// Send message to specific client
function sendToClient(client, message) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
  }
}

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'player_joined':
          const playerData = message.data;
          
          // Store player
          players.set(ws, playerData);
          console.log(`Player joined: ${playerData.name} (${playerData.role})`);
          
          // Send current players to new client
          const currentPlayers = Array.from(players.values())
            .filter(p => p.id !== playerData.id);
          
          if (currentPlayers.length > 0) {
            sendToClient(ws, {
              type: 'init',
              data: currentPlayers
            });
          }
          
          // Broadcast new player to others
          broadcast({
            type: 'player_joined',
            data: playerData
          }, ws);
          break;
          
        case 'player_update':
          const updateData = message.data;
          
          // Update stored player data
          if (players.has(ws)) {
            const existingPlayer = players.get(ws);
            players.set(ws, { ...existingPlayer, ...updateData });
          }
          
          // Broadcast update to others
          broadcast({
            type: 'player_update',
            data: updateData
          }, ws);
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    
    // Get player data before removing
    const playerData = players.get(ws);
    
    if (playerData) {
      console.log(`Player left: ${playerData.name}`);
      
      // Remove player
      players.delete(ws);
      
      // Broadcast player left to others
      broadcast({
        type: 'player_left',
        data: { playerId: playerData.id }
      });
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Players connected: ${players.size}`);
});

// Log player count every 30 seconds
setInterval(() => {
  if (players.size > 0) {
    console.log(`Active players: ${players.size}`);
    Array.from(players.values()).forEach(player => {
      console.log(`  - ${player.name} (${player.role}) at (${player.x}, ${player.y})`);
    });
  }
}, 30000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  wss.clients.forEach(client => {
    client.close();
  });
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});