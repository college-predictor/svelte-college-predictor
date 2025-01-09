<script>
  
    let userMessage = '';
    let messages = [
        {"sender": "unibot", "text": "How can I help you?"}
    ];
    
    function sendMessage() {
      return "Hello World1";
      
      // Here you would call your AI endpoint, for example:
      // fetch('/api/ai-endpoint', { ... })
      //   .then(res => res.json())
      //   .then(data => {
      //     aiChatStore.update(msgs => [...msgs, { sender: 'ai', text: data.answer }]);
      //   });
    }
  </script>
  
  <div class="flex min-h-screen">
    <!-- Left side (AI-generated content) -->
    <div class="w-9/12 p-6 bg-gray-100 overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4">AI Recommendations</h2>
      <p class="mb-2 text-gray-700">
        Here you'll see AI-generated insights, recommended colleges, exam strategies, 
        and other personalized data for the user.
      </p>
      <!-- Possibly more dynamic content or feed from AI -->
    </div>
  
    <!-- Right side (Chat Interface) -->
    <div class="w-3/12 border-l border-gray-300 p-4 flex flex-col">
      <h3 class="text-lg font-semibold mb-2">Chat with AI</h3>
      <div class="flex-grow overflow-y-auto mb-4 border rounded p-2">
        {#each messages as msg, i}
          <div class="mb-2">
            <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
          </div>
        {/each}
      </div>
      <div class="flex">
        <input 
          type="text" 
          class="flex-grow border border-gray-300 rounded px-2 py-1 mr-2"
          placeholder="Ask a question..."
          bind:value={userMessage}
        />
        <button 
          class="bg-blue-600 text-white px-4 py-1 rounded" 
          on:click={sendMessage}>
          Send
        </button>
      </div>
    </div>
  </div>
  