import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Local storage keys
const STORAGE_KEY = 'discussion-forum-messages';
const STORAGE_KEY_USER = 'forum-user';
const STORAGE_KEY_CLIENT_ID = 'forum-client-id';

// Function to load messages from localStorage
function loadMessages() {
  if (browser) {
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY);
      return storedMessages ? JSON.parse(storedMessages) : [];
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
      return [];
    }
  }
  return [];
}

// Function to load user from localStorage
function loadUser() {
  if (browser) {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      return null;
    }
  }
  return null;
}

// Create stores for forum state
export const messages = writable(loadMessages());
export const currentUser = writable(loadUser());
export const isConnected = writable(false);
export const isConnecting = writable(false);
export const connectionError = writable('');
export const activeUsers = writable(0);

// Subscribe to messages store to save changes to localStorage
if (browser) {
  messages.subscribe(value => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  });
  
  currentUser.subscribe(value => {
    if (value) {
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    }
  });
}

// WebSocket instance
let socket = null;

// Get or generate client ID
export function getClientId() {
  if (browser) {
    let clientId = localStorage.getItem(STORAGE_KEY_CLIENT_ID);
    if (!clientId) {
      clientId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(STORAGE_KEY_CLIENT_ID, clientId);
    }
    return clientId;
  }
  return null;
}

// Initialize WebSocket connection
export function initWebSocket() {
  if (!socket && browser) {
    isConnecting.set(true);
    connectionError.set('');
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const clientId = getClientId();
    
    try {
      socket = new WebSocket(`${protocol}//localhost:8000/api/ws-discussion-forum/${clientId}`);
      
      socket.onopen = () => {
        console.log('WebSocket connection established for discussion forum.');
        isConnected.set(true);
        isConnecting.set(false);
        
        // Send user information when connection is established
        let user;
        currentUser.subscribe(value => { user = value; })();
        if (user) {
          sendUserUpdate(user.name, user.color);
        }
        
        // Request active users count
        requestUsersCount();
        
        // Request chat history
        socket.send(JSON.stringify({
          type: 'get_history'
        }));
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        connectionError.set('Failed to connect to server');
        isConnected.set(false);
        isConnecting.set(false);
      };
      
      socket.onclose = () => {
        console.log('WebSocket connection closed');
        isConnected.set(false);
      };
      
      socket.onmessage = handleWebSocketMessage;
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      connectionError.set('Failed to initialize connection');
      isConnecting.set(false);
    }
  }
}

// Handle incoming WebSocket messages
function handleWebSocketMessage(event) {
  try {
    const data = JSON.parse(event.data);
    console.log('Message received:', data);
    
    switch (data.type) {
      case 'message':
        // Regular text message
        messages.update(msgs => [...msgs, {
          id: data.id,
          user_id: data.user_id,
          user: data.username,
          userColor: data.color || 'text-gray-800',
          content: data.content,
          timestamp: data.timestamp,
          isQuestion: data.type === 'question'
        }]);
        break;
        

        
      case 'system':
        // System notification
        messages.update(msgs => [...msgs, {
          id: Date.now(),
          user: 'System',
          content: data.content,
          timestamp: new Date().toISOString(),
          isQuestion: false
        }]);
        break;
        
      case 'users_count':
        // Update active users count
        activeUsers.set(data.count);
        break;
        
      case 'history':
        // Chat history from server
        if (Array.isArray(data.messages)) {
          messages.set(data.messages.map(msg => ({
            id: msg.id,
            user_id: msg.user_id,
            user: msg.username,
            userColor: msg.color || 'text-gray-800',
            content: msg.content,
            timestamp: msg.timestamp,
            isQuestion: msg.type === 'question'
          })));
        }
        break;
        
      case 'error':
        // Error message
        connectionError.set(data.content);
        break;
    }
  } catch (err) {
    console.error('Error parsing message:', err);
  }
}

// Send a text message through the WebSocket
export function sendTextMessage(text) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    connectionError.set('Not connected to server');
    return false;
  }
  
  let user;
  currentUser.subscribe(value => { user = value; })();
  
  // Add message to the messages store
  const message = {
    id: Date.now(),
    user_id: getClientId(), // Add user_id to ensure proper message alignment
    user: user.name,
    userColor: user.color,
    content: text,
    timestamp: new Date().toISOString(),
    isQuestion: false
  };
  
  messages.update(msgs => [...msgs, message]);
  
  // Send the message to the server
  socket.send(JSON.stringify({
    type: 'message',
    content: text
  }));
  
  return true;
}

// Send a question message through the WebSocket
export function sendQuestionMessage(questionContent) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    connectionError.set('Not connected to server');
    return false;
  }
  
  let user;
  currentUser.subscribe(value => { user = value; })();
  
  // Add question to the messages store
  const message = {
    id: Date.now(),
    user_id: getClientId(), // Add user_id to ensure proper message alignment
    user: user.name,
    userColor: user.color,
    content: questionContent,
    timestamp: new Date().toISOString(),
    isQuestion: true
  };
  
  messages.update(msgs => [...msgs, message]);
  
  // Send the question to the server
  socket.send(JSON.stringify({
    type: 'question',
    user: user.name,
    userColor: user.color,
    content: questionContent
  }));
  
  return true;
}

// Send username update
export function sendUserUpdate(username, color) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return false;
  
  socket.send(JSON.stringify({
    type: 'username_update',
    user: username,
    userColor: color
  }));
  
  return true;
}

// Request active users count
export function requestUsersCount() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return false;
  
  socket.send(JSON.stringify({
    type: 'get_users_count'
  }));
  
  return true;
}

// Close the WebSocket connection
export function closeWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
  isConnected.set(false);
}

// Username generation data with emojis
const adjectives = ['Tiny', 'Witty', 'Quirky', 'Zippy', 'Cozy', 'Perky', 'Snazzy', 'Jolly', 'Peppy', 'Zesty'];
const nouns = ['Panda🐼', 'Fox🦊', 'Owl🦉', 'Bear🐻', 'Cat😺', 'Wolf🐺', 'Duck🦆', 'Lion🦁', 'Tiger🐯', 'Koala🐨'];
const colors = ['text-blue-800', 'text-green-800', 'text-purple-800', 'text-red-800', 'text-indigo-800', 'text-pink-800'];

// Generate a random username
export function generateUsername() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const name = `${adjective}${noun}`;
  const color = colors[Math.floor(Math.random() * colors.length)];
  return { name, color };
}

// Initialize user
export function initializeUser() {
  let user = loadUser();
  if (!user) {
    user = generateUsername();
    currentUser.set(user);
  }
  return user;
}

// Clear messages on page refresh but keep user and clientId
if (browser) {
  window.addEventListener('beforeunload', () => {
    localStorage.removeItem(STORAGE_KEY);
    closeWebSocket();
  });
}