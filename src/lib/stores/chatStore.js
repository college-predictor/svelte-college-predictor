import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Create stores for chat state
export const messages = writable([]);
export const isConnected = writable(false);
export const isConnecting = writable(false);
export const connectionError = writable('');

// Reference to the current bot message DOM element
let currentStreamingMsgEl = null;
// A promise chain that ensures each received chunk is displayed in order
let typewriterChain = Promise.resolve();

// WebSocket instance
let socket = null;

// Initialize WebSocket connection
export function initWebSocket() {
  if (!browser) return;
  
  isConnecting.set(true);
  connectionError.set('');
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const clientId = Math.random().toString(36).substring(2, 15);
  
  try {
    socket = new WebSocket(`${protocol}//localhost:8000/api/ws/${clientId}`);
    
    socket.onopen = () => {
      console.log('WebSocket connection established.');
      isConnected.set(true);
      isConnecting.set(false);
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

// Handle incoming WebSocket messages
function handleWebSocketMessage(event) {
  console.log('Raw message received:', event.data);
  try {
    const data = JSON.parse(event.data);
    
    if (data.type === 'error') {
      console.error('Server error:', data.message);
      messages.update(msgs => [...msgs, { sender: 'system', message: `Error: ${data.message}` }]);
      return;
    }
    
    if (data.sender === 'bot') {
      // When a chunk is received
      if (data.is_chunk === true) {
        messages.update(msgs => {
          // If there's no existing bot message or the last message isn't from the bot, create a new one
          if (msgs.length === 0 || msgs[msgs.length - 1].sender !== 'bot') {
            return [...msgs, { sender: 'bot', message: data.message, isComplete: false }];
          }
          
          // Otherwise, append to the existing bot message
          const updatedMsgs = [...msgs];
          updatedMsgs[updatedMsgs.length - 1].message += data.message;
          return updatedMsgs;
        });
      } else {
        // For non-chunk messages
        if (data.message === 'DONE') {
          console.log('Received DONE signal from backend.');
          messages.update(msgs => {
            if (msgs.length > 0 && msgs[msgs.length - 1].sender === 'bot') {
              const updatedMsgs = [...msgs];
              updatedMsgs[updatedMsgs.length - 1].isComplete = true;
              return updatedMsgs;
            }
            return msgs;
          });
        } else {
          // If the backend sends a complete (non-chunk) message
          messages.update(msgs => [...msgs, { sender: 'bot', message: data.message, isComplete: true }]);
        }
      }
    } else if (data.sender === 'system') {
      messages.update(msgs => [...msgs, { sender: 'system', message: data.message }]);
    } else if (data.sender === 'user') {
      // This would typically come from the UI directly, but handle it just in case
      messages.update(msgs => [...msgs, { sender: 'user', message: data.message }]);
    }
  } catch (err) {
    console.error('Error parsing message:', err);
  }
}

// Send a message through the WebSocket
export function sendMessage(text) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    messages.update(msgs => [...msgs, { sender: 'system', message: 'Not connected to server' }]);
    return false;
  }
  
  // Add user message to the messages store
  messages.update(msgs => [...msgs, { sender: 'user', message: text }]);
  
  // Send the message to the server
  socket.send(JSON.stringify({
    type: 'text',
    content: text,
    sender: 'user'
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