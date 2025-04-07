import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Local storage key for chat messages
const STORAGE_KEY = 'college-predictor-chat-messages';
const STORAGE_KEY_RESEARCH = 'college-predictor-chat-research';

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
      updatedMsgs[currentMessageIndex].content += ch;
      return updatedMsgs;
    });
    
    // Add a small delay between characters for the typewriter effect
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

// WebSocket instance
let socket = null;

// Function to sync conversation history with backend
async function syncConversationHistory() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  
  try {
    const storedMessages = loadMessages();
    if (storedMessages.length > 0) {
      socket.send(JSON.stringify({
        type: 'sync',
        content: storedMessages,
        role: 'user'
      }));
    }
  } catch (error) {
    console.error('Error syncing conversation history:', error);
  }
}

// Initialize WebSocket connection
export function initWebSocket() {
  if (!browser) return;
  
  isConnecting.set(true);
  connectionError.set('');
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const clientId = Math.random().toString(36).substring(2, 15);
  
  try {
    socket = new WebSocket(`wss://api.collegepredictor.co.in/api/ws/${clientId}`);
    
    socket.onopen = () => {
      console.log('WebSocket connection established.');
      isConnected.set(true);
      isConnecting.set(false);
      // Sync conversation history when connection is established
      syncConversationHistory();
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
      console.error('Server error:', data.message || data.content);
      messages.update(msgs => [...msgs, { role: 'system', content: `Error: ${data.message || data.content}` }]);
      return;
    }
    
    if (data.role === 'assistant' || data.sender === 'bot') {
      // When a chunk is received
      if (data.is_chunk === true) {
        // If there's no existing assistant message or the last message isn't from the assistant, create a new one
        messages.update(msgs => {
          if (msgs.length === 0 || msgs[msgs.length - 1].role !== 'assistant') {
            currentMessageIndex = msgs.length;
            // Start with an empty message that will be filled character by character
            return [...msgs, { role: 'assistant', content: '', isComplete: false }];
          }
          
          // Otherwise, keep the existing assistant message index
          currentMessageIndex = msgs.length - 1;
          return msgs;
        });
        
        // Chain the new chunk onto the existing typewriter chain
        console.log('Typing chunk:', data.content || data.message);
        typewriterChain = typewriterChain.then(() => typeChunk(data.content || data.message));
      } else {
        // For non-chunk messages
        if ((data.content || data.message) === 'DONE') {
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
            return [...msgs, { role: 'assistant', content: '', isComplete: false }];
          });
          
          // Type out the complete message
          typewriterChain = typewriterChain.then(() => typeChunk(data.content || data.message)).then(() => {
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
    } else if (data.role === 'system' || data.sender === 'system') {
      messages.update(msgs => [...msgs, { role: 'system', content: data.content || data.message }]);
    } else if (data.role === 'user' || data.sender === 'user') {
      // This would typically come from the UI directly, but handle it just in case
      messages.update(msgs => [...msgs, { role: 'user', content: data.content || data.message }]);
    }
  } catch (err) {
    console.error('Error parsing message:', err);
  }
}

// Send a message through the WebSocket
export function sendMessage(text) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    messages.update(msgs => [...msgs, { role: 'system', content: 'Not connected to server' }]);
    return false;
  }
  
  // Add user message to the messages store
  messages.update(msgs => [...msgs, { role: 'user', content: text }]);
  
  // Send the message to the server
  socket.send(JSON.stringify({
    type: 'text',
    content: text,
    role: 'user'
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