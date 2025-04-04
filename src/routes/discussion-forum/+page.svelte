<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { faPlus, faPaperPlane, faTimes, faImage, faTrash } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  // Chat messages store
  let messages = [];
  let newMessage = '';
  let showQuestionModal = false;
  let fileInput;
  let currentUser = null;
  
  // Question form data
  let questionForm = {
    question: '',
    questionImage: null,
    optionA: { text: '', image: null },
    optionB: { text: '', image: null },
    optionC: { text: '', image: null },
    optionD: { text: '', image: null },
    difficulty: 3,
    myAnswer: '',
    messageType: '',
    customMessage: ''
  };

  // Predefined message types
  const messageTypes = [
    { value: '', label: 'Type your message here...' },
    { value: 'is_correct', label: 'Is this option correct?' },
    { value: 'what_answer', label: 'What is the answer to this question?' },
    { value: 'difficulty', label: 'What is its difficulty level?' },
    { value: 'how_solve', label: 'How to solve this?' },
    { value: 'is_wrong', label: 'Is this question wrong?' },
    { value: 'custom', label: 'Write your own...' }
  ];

  // Answer options
  const answerOptions = [
    { value: '', label: 'Select your answer' },
    { value: 'A', label: 'Option A' },
    { value: 'B', label: 'Option B' },
    { value: 'C', label: 'Option C' },
    { value: 'D', label: 'Option D' }
  ];

  // Preview images
  let questionImagePreview = '';
  let optionImagePreviews = {
    A: '',
    B: '',
    C: '',
    D: ''
  };

  onMount(() => {
    // Initialize user
    currentUser = initializeUser();

    // Load messages from localStorage if available
    const storedMessages = localStorage.getItem('discussion-forum-messages');
    if (storedMessages) {
      messages = JSON.parse(storedMessages);
    } else {
      // Add a welcome message if no messages exist
      messages = [
        {
          id: 1,
          user: 'System',
          content: 'Welcome to the JEE Discussion Forum! Ask questions or share your knowledge with fellow students.',
          timestamp: new Date().toISOString(),
          isQuestion: false
        }
      ];
      saveMessages();
    }
  });

  function saveMessages() {
    localStorage.setItem('discussion-forum-messages', JSON.stringify(messages));
  }

  // Username generation data with emojis
  const adjectives = ['Tiny', 'Witty', 'Quirky', 'Zippy', 'Cozy', 'Perky', 'Snazzy', 'Jolly', 'Peppy', 'Zesty'];
  const nouns = ['Panda🐼', 'Fox🦊', 'Owl🦉', 'Bear🐻', 'Cat😺', 'Wolf🐺', 'Duck🦆', 'Lion🦁', 'Tiger🐯', 'Koala🐨'];
  const colors = ['text-blue-800', 'text-green-800', 'text-purple-800', 'text-red-800', 'text-indigo-800', 'text-pink-800'];

  function generateUsername() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const name = `${adjective}${noun}`;
    const color = colors[Math.floor(Math.random() * colors.length)];
    return { name, color };
  }

  function initializeUser() {
    let user = localStorage.getItem('forum-user');
    if (!user) {
      user = JSON.stringify(generateUsername());
      localStorage.setItem('forum-user', user);
    }
    return JSON.parse(user);
  }

  function sendMessage() {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      user: currentUser.name,
      userColor: currentUser.color,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isQuestion: false
    };
    
    messages = [...messages, message];
    saveMessages();
    newMessage = '';
    
    // Auto-scroll to bottom
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
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
      optionA: { text: '', image: null },
      optionB: { text: '', image: null },
      optionC: { text: '', image: null },
      optionD: { text: '', image: null },
      difficulty: 3,
      myAnswer: '',
      messageType: '',
      customMessage: ''
    };
    
    questionImagePreview = '';
    optionImagePreviews = { A: '', B: '', C: '', D: '' };
  }

  function handleQuestionImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      questionForm.questionImage = file;
      const reader = new FileReader();
      reader.onload = e => {
        questionImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  function handleOptionImageUpload(event, option) {
    const file = event.target.files[0];
    if (file) {
      questionForm[`option${option}`].image = file;
      const reader = new FileReader();
      reader.onload = e => {
        optionImagePreviews[option] = e.target.result;
      };
      reader.readAsDataURL(file);
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

  function submitQuestion() {
    // Validate form
    if (!questionForm.question.trim() && !questionForm.questionImage) {
      alert('Please provide a question text or image');
      return;
    }

    // Create question content HTML
    let questionContent = '';
    
    if (questionForm.question.trim()) {
      questionContent += `<p class="mb-2">${questionForm.question}</p>`;
    }
    
    if (questionForm.questionImage) {
      questionContent += `<div class="mb-3"><img src="${questionImagePreview}" alt="Question Image" class="max-w-full rounded"></div>`;
    }
    
    questionContent += '<div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">';
    
    const options = ['A', 'B', 'C', 'D'];
    options.forEach(opt => {
      const option = questionForm[`option${opt}`];
      if (option.text.trim() || option.image) {
        questionContent += `<div class="p-2 border border-gray-300 rounded">`;
        questionContent += `<span class="font-bold">${opt}:</span> `;
        
        if (option.text.trim()) {
          questionContent += `<span>${option.text}</span>`;
        }
        
        if (option.image) {
          questionContent += `<div class="mt-1"><img src="${optionImagePreviews[opt]}" alt="Option ${opt} Image" class="max-w-full rounded"></div>`;
        }
        
        questionContent += '</div>';
      }
    });
    
    questionContent += '</div>';
    questionContent += `<div class="mt-3 text-sm text-gray-600">Difficulty: ${'★'.repeat(questionForm.difficulty)}${'☆'.repeat(5 - questionForm.difficulty)}</div>`;
    
    // Add message type and answer
    if (questionForm.myAnswer) {
      questionContent += `<div class="mt-1 text-sm text-green-600">My Answer: Option ${questionForm.myAnswer}</div>`;
    }

    if (questionForm.messageType) {
      const messageText = questionForm.messageType === 'custom' ? questionForm.customMessage : messageTypes.find(t => t.value === questionForm.messageType)?.label;
      if (messageText) {
        questionContent += `<div class="mt-2 text-sm text-indigo-600">${messageText}</div>`;
      }
    }
    
    const message = {
      id: Date.now(),
      user: currentUser.name,
      userColor: currentUser.color,
      content: questionContent,
      timestamp: new Date().toISOString(),
      isQuestion: true
    };
    
    messages = [...messages, message];
    saveMessages();
    closeQuestionModal();
    
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
      <h1 class="text-2xl font-bold">JEE Discussion Forum</h1>
      <p class="text-sm opacity-80">Connect with fellow students, ask questions, and share knowledge</p>
    </div>
    
    <!-- Chat area -->
    <div class="flex flex-col h-[calc(100vh-16rem)]">
      <!-- Messages -->
      <div class="chat-messages flex-grow p-4 overflow-y-auto">
        {#each messages as message (message.id)}
          <div class="mb-4 text-right">
            <div class="inline-block max-w-[80%] {message.user === 'System' ? 'bg-yellow-100' : 'bg-gray-100'} rounded-lg p-3 shadow-sm text-left">
              <div class="flex justify-between items-start mb-1">
                <span class="font-semibold text-sm {message.user === 'System' ? 'text-yellow-800' : message.userColor}">{message.user}</span>
                <span class="text-xs text-gray-500 ml-2">{formatTimestamp(message.timestamp)}</span>
              </div>
              
              {#if message.isQuestion}
                <div class="question-content">
                  {@html message.content}
                </div>
              {:else}
                <p>{message.content}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
      
      <!-- Input area -->
      <div class="border-t border-gray-200 p-4 bg-gray-50">
        <div class="flex items-center gap-2">
          <input 
            type="text" 
            bind:value={newMessage} 
            placeholder="Type your message here..." 
            class="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            on:keypress={(e) => e.key === 'Enter' && sendMessage()}
          />
          
          <button 
            class="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed mr-2"
            on:click={sendMessage}
            disabled={!newMessage.trim()}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
          
          <button 
            class="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 transition duration-200 flex items-center gap-2"
            on:click={openQuestionModal}
            title="Add Question"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Upload Question</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Question Modal -->
{#if showQuestionModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" transition:fade={{ duration: 200 }}>
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" transition:scale={{ duration: 200, start: 0.95 }}>
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white flex justify-between items-center">
        <h2 class="text-xl font-bold">Add Question</h2>
        <button class="text-white hover:text-gray-200" on:click={closeQuestionModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <!-- Modal Body -->
      <div class="p-6">
        <form on:submit|preventDefault={submitQuestion}>
          <!-- Question -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Question</label>
            <textarea 
              bind:value={questionForm.question} 
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter your question here..."
            ></textarea>
            
            <!-- Question Image Upload -->
            <div class="mt-2 flex items-center">
              <button 
                type="button" 
                class="flex items-center text-sm text-blue-600 hover:text-blue-800"
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
              <div class="mt-2 relative inline-block">
                <img src={questionImagePreview} alt="Question Preview" class="max-h-40 rounded border border-gray-300" />
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
          <div class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each ['A', 'B', 'C', 'D'] as option}
              <div class="border border-gray-200 rounded-lg p-3">
                <label class="block text-gray-700 font-medium mb-2">Option {option}</label>
                <input 
                  type="text" 
                  bind:value={questionForm[`option${option}`].text} 
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter option ${option}...`}
                />
                
                <!-- Option Image Upload -->
                <div class="flex items-center">
                  <button 
                    type="button" 
                    class="flex items-center text-sm text-blue-600 hover:text-blue-800"
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
                  <div class="mt-2 relative inline-block">
                    <img src={optionImagePreviews[option]} alt={`Option ${option} Preview`} class="max-h-32 rounded border border-gray-300" />
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
          <div class="mb-6">
            <label class="block text-gray-700 font-medium mb-2">
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
          
          <!-- My Answer Dropdown -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">My Answer</label>
            <select
              bind:value={questionForm.myAnswer}
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {#each answerOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>

          <!-- Message Type Dropdown -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Message Type</label>
            <select
              bind:value={questionForm.messageType}
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            >
              {#each messageTypes as type}
                <option value={type.value}>{type.label}</option>
              {/each}
            </select>

            {#if questionForm.messageType === 'custom'}
              <textarea
                bind:value={questionForm.customMessage}
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Write your question here..."
              ></textarea>
            {/if}
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button 
              type="button" 
              class="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-100 transition duration-200"
              on:click={closeQuestionModal}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
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