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

// Export socket for external use
export { socket };

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

// Function to fetch question by ID and format as HTML
export async function getQuestionById(questionId) {
  try {
    const response = await fetch(`/api/questions/${questionId}`);
    if (!response.ok) throw new Error('Failed to fetch question');
    
    const questionData = await response.json();
    
    // Format question as HTML
    let htmlContent = `<div class="mb-2 text-sm text-gray-500">Date: ${questionData.shiftDate || 'Not specified'}, ${questionData.shiftType} shift</div>`;
    
    // Question content
    if (questionData.question) {
      htmlContent += `<p class="mb-2 font-medium">${questionData.question}</p>`;
    }
    if (questionData.questionImage) {
      htmlContent += `<div class="mb-3"><img src="${questionData.questionImage}" alt="Question Image" class="max-w-full max-h-[200px] rounded"></div>`;
    }
    
    // Options grid
    htmlContent += '<div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">';
    
    const options = ['A', 'B', 'C', 'D'];
    options.forEach(opt => {
      const option = questionData.options[opt];
      htmlContent += `<div class="p-2 border ${option.selected ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} rounded">`;
      htmlContent += `<span class="font-bold">${opt}:</span> `;
      
      if (option.text) {
        htmlContent += `<span>${option.text}</span>`;
      } else if (!option.image) {
        htmlContent += `<span class="text-gray-400">No text provided</span>`;
      }
      
      if (option.image) {
        htmlContent += `<div class="mt-1"><img src="${option.image}" alt="Option ${opt} Image" class="max-w-full max-h-[200px] rounded"></div>`;
      }
      
      if (option.selected) {
        htmlContent += `<div class="mt-1 text-sm font-medium text-green-600">✓ Selected Answer</div>`;
      }
      
      htmlContent += '</div>';
    });
    
    htmlContent += '</div>';
    
    // Difficulty indicator
    htmlContent += `<div class="mt-3 text-sm text-gray-600">Difficulty: ${'★'.repeat(questionData.difficulty)}${'☆'.repeat(5 - questionData.difficulty)}</div>`;
    
    // Additional message
    if (questionData.message) {
      htmlContent += `<div class="mt-3 text-xs text-gray-700 border-t pt-2 border-gray-200">${questionData.message}</div>`;
    }
    
    return htmlContent;
  } catch (error) {
    console.error('Error fetching question:', error);
    return '<div class="text-red-500">Error loading question</div>';
  }
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
    // Debug - log message status updates more explicitly
    if (data.type === 'message_validated' || (data.type === 'message' && data.messageId)) {
      console.log('Status update for message ID:', data.messageId, '- Setting status to sent');
    }
    
    switch (data.type) {
      case 'message':  
        // Regular text message from server (validated)
        // First check if this is a validation response for a pending message
        if (data.messageId) {
          // Update the status of the pending message to 'sent'
          messages.update(msgs => {
            // Create a completely new array with the updated message to ensure reactivity
            return [...msgs.map(msg => 
              msg.id === data.messageId ? { ...msg, status: 'sent' } : { ...msg }
            )];
          });
        } else if (data.id) {
          // This is a new message from another user
          // Check if we already have this message in the store (avoid duplicates)
          messages.update(msgs => {
            // Check if message with this ID already exists
            const messageExists = msgs.some(msg => msg.id === data.id);
            if (messageExists) {
              // Message already exists, just return the current messages
              return msgs;
            } else {
              // Add the new message
              return [...msgs, {
                id: data.id,
                user_id: data.user_id,
                user: data.username,
                userColor: data.color || '',
                content: data.content,
                timestamp: data.timestamp,
                status: 'sent' // Messages from others are always in 'sent' state
              }];
            }
          });
        }
        break;
        
      case 'message_validated':
        // Message validation response
        console.log('Received message_validated event for message ID:', data.messageId);
        // Force a complete refresh of the messages store to trigger reactivity
        // Add a small delay to ensure the UI has time to update
        setTimeout(() => {
          messages.update(msgs => {
            // Check if message exists before updating
            const messageExists = msgs.some(msg => msg.id === data.messageId);
            
            if (messageExists) {
              // Create a new array with the updated message, ensuring each object reference is new
              return msgs.map(msg => 
                msg.id === data.messageId ? { ...msg, status: 'sent' } : msg
              );
            }
            
            // If message doesn't exist (rare case), just return current messages
            return msgs;
          });
        }, 50); // Small delay to ensure the UI updates
        break;
        
      case 'message_error':
        // Message validation error - remove the message
        messages.update(msgs => msgs.filter(msg => msg.id !== data.messageId));
        
        // Show error notification
        messages.update(msgs => [...msgs, {
          id: Date.now(),
          user: 'System',
          content: `Error: ${data.error || 'Your message could not be delivered'}`,
          timestamp: new Date().toISOString(),
          hasQuestion: false,
          questionId: null,
          status: 'sent'
        }]);
        break;
        
      case 'validation':
        // Handle message validation response
        if (data.status === 'error') {
          // Remove message completely if validation failed
          messages.update(msgs => msgs.filter(msg => msg.id !== data.messageId));
          
          // Show error notification
          messages.update(msgs => [...msgs, {
            id: Date.now(),
            user: 'System',
            content: `Error: Message could not be validated`,
            timestamp: new Date().toISOString(),
            hasQuestion: false,
            questionId: null,
            status: 'sent'
          }]);
        } else {
          // Update status for validated messages
          messages.update(msgs => {
            // Check if message exists and update its status
            const messageExists = msgs.some(msg => msg.id === data.messageId);
            
            if (messageExists) {
              // Create a new array with the updated message status
              return msgs.map(msg => 
                msg.id === data.messageId ? { ...msg, status: 'sent' } : msg
              );
            }
            
            // If message doesn't exist (rare case), just return current messages
            return msgs;
          });
        }
        console.log(`Message ID: ${data.messageId} validation status: ${data.status}`);
        break;
        
      case 'system':
        // System notification
        messages.update(msgs => [...msgs, {
          id: Date.now(),
          user: 'System',
          content: data.content,
          timestamp: new Date().toISOString(),
          hasQuestion: false,
            questionId: null,
          status: 'sent'
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
            userColor: msg.color || '',
            content: msg.content,
            timestamp: msg.timestamp,
            hasQuestion: msg.has_question,
            questionId: msg.question_id,
            status: 'sent' // All history messages are in 'sent' state
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
export function sendTextMessage(text, questionId = null) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    connectionError.set('Not connected to server');
    return false;
  }
  
  let user;
  currentUser.subscribe(value => { user = value; })();
  
  // Generate a unique message ID with a small random offset to prevent duplicates
  // when called in quick succession (especially after sendQuestion)
  const messageId = Date.now() + Math.floor(Math.random() * 1000);
  
  // Add message to the messages store with pending status
  const message = {
    id: messageId,
    user_id: getClientId(), // Add user_id to ensure proper message alignment
    user: user.name,
    userColor: user.color,
    content: text,
    timestamp: new Date().toISOString(),
    hasQuestion: questionId !== null, // Set to true if questionId is provided
    questionId: questionId, // Include the questionId
    status: 'pending', // Add status field for tracking message state
  };
  
  // Add the message to the store
  messages.update(msgs => [...msgs, message]);
  
  // Send the message to the server
  socket.send(JSON.stringify({
    type: 'message',
    messageId: messageId, // Include message ID for tracking
    content: text,
    hasQuestion: questionId !== null, // Include hasQuestion flag
    questionId: questionId, // Include questionId in message to server
  }));
  
  // Automatically set status to 'sent' after a delay if no validation received
  // This ensures the UI updates even if there's an issue with the WebSocket response
  setTimeout(() => {
    messages.update(msgs => {
      // Check if the message still exists and is still pending
      const messageStillPending = msgs.some(msg => msg.id === messageId && msg.status === 'pending');
      
      if (messageStillPending) {
        console.log('Auto-updating message status for ID:', messageId);
        // Force update with new object references
        return msgs.map(msg => msg.id === messageId ? { ...msg, status: 'sent' } : { ...msg });
      }
      return msgs;
    });
  }, 2000); // 2 second timeout
  
  return questionId; // Return question ID for tracking
}

// Send a question message through the WebSocket
export function sendQuestion(questionData) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    connectionError.set('Not connected to server');
    return false;
  }
  
  // Generate unique question ID
  const questionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

  // Send the question to the server
  socket.send(JSON.stringify({
    type: 'question',
    questionId: questionId,
    data: {
      question: questionData.question,
      questionImage: questionData.questionImage,
      options: questionData.options,
      difficulty: questionData.difficulty,
      message: questionData.message,
      shiftDate: questionData.shiftDate,
      shiftType: questionData.shiftType
    }
  }));
  
  return questionId; // Return question ID for tracking
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