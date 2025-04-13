<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSpinner, faCheckCircle, faTimesCircle, faExclamationTriangle, faBullhorn } from '@fortawesome/free-solid-svg-icons';

	// State variables
	let answerSheetLink = '';
	let isLoading = true;
	let error = '';
	let result: any = null;

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

			result = await response.json();
		} catch (err) {
			// Customize error message to inform about service availability
			error = 'This service is currently under development and will be fully available shortly. Thank you for your patience.';
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>JEE Answer Sheet Results | College Predictor</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="max-w-4xl mx-auto">
		<!-- Service Availability Notification -->
		<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md shadow-sm">
			<div class="flex items-start">
				<div class="flex-shrink-0">
					<FontAwesomeIcon icon={faBullhorn} class="text-yellow-500 h-5 w-5 mt-0.5" />
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-yellow-800">Service Coming Soon</h3>
					<div class="mt-1 text-sm text-yellow-700">
						<p>The JEE Answer Sheet Analysis service will be available shortly. We're working hard to bring you accurate results soon!</p>
					</div>
				</div>
			</div>
		</div>
		
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
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
								<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
								<div class="overflow-x-auto">
									<table class="min-w-full divide-y divide-gray-200">
										<thead class="bg-gray-50">
											<tr>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q#</th>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Answer</th>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Answer</th>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
												<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
											</tr>
										</thead>
										<tbody class="bg-white divide-y divide-gray-200">
											{#each result.questions as question, index}
												<tr class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
													<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{question.number}</td>
													<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{question.subject}</td>
													<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.yourAnswer || '-'}</td>
													<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.correctAnswer}</td>
													<td class="px-6 py-4 whitespace-nowrap">
														{#if question.isCorrect}
															<span class="flex items-center text-green-600">
																<FontAwesomeIcon icon={faCheckCircle} class="mr-1" />
																Correct
															</span>
														{:else}
															<span class="flex items-center text-red-600">
																<FontAwesomeIcon icon={faTimesCircle} class="mr-1" />
																Incorrect
															</span>
														{/if}
													</td>
													<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.marks}</td>
												</tr>
											{/each}
										</tbody>
									</table>
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
	</div>
</div>