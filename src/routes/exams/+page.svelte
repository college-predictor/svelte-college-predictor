<script lang="ts">
	import {
		faBook,
		faFileAlt,
		faPuzzlePiece,
		faCalculator
	} from '@fortawesome/free-solid-svg-icons';
	import ServiceCard from '$lib/components/ServiceCard.svelte';

	// Define the available exams with their study materials
	// Add disabled property based on URL value
	const exams = [
		{
			id: 'jee-main',
			title: 'JEE Main',
			description: 'Joint Entrance Examination for engineering programs',
			icon: faCalculator,
			materials: [
				{ title: 'Physics Notes', type: 'PDF', url: '#', disabled: true },
				{ title: 'Chemistry Formula Sheet', type: 'PDF', url: '#', disabled: true },
				{ title: 'Mathematics Practice Problems', type: 'PDF', url: '#', disabled: true },
				{ title: 'Previous Year Papers', type: 'PDF', url: '#', disabled: true },
				{ title: 'Video Lectures', type: 'Video', url: '#', disabled: true }
			]
		},
		{
			id: 'jee-advanced',
			title: 'JEE Advanced',
			description: 'Advanced examination for IIT admissions',
			icon: faCalculator,
			materials: [
				{ title: 'Physics Complete Notes', type: 'PDF', url: '#', disabled: true },
				{ title: 'Chemistry Study Material', type: 'PDF', url: '#', disabled: true },
				{ title: 'Mathematics Problem Solving', type: 'PDF', url: '#', disabled: true },
				{ title: 'Mock Tests', type: 'Interactive', url: '#', disabled: true },
				{ title: 'Video Solutions', type: 'Video', url: '#', disabled: true }
			]
		},
		{
			id: 'neet',
			title: 'NEET',
			description: 'National Eligibility cum Entrance Test for medical programs',
			icon: faBook,
			materials: [
				{ title: 'Biology Complete Notes', type: 'PDF', url: '#', disabled: true },
				{ title: 'Physics Study Material', type: 'PDF', url: '#', disabled: true },
				{ title: 'Chemistry Revision Notes', type: 'PDF', url: '#', disabled: true },
				{ title: 'Previous Year Papers with Solutions', type: 'PDF', url: '#', disabled: true },
				{ title: 'Video Lectures', type: 'Video', url: '#', disabled: true }
			]
		},
		{
			id: 'gate',
			title: 'GATE',
			description: 'Graduate Aptitude Test in Engineering',
			icon: faFileAlt,
			materials: [
				{ title: 'Subject-wise Notes', type: 'PDF', url: '#', disabled: true },
				{ title: 'Previous Year Papers', type: 'PDF', url: '#', disabled: true },
				{ title: 'Mock Tests', type: 'Interactive', url: '#', disabled: true },
				{ title: 'Video Tutorials', type: 'Video', url: '#', disabled: true }
			]
		},
		{
			id: 'cat',
			title: 'CAT',
			description: 'Common Admission Test for MBA programs',
			icon: faPuzzlePiece,
			materials: [
				{ title: 'Quantitative Aptitude', type: 'PDF', url: '#', disabled: true },
				{ title: 'Verbal Ability', type: 'PDF', url: '#', disabled: true },
				{ title: 'Data Interpretation', type: 'PDF', url: '#', disabled: true },
				{ title: 'Logical Reasoning', type: 'PDF', url: '#', disabled: true },
				{ title: 'Mock Tests', type: 'Interactive', url: '#', disabled: true }
			]
		},
		{
			id: 'upsc',
			title: 'UPSC',
			description: 'Civil Services Examination',
			icon: faBook,
			materials: [
				{ title: 'General Studies Notes', type: 'PDF', url: '#', disabled: true },
				{ title: 'Current Affairs', type: 'PDF', url: '#', disabled: true },
				{ title: 'Optional Subject Materials', type: 'PDF', url: '#', disabled: true },
				{ title: 'Previous Year Papers', type: 'PDF', url: '#', disabled: true }
			]
		}
	];

	// State to track which exam is selected
	let selectedExam: any = null;

	// Function to select an exam
	function selectExam(exam: any) {
		selectedExam = exam;
	}

	// Function to go back to exam selection
	function backToExams() {
		selectedExam = null;
	}
</script>

<section class="min-h-screen bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		<h1 class="mb-8 text-center text-4xl font-bold text-blue-600">Study Materials</h1>
		<p class="mb-12 text-center text-lg text-gray-600">
			Select an exam to access free study materials and resources
		</p>

		{#if !selectedExam}
			<!-- Exam Selection Grid -->
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each exams as exam}
					<div
						on:click={() => selectExam(exam)}
						on:keydown={(e) => e.key === 'Enter' && selectExam(exam)}
						class="cursor-pointer"
						role="button"
						tabindex="0"
					>
						<ServiceCard title={exam.title} description={exam.description} icon={exam.icon} />
					</div>
				{/each}
			</div>
		{:else}
			<!-- Study Materials for Selected Exam -->
			<div class="rounded-lg bg-white p-8 shadow-lg">
				<div class="mb-6 flex items-center">
					<button
						on:click={backToExams}
						class="mr-4 inline-flex items-center rounded bg-gray-200 px-4 py-2 font-semibold text-gray-800 transition duration-300 hover:bg-gray-300"
					>
						<span>← Back</span>
					</button>
					<h2 class="text-3xl font-bold text-blue-600">{selectedExam.title} Study Materials</h2>
				</div>

				<div class="space-y-6">
					{#each selectedExam.materials as material}
						<div
							class="rounded-lg border border-gray-200 p-4 transition duration-300 hover:shadow-md"
						>
							<div class="flex items-center justify-between">
								<div>
									<h3 class="text-xl font-semibold">{material.title}</h3>
									<p class="text-gray-600">Type: {material.type}</p>
								</div>
								<button
									class="inline-flex items-center rounded bg-blue-600 px-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-700"
									disabled={material.disabled}
									style={material.disabled ? 'opacity: 0.5; cursor: not-allowed;' : ''}
									on:click={() => {
										if (!material.disabled) {
											window.location.href = material.url;
										}
									}}
								>
									{material.disabled ? 'Coming Soon' : 'Download'}
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	/* Add any custom styles here */
</style>
