import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Local storage key for chat messages
const STORAGE_KEY = 'college-predictor-chat-messages';

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

// Create stores for chat state
export const messages = writable(loadMessages());
export const isConnected = writable(false);
export const isConnecting = writable(false);
export const connectionError = writable('');

// Subscribe to messages store to save changes to localStorage
if (browser) {
  messages.subscribe(value => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  });
}

// A promise chain that ensures each received chunk is displayed in order
let typewriterChain = Promise.resolve();

// Store for the current message being typed
let currentMessageIndex = -1;

// Function to type out a chunk character by character with a delay
async function typeChunk(chunk) {
  // For each character in the chunk
  for (let ch of chunk) {
    // Update the message in the store one character at a time
    messages.update(msgs => {
      if (msgs.length === 0 || currentMessageIndex === -1) return msgs;
      
      const updatedMsgs = [...msgs];
      updatedMsgs[currentMessageIndex].message += ch;
      return updatedMsgs;
    });
    
    // Add a small delay between characters for the typewriter effect
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

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
        // If there's no existing bot message or the last message isn't from the bot, create a new one
        messages.update(msgs => {
          if (msgs.length === 0 || msgs[msgs.length - 1].sender !== 'bot') {
            currentMessageIndex = msgs.length;
            // Start with an empty message that will be filled character by character
            return [...msgs, { sender: 'bot', message: '', isComplete: false }];
          }
          
          // Otherwise, keep the existing bot message index
          currentMessageIndex = msgs.length - 1;
          return msgs;
        });
        
        // Chain the new chunk onto the existing typewriter chain
        console.log('Typing chunk:', data.message);
        typewriterChain = typewriterChain.then(() => typeChunk(data.message));
      } else {
        // For non-chunk messages
        if (data.message === 'DONE') {
          console.log('Received DONE signal from backend.');
          // Let the current chain complete and then mark the message as complete
          typewriterChain.then(() => {
            messages.update(msgs => {
              if (msgs.length > 0 && currentMessageIndex >= 0 && currentMessageIndex < msgs.length) {
                const updatedMsgs = [...msgs];
                updatedMsgs[currentMessageIndex].isComplete = true;
                currentMessageIndex = -1; // Reset the current message index
                return updatedMsgs;
              }
              return msgs;
            });
          });
        } else {
          // If the backend sends a complete (non-chunk) message
          messages.update(msgs => {
            currentMessageIndex = msgs.length;
            return [...msgs, { sender: 'bot', message: '', isComplete: false }];
          });
          
          // Type out the complete message
          typewriterChain = typewriterChain.then(() => typeChunk(data.message)).then(() => {
            messages.update(msgs => {
              if (msgs.length > 0 && currentMessageIndex >= 0 && currentMessageIndex < msgs.length) {
                const updatedMsgs = [...msgs];
                updatedMsgs[currentMessageIndex].isComplete = true;
                currentMessageIndex = -1; // Reset the current message index
                return updatedMsgs;
              }
              return msgs;
            });
          });
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

// Clear chat messages from store and localStorage
export function clearChat() {
  messages.set([]);
  if (browser) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing messages from localStorage:', error);
    }
  }
}