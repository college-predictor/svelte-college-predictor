<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { faPlus, faPaperPlane, faTimes, faImage, faTrash, faUsers, faCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { browser } from '$app/environment';
  import { 
    messages, 
    currentUser, 
    isConnected, 
    isConnecting, 
    connectionError, 
    activeUsers,
    initWebSocket, 
    closeWebSocket, 
    sendTextMessage, 
    sendQuestion, 
    initializeUser,
    getClientId,
    getQuestionById
  } from '$lib/stores/forumStore';
  
  // Get access to the socket for sending answer selections
  import { socket } from '$lib/stores/forumStore';
  
  // Import additional icons for option selection
  import { faHandPointRight } from '@fortawesome/free-solid-svg-icons';

  // Local variables
  let newMessage = '';
  let showQuestionModal = false;
  let fileInput;
  let chatContainer; // Reference to chat container for auto-scrolling
  
  // Question form data
  let questionForm = {
    question: '',
    questionImage: null,
    optionA: { text: '', image: null, selected: false },
    optionB: { text: '', image: null, selected: false },
    optionC: { text: '', image: null, selected: false },
    optionD: { text: '', image: null, selected: false },
    difficulty: 3,
    message: '',
    shiftDate: '',
    shiftType: 'day'
  };

  // Shift dates and types
  const shiftDates = ['3 April', '4 April', '5 April', '6 April'];
  const shiftTypes = ['day', 'night'];

  // Preview images
  let questionImagePreview = '';
  let optionImagePreviews = {
    A: '',
    B: '',
    C: '',
    D: ''
  };

  onMount(() => {
    if (browser) {
      // Initialize WebSocket connection
      initWebSocket();
      
      // Initialize user (now handled by the store)
      $currentUser = initializeUser();
      
      // Add event listener for option selection in questions
      document.addEventListener('selectQuestionOption', (event) => {
        const { messageId, option } = event.detail;
        if (messageId && option) {
          selectAnswerInQuestion(messageId, option);
        }
      });
    }
  });
  
  onDestroy(() => {
    if (browser) {
      // Close WebSocket connection
      closeWebSocket();
      
      // Remove event listener for option selection
      document.removeEventListener('selectQuestionOption', (event) => {
        const { messageId, option } = event.detail;
        if (messageId && option) {
          selectAnswerInQuestion(messageId, option);
        }
      });
    }
  });
  
  afterUpdate(() => {
    // Scroll to the bottom of the chat container when new messages arrive
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });

  // These functions are now handled by the forumStore
  // Username generation, user initialization, and message persistence
  // are all managed in the store

  function sendMessage() {
    if (!newMessage.trim()) return;
    
    // Use the WebSocket store to send the message
    // sendTextMessage now returns the message ID for tracking
    const messageId = sendTextMessage(newMessage);
    newMessage = '';
    
    // Auto-scrolling is now handled by afterUpdate
  }

  function openQuestionModal() {
    showQuestionModal = true;
  }

  function closeQuestionModal() {
    showQuestionModal = false;
    resetQuestionForm();
  }

  function resetQuestionForm() {
    questionForm = {
      question: '',
      questionImage: null,
      optionA: { text: '', image: null, selected: false },
      optionB: { text: '', image: null, selected: false },
      optionC: { text: '', image: null, selected: false },
      optionD: { text: '', image: null, selected: false },
      difficulty: 3,
      message: '',
      shiftDate: '3 April',
      shiftType: 'day'
    };
    
    questionImagePreview = '';
    optionImagePreviews = { A: '', B: '', C: '', D: '' };
  }

  // Function to resize image and convert to base64 (max 150x150)
  async function resizeAndConvertToBase64(file, maxWidth = 150, maxHeight = 150, quality = 0.6) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
          
          // Create canvas and resize
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64
          const base64 = canvas.toDataURL('image/jpeg', quality);
          resolve(base64);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleQuestionImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      // Resize and convert to base64
      questionImagePreview = await resizeAndConvertToBase64(file);
      questionForm.questionImage = questionImagePreview;
    }
  }

  async function handleOptionImageUpload(event, option) {
    const file = event.target.files[0];
    if (file) {
      // Resize and convert to base64 (max 150x150)
      optionImagePreviews[option] = await resizeAndConvertToBase64(file, 150, 150, 0.6);
      questionForm[`option${option}`].image = optionImagePreviews[option];
    }
  }

  function removeQuestionImage() {
    questionForm.questionImage = null;
    questionImagePreview = '';
  }

  function removeOptionImage(option) {
    questionForm[`option${option}`].image = null;
    optionImagePreviews[option] = '';
  }

  function selectOption(option) {
    // Deselect all options first
    ['A', 'B', 'C', 'D'].forEach(opt => {
      questionForm[`option${opt}`].selected = false;
    });
    
    // Select the clicked option
    questionForm[`option${option}`].selected = true;
  }
  
  function submitQuestion() {
    // Validate form
    if (!questionForm.question.trim() && !questionForm.questionImage) {
      alert('Please provide a question text or image');
      return;
    }
    
    // Validate shift date is selected
    if (!questionForm.shiftDate) {
      alert('Please select a shift date');
      return;
    }
    
    // Prepare question data for WebSocket
    const questionData = {
      type: 'question',
      question: questionForm.question.trim(),
      questionImage: questionForm.questionImage,
      options: {
        A: questionForm.optionA,
        B: questionForm.optionB,
        C: questionForm.optionC,
        D: questionForm.optionD
      },
      difficulty: questionForm.difficulty,
      message: questionForm.message,
      shiftDate: questionForm.shiftDate,
      shiftType: questionForm.shiftType
    };
    
    // Use the WebSocket store to send the question
    var questionId = sendQuestion(questionData);
    
    sendTextMessage(questionForm.message, questionId);
    
    closeQuestionModal();
  }
  
  // Function to handle option selection in displayed questions
  function selectAnswerInQuestion(messageId, optionKey) {
    // Update the local messages store
    messages.update(msgs => {
      return msgs.map(msg => {
        if (msg.id === messageId) {
          // Create a new content string with the selected option
          let updatedContent = msg.content;
          
          // Find all option divs and update the selected one
          const optionKeys = ['A', 'B', 'C', 'D'];
          optionKeys.forEach(key => {
            // Replace the class for the option div
            const isSelected = key === optionKey;
            const oldClass = isSelected ? 'border-gray-300' : 'bg-blue-100 border-blue-500';
            const newClass = isSelected ? 'bg-blue-100 border-blue-500' : 'border-gray-300';
            
            // Update the class in the content
            updatedContent = updatedContent.replace(
              new RegExp(`<div class="p-2 border (${oldClass}|${newClass}) rounded`, 'g'),
              `<div class="p-2 border ${isSelected ? newClass : oldClass} rounded`
            );
            
            // Add or remove the selected answer text
            if (isSelected) {
              // Check if this option already has the selected text
              const optionSection = updatedContent.match(new RegExp(`<div class="p-2 border ${newClass} rounded[^>]*>[\s\S]*?<span class="font-bold">${key}:</span>[\s\S]*?</div>`, 'g'));
              
              if (optionSection && optionSection[0] && !optionSection[0].includes('✓ Selected Answer')) {
                // Add selected answer text
                updatedContent = updatedContent.replace(
                  optionSection[0],
                  optionSection[0].replace('</div>', '<div class="mt-1 text-sm font-medium text-green-600">✓ Selected Answer</div></div>')
                );
              }
            } else {
              // Remove selected answer text if it exists
              updatedContent = updatedContent.replace(
                new RegExp(`<div class="mt-1 text-sm font-medium text-green-600">✓ Selected Answer</div>`, 'g'),
                ''
              );
            }
          });
          
          // Send the selection to the server
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'question_answer',
              messageId: messageId,
              selectedOption: optionKey
            }));
          }
          
          return { ...msg, content: updatedContent };
        }
        return msg;
      });
    });
  }
</script>

<!-- <div class="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
  <div class="bg-white rounded-lg shadow-lg overflow-hidden"> -->
    <!-- Header -->
    <div class="fixed top-16 left-0 right-0 z-40 bg-gray-200 sm:p-2 text-black">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div class="mb-2 sm:mb-0">
          <h1 class="text-xl sm:text-2xl font-semibold">JEE Discussion Forum</h1>
          <p class="text-xs sm:text-sm opacity-80">Connect with fellow students, ask questions, and share knowledge</p>
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Active users indicator -->
          <div class="flex items-center text-xs sm:text-sm">
            <FontAwesomeIcon icon={faUsers} class="mr-1" />
            <span>{$activeUsers} online</span>
          </div>
          
          <!-- Connection status indicator -->
          <div class="flex items-center">
            {#if $isConnecting}
              <span class="inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400 mr-1 sm:mr-2"></span>
              <span class="text-xs sm:text-sm">Connecting...</span>
            {:else if $isConnected}
              <span class="inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 mr-1 sm:mr-2"></span>
              <span class="text-xs sm:text-sm">Connected</span>
            {:else}
              <span class="inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 mr-1 sm:mr-2"></span>
              <span class="text-xs sm:text-sm">Disconnected</span>
            {/if}
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="mt-32"> -->
    
    <!-- Chat area -->
    <div class="flex flex-col h-screen bg-white">
      <div class="flex-1 overflow-y-auto chat-messages" bind:this={chatContainer}>
        {#if $messages.length === 0}
          <div class="flex items-center justify-center h-full text-gray-500 text-sm">
            No messages yet
          </div>
        {:else}
          {#each $messages as message}
            <div class="mb-2 sm:mb-4 {message.user_id === getClientId() ? 'text-right' : 'text-left'}">
              <div class="inline-block max-w-[90%] sm:max-w-[80%] {message.user === 'System' ? 'bg-yellow-100' : message.user_id === getClientId() ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg p-2 sm:p-3 shadow-sm {message.user_id === getClientId() ? 'text-right' : 'text-left'} {message.status === 'pending' ? 'opacity-60' : 'opacity-100'} transition-opacity duration-200">
                <div class="flex justify-between items-start mb-1">
                  <span class="font-semibold text-xs sm:text-sm {message.user === 'System' ? 'text-yellow-800' : message.userColor}">{message.user}</span>
                  {#if message.status === 'pending' && message.user_id === getClientId()}
                    <span class="text-xs text-gray-500 ml-2">Sending...</span>
                  {/if}
                </div>
                <p class="text-xs sm:text-sm">{message.content}</p>
                <!-- <div class="text-xs text-gray-500 mt-1">
                  {#if message.timestamp}
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  {/if}
                  {#if message.id}
                    <span class="ml-2">ID: {message.id}</span>
                  {/if}
                  {#if message.user_id}
                    <span class="ml-2">User ID: {message.user_id}</span>
                  {/if}
                  {#if message.type}
                    <span class="ml-2">Type: {message.type}</span>
                  {/if}
                  {#if message.status}
                    <span class="ml-2">Status: {message.status}</span>
                  {/if}
                  {#if message.hasQuestion}
                    <span class="ml-2">Has Question: {message.hasQuestion}</span>
                  {/if}
                  {#if message.questionId}
                    <span class="ml-2">Question ID: {message.questionId}</span>
                  {/if}
                </div> -->
                {#if message.hasQuestion}
                  <div class="text-xs sm:text-sm mt-2">                    
                    <span class="inline-block bg-gray-100 border border-gray-200 rounded px-2 py-1">
                      {#if message.questionHtml}
                        <span class="text-gray-700">{@html message.questionHtml}</span>
                      {:else}
                        {#await getQuestionById(message.questionId) then html}
                        <span class="text-gray-700">{@html html}</span>
                      {/await}
                      {/if}
                    </span>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        {/if}
      </div>
      
      <!-- Input area - sticky at bottom -->
      <div class="sticky bottom-0 border-t border-gray-200 p-2 sm:p-4 bg-gray-50">
        <div class="flex items-center gap-1 sm:gap-2">
          <input 
            type="text" 
            bind:value={newMessage} 
            placeholder="Type your message here..." 
            class="flex-grow border border-gray-300 rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            on:keypress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={!$isConnected}
          />
          
          <button 
            class="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-2 sm:px-4 py-1 sm:py-2 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed mr-1 sm:mr-2 text-xs sm:text-sm"
            on:click={sendMessage}
            disabled={!$isConnected || !newMessage.trim()}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
          
          <button 
            class="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-2 sm:px-4 py-1 sm:py-2 transition duration-200 flex items-center gap-1 sm:gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs sm:text-sm"
            on:click={openQuestionModal}
            title="Add Question"
            disabled={!$isConnected}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span class="hidden sm:inline">Upload Question</span>
            <span class="inline sm:hidden">Q</span>
          </button>
        </div>
      </div>
    </div>
  <!-- </div>
</div> -->

<!-- Question Modal -->
{#if showQuestionModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2" transition:fade={{ duration: 200 }}>
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" transition:scale={{ duration: 200, start: 0.95 }}>
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 sm:p-4 text-white flex justify-between items-center">
        <h2 class="text-lg sm:text-xl font-bold">Add Question</h2>
        <button class="text-white hover:text-gray-200" on:click={closeQuestionModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <!-- Modal Body -->
      <div class="p-3 sm:p-6">
        <form on:submit|preventDefault={submitQuestion}>
          <!-- Shift Date Selection (Moved to top) -->
          <div class="mb-3 sm:mb-4">
            <label class="block text-gray-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">Shift Date <span class="text-red-500">*</span></label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {#each shiftDates as date}
                <button 
                  type="button"
                  class="px-2 py-1 border rounded-lg text-xs sm:text-sm {questionForm.shiftDate === date ? 'bg-blue-100 border-blue-400' : 'border-gray-300 hover:bg-gray-50'}"
                  on:click={() => questionForm.shiftDate = date}
                >
                  {date}
                </button>
              {/each}
            </div>
            {#if questionForm.shiftDate === ''}
              <p class="text-xs text-red-500 mt-1">Please select a shift date</p>
            {/if}
          </div>

          <!-- Shift Type Selection (Moved to top) -->
          <div class="mb-3 sm:mb-4">
            <label class="block text-gray-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">Shift Type <span class="text-red-500">*</span></label>
            <div class="flex gap-4">
              {#each shiftTypes as type}
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    name="shiftType" 
                    value={type} 
                    bind:group={questionForm.shiftType}
                    class="mr-1"
                  />
                  <span class="text-xs sm:text-sm capitalize">{type}</span>
                </label>
              {/each}
            </div>
          </div>
          
          <!-- Question -->
          <div class="mb-3 sm:mb-4">
            <label class="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm">Question</label>
            <textarea 
              bind:value={questionForm.question} 
              class="w-full border border-gray-300 rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter your question here..."
            ></textarea>
            
            <!-- Question Image Upload -->
            <div class="mt-1 sm:mt-2 flex items-center">
              <button 
                type="button" 
                class="flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                on:click={() => fileInput.click()}
              >
                <FontAwesomeIcon icon={faImage} class="mr-1" />
                Add Image
              </button>
              <input 
                type="file" 
                accept="image/*" 
                class="hidden" 
                bind:this={fileInput}
                on:change={handleQuestionImageUpload}
              />
            </div>
            
            <!-- Question Image Preview -->
            {#if questionImagePreview}
              <div class="mt-1 sm:mt-2 relative inline-block">
                <img src={questionImagePreview} alt="Question Preview" class="max-h-32 sm:max-h-40 rounded border border-gray-300" />
                <button 
                  type="button" 
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  on:click={removeQuestionImage}
                >
                  <FontAwesomeIcon icon={faTrash} size="xs" />
                </button>
              </div>
            {/if}
          </div>
          
          <!-- Options -->
          <div class="mb-3 sm:mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {#each ['A', 'B', 'C', 'D'] as option}
              <div class="border border-gray-200 rounded-lg p-2 sm:p-3 {questionForm[`option${option}`].selected ? 'bg-blue-50 border-blue-300' : ''}">
                <div class="flex items-center justify-between mb-1 sm:mb-2">
                  <label class="block text-gray-700 font-medium text-xs sm:text-sm">Option {option}</label>
                  <button 
                    type="button" 
                    class="flex items-center justify-center w-5 h-5 rounded-full focus:outline-none"
                    on:click={() => selectOption(option)}
                  >
                    <FontAwesomeIcon 
                      icon={questionForm[`option${option}`].selected ? faCheckCircle : faCircle} 
                      class="{questionForm[`option${option}`].selected ? 'text-blue-500' : 'text-gray-400'} text-lg"
                    />
                  </button>
                </div>
                
                <input 
                  type="text" 
                  bind:value={questionForm[`option${option}`].text} 
                  class="w-full border border-gray-300 rounded-lg px-2 sm:px-4 py-1 sm:py-2 mb-1 sm:mb-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter option ${option}...`}
                />
                
                <!-- Option Image Upload -->
                <div class="flex items-center">
                  <button 
                    type="button" 
                    class="flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                    on:click={() => document.getElementById(`option${option}FileInput`).click()}
                  >
                    <FontAwesomeIcon icon={faImage} class="mr-1" />
                    Add Image
                  </button>
                  <input 
                    id={`option${option}FileInput`}
                    type="file" 
                    accept="image/*" 
                    class="hidden" 
                    on:change={(e) => handleOptionImageUpload(e, option)}
                  />
                </div>
                
                <!-- Option Image Preview -->
                {#if optionImagePreviews[option]}
                  <div class="mt-1 sm:mt-2 relative inline-block">
                    <img src={optionImagePreviews[option]} alt={`Option ${option} Preview`} class="max-h-24 sm:max-h-32 rounded border border-gray-300" />
                    <button 
                      type="button" 
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      on:click={() => removeOptionImage(option)}
                    >
                      <FontAwesomeIcon icon={faTrash} size="xs" />
                    </button>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
          
          <!-- Difficulty Slider -->
          <div class="mb-4 sm:mb-6">
            <label class="block text-gray-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
              Difficulty: {questionForm.difficulty}
            </label>
            <input 
              type="range" 
              bind:value={questionForm.difficulty} 
              min="1" 
              max="5" 
              step="1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Easy</span>
              <span>Medium</span>
              <span>Hard</span>
            </div>
          </div>
          
          <!-- Shift Date and Type sections moved to the top of the form -->

          <!-- Message Textarea -->
          <div class="mb-3 sm:mb-4">
            <label class="block text-gray-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">Message</label>
            <textarea
              bind:value={questionForm.message}
              class="w-full border border-gray-300 rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button 
              type="button" 
              class="px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-100 transition duration-200 text-xs sm:text-sm"
              on:click={closeQuestionModal}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-xs sm:text-sm"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Custom scrollbar for chat messages */
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }
  
  .chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .chat-messages::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  /* Styling for range input (slider) */
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: #4f46e5;
    border-radius: 50%;
    cursor: pointer;
  }
  
  input[type=range]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #4f46e5;
    border-radius: 50%;
    cursor: pointer;
  }
</style>