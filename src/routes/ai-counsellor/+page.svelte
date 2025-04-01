<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import { browser } from '$app/environment';
  import { messages, isConnected, isConnecting, connectionError, initWebSocket, sendMessage, closeWebSocket } from '$lib/stores/chatStore';

  // Slider state: right (chat) container width (in percent)
  // Enforced to be between 25% and 60%
  let chatRightWidth = 30; // initial value (slightly wider for chat)
  let chatLeftWidth = 100 - chatRightWidth;
  let isDragging = false;

  // Reference to the overall container (for slider math)
  let container: HTMLDivElement;
  let chatMessagesContainer: HTMLDivElement;
  let userInput = '';
  
  // For typewriter effect
  let currentStreamingMsgEl: HTMLElement | null = null;
  let typewriterChain = Promise.resolve();

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

    <!-- Right Container (Chat panel) -->
    <div
      class="bg-white rounded shadow-lg p-4 h-[calc(100vh-6rem)] flex flex-col"
      style="width: {chatRightWidth}%"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-800">AI Counsellor</h3>
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
            <div class="message mb-3 {message.sender === 'user' ? 'user' : message.sender === 'system' ? 'system' : 'bot'}">
              <div class="p-3 rounded-lg inline-block max-w-[85%] {message.sender === 'user' ? 'bg-blue-500 text-white ml-auto' : message.sender === 'system' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'}">
                {message.message}
                {#if message.sender === 'bot' && !message.isComplete}
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
