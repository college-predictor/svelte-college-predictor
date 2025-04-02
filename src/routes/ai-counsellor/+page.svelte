<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import { browser } from '$app/environment';
  import { messages, isConnected, isConnecting, connectionError, initWebSocket, sendMessage, closeWebSocket, clearChat } from '$lib/stores/chatStore';

  // Slider state: right (chat) container width (in percent)
  // Enforced to be between 25% and 60%
  let chatRightWidth = 30; // initial value (slightly wider for chat)
  let chatLeftWidth = 100 - chatRightWidth;
  let isDragging = false;

  // Reference to the overall container (for slider math)
  let container: HTMLDivElement;
  let chatMessagesContainer: HTMLDivElement;
  let userInput = '';
  
  // Typewriter effect is now handled in the chatStore.js

  onMount(() => {
    // Add event listeners only if running in the browser
    if (browser) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      // Initialize WebSocket connection
      initWebSocket();
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      // Close WebSocket connection
      closeWebSocket();
    }
  });

  afterUpdate(() => {
    // Scroll to the bottom of the chat container when new messages arrive
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
    const offsetRight = rect.right - e.clientX;
    let newRightWidth = (offsetRight / rect.width) * 100;

    if (newRightWidth < 25) newRightWidth = 25;
    if (newRightWidth > 60) newRightWidth = 60;
    chatRightWidth = newRightWidth;
    chatLeftWidth = 100 - chatRightWidth;
  }

  function handleMouseUp() {
    isDragging = false;
  }
  
  // Handle form submission
  function handleSubmit() {
    if (userInput.trim() === '') return;
    
    sendMessage(userInput.trim());
    userInput = '';
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
  
  /* Chat message styling */
  .message {
    display: flex;
    margin-bottom: 0.75rem;
  }
  
  .message.user {
    justify-content: flex-end;
  }
  
  .message.bot {
    justify-content: flex-start;
  }
  
  /* Adding assistant class for new naming convention */
  .message.assistant {
    justify-content: flex-start;
  }
  
  .message.system {
    justify-content: center;
  }
  
  /* Typing indicator animation */
  .typing-indicator {
    display: inline-block;
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
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
    </div>

    <!-- Slider separator -->
    <div class="slider" on:mousedown={handleMouseDown}></div>

    <!-- Right Container (Chat panel) -->
    <div
      class="bg-white rounded shadow-lg p-4 h-[calc(100vh-6rem)] flex flex-col"
      style="width: {chatRightWidth}%"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-800">AI Counsellor</h3>
        <div class="flex items-center gap-4">
          <!-- Clear chat button -->
          <button
            class="text-sm px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded flex items-center"
            on:click={() => clearChat()}
            title="Clear chat history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Chat
          </button>
          
          <!-- Connection status indicator -->
          <div class="flex items-center">
            {#if $isConnecting}
              <span class="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
              <span class="text-sm text-gray-600">Connecting...</span>
            {:else if $isConnected}
              <span class="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span class="text-sm text-gray-600">Connected</span>
            {:else}
              <span class="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span class="text-sm text-gray-600">Disconnected</span>
            {/if}
          </div>
        </div>
      </div>
      
      <!-- Chat messages container -->
      <div class="flex-grow min-h-0 overflow-y-auto p-2 bg-gray-50 rounded" bind:this={chatMessagesContainer}>
        {#if $connectionError}
          <div class="message system p-2 mb-3 bg-red-100 text-red-800 rounded">
            {$connectionError}
          </div>
        {/if}
        
        {#if $messages.length === 0}
          <div class="flex items-center justify-center h-full">
            <p class="text-gray-500 text-center">
              Welcome to the AI Counsellor! Ask me anything about college admissions, courses, or career paths.
            </p>
          </div>
        {:else}
          {#each $messages as message}
            <div class="message mb-3 {message.role === 'user' ? 'user' : message.role === 'system' ? 'system' : 'bot'}">
              <div class="p-3 rounded-lg inline-block max-w-[85%] {message.role === 'user' ? 'bg-blue-500 text-white ml-auto' : message.role === 'system' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'}">
                {message.content}
                {#if message.role === 'assistant' && !message.isComplete}
                  <span class="typing-indicator">▌</span>
                {/if}
              </div>
            </div>
          {/each}
        {/if}
      </div>
      
      <!-- Chat input form -->
      <div class="mt-4">
        <form on:submit|preventDefault={handleSubmit} class="flex">
          <input
            type="text"
            bind:value={userInput}
            placeholder="Type your message here..."
            class="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!$isConnected}
          />
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!$isConnected || userInput.trim() === ''}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
