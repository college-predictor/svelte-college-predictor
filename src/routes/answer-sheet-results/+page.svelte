<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSpinner, faCheckCircle, faTimesCircle, faExclamationTriangle, faBullhorn, faImage, faQuestionCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

	// State variables
	let answerSheetLink = '';
	let isLoading = true;
	let error = '';
	let result: any = null;
	let selectedQuestion: any = null;
	let showQuestionModal = false;

	// Interface for the new API response format
	interface Question {
		question_number: number;
		question_type: 'MCQ' | 'SA';
		question_id: string;
		question_img_url: string;
		option_1_url?: string;
		option_2_url?: string;
		option_3_url?: string;
		option_4_url?: string;
		chosen_option?: string;
		correct_option?: string;
		given_answer?: string;
		correct_answer?: string;
		status: string;
	}

	interface ScoreCard {
		answered_questions: number;
		unanswered_questions: number;
		wrong_answers: number;
		physics_marks: number;
		chemistry_marks: number;
		maths_marks: number;
		total_marks: number;
	}

	interface ApiResponse {
		status: string;
		message: string;
		data: Question[];
		score_card: ScoreCard;
	}

	// Function to open question modal
	function openQuestionModal(question: Question) {
		selectedQuestion = question;
		showQuestionModal = true;
	}

	// Function to close question modal
	function closeQuestionModal() {
		showQuestionModal = false;
	}

	// Function to get option label
	function getOptionLabel(optionNumber: string): string {
		switch(optionNumber) {
			case '1': return 'A';
			case '2': return 'B';
			case '3': return 'C';
			case '4': return 'D';
			default: return optionNumber;
		}
	}

	onMount(async () => {
		// Get the answer sheet link from the URL query parameter
		answerSheetLink = $page.url.searchParams.get('answerSheetLink') || '';

		if (!answerSheetLink) {
			error = 'No answer sheet link provided. Please go back and enter a valid link.';
			isLoading = false;
			return;
		}

		// Validate the link
		if (!answerSheetLink.startsWith('https://cdn3.digialm.com/')) {
			error = 'Invalid answer sheet link. Please go back and enter a valid link.';
			isLoading = false;
			return;
		}

		// Fetch the results
		try {
			const response = await fetch(`${window.location.protocol}//api.collegepredictor.in/api/jee-main/calculate-marks`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					"url": answerSheetLink
				})
			});

			if (!response.ok) {
				throw new Error('Failed to calculate marks. Please try again.');
			}

			const apiResponse: ApiResponse = await response.json();
			result = {
				questions: apiResponse.data,
				correct: apiResponse.score_card.answered_questions - apiResponse.score_card.wrong_answers,
				incorrect: apiResponse.score_card.wrong_answers,
				totalMarks: apiResponse.score_card.total_marks,
				subjectWiseMarks: {
					physics: apiResponse.score_card.physics_marks,
					chemistry: apiResponse.score_card.chemistry_marks,
					maths: apiResponse.score_card.maths_marks
				}
			};
		} catch (err) {
			// Customize error message to inform about service availability
			error = 'This service is currently under development and will be fully available shortly. Thank you for your patience.';
		} finally {
			isLoading = false;
		}
	});
	
	// Function to determine if a question was answered correctly
	function isQuestionCorrect(question: Question): boolean {
		if (question.question_type === 'MCQ') {
			return question.chosen_option === question.correct_option;
		} else if (question.question_type === 'SA') {
			return question.given_answer === question.correct_answer;
		}
		return false;
	}
</script>

<svelte:head>
	<title>JEE Answer Sheet Results | College Predictor</title>
</svelte:head>

<style>
	/* Modal image styles to preserve original size */
	.question-modal-image-container {
		overflow: auto;
		max-height: 70vh;
	}
	
	.question-modal-image {
		width: auto;
		height: auto;
		max-width: none;
	}
	
	.option-image-container {
		overflow: auto;
		max-height: 40vh;
	}
	
	.option-image {
		width: auto;
		height: auto;
		max-width: none;
	}
</style>

<div class="container mx-auto px-4 py-12">
	<div class="max-w-4xl mx-auto">
		
		<div class="bg-white rounded-lg shadow-lg overflow-hidden">
			<div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
				<h1 class="text-2xl font-bold text-white">JEE Answer Sheet Analysis</h1>
			</div>

			<div class="p-6">
				{#if isLoading}
					<div class="flex flex-col items-center justify-center py-12">
						<FontAwesomeIcon icon={faSpinner} spin size="3x" class="text-indigo-600 mb-4" />
						<p class="text-gray-600 text-lg">Analyzing your answer sheet...</p>
						<div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4 max-w-lg">
							<p class="text-sm text-yellow-700">
								<FontAwesomeIcon icon={faBullhorn} class="mr-2" />
								This service is currently in development and will be fully available shortly. We're still processing your request in the background.
							</p>
						</div>
					</div>
				{:else if error}
					<div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
						<div class="flex items-center">
							<FontAwesomeIcon icon={faExclamationTriangle} class="text-red-500 mr-3" />
							<p class="text-red-700">{error}</p>
						</div>
					</div>
					<div class="text-center">
						<a
							href="/"
							class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
						>
							Back to Home
						</a>
					</div>
				{:else if result}
					<div class="space-y-8">
						<!-- Summary Section -->
						<div class="grid grid-cols-1 grid-cols-3 gap-6">
							<div class="bg-green-50 p-4 rounded-lg text-center">
								<p class="text-sm text-gray-600 mb-1">Correct Answers</p>
								<p class="text-3xl font-bold text-green-600">{result.correct}</p>
							</div>
							<div class="bg-red-50 p-4 rounded-lg text-center">
								<p class="text-sm text-gray-600 mb-1">Incorrect Answers</p>
								<p class="text-3xl font-bold text-red-600">{result.incorrect}</p>
							</div>
							<div class="bg-blue-50 p-4 rounded-lg text-center">
								<p class="text-sm text-gray-600 mb-1">Total Score</p>
								<p class="text-3xl font-bold text-blue-600">{result.totalMarks}</p>
							</div>
						</div>

						<!-- Subject-wise Breakdown -->
						{#if result.subjectWiseMarks}
							<div>
								<h3 class="text-xl font-semibold text-gray-800 mb-4">Subject-wise Breakdown</h3>
								<div class="grid grid-cols-1 grid-cols-3 gap-4">
									{#each Object.entries(result.subjectWiseMarks) as [subject, marks]}
										<div class="bg-gray-50 p-4 rounded-lg">
											<p class="text-sm font-medium text-gray-700 capitalize">{subject}</p>
											<p class="text-2xl font-bold text-indigo-600">{marks}</p>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Question Analysis -->
						{#if result.questions && result.questions.length > 0}
							<div>
								<h3 class="text-xl font-semibold text-gray-800 mb-4">Question Analysis</h3>
								
								<!-- Desktop view (table) - hidden on small screens -->
								<div class="hidden md:block overflow-x-auto">
									<table class="min-w-full divide-y divide-gray-200">
										<thead class="bg-gray-50">
											<tr>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q#</th>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Answer</th>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Answer</th>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
											</tr>
										</thead>
										<tbody class="bg-white divide-y divide-gray-200">
											{#each result.questions as question, index}
												<tr class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
													<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{question.question_number}</td>
													<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.question_type}</td>
													<td class="px-6 py-4 whitespace-nowrap text-sm">
														{#if question.question_type === 'MCQ'}
															{#if question.chosen_option}
																<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
																	{getOptionLabel(question.chosen_option)}
																</span>
															{:else}
																<span class="text-gray-500">--</span>
															{/if}
														{:else}
															{#if question.given_answer}
																<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
																	{question.given_answer}
																</span>
															{:else}
																<span class="text-gray-500">--</span>
															{/if}
														{/if}
													</td>
													<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
														{#if question.question_type === 'MCQ'}
															{getOptionLabel(question.correct_option)}
														{:else}
															{question.correct_answer || '--'}
														{/if}
													</td>
													<td class="px-6 py-4 whitespace-nowrap">
														{#if question.status === 'Answered' && isQuestionCorrect(question)}
															<span class="flex items-center text-green-600">
																<FontAwesomeIcon icon={faCheckCircle} class="mr-1" />
																Correct
															</span>
														{:else if question.status === 'Answered'}
															<span class="flex items-center text-red-600">
																<FontAwesomeIcon icon={faTimesCircle} class="mr-1" />
																Incorrect
															</span>
														{:else}
															<span class="flex items-center text-gray-500">
																<FontAwesomeIcon icon={faQuestionCircle} class="mr-1" />
																Not Answered
															</span>
														{/if}
													</td>
													<td class="px-6 py-4 whitespace-nowrap">
														<button
															class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
															on:click={() => openQuestionModal(question)}
														>
															<FontAwesomeIcon icon={faImage} class="mr-1" />
															View Question
														</button>
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
								
								<!-- Mobile view (cards) - shown only on small screens -->
								<div class="md:hidden space-y-4">
									{#each result.questions as question, index}
										<div class="bg-white border rounded-lg shadow-sm overflow-hidden">
											<div class="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
												<div class="font-medium">Question {question.question_number}</div>
												<div class="text-xs px-2 py-1 rounded bg-gray-200">{question.question_type}</div>
											</div>
											<div class="p-4 space-y-3">
												<div class="grid grid-cols-2 gap-2 text-sm">
													<div>
														<span class="text-gray-600 font-medium">Your Answer:</span>
														<div class="mt-1">
															{#if question.question_type === 'MCQ'}
																{#if question.chosen_option}
																	<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium inline-block">
																		{getOptionLabel(question.chosen_option)}
																	</span>
																{:else}
																	<span class="text-gray-500">--</span>
																{/if}
															{:else}
																{#if question.given_answer}
																	<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium inline-block">
																		{question.given_answer}
																	</span>
																{:else}
																	<span class="text-gray-500">--</span>
																{/if}
															{/if}
														</div>
													</div>
													<div>
														<span class="text-gray-600 font-medium">Correct Answer:</span>
														<div class="mt-1">
															{#if question.question_type === 'MCQ'}
																{getOptionLabel(question.correct_option)}
															{:else}
																{question.correct_answer || '--'}
															{/if}
														</div>
													</div>
												</div>
												
												<div class="pt-2 border-t">
													<div class="flex items-center justify-between">
														<div>
															{#if question.status === 'Answered' && isQuestionCorrect(question)}
																<span class="flex items-center text-green-600 text-sm">
																	<FontAwesomeIcon icon={faCheckCircle} class="mr-1" />
																	Correct
																</span>
															{:else if question.status === 'Answered'}
																<span class="flex items-center text-red-600 text-sm">
																	<FontAwesomeIcon icon={faTimesCircle} class="mr-1" />
																	Incorrect
																</span>
															{:else}
																<span class="flex items-center text-gray-500 text-sm">
																	<FontAwesomeIcon icon={faQuestionCircle} class="mr-1" />
																	Not Answered
																</span>
															{/if}
														</div>
														<button
															class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
															on:click={() => openQuestionModal(question)}
														>
															<FontAwesomeIcon icon={faImage} class="mr-1" />
															View Question
														</button>
													</div>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Actions -->
						<div class="flex justify-center pt-4">
							<a
								href="/"
								class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
							>
								Back to Home
							</a>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Question Modal -->
		{#if showQuestionModal && selectedQuestion}
			<div class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
				<div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
					<!-- Modal Header -->
					<div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 flex justify-between items-center">
						<h3 class="text-xl font-bold text-white">Question {selectedQuestion.question_number} ({selectedQuestion.question_type})</h3>
						<button 
							class="text-white hover:text-gray-200 focus:outline-none" 
							on:click={closeQuestionModal}
						>
							<FontAwesomeIcon icon={faTimes} size="lg" />
						</button>
					</div>

					<!-- Modal Body -->
					<div class="p-6 space-y-6">
						<!-- Question Image -->
						<div class="border rounded-lg p-4 bg-gray-50 question-modal-image-container">
							<h4 class="text-lg font-medium text-gray-800 mb-3">Question</h4>
							<img 
								src={selectedQuestion.question_img_url} 
								alt="Question {selectedQuestion.question_number}" 
								class="mx-auto rounded border question-modal-image" 
							/>
						</div>

						<!-- Options (for MCQ) -->
						{#if selectedQuestion.question_type === 'MCQ'}
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								{#if selectedQuestion.option_1_url}
									<div class="border rounded-lg p-3 {selectedQuestion.chosen_option === '1' ? 'border-blue-500 bg-blue-50' : ''} {selectedQuestion.correct_option === '1' ? 'border-green-500 bg-green-50' : ''}">
										<div class="flex items-center mb-2">
											<span class="font-medium mr-2">Option A:</span>
											{#if selectedQuestion.chosen_option === '1'}
                                                <span class="text-blue-600 text-sm font-medium ml-auto">Your Choice</span>
											{/if}
											{#if selectedQuestion.correct_option === '1'}
												<span class="text-green-600 text-sm font-medium ml-auto">Correct Answer</span>
											{/if}
										</div>
										<div class="option-image-container">
											<img src={selectedQuestion.option_1_url} alt="Option A" class="option-image rounded" />
										</div>
									</div>
								{/if}

								{#if selectedQuestion.option_2_url}
									<div class="border rounded-lg p-3 {selectedQuestion.chosen_option === '2' ? 'border-blue-500 bg-blue-50' : ''} {selectedQuestion.correct_option === '2' ? 'border-green-500 bg-green-50' : ''}">
										<div class="flex items-center mb-2">
											<span class="font-medium mr-2">Option B:</span>
											{#if selectedQuestion.chosen_option === '2'}
                                                <span class="text-blue-600 text-sm font-medium ml-auto">Your Choice</span>
											{/if}
											{#if selectedQuestion.correct_option === '2'}
												<span class="text-green-600 text-sm font-medium ml-auto">Correct Answer</span>
											{/if}
										</div>
										<div class="option-image-container">
											<img src={selectedQuestion.option_2_url} alt="Option B" class="option-image rounded" />
										</div>
									</div>
								{/if}

								{#if selectedQuestion.option_3_url}
									<div class="border rounded-lg p-3 {selectedQuestion.chosen_option === '3' ? 'border-blue-500 bg-blue-50' : ''} {selectedQuestion.correct_option === '3' ? 'border-green-500 bg-green-50' : ''}">
										<div class="flex items-center mb-2">
											<span class="font-medium mr-2">Option C:</span>
											{#if selectedQuestion.chosen_option === '3'}
                                                <span class="text-blue-600 text-sm font-medium ml-auto">Your Choice</span>
											{/if}
											{#if selectedQuestion.correct_option === '3'}
												<span class="text-green-600 text-sm font-medium ml-auto">Correct Answer</span>
											{/if}
										</div>
										<div class="option-image-container">
											<img src={selectedQuestion.option_3_url} alt="Option C" class="option-image rounded" />
										</div>
									</div>
								{/if}

								{#if selectedQuestion.option_4_url}
									<div class="border rounded-lg p-3 {selectedQuestion.chosen_option === '4' ? 'border-blue-500 bg-blue-50' : ''} {selectedQuestion.correct_option === '4' ? 'border-green-500 bg-green-50' : ''}">
										<div class="flex items-center mb-2">
											<span class="font-medium mr-2">Option D:</span>
											{#if selectedQuestion.chosen_option === '4'}
                                                <span class="text-blue-600 text-sm font-medium ml-auto">Your Choice</span>
											{/if}
											{#if selectedQuestion.correct_option === '4'}
												<span class="text-green-600 text-sm font-medium ml-auto">Correct Answer</span>
											{/if}
										</div>
										<div class="option-image-container">
											<img src={selectedQuestion.option_4_url} alt="Option D" class="option-image rounded" />
										</div>
									</div>
								{/if}
							</div>
						{/if}

						<!-- Answer (for SA) -->
						{#if selectedQuestion.question_type === 'SA'}
							<div class="grid grid-cols-1 gap-4">
								<div class="border rounded-lg p-4">
									<h4 class="text-lg font-medium text-gray-800 mb-2">Your Answer</h4>
									<p class="text-xl font-bold {selectedQuestion.given_answer === selectedQuestion.correct_answer ? 'text-green-600' : 'text-red-600'}">
										{selectedQuestion.given_answer || 'Not Answered'}
									</p>
								</div>

								<div class="border rounded-lg p-4 bg-green-50">
									<h4 class="text-lg font-medium text-gray-800 mb-2">Correct Answer</h4>
									<p class="text-xl font-bold text-green-600">
										{selectedQuestion.correct_answer || 'Not Available'}
									</p>
								</div>
							</div>
						{/if}

						<!-- Status -->
						<div class="border rounded-lg p-4 {selectedQuestion.status === 'Answered' && isQuestionCorrect(selectedQuestion) ? 'bg-green-50 border-green-200' : selectedQuestion.status === 'Answered' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}">
							<h4 class="text-lg font-medium text-gray-800 mb-2">Status</h4>
							<div class="flex items-center">
								{#if selectedQuestion.status === 'Answered' && isQuestionCorrect(selectedQuestion)}
									<FontAwesomeIcon icon={faCheckCircle} class="text-green-500 mr-2" size="lg" />
									<p class="text-green-700 font-medium">Correct Answer</p>
								{:else if selectedQuestion.status === 'Answered'}
									<FontAwesomeIcon icon={faTimesCircle} class="text-red-500 mr-2" size="lg" />
									<p class="text-red-700 font-medium">Incorrect Answer</p>
								{:else}
									<FontAwesomeIcon icon={faQuestionCircle} class="text-gray-500 mr-2" size="lg" />
									<p class="text-gray-700 font-medium">Not Answered</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- Modal Footer -->
					<div class="bg-gray-50 px-6 py-3 flex justify-end">
						<button
							class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
							on:click={closeQuestionModal}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>