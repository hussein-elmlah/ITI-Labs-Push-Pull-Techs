const http = require('http');
const WebSocket = require('ws');

const port = process.env.PORT || 8080;
const clients = new Map();

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('<h1>WebSocket Chat Server Running!</h1>');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  // console.log('Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'login') {

      const username = data.username;
      clients.set(username, ws);
      console.log(`Client '${username}' connected`);
      // console.log(`wss: ${JSON.stringify(ws)} `)

      const joinMessage = {
        type: 'message',
        username: username,
        content: `${username} has joined the chat!`
      };
      for (const [clientUsername, clientWs] of clients.entries()) {
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify(joinMessage));
          // console.log(`Join Message sent to ${clientUsername}`);
        }
      }

    } else if (data.type === 'message') {
      const username = data.username;
      const content = data.content;
      // console.log(`Message from ${username}: ${content}`);

      // Broadcast message to all connected clients
      for (const [clientUsername, clientWs] of clients.entries()) {
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify({ type: 'message', username, content }));
          // console.log(`Message sent to ${clientUsername}`);
        }
      }
    }
  });

  ws.on('close', () => {
    const username = Array.from(clients.keys()).find(
      (clientUsername) => clients.get(clientUsername) === ws
    );
    console.log(`Client '${username}' disconnected`);
    clients.delete(username);

    // Broadcast user disconnect message (optional)
    const disconnectMessage = {
      type: 'message',
      username: username,
      content: `${username} has left the chat!`
    };
    for (const [, clientWs] of clients.entries()) {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(disconnectMessage));
        // console.log(`Disconnect Message sent to ${clientUsername}`);
      }
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
