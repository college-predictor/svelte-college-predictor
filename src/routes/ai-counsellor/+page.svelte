<script lang="ts">
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import { chatStore } from '$lib/stores';
  import { get } from 'svelte/store';
  import md5 from 'blueimp-md5';
  import { browser } from '$app/environment';

  let message = '';
  let chatId = '';
  let isLoading = false;
  let chatMessagesContainer: HTMLDivElement;
  let socket: WebSocket;
  let isConnected = false;
  let connectionStatus = 'Disconnected';

  // Chat object to manage messages
  let chatObject = {
    messages: [],
    chatHash: '',
    syncRequired: false,
  };

  // Slider state: right (chat) container width (in percent)
  // Enforced to be between 25% and 50%
  let chatRightWidth = 25; // initial value
  let chatLeftWidth = 100 - chatRightWidth;
  let isDragging = false;

  // Reference to the overall container (for slider math)
  let container: HTMLDivElement;

  onMount(() => {
    // localStorage and window are available here only on the client
    chatId = localStorage.getItem('chat_id') || '';
    if (!chatId) {
      chatId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chat_id', chatId);
    }
    chatObject.messages = get(chatStore);
    chatObject.chatHash = computeHash(chatObject.messages);

    // Add event listeners only if running in the browser
    if (browser) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      // Initialize WebSocket connection
      connectWebSocket();
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      // Close WebSocket connection
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    }
  });

  function connectWebSocket() {
    // For local testing, use localhost instead of production URL
    const wsUrl = 'ws://localhost:8000/ws/' + chatId;
    
    connectionStatus = 'Connecting...';
    
    // Create URL with query parameters for authentication
    const urlWithAuth = `${wsUrl}?chat_id=${chatId}`;
    socket = new WebSocket(urlWithAuth);
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      isConnected = true;
      connectionStatus = 'Connected';
    };
    
    socket.onclose = (event) => {
      console.log('WebSocket disconnected', event);
      isConnected = false;
      connectionStatus = 'Disconnected';
      
      // Try to reconnect after 3 seconds
      setTimeout(() => {
        if (browser) connectWebSocket();
      }, 3000);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      connectionStatus = 'Error';
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle different message types
        switch (data.type) {
          case 'system':
            console.log('System message:', data.message);
            break;
          case 'assistant':
            // Handle assistant message
            if (chatObject.messages.length > 0 && 
                chatObject.messages[chatObject.messages.length - 1].role === 'assistant' && 
                chatObject.messages[chatObject.messages.length - 1].content === 'Loading...') {
              chatObject.messages[chatObject.messages.length - 1].content = data.message;
            } else {
              chatObject.messages.push({ role: 'assistant', content: data.message });
            }
            chatStore.set([...chatObject.messages]);
            isLoading = false;
            break;
          case 'error':
            // Handle error message
            console.error('Server error:', data.message);
            chatObject.messages.pop(); // Remove 'Loading...' message
            chatStore.set([...chatObject.messages]);
            isLoading = false;
            break;
          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }
  
  function handleStreamMessage(data) {
    // If this is the first chunk, replace the "Loading..." message
    if (chatObject.messages.length > 0 && 
        chatObject.messages[chatObject.messages.length - 1].role === 'assistant' && 
        chatObject.messages[chatObject.messages.length - 1].content === 'Loading...') {
      chatObject.messages[chatObject.messages.length - 1].content = data.content;
    } else {
      // Otherwise append to the last assistant message
      const lastMsg = chatObject.messages[chatObject.messages.length - 1];
      if (lastMsg.role === 'assistant') {
        lastMsg.content += data.content;
      }
    }
    
    // Update the store to trigger UI refresh
    chatStore.set([...chatObject.messages]);
  }
  
  function handleCompleteMessage(data) {
    // Finalize the message
    isLoading = false;
    
    // Update chat hash
    chatObject.chatHash = computeHash(chatObject.messages);
  }

  function computeHash(messages) {
    let messagesStr = messages.map(msg => msg.content).join('');
    return md5(messagesStr);
  }

  async function sendMessage() {
    if (!message.trim() || isLoading) return;
    isLoading = true;

    const originalMessages = [...chatObject.messages];
    const chatHash = computeHash(originalMessages);

    const optimisticUserMsg = { role: 'user', content: message };
    const loadingMsg = { role: 'assistant', content: 'Loading...' };

    chatObject.messages.push(optimisticUserMsg, loadingMsg);
    chatStore.set([...chatObject.messages]);

    // Check if WebSocket is connected
    if (!isConnected || socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected. Attempting to reconnect...');
      connectWebSocket();
      
      // Fall back to REST API if WebSocket connection fails
      setTimeout(() => {
        if (!isConnected) {
          sendMessageViaREST();
        } else {
          sendMessageViaWebSocket();
        }
      }, 1000);
    } else {
      sendMessageViaWebSocket();
    }
  }
  
  function sendMessageViaWebSocket() {
    const payload = {
      message: message
    };
    
    socket.send(JSON.stringify(payload));
    message = '';
  }
  
  async function sendMessageViaREST() {
    const originalMessages = [...chatObject.messages];
    const chatHash = computeHash(originalMessages);
    
    const payload = {
      chat_id: chatId,
      prompt: message,
      chat_hash: chatHash,
    };

    try {
      // Use localhost for testing
      let res = await fetch('http://localhost:8000/api/chat/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        console.warn('Sync required. Fetching full chat history.');
        chatObject.syncRequired = true;
        const syncPayload = {
          chat_id: chatId,
          prompt: message,
          messages: originalMessages,
          chat_hash: chatHash,
          sync_required: true,
        };

        res = await fetch('http://localhost:8000/api/chat/generate-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(syncPayload),
        });
      }

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = await res.json();
      if (!data.response || typeof data.response !== 'string') {
        throw new Error('Invalid response from server');
      }

      chatObject.messages.pop(); // Remove 'Loading...'
      chatObject.messages.push({ role: 'assistant', content: data.response });
      chatStore.set([...chatObject.messages]);
      chatObject.chatHash = computeHash(chatObject.messages);
    } catch (error) {
      console.error('Error:', error);
      chatObject.messages = originalMessages;
      chatStore.set([...originalMessages]);
    }

    message = '';
    isLoading = false;
  }

  function clearChat() {
    chatObject.messages = [];
    chatStore.set([]);
    localStorage.removeItem('chat_id');
    chatId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chat_id', chatId);
    chatObject.chatHash = '';
    
    // Reconnect WebSocket with new chat ID
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    connectWebSocket();
  }

  afterUpdate(() => {
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  });

  // Slider functions
  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    e.preventDefault();
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging || !container) return;

    const rect = container.getBoundingClientRect();
    // Calculate the new right container width as percentage of container's width.
    // We use the distance from the right edge.
    const offsetRight = rect.right - e.clientX;
    let newRightWidth = (offsetRight / rect.width) * 100;

    // Enforce minimum (25%) and maximum (50%) boundaries for the chat window.
    if (newRightWidth < 25) newRightWidth = 25;
    if (newRightWidth > 50) newRightWidth = 50;
    chatRightWidth = newRightWidth;
    chatLeftWidth = 100 - chatRightWidth;
  }

  function handleMouseUp() {
    isDragging = false;
  }
</script>

<style>
  /* Simple styling for the slider separator */
  .slider {
    width: 4px;
    cursor: col-resize;
    background-color: #72a4e0;
    height: calc(100vh-13rem);
  }
  
  .connection-status {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    margin-left: 0.5rem;
  }
  
  .status-connected {
    background-color: #10b981;
    color: white;
  }
  
  .status-connecting {
    background-color: #f59e0b;
    color: white;
  }
  
  .status-disconnected, .status-error {
    background-color: #ef4444;
    color: white;
  }
</style>

<!-- Overall page container -->
<div bind:this={container} class="flex flex-col flex-1 p-2">
  <!-- Flex container split into resizable panels -->
  <div class="flex flex-1 h-full gap-0">
    <!-- Left Container (Content) -->
    <div
      class="bg-white rounded shadow-lg p-4 h-[calc(100vh-6rem)] overflow-y-auto"
      style="width: {chatLeftWidth}%"
    >
      <!-- Section: Top Engineering Colleges -->
      <section>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Top Engineering Colleges</h2>
        <p class="text-gray-600">
          Discover the best engineering colleges offering modern curricula, advanced research facilities, and a supportive learning environment.
        </p>
      </section>
  
      <!-- Zigzag Section 1 -->
      <section class="flex flex-col md:flex-row items-center bg-gray-50 rounded-lg shadow p-4">
        <img
          src="https://source.unsplash.com/featured/?engineering"
          alt="Engineering"
          class="w-full md:w-1/2 h-48 object-cover rounded-lg"
        />
        <div class="mt-4 md:mt-0 md:ml-6">
          <h3 class="text-2xl font-semibold text-gray-700">Cutting-Edge Curriculum</h3>
          <p class="text-gray-600">
            Our recommended colleges offer a curriculum that blends theoretical knowledge with practical applications.
          </p>
        </div>
      </section>
  
      <!-- Zigzag Section 2 (Reversed Layout) -->
      <section class="flex flex-col md:flex-row-reverse items-center bg-gray-50 rounded-lg shadow p-4">
        <img
          src="https://source.unsplash.com/featured/?technology"
          alt="Technology"
          class="w-full md:w-1/2 h-48 object-cover rounded-lg"
        />
        <div class="mt-4 md:mt-0 md:mr-6">
          <h3 class="text-2xl font-semibold text-gray-700">Innovative Research</h3>
          <p class="text-gray-600">
            Engage in groundbreaking research projects that push the boundaries of modern technology.
          </p>
        </div>
      </section>
  
      <!-- Section: Branches and Scholarships Table -->
      <section>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Branches &amp; Scholarships</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr>
                <th class="px-4 py-2 border-b text-left">Branch</th>
                <th class="px-4 py-2 border-b text-left">Scholarship Opportunities</th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-gray-50">
                <td class="px-4 py-2 border-b">Computer Science</td>
                <td class="px-4 py-2 border-b">Merit-based, Need-based</td>
              </tr>
              <tr>
                <td class="px-4 py-2 border-b">Mechanical Engineering</td>
                <td class="px-4 py-2 border-b">Sports &amp; Diversity Scholarships</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="px-4 py-2 border-b">Electrical Engineering</td>
                <td class="px-4 py-2 border-b">Research &amp; Merit-based</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
  
      <!-- Section: Social Media -->
      <section class="bg-gray-50 rounded-lg shadow p-4">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Connect With Us</h2>
        <div class="flex flex-wrap gap-4">
          <a href="https://twitter.com" target="_blank" class="flex items-center space-x-2 text-blue-500 hover:text-blue-700">
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.28 4.28 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.26 4.26 0 0016.11 4c-2.36 0-4.28 1.92-4.28 4.28 0 .34.04.67.11.99-3.56-.18-6.72-1.88-8.82-4.47a4.27 4.27 0 00-.58 2.15c0 1.48.75 2.78 1.88 3.54a4.24 4.24 0 01-1.94-.54v.06c0 2.07 1.47 3.8 3.42 4.19a4.3 4.3 0 01-1.93.07c.54 1.68 2.08 2.91 3.91 2.94A8.55 8.55 0 012 19.54a12.07 12.07 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.7 8.7 0 0024 4.56a8.55 8.55 0 01-2.54.7z"/>
            </svg>
            <span>Twitter</span>
          </a>
          <a href="https://instagram.com" target="_blank" class="flex items-center space-x-2 text-pink-500 hover:text-pink-700">
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zM12 7a5 5 0 100 10 5 5 0 000-10z"/>
            </svg>
            <span>Instagram</span>
          </a>
          <a href="https://youtube.com" target="_blank" class="flex items-center space-x-2 text-red-600 hover:text-red-800">
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M19.615 3.184C21.178 3.63 22 4.84 22 6.473v11.053c0 1.633-.822 2.843-2.385 3.29C17.935 21.77 12 21.77 12 21.77s-5.935 0-7.615-.974C2.822 20.369 2 19.159 2 17.526V6.473C2 4.84 2.822 3.63 4.385 3.184 6.065 2.21 12 2.21 12 2.21s5.935 0 7.615.974zM10 15l5-3-5-3v6z"/>
            </svg>
            <span>YouTube</span>
          </a>
        </div>
      </section>
  
      <!-- Section: Featured YouTube Video -->
      <section class="bg-gray-50 rounded-lg shadow p-4">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Featured Video</h2>
        <div class="w-full aspect-video">
          <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="YouTube video player" 
            frameborder="0" 
            class="w-full h-full rounded-lg" 
            allowfullscreen>
          </iframe>
        </div>
      </section>
    </div>

    <!-- Slider separator -->
    <div class="slider" on:mousedown={handleMouseDown}></div>

    <!-- Right Container (Chat) -->
    <div
      class="bg-white rounded shadow-lg p-4 h-[calc(100vh-6rem)] flex flex-col"
      style="width: {chatRightWidth}%"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-800">Chat with AI</h3>
        <span class="connection-status status-{connectionStatus.toLowerCase()}">{connectionStatus}</span>
      </div>
      
      <button class="btn btn-blue mb-4" on:click={clearChat}>Clear Chat</button>
      
      <div class="flex-grow min-h-0 overflow-y-auto flex flex-col space-y-4 mb-4" bind:this={chatMessagesContainer}>
        {#each $chatStore as msg}
          <div class="max-w-xs p-2 rounded-lg {msg.role === 'user' ? 'bg-blue-100 self-end' : 'bg-green-100 self-start'}">
            <strong class="block text-sm mb-1">{msg.role === 'user' ? 'User' : 'AI'}</strong>
            <p class="text-gray-700 text-sm">{msg.content}</p>
          </div>
        {/each}
        <div class="mt-auto"></div>
      </div>
    
      <div class="flex">
        <input
          class="flex-grow rounded-lg border border-gray-300 p-2 mr-2"
          type="text"
          bind:value={message}
          placeholder="Type your message..."
          on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()} />
        <button
          type="button"
          class="rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300"
          on:click={sendMessage} disabled={isLoading || !message.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  </div>
</div>
