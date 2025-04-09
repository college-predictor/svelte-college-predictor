<script lang="ts">
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import {
		faPlus,
		faPaperPlane,
		faTimes,
		faImage,
		faTrash,
		faUsers,
		faCircle,
		faCheckCircle
	} from '@fortawesome/free-solid-svg-icons';
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
	import { faHandPointRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';

	// Local variables
	let newMessage = '';
	let showQuestionModal = false;
	let fileInput;
	let chatContainer; // Reference to chat container for auto-scrolling
	let shouldAutoScroll = true; // Flag to track if we should auto-scroll
	let isUserScrolling = false; // Flag to track if user is manually scrolling
	let showScrollButton = false; // Flag to show scroll-to-bottom button

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

	// Function to check if user is at the bottom of the chat
	function isAtBottom() {
		if (!chatContainer) return true;

		const tolerance = 150; // pixels of tolerance for considering "at bottom"
		const scrollBottom = chatContainer.scrollTop + chatContainer.clientHeight;
		return scrollBottom >= chatContainer.scrollHeight - tolerance;
	}

	// Function to scroll to the bottom of the chat
	function scrollToBottom() {
		if (!chatContainer) return;

		chatContainer.scrollTop = chatContainer.scrollHeight + 100; // Extra padding to ensure visibility
	}

	// Handle scroll events to determine if user is manually scrolling
	function handleScroll() {
		isUserScrolling = true;
		shouldAutoScroll = isAtBottom();

		// Show scroll button if not at bottom
		showScrollButton = !shouldAutoScroll;

		// Reset the user scrolling flag after a short delay
		setTimeout(() => {
			isUserScrolling = false;
		}, 100);
	}

	// Watch for changes to the messages store and scroll to bottom when new messages arrive
	let previousMessagesLength = 0;

	// Function to handle new messages
	function handleNewMessages() {
		// Check if new messages have arrived
		if ($messages.length > previousMessagesLength) {
			// Only auto-scroll if we're already at the bottom or it's a new message from the current user
			if (shouldAutoScroll) {
				setTimeout(() => {
					scrollToBottom();
				}, 100);
			} else {
				// Show the scroll button if we're not auto-scrolling
				showScrollButton = true;
			}
		}

		// Update the previous messages length
		previousMessagesLength = $messages.length;
	}

	// Use afterUpdate to watch for changes to the messages store
	afterUpdate(() => {
		handleNewMessages();
	});

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

			// Scroll to bottom on initial load after a delay to ensure DOM is ready
			setTimeout(() => {
				scrollToBottom(); // Scroll to bottom on initial load

				// Add scroll event listener
				if (chatContainer) {
					chatContainer.addEventListener('scroll', handleScroll);
				}
			}, 300);
		}
	});

	onDestroy(() => {
		if (browser) {
			// Close WebSocket connection
			closeWebSocket();

			// Remove event listeners
			document.removeEventListener('selectQuestionOption', (event) => {
				const { messageId, option } = event.detail;
				if (messageId && option) {
					selectAnswerInQuestion(messageId, option);
				}
			});

			// Remove scroll event listener
			if (chatContainer) {
				chatContainer.removeEventListener('scroll', handleScroll);
			}
		}
	});

	// These functions are now handled by the forumStore
	// Username generation, user initialization, and message persistence
	// are all managed in the store

	function sendMessage() {
		if (!newMessage.trim()) return;

		// Use the WebSocket store to send the message
		// sendTextMessage now returns the message ID for tracking
		sendTextMessage(newMessage);
		newMessage = '';

		// Always scroll to bottom when user sends a message
		shouldAutoScroll = true;

		// Force an immediate scroll to the bottom after sending
		setTimeout(() => {
			scrollToBottom();
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
		['A', 'B', 'C', 'D'].forEach((opt) => {
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
		messages.update((msgs) => {
			return msgs.map((msg) => {
				if (msg.id === messageId) {
					// Create a new content string with the selected option
					let updatedContent = msg.content;

					// Find all option divs and update the selected one
					const optionKeys = ['A', 'B', 'C', 'D'];
					optionKeys.forEach((key) => {
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
							const optionSection = updatedContent.match(
								new RegExp(
									`<div class="p-2 border ${newClass} rounded[^>]*>[\s\S]*?<span class="font-bold">${key}:</span>[\s\S]*?</div>`,
									'g'
								)
							);

							if (
								optionSection &&
								optionSection[0] &&
								!optionSection[0].includes('✓ Selected Answer')
							) {
								// Add selected answer text
								updatedContent = updatedContent.replace(
									optionSection[0],
									optionSection[0].replace(
										'</div>',
										'<div class="mt-1 text-sm font-medium text-green-600">✓ Selected Answer</div></div>'
									)
								);
							}
						} else {
							// Remove selected answer text if it exists
							updatedContent = updatedContent.replace(
								new RegExp(
									`<div class="mt-1 text-sm font-medium text-green-600">✓ Selected Answer</div>`,
									'g'
								),
								''
							);
						}
					});

					// Send the selection to the server
					if (socket && socket.readyState === WebSocket.OPEN) {
						socket.send(
							JSON.stringify({
								type: 'question_answer',
								messageId: messageId,
								selectedOption: optionKey
							})
						);
					}

					return { ...msg, content: updatedContent };
				}
				return msg;
			});
		});
	}
</script>

<!-- Main container -->
<div class="w-full">
	<!-- Header with fixed position -->
	<div class="sticky top-0 z-50 rounded-t-lg bg-white p-3 shadow-md sm:p-4">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
			<div class="mb-2 sm:mb-0">
				<h1 class="text-xl font-semibold text-blue-600 sm:text-2xl">JEE Discussion Forum</h1>
				<p class="text-xs text-gray-600 sm:text-md">
					Connect with fellow students, ask questions, and share knowledge
				</p>
			</div>
			<div>
				<div class="justify-content flex items-center gap-2 sm:gap-4">
					<!-- Active users indicator -->
					<div class="flex items-center text-sm sm:text-md">
						<FontAwesomeIcon icon={faUsers} class="mr-1 text-blue-500" />
						<span class="font-medium">{$activeUsers} online</span>
					</div>

					<!-- Connection status indicator -->
					<div class="flex items-center text-sm sm:text-md">
						{#if $isConnecting}
							<span class="mr-1 inline-block h-3 w-3 animate-pulse rounded-full bg-yellow-400 sm:mr-2"></span>
							<span >Connecting...</span>
						{:else if $isConnected}
							<span class="mr-1 inline-block h-3 w-3 rounded-full bg-green-500 sm:mr-2"></span>
							<span class="font-medium text-green-700">Connected</span>
						{:else}
							<span class="mr-1 inline-block h-3 w-3 rounded-full bg-red-500 sm:mr-2"></span>
							<span class="font-medium text-red-700">Disconnected</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Chat area -->
	<div class="overflow-hidden rounded-b-lg bg-white shadow-md">
		<!-- Scroll to bottom button -->
		{#if showScrollButton}
			<button
				class="z-45 fixed bottom-20 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all hover:bg-blue-600"
				on:click={() => {
					shouldAutoScroll = true;
					showScrollButton = false;
					scrollToBottom();
				}}
				title="Scroll to bottom"
			>
				<FontAwesomeIcon icon={faArrowDown} />
			</button>
		{/if}

		<!-- Messages container with its own scrollbar -->
		<div
			class="h-[calc(100vh-14rem)] overflow-y-auto px-4 py-6"
			bind:this={chatContainer}
			on:scroll={handleScroll}
		>
			{#if $messages.length === 0}
				<div class="flex flex-col items-center justify-center py-16">
					<div class="mb-4 text-blue-500">
						<FontAwesomeIcon icon={faUsers} size="3x" />
					</div>
					<p class="max-w-md px-4 text-center text-lg text-gray-600">
						Welcome to the JEE Discussion Forum! Ask questions or share your knowledge with fellow
						students.
					</p>
				</div>
			{:else}
				{#each $messages as message}
					<div
						class="message-item mb-3 sm:mb-4 {message.user_id === getClientId()
							? 'text-right'
							: 'text-left'}"
					>
						<div
							class="inline-block max-w-[95%] sm:max-w-[80%] {message.user === 'System'
								? 'bg-yellow-100'
								: message.user_id === getClientId()
									? 'bg-blue-100'
									: 'bg-gray-100'} rounded-lg p-3 shadow-sm sm:p-3 {message.user_id ===
							getClientId()
								? 'text-right'
								: 'text-left'} {message.status === 'pending'
								? 'opacity-60'
								: 'opacity-100'} transition-opacity duration-200"
						>
							<div class="mb-1 flex items-start justify-between">
								<span
									class="font-semibold {message.user === 'System'
										? 'text-yellow-800'
										: message.userColor}">{message.user}</span
								>
								{#if message.status === 'pending' && message.user_id === getClientId()}
									<span class="ml-2 text-sm text-gray-500">Sending...</span>
								{/if}
							</div>
							<p class="">{message.content}</p>
							{#if message.hasQuestion}
								<div class=" mt-2">
									<span class="inline-block rounded border border-gray-200 bg-gray-100 px-2 py-1">
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

		<!-- End of messages container -->
	</div>
</div>

<!-- Input area - fixed at bottom with no space -->
<div
	class="z-45 fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-3 shadow-[0_-4px_15px_rgba(0,0,0,0.1)] sm:p-4"
>
	<div class="container mx-auto flex items-center gap-2">
		<input
			type="text"
			bind:value={newMessage}
			placeholder="Type your message here..."
			class="flex-grow rounded-lg border border-gray-300 px-4 py-3 text-base shadow-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-5" style="font-size: 16px;"
			on:keypress={(e) => e.key === 'Enter' && sendMessage()}
			disabled={!$isConnected}
		/>

		<button
			class="rounded-lg bg-blue-500 px-4 py-3 text-white shadow-md transition duration-200 hover:scale-105 hover:bg-blue-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400 sm:px-5"
			on:click={sendMessage}
			disabled={!$isConnected || !newMessage.trim()}
		>
			<FontAwesomeIcon icon={faPaperPlane} />
		</button>

		<button
			class="flex items-center gap-1 rounded-lg bg-indigo-500 px-4 py-3 text-white shadow-md transition duration-200 hover:scale-105 hover:bg-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400 sm:gap-2 sm:px-5"
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

<!-- Question Modal -->
{#if showQuestionModal}
	<div
		class="z-45 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="max-h-[70vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<!-- Modal Header -->
			<div
				class="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 p-2 text-white sm:p-4"
			>
				<h2 class="text-lg font-bold sm:text-xl">Add Question</h2>
				<button class="text-white hover:text-gray-200" on:click={closeQuestionModal}>
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>

			<!-- Modal Body -->
			<div class="p-3 sm:p-6">
				<form on:submit|preventDefault={submitQuestion}>
					<!-- Shift Date Selection (Moved to top) -->
					<div class="mb-3 sm:mb-4">
						<label
							for="shift-date"
							class="mb-1 block text-sm font-medium text-gray-700 sm:mb-2 sm:text-md"
							>Shift Date <span class="text-red-500">*</span></label
						>
						<input
							type="hidden"
							id="shift-date"
							bind:value={questionForm.shiftDate}
							aria-label="Selected shift date"
						/>
						<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
							{#each shiftDates as date}
								<button
									type="button"
									class="rounded-lg border px-2 py-1 text-sm sm:text-md {questionForm.shiftDate ===
									date
										? 'border-blue-400 bg-blue-100'
										: 'border-gray-300 hover:bg-gray-50'}"
									on:click={() => (questionForm.shiftDate = date)}
								>
									{date}
								</button>
							{/each}
						</div>
						{#if questionForm.shiftDate === ''}
							<p class="mt-1 text-sm text-red-500">Please select a shift date</p>
						{/if}
					</div>

					<!-- Shift Type Selection (Moved to top) -->
					<div class="mb-3 sm:mb-4">
						<label
							for="shift-type-group"
							class="mb-1 block text-sm font-medium text-gray-700 sm:mb-2 sm:text-md"
							>Shift Type <span class="text-red-500">*</span></label
						>
						<div id="shift-type-group" class="flex gap-4">
							{#each shiftTypes as type}
								<label class="flex items-center">
									<input
										type="radio"
										name="shiftType"
										value={type}
										bind:group={questionForm.shiftType}
										class="mr-1"
									/>
									<span class="text-sm capitalize sm:text-md">{type}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Question -->
					<div class="mb-3 sm:mb-4">
						<label for="question-text" class="mb-1 block text-sm font-medium text-gray-700 sm:mb-2"
							>Question</label
						>
						<textarea
							id="question-text"
							bind:value={questionForm.question}
							class="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 sm:py-2 sm:text-md"
							rows="3"
							placeholder="Enter your question here..."
						></textarea>

						<!-- Question Image Upload -->
						<div class="mt-1 flex items-center sm:mt-2">
							<button
								type="button"
								class="flex items-center text-sm text-blue-600 hover:text-blue-800 sm:text-md"
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
							<div class="relative mt-1 inline-block sm:mt-2">
								<img
									src={questionImagePreview}
									alt="Question Preview"
									class="max-h-32 rounded border border-gray-300 sm:max-h-40"
								/>
								<button
									type="button"
									class="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
									on:click={removeQuestionImage}
								>
									<FontAwesomeIcon icon={faTrash} size="xs" />
								</button>
							</div>
						{/if}
					</div>

					<!-- Options -->
					<div class="mb-3 grid grid-cols-1 gap-2 sm:mb-4 sm:grid-cols-2 sm:gap-4">
						{#each ['A', 'B', 'C', 'D'] as option}
							<div
								class="rounded-lg border border-gray-200 p-2 sm:p-3 {questionForm[`option${option}`]
									.selected
									? 'border-blue-300 bg-blue-50'
									: ''}"
							>
								<div class="mb-1 flex items-center justify-between sm:mb-2">
									<label
										for="option-{option}-text"
										class="block text-sm font-medium text-gray-700 sm:text-md"
										>Option {option}</label
									>
									<button
										type="button"
										class="flex h-5 w-5 items-center justify-center rounded-full focus:outline-none"
										on:click={() => selectOption(option)}
									>
										<FontAwesomeIcon
											icon={questionForm[`option${option}`].selected ? faCheckCircle : faCircle}
											class="{questionForm[`option${option}`].selected
												? 'text-blue-500'
												: 'text-gray-400'} text-lg"
										/>
									</button>
								</div>

								<input
									id="option-{option}-text"
									type="text"
									bind:value={questionForm[`option${option}`].text}
									class="mb-1 w-full rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:mb-2 sm:px-4 sm:py-2 sm:text-md"
									placeholder={`Enter option ${option}...`}
								/>

								<!-- Option Image Upload -->
								<div class="flex items-center">
									<button
										type="button"
										class="flex items-center text-sm text-blue-600 hover:text-blue-800 sm:text-md"
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
									<div class="relative mt-1 inline-block sm:mt-2">
										<img
											src={optionImagePreviews[option]}
											alt={`Option ${option} Preview`}
											class="max-h-24 rounded border border-gray-300 sm:max-h-32"
										/>
										<button
											type="button"
											class="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
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
						<label
							for="difficulty-slider"
							class="mb-1 block text-sm font-medium text-gray-700 sm:mb-2 sm:text-md"
						>
							Difficulty: {questionForm.difficulty}
						</label>
						<input
							id="difficulty-slider"
							type="range"
							bind:value={questionForm.difficulty}
							min="1"
							max="5"
							step="1"
							class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
						/>
						<div class="mt-1 flex justify-between text-sm text-gray-500">
							<span>Easy</span>
							<span>Medium</span>
							<span>Hard</span>
						</div>
					</div>

					<!-- Shift Date and Type sections moved to the top of the form -->

					<!-- Message Textarea -->
					<div class="mb-3 sm:mb-4">
						<label
							for="message-text"
							class="mb-1 block text-sm font-medium text-gray-700 sm:mb-2 sm:text-md">Message</label
						>
						<textarea
							id="message-text"
							bind:value={questionForm.message}
							class="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 sm:py-2 sm:text-md"
							rows="2"
							placeholder="Write your message here..."
						></textarea>
					</div>

					<!-- Submit Button -->
					<div class="flex justify-end">
						<button
							type="button"
							class="mr-2 rounded-lg border border-gray-300 px-2 py-1 text-sm transition duration-200 hover:bg-gray-100 sm:px-4 sm:py-2 sm:text-md"
							on:click={closeQuestionModal}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="rounded-lg bg-blue-500 px-2 py-1 text-sm text-white transition duration-200 hover:bg-blue-600 sm:px-4 sm:py-2 sm:text-md"
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
	/* Message animations and styling */
	.message-item {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Remove padding from the bottom of the page */
	:global(body) {
		padding-bottom: 0;
		overflow-x: hidden;
		margin: 0;
	}

	/* Style for the last message to ensure it's properly spaced */

	/* Styling for range input (slider) */
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		background: #4f46e5;
		border-radius: 50%;
		cursor: pointer;
	}

	input[type='range']::-moz-range-thumb {
		width: 18px;
		height: 18px;
		background: #4f46e5;
		border-radius: 50%;
		cursor: pointer;
	}
</style>
