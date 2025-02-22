<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { chatStore } from '$lib/stores';
  import { get } from 'svelte/store';
  import md5 from 'blueimp-md5';

  let message = '';
  let chatId = '';
  let isLoading = false;
  // Reference to the scrollable container.
  let chatMessagesContainer: HTMLDivElement;
  
  onMount(() => {
    chatId = localStorage.getItem('chat_id') || '';
    if (!chatId) {
      chatId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chat_id', chatId);
    }
  });
  
  function computeHash(messages: { role: string, content: string }[]) {
    // Concatenate the 'content' of each message to form the final string
    let messagesStr = '';
    messages.forEach((message) => {
      messagesStr += message.content; // Assuming message has a 'content' field
    });

    // Return the MD5 hash of the concatenated string
    return md5(messagesStr);
  }

  async function sendMessage() {
  if (!message.trim()) return;
  isLoading = true;
  
  // Save the current (in-sync) conversation
  const originalConversation = get(chatStore);
  
  // Compute the hash using the modified function (now using the 'content' of messages)
  const chatHash = computeHash(originalConversation); // MD5 hash of the conversation
  
  // Prepare optimistic updates:
  const optimisticUserMsg = { role: 'user', content: message };
  const loadingMsg = { role: 'assistant', content: 'Loading...' };
  
  // Immediately update the UI without affecting the hash computation.
  chatStore.set([...originalConversation, optimisticUserMsg, loadingMsg]);
  
  // Prepare the payload using the original conversation.
  const payload = {
    chat_id: chatId,
    prompt: message,
    chat_hash: chatHash
  };

  try {
    let res = await fetch('https://api.collegepredictor.co.in/api/chat/generate-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('Request:', payload);

    // If a sync is required, re-send with the full conversation.
    if (res.status === 409) {
      console.warn('Sync required. Resending full conversation...');
      const syncPayload = {
        chat_id: chatId,
        prompt: message,
        messages: originalConversation, // full conversation for syncing
        chat_hash: chatHash,
        sync_required: true
      };
      res = await fetch('https://api.collegepredictor.co.in/api/chat/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncPayload)
      });

      console.log('Sync Request:', syncPayload);
    }
    
    // If the response status is not OK, throw an error.
    if (!res.ok) {
      throw new Error("Request failed with status " + res.status);
    }
    
    const data = await res.json();
    
    console.log('Response:', data);
    // Validate that the server returned a proper assistant response.
    if (!data.response || typeof data.response !== 'string') {
      throw new Error("Invalid response from server");
    }
    
    // Replace the optimistic loading message with the actual response.
    const newConversation = [
      ...originalConversation,
      optimisticUserMsg,
      { role: 'assistant', content: data.response }
    ];
    chatStore.set(newConversation);
  } catch (error) {
    console.error('Error:', error);
    // On error, revert to the original conversation (i.e. do not store the new user message)
    chatStore.set(originalConversation);
  }
  
  // Reset the message and loading flag.
  message = '';
  isLoading = false;
}

  
  function clearChat() {
    chatStore.set([]);
    localStorage.removeItem('chat_id');
    // Generate a new chat id for a new conversation.
    chatId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chat_id', chatId);
  }

  // After each update, scroll the chat container to the bottom.
  afterUpdate(() => {
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  });
</script>


<!-- Full Page Container (Keeps everything at a fixed height) -->
<div class="flex flex-col flex-1 p-4">
  <!-- Flex container splitting into 3:1 ratio -->
  <div class="flex flex-1 h-full gap-2">
    <!-- Left Container: 75% width (Scrolls when content overflows) -->
    <div class="w-3/4 bg-white rounded-lg shadow-lg p-4 h-[calc(100vh-14rem)] overflow-y-auto">
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

    <!-- Right Container: 25% width -->
    <div class="w-1/4 bg-white rounded-lg shadow-lg p-4 h-[calc(100vh-14rem)] flex flex-col">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Chat with AI</h3>
      <button class="btn btn-blue" on:click={clearChat}>Clear Chat</button>
      <!-- Chat messages container without justify-end -->
      <div
        class="flex-grow min-h-0 overflow-y-auto flex flex-col space-y-4 mb-4"
        bind:this={chatMessagesContainer}
      >
        {#each $chatStore as msg}
          <div
            class="max-w-xs p-2 rounded-lg
              {msg.role === 'user'
                ? 'bg-blue-100 self-end translate-x'
                : 'bg-green-100 self-start -translate-x'}"
          >
            <strong class="block text-sm mb-1">{msg.role === 'user' ? 'user' : 'AI'}</strong>
            <p class="text-gray-700 text-sm">{msg.content}</p>
          </div>
        {/each}
        <!-- Dummy spacer to push messages to the bottom when there's little content -->
        <div class="mt-auto"></div>
      </div>

      <!-- Message input and send button -->
      <div class="flex">
        <input
          class="flex-grow rounded-lg border border-gray-300 p-2 mr-2"
          type="text"
          bind:value={message}
          placeholder="Type your message..."
          on:keydown={(e) => e.key === 'Enter' && sendMessage()} />
        <button
          type="button" 
          class="rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          on:click={sendMessage} disabled={isLoading}
        >{isLoading ? 'Sending...' : 'Send'}</button>
      </div>
    </div>
  </div>
</div>
