<script lang="ts">
	import { onMount } from 'svelte';
    import { scale } from 'svelte/transition';
	import {
		faCalendar,
		faBook,
		faNewspaper,
		faFileAlt,
		faPuzzlePiece,
		faQuestion,
		faRobot,
		faSearch,
		faLightbulb,
		faChevronDown,
		faChevronUp,
		faDownload,
		faExternalLinkAlt,
		faBullhorn,
		faClock,
		faGraduationCap,
		faInfoCircle,
		faPaperPlane,
		faTools,
		faUser,
		faTimes
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { messages, sendTextMessage, initWebSocket, isConnected } from '$lib/stores/chatStore';

	// Exam details
	const examInfo = {
		name: 'JEE Main',
		fullName: 'Joint Entrance Examination (Main)',
		description:
			'JEE Main is a standardized test conducted for admission to various engineering colleges in India. It is constituted by two papers; Paper-1 for B.E./B.Tech and Paper-2 for B.Arch/B.Planning.',
		conductedBy: 'National Testing Agency (NTA)',
		frequency: 'Twice a year (January and April sessions)',
		eligibility: 'Candidates who have passed class 12th or equivalent examination',
		examMode: 'Computer Based Test (CBT)',
		website: 'https://jeemain.nta.nic.in/'
	};

	// Exam calendar - sample data
	const examCalendar = [
		{
			event: 'Application Form Release',
			dateRange: 'November 2023',
			status: 'Completed'
		},
		{
			event: 'Last Date to Apply',
			dateRange: 'December 2023',
			status: 'Completed'
		},
		{
			event: 'Admit Card Release',
			dateRange: '2 weeks before exam',
			status: 'Upcoming'
		},
		{
			event: 'Session 1 Exam Dates',
			dateRange: 'January 2024',
			status: 'Upcoming'
		},
		{
			event: 'Session 1 Result',
			dateRange: 'February 2024',
			status: 'Upcoming'
		},
		{
			event: 'Session 2 Exam Dates',
			dateRange: 'April 2024',
			status: 'Upcoming'
		},
		{
			event: 'Session 2 Result',
			dateRange: 'May 2024',
			status: 'Upcoming'
		}
	];

	// Exam pattern
	const examPattern = {
		paper1: {
			title: 'Paper 1 (B.E./B.Tech)',
			sections: [
				{
					name: 'Physics',
					questions: 25,
					marks: 100,
					topics: [
						'Mechanics',
						'Electromagnetism',
						'Optics',
						'Modern Physics',
						'Thermodynamics'
					]
				},
				{
					name: 'Chemistry',
					questions: 25,
					marks: 100,
					topics: [
						'Physical Chemistry',
						'Organic Chemistry',
						'Inorganic Chemistry',
						'Analytical Chemistry'
					]
				},
				{
					name: 'Mathematics',
					questions: 25,
					marks: 100,
					topics: [
						'Algebra',
						'Calculus',
						'Trigonometry',
						'Coordinate Geometry',
						'Vector Algebra'
					]
				}
			],
			totalTime: '3 hours',
			totalMarks: 300,
			markingScheme: 'Correct Answer: +4, Incorrect Answer: -1, Unattempted: 0'
		},
		paper2: {
			title: 'Paper 2 (B.Arch/B.Planning)',
			sections: [
				{
					name: 'Mathematics',
					questions: 25,
					marks: 100
				},
				{
					name: 'Aptitude Test',
					questions: 50,
					marks: 200
				},
				{
					name: 'Drawing Test',
					questions: 2,
					marks: 100
				}
			],
			totalTime: '3 hours',
			totalMarks: 400
		}
	};

	// Previous year papers - sample data
	const previousYearPapers = [
		{
			year: '2023',
			sessions: [
				{
					name: 'January Session',
					papers: [
						{
							name: 'Paper 1 - Shift 1',
							url: '#',
							solutionUrl: '#',
							type: 'PDF'
						},
						{
							name: 'Paper 1 - Shift 2',
							url: '#',
							solutionUrl: '#',
							type: 'PDF'
						}
					]
				},
				{
					name: 'April Session',
					papers: [
						{
							name: 'Paper 1 - Shift 1',
							url: '#',
							solutionUrl: '#',
							type: 'PDF'
						},
						{
							name: 'Paper 1 - Shift 2',
							url: '#',
							solutionUrl: '#',
							type: 'PDF'
						}
					]
				}
			]
		},
		{
			year: '2022',
			sessions: [
				{
					name: 'January Session',
					papers: [
						{
							name: 'Paper 1 - Shift 1',
							url: '#',
							solutionUrl: '#',
							type: 'PDF'
						},
						{
							name: 'Paper 1 - Shift 2',
							url: '#',
							solutionUrl: '#',
							type: 'PDF'
						}
					]
				},
				{
					name: 'April Session',
					papers: [
						{
							name: 'Paper 1 - Shift 1',
							url: '#',
							solutionUrl: '#',
							type: 'PDF'
						},
						{
							name: 'Paper 1 - Shift 2',
							url: '#',
							solutionUrl: '#',
							type: 'PDF'
						}
					]
				}
			]
		}
	];

	// Study materials - sample data
	const studyMaterials = [
		{
			category: 'Physics',
			materials: [
				{
					title: 'Mechanics Study Notes',
					type: 'PDF',
					url: '#',
					description: 'Comprehensive notes covering all mechanics topics',
					size: '4.2 MB'
				},
				{
					title: 'Electromagnetism Formula Sheet',
					type: 'PDF',
					url: '#',
					description: 'Quick reference formulas for electromagnetism',
					size: '1.8 MB'
				},
				{
					title: 'Modern Physics Video Lectures',
					type: 'Video',
					url: '#',
					description: 'Video lectures covering quantum physics and relativity',
					duration: '8 hours'
				}
			]
		},
		{
			category: 'Chemistry',
			materials: [
				{
					title: 'Organic Chemistry Reaction Guide',
					type: 'PDF',
					url: '#',
					description: 'Complete guide to important organic reactions',
					size: '5.7 MB'
				},
				{
					title: 'Periodic Table and Properties',
					type: 'PDF',
					url: '#',
					description: 'Interactive periodic table with element properties',
					size: '3.2 MB'
				},
				{
					title: 'Inorganic Chemistry Notes',
					type: 'PDF',
					url: '#',
					description: 'Comprehensive notes on inorganic chemistry',
					size: '6.1 MB'
				}
			]
		},
		{
			category: 'Mathematics',
			materials: [
				{
					title: 'Calculus Problem Solving',
					type: 'PDF',
					url: '#',
					description: 'Practice problems with solutions for calculus',
					size: '4.9 MB'
				},
				{
					title: 'Coordinate Geometry Formulas',
					type: 'PDF',
					url: '#',
					description: 'Quick reference for coordinate geometry formulas',
					size: '2.3 MB'
				},
				{
					title: 'Algebra Video Lectures',
					type: 'Video',
					url: '#',
					description: 'Comprehensive video lectures on algebra topics',
					duration: '10 hours'
				}
			]
		}
	];

	// Latest news - sample data
	const latestNews = [
		{
			title: 'JEE Main 2024 Application Form Released',
			date: 'November 1, 2023',
			summary: 'The National Testing Agency (NTA) has released the application form for JEE Main 2024. Candidates can apply online through the official website.',
			url: '#',
			important: true
		},
		{
			title: 'JEE Main 2024 Exam Dates Announced',
			date: 'October 15, 2023',
			summary: 'The JEE Main 2024 will be conducted in two sessions - January and April. The first session will be held from January 24 to February 1, 2024.',
			url: '#',
			important: true
		},
		{
			title: 'Changes in JEE Main 2024 Exam Pattern',
			date: 'October 10, 2023',
			summary: 'NTA has announced changes in the exam pattern for JEE Main 2024. The exam will now have more numerical type questions and fewer multiple-choice questions.',
			url: '#',
			important: false
		},
		{
			title: 'JEE Main 2023 Toppers List Released',
			date: 'September 25, 2023',
			summary: 'NTA has released the list of JEE Main 2023 toppers. A total of 43 candidates have scored 100 percentile in the exam.',
			url: '#',
			important: false
		},
		{
			title: 'JEE Main 2024 Syllabus Released',
			date: 'September 15, 2023',
			summary: 'The syllabus for JEE Main 2024 has been released. There are no major changes in the syllabus compared to the previous year.',
			url: '#',
			important: true
		}
	];

	// AI tools - sample data
	const aiTools = [
		{
			name: 'JEE AI Assistant',
			icon: faRobot,
			description: 'Ask any question about JEE Main exam, preparation strategies, or college admissions',
			type: 'chat'
		},
		{
			name: 'Concept Explainer',
			icon: faLightbulb,
			description: 'Get AI-powered explanations for complex JEE concepts and topics',
			type: 'tool'
		},
		{
			name: 'Smart Search',
			icon: faSearch,
			description: 'Search through study materials, previous year papers, and more with AI-enhanced results',
			type: 'search'
		},
		{
			name: 'Personalized Study Plan',
			icon: faCalendar,
			description: 'Get a customized study plan based on your strengths, weaknesses, and available time',
			type: 'tool'
		}
	];

	// Related information - sample data
	const relatedInfo = [
		{
			title: 'Top Engineering Colleges Accepting JEE Main Score',
			url: '#',
			icon: faGraduationCap
		},
		{
			title: 'JEE Main vs JEE Advanced: Key Differences',
			url: '#',
			icon: faInfoCircle
		},
		{
			title: 'How to Prepare for JEE Main in 3 Months',
			url: '#',
			icon: faClock
		},
		{
			title: 'JEE Main Rank Predictor',
			url: '#',
			icon: faTools
		}
	];

	// Accordion state
	let activeSection = 'overview';
	let expandedPaperYear = null;
	let expandedMaterialCategory = null;

	// AI Chat functionality
	let aiChatVisible = false;
	let userQuestion = '';

	onMount(() => {
		// Initialize WebSocket connection for AI chat
		initWebSocket();

		// Add meta tags for SEO
		const head = document.head;
		const metaDescription = document.createElement('meta');
		metaDescription.name = 'description';
		metaDescription.content = 'Complete guide to JEE Main exam including pattern, syllabus, previous papers, study materials, and preparation tips. Get all the information you need for JEE Main preparation.';
		head.appendChild(metaDescription);

		const metaKeywords = document.createElement('meta');
		metaKeywords.name = 'keywords';
		metaKeywords.content = 'JEE Main, engineering entrance exam, NTA, JEE preparation, JEE study materials, JEE previous papers, JEE exam pattern';
		head.appendChild(metaKeywords);
	});

	// Function to handle sending AI chat messages
	function handleSendMessage() {
		if (userQuestion.trim() === '') return;
		
		// Add context to the question
		const contextualQuestion = `[JEE Main Question] ${userQuestion}`;
		sendTextMessage(contextualQuestion);
		userQuestion = '';
	}

	// Function to toggle sections
	function toggleSection(section) {
		activeSection = activeSection === section ? null : section;
	}

	// Function to toggle paper year expansion
	function togglePaperYear(year) {
		expandedPaperYear = expandedPaperYear === year ? null : year;
	}

	// Function to toggle material category expansion
	function toggleMaterialCategory(category) {
		expandedMaterialCategory = expandedMaterialCategory === category ? null : category;
	}

	// Function to toggle AI chat visibility
	function toggleAiChat() {
		aiChatVisible = !aiChatVisible;
	}
</script>

<svelte:head>
	<title>JEE Main Exam - Complete Guide, Pattern, Syllabus & Study Materials</title>
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<!-- Hero Section with Key Info -->
	<section class="relative bg-gradient-to-br from-blue-600 to-indigo-800 text-white py-10 md:py-16 overflow-hidden">
		<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')]" opacity-20></div>
		<div class="container mx-auto px-4 relative z-10">
			<div class="max-w-5xl mx-auto">
				<div class="text-center mb-6">
					<h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">{examInfo.fullName}</h1>
					<p class="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">{examInfo.description}</p>
				</div>
				
				<!-- Quick Info Grid -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
						<h3 class="font-semibold mb-2">Conducted By</h3>
						<p>{examInfo.conductedBy}</p>
					</div>
					<div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
						<h3 class="font-semibold mb-2">Frequency</h3>
						<p>{examInfo.frequency}</p>
					</div>
					<div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
						<h3 class="font-semibold mb-2">Exam Mode</h3>
						<p>{examInfo.examMode}</p>
					</div>
				</div>
				
				<!-- Quick Actions -->
				<div class="flex flex-wrap justify-center gap-4">
					<a href="{examInfo.website}" target="_blank" rel="noopener noreferrer" class="bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-lg px-6 py-3 inline-flex items-center transition-colors duration-300">
						Official Website
						<FontAwesomeIcon icon={faExternalLinkAlt} class="ml-2 h-4 w-4" />
					</a>
					<button on:click={() => toggleSection('calendar')} class="bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg px-6 py-3 inline-flex items-center transition-colors duration-300">
						View Exam Calendar
						<FontAwesomeIcon icon={faCalendar} class="ml-2 h-4 w-4" />
					</button>
					<button on:click={toggleAiChat} class="bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded-lg px-6 py-3 inline-flex items-center transition-colors duration-300">
						Ask AI Assistant
						<FontAwesomeIcon icon={faRobot} class="ml-2 h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Latest News Alert -->
	{#if latestNews.some(news => news.important)}
		<div class="bg-amber-50 border-l-4 border-amber-500 p-4 shadow-sm">
			<div class="container mx-auto px-4">
				<div class="flex items-start gap-3">
					<div class="flex-shrink-0 text-amber-500 mt-1">
						<FontAwesomeIcon icon={faBullhorn} class="h-5 w-5" />
					</div>
					<div>
						<h3 class="font-semibold text-amber-800">Important Updates</h3>
						<ul class="mt-2 space-y-2">
							{#each latestNews.filter(news => news.important) as news}
								<li>
									<a href={news.url} class="text-amber-700 hover:text-amber-900 hover:underline flex items-start gap-2">
										<span class="inline-block h-2 w-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></span>
										<span>{news.title} <span class="text-amber-600 text-sm">({news.date})</span></span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Removed duplicate main content section -->
    <div>
        <div>
			<!-- Overview Section -->
			{#if activeSection === 'overview'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">About JEE Main</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<p class="text-gray-700 mb-4">
								The Joint Entrance Examination (Main) is a standardized test conducted for admission to various engineering colleges in India. It is constituted by two papers; Paper-1 for B.E./B.Tech and Paper-2 for B.Arch/B.Planning.
							</p>
							<p class="text-gray-700 mb-4">
								JEE Main is conducted by the National Testing Agency (NTA) and serves as a qualifying exam for JEE Advanced, which is the entrance test for admission to the Indian Institutes of Technology (IITs).
							</p>
							<h3 class="text-lg font-semibold mb-3 text-gray-800">Eligibility Criteria</h3>
							<ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
								<li>Candidates who have passed class 12th or equivalent examination in 2022, 2023, or appearing in 2024 are eligible to apply.</li>
								<li>There is no age limit for the candidates.</li>
								<li>Candidates can attempt JEE Main for three consecutive years.</li>
							</ul>
						</div>
						<div>
							<h3 class="text-lg font-semibold mb-3 text-gray-800">Important Features</h3>
							<ul class="space-y-4">
								<li class="flex items-start gap-3">
									<div class="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
										<FontAwesomeIcon icon={faCalendar} class="h-4 w-4" />
									</div>
									<div>
										<span class="font-medium text-gray-800">Multiple Sessions</span>
										<p class="text-gray-600 text-sm mt-1">JEE Main is conducted in multiple sessions, giving candidates multiple attempts to improve their score.</p>
									</div>
								</li>
								<li class="flex items-start gap-3">
									<div class="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
										<FontAwesomeIcon icon={faGraduationCap} class="h-4 w-4" />
									</div>
									<div>
										<span class="font-medium text-gray-800">Wide Acceptance</span>
										<p class="text-gray-600 text-sm mt-1">JEE Main score is accepted by NITs, IIITs, CFTIs, and many state engineering colleges for admission.</p>
									</div>
								</li>
								<li class="flex items-start gap-3">
									<div class="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
										<FontAwesomeIcon icon={faFileAlt} class="h-4 w-4" />
									</div>
									<div>
										<span class="font-medium text-gray-800">Computer-Based Test</span>
										<p class="text-gray-600 text-sm mt-1">The exam is conducted in Computer Based Test (CBT) mode, except for the Drawing section in Paper-2.</p>
									</div>
								</li>
							</ul>
							<div class="mt-6">
								<h3 class="text-lg font-semibold mb-3 text-gray-800">Related Information</h3>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{#each relatedInfo as info}
										<a href={info.url} class="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200">
											<FontAwesomeIcon icon={info.icon} class="h-4 w-4 text-blue-600" />
											<span class="text-gray-700 text-sm">{info.title}</span>
										</a>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Exam Calendar Section -->
			{#if activeSection === 'calendar'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<div class="flex justify-between items-center mb-6">
						<h2 class="text-2xl font-bold text-gray-800">JEE Main 2024 Calendar</h2>
						<button class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
							<FontAwesomeIcon icon={faDownload} class="h-3 w-3" />
							Download Calendar
						</button>
					</div>
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
									<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
									<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each examCalendar as event}
									<tr class="hover:bg-gray-50 transition-colors duration-150">
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.event}</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.dateRange}</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm">
											{#if event.status === 'Completed'}
												<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
													{event.status}
												</span>
											{:else if event.status === 'Upcoming'}
												<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
													{event.status}
												</span>
											{:else}
												<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
													{event.status}
												</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
						<div class="flex items-start gap-3">
							<div class="flex-shrink-0 text-blue-600 mt-1">
								<FontAwesomeIcon icon={faInfoCircle} class="h-5 w-5" />
							</div>
							<div>
								<h3 class="font-semibold text-blue-800">Important Note</h3>
								<p class="mt-1 text-blue-700 text-sm">
									The dates mentioned above are tentative and subject to change. Candidates are advised to regularly check the official NTA website for the latest updates.
								</p>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Exam Pattern Section -->
			{#if activeSection === 'pattern'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">JEE Main Exam Pattern</h2>
					
					<div class="mb-8">
						<h3 class="text-xl font-semibold mb-4 text-gray-800">{examPattern.paper1.title}</h3>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							{#each examPattern.paper1.sections as section}
								<div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
									<div class="bg-blue-600 text-white p-4">
										<h4 class="font-semibold text-lg">{section.name}</h4>
										<div class="flex justify-between mt-1 text-blue-100 text-sm">
											<span>{section.questions} Questions</span>
											<span>{section.marks} Marks</span>
										</div>
									</div>
									<div class="p-4">
										<h5 class="text-sm font-medium text-gray-700 mb-2">Key Topics</h5>
										<ul class="space-y-1">
											{#each section.topics || [] as topic}
												<li class="text-sm text-gray-600 flex items-center gap-2">
													<span class="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block"></span>
													{topic}
												</li>
											{/each}
										</ul>
									</div>
								</div>
							{/each}
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<h4 class="font-medium text-gray-800 mb-2">Exam Duration</h4>
								<p class="text-gray-700">{examPattern.paper1.totalTime}</p>
							</div>
							<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<h4 class="font-medium text-gray-800 mb-2">Total Marks</h4>
								<p class="text-gray-700">{examPattern.paper1.totalMarks}</p>
							</div>
						</div>
						<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
							<h4 class="font-medium text-gray-800 mb-2">Marking Scheme</h4>
							<p class="text-gray-700">{examPattern.paper1.markingScheme}</p>
						</div>
					</div>
					
					<div>
						<h3 class="text-xl font-semibold mb-4 text-gray-800">{examPattern.paper2.title}</h3>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							{#each examPattern.paper2.sections as section}
								<div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
									<div class="bg-indigo-600 text-white p-4">
										<h4 class="font-semibold text-lg">{section.name}</h4>
										<div class="flex justify-between mt-1 text-indigo-100 text-sm">
											<span>{section.questions} Questions</span>
											<span>{section.marks} Marks</span>
										</div>
									</div>
								</div>
							{/each}
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<h4 class="font-medium text-gray-800 mb-2">Exam Duration</h4>
								<p class="text-gray-700">{examPattern.paper2.totalTime}</p>
							</div>
							<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<h4 class="font-medium text-gray-800 mb-2">Total Marks</h4>
								<p class="text-gray-700">{examPattern.paper2.totalMarks}</p>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Previous Papers Section -->
			{#if activeSection === 'papers'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">Previous Year Papers</h2>
					
					<div class="space-y-4">
						{#each previousYearPapers as yearData}
							<div class="border border-gray-200 rounded-lg overflow-hidden">
								<button 
									on:click={() => togglePaperYear(yearData.year)}
									class="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-150 text-left"
								>
									<span class="font-medium text-gray-800">JEE Main {yearData.year}</span>
									<FontAwesomeIcon 
										icon={expandedPaperYear === yearData.year ? faChevronUp : faChevronDown} 
										class="h-4 w-4 text-gray-500" 
									/>
								</button>
								
								{#if expandedPaperYear === yearData.year}
									<div class="p-4 bg-white" transition:fade={{ duration: 150 }}>
										{#each yearData.sessions as session}
											<div class="mb-4 last:mb-0">
												<h4 class="font-medium text-gray-700 mb-2">{session.name}</h4>
												<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
													{#each session.papers as paper}
														<div class="border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-150">
															<div class="flex justify-between items-start">
																<div>
																	<h5 class="font-medium text-gray-800">{paper.name}</h5>
																	<div class="flex items-center gap-3 mt-2">
																		<a href={paper.url} class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
																			<FontAwesomeIcon icon={faDownload} class="h-3 w-3" />
																			Download
																		</a>
																		<a href={paper.solutionUrl} class="text-green-600 hover:text-green-800 text-sm flex items-center gap-1">
																			<FontAwesomeIcon icon={faFileAlt} class="h-3 w-3" />
																			Solutions
																		</a>
																	</div>
																</div>
																<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
																	{paper.type}
																</span>
															</div>
														</div>
													{/each}
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Study Materials Section -->
			{#if activeSection === 'materials'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">Study Materials</h2>
					
					<div class="space-y-4">
						{#each studyMaterials as category}
							<div class="border border-gray-200 rounded-lg overflow-hidden">
								<button 
									on:click={() => toggleMaterialCategory(category.category)}
									class="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-150 text-left"
								>
									<span class="font-medium text-gray-800">{category.category}</span>
									<FontAwesomeIcon 
										icon={expandedMaterialCategory === category.category ? faChevronUp : faChevronDown} 
										class="h-4 w-4 text-gray-500" 
									/>
								</button>
								
								{#if expandedMaterialCategory === category.category}
									<div class="p-4 bg-white" transition:fade={{ duration: 150 }}>
										<div class="grid grid-cols-1 gap-4">
											{#each category.materials as material}
												<div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-150">
													<div class="flex justify-between items-start">
														<div>
															<h4 class="font-medium text-gray-800">{material.title}</h4>
															<p class="text-gray-600 text-sm mt-1">{material.description}</p>
															<div class="flex items-center gap-3 mt-3">
																<a href={material.url} class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
																	<FontAwesomeIcon icon={faDownload} class="h-3 w-3" />
																	Download
																</a>
																{#if material.type === 'Video'}
																	<span class="text-gray-500 text-sm">{material.duration}</span>
																{:else}
																	<span class="text-gray-500 text-sm">{material.size}</span>
																{/if}
															</div>
														</div>
														<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
															{material.type}
														</span>
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Latest News Section -->
			{#if activeSection === 'news'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">Latest News & Updates</h2>
					
					<div class="space-y-4">
						{#each latestNews as news}
							<div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150 {news.important ? 'border-amber-300 bg-amber-50 hover:bg-amber-100' : ''}">
								<div class="flex items-start gap-4">
									<div class="flex-shrink-0 {news.important ? 'text-amber-500' : 'text-blue-500'} mt-1">
										<FontAwesomeIcon icon={faBullhorn} class="h-5 w-5" />
									</div>
									<div>
										<h3 class="font-semibold text-gray-800 mb-1">{news.title}</h3>
										<p class="text-gray-600 text-sm mb-2">{news.summary}</p>
										<div class="flex items-center justify-between">
											<span class="text-gray-500 text-xs">{news.date}</span>
											<a href={news.url} class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
												Read More
												<FontAwesomeIcon icon={faExternalLinkAlt} class="h-3 w-3" />
											</a>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- AI Tools Section -->
			{#if activeSection === 'ai-tools'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">AI-Powered Learning Tools</h2>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						{#each aiTools as tool}
							<div class="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
								<div class="flex items-start gap-4">
									<div class="bg-blue-100 p-3 rounded-full text-blue-600 flex-shrink-0">
										<FontAwesomeIcon icon={tool.icon} class="h-6 w-6" />
									</div>
									<div>
										<h3 class="font-semibold text-gray-800 mb-1">{tool.name}</h3>
										<p class="text-gray-600 text-sm mb-3">{tool.description}</p>
										{#if tool.type === 'chat'}
											<button 
												on:click={toggleAiChat} 
												class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
											>
												<FontAwesomeIcon icon={faQuestion} class="h-3 w-3" />
												Ask a Question
											</button>
										{:else if tool.type === 'search'}
											<button 
												class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
											>
												<FontAwesomeIcon icon={faSearch} class="h-3 w-3" />
												Search Content
											</button>
										{:else}
											<button 
												class="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
											>
												<FontAwesomeIcon icon={faTools} class="h-3 w-3" />
												Use Tool
											</button>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- AI Chat Widget -->
	{#if aiChatVisible}
		<div class="fixed bottom-6 right-6 w-full max-w-md z-50" transition:scale={{ duration: 200, start: 0.9 }}>
			<div class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[500px]">
				<div class="bg-blue-600 text-white p-4 flex justify-between items-center">
					<div class="flex items-center gap-2">
						<FontAwesomeIcon icon={faRobot} class="h-5 w-5" />
						<h3 class="font-semibold">JEE AI Assistant</h3>
					</div>
					<button on:click={toggleAiChat} class="text-white hover:text-blue-200 transition-colors duration-150">
						<FontAwesomeIcon icon={faTimes} class="h-5 w-5" />
					</button>
				</div>
				
				<div class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
					<!-- Welcome message -->
					<div class="flex items-start gap-3">
						<div class="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
							<FontAwesomeIcon icon={faRobot} class="h-5 w-5" />
						</div>
						<div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 max-w-[80%]">
							<p class="text-gray-700">
								Hello! I'm your JEE Main AI Assistant. Ask me anything about JEE Main exam, preparation strategies, or college admissions.
							</p>
						</div>
					</div>
					
					<!-- Chat messages -->
					{#each $messages as message}
						{#if message.role === 'user'}
							<div class="flex items-start gap-3 justify-end">
								<div class="bg-blue-600 p-3 rounded-lg shadow-sm text-white max-w-[80%]">
									<p>{message.content}</p>
								</div>
								<div class="bg-blue-500 p-2 rounded-full text-white flex-shrink-0">
									<FontAwesomeIcon icon={faUser} class="h-5 w-5" />
								</div>
							</div>
						{:else}
							<div class="flex items-start gap-3">
								<div class="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
									<FontAwesomeIcon icon={faRobot} class="h-5 w-5" />
								</div>
								<div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 max-w-[80%]">
									<p class="text-gray-700">{message.content}</p>
								</div>
							</div>
						{/if}
					{/each}
				</div>
				
				<div class="border-t border-gray-200 p-4 bg-white">
					<form on:submit|preventDefault={handleSendMessage} class="flex gap-2">
						<input
							type="text"
							bind:value={userQuestion}
							placeholder="Ask about JEE Main..."
							class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<button 
							type="submit" 
							class="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={!$isConnected || userQuestion.trim() === ''}
						>
							<FontAwesomeIcon icon={faPaperPlane} class="h-5 w-5" />
						</button>
					</form>
					{#if !$isConnected}
						<p class="text-amber-600 text-xs mt-2">Connecting to AI service...</p>
					{/if}
				</div>
			</div>
		</div>
    {/if}

	<!-- Removed duplicate main content section -->
    <div>
        <div>
			<!-- Overview Section -->
			{#if activeSection === 'overview'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">About JEE Main</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<p class="text-gray-700 mb-4">
								The Joint Entrance Examination (Main) is a standardized test conducted for admission to various engineering colleges in India. It is constituted by two papers; Paper-1 for B.E./B.Tech and Paper-2 for B.Arch/B.Planning.
							</p>
							<p class="text-gray-700 mb-4">
								JEE Main is conducted by the National Testing Agency (NTA) and serves as a qualifying exam for JEE Advanced, which is the entrance test for admission to the Indian Institutes of Technology (IITs).
							</p>
							<h3 class="text-lg font-semibold mb-3 text-gray-800">Eligibility Criteria</h3>
							<ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
								<li>Candidates who have passed class 12th or equivalent examination in 2022, 2023, or appearing in 2024 are eligible to apply.</li>
								<li>There is no age limit for the candidates.</li>
								<li>Candidates can attempt JEE Main for three consecutive years.</li>
							</ul>
						</div>
						<div>
							<h3 class="text-lg font-semibold mb-3 text-gray-800">Important Features</h3>
							<ul class="space-y-4">
								<li class="flex items-start gap-3">
									<div class="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
										<FontAwesomeIcon icon={faCalendar} class="h-4 w-4" />
									</div>
									<div>
										<span class="font-medium text-gray-800">Multiple Sessions</span>
										<p class="text-gray-600 text-sm mt-1">JEE Main is conducted in multiple sessions, giving candidates multiple attempts to improve their score.</p>
									</div>
								</li>
								<li class="flex items-start gap-3">
									<div class="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
										<FontAwesomeIcon icon={faGraduationCap} class="h-4 w-4" />
									</div>
									<div>
										<span class="font-medium text-gray-800">Wide Acceptance</span>
										<p class="text-gray-600 text-sm mt-1">JEE Main score is accepted by NITs, IIITs, CFTIs, and many state engineering colleges for admission.</p>
									</div>
								</li>
								<li class="flex items-start gap-3">
									<div class="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
										<FontAwesomeIcon icon={faFileAlt} class="h-4 w-4" />
									</div>
									<div>
										<span class="font-medium text-gray-800">Computer-Based Test</span>
										<p class="text-gray-600 text-sm mt-1">The exam is conducted in Computer Based Test (CBT) mode, except for the Drawing section in Paper-2.</p>
									</div>
								</li>
							</ul>
							<div class="mt-6">
								<h3 class="text-lg font-semibold mb-3 text-gray-800">Related Information</h3>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{#each relatedInfo as info}
										<a href={info.url} class="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200">
											<FontAwesomeIcon icon={info.icon} class="h-4 w-4 text-blue-600" />
											<span class="text-gray-700 text-sm">{info.title}</span>
										</a>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Exam Calendar Section -->
			{#if activeSection === 'calendar'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<div class="flex justify-between items-center mb-6">
						<h2 class="text-2xl font-bold text-gray-800">JEE Main 2024 Calendar</h2>
						<button class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
							<FontAwesomeIcon icon={faDownload} class="h-3 w-3" />
							Download Calendar
						</button>
					</div>
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
									<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
									<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each examCalendar as event}
									<tr class="hover:bg-gray-50 transition-colors duration-150">
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.event}</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.dateRange}</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm">
											{#if event.status === 'Completed'}
												<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
													{event.status}
												</span>
											{:else if event.status === 'Upcoming'}
												<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
													{event.status}
												</span>
											{:else}
												<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
													{event.status}
												</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
						<div class="flex items-start gap-3">
							<div class="flex-shrink-0 text-blue-600 mt-1">
								<FontAwesomeIcon icon={faInfoCircle} class="h-5 w-5" />
							</div>
							<div>
								<h3 class="font-semibold text-blue-800">Important Note</h3>
								<p class="mt-1 text-blue-700 text-sm">
									The dates mentioned above are tentative and subject to change. Candidates are advised to regularly check the official NTA website for the latest updates.
								</p>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Exam Pattern Section -->
			{#if activeSection === 'pattern'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">JEE Main Exam Pattern</h2>
					
					<div class="mb-8">
						<h3 class="text-xl font-semibold mb-4 text-gray-800">{examPattern.paper1.title}</h3>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							{#each examPattern.paper1.sections as section}
								<div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
									<div class="bg-blue-600 text-white p-4">
										<h4 class="font-semibold text-lg">{section.name}</h4>
										<div class="flex justify-between mt-1 text-blue-100 text-sm">
											<span>{section.questions} Questions</span>
											<span>{section.marks} Marks</span>
										</div>
									</div>
									<div class="p-4">
										<h5 class="text-sm font-medium text-gray-700 mb-2">Key Topics</h5>
										<ul class="space-y-1">
											{#each section.topics || [] as topic}
												<li class="text-sm text-gray-600 flex items-center gap-2">
													<span class="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block"></span>
													{topic}
												</li>
											{/each}
										</ul>
									</div>
								</div>
							{/each}
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<h4 class="font-medium text-gray-800 mb-2">Exam Duration</h4>
								<p class="text-gray-700">{examPattern.paper1.totalTime}</p>
							</div>
							<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<h4 class="font-medium text-gray-800 mb-2">Total Marks</h4>
								<p class="text-gray-700">{examPattern.paper1.totalMarks}</p>
							</div>
						</div>
						<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
							<h4 class="font-medium text-gray-800 mb-2">Marking Scheme</h4>
							<p class="text-gray-700">{examPattern.paper1.markingScheme}</p>
						</div>
					</div>
					
					<div>
						<h3 class="text-xl font-semibold mb-4 text-gray-800">{examPattern.paper2.title}</h3>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							{#each examPattern.paper2.sections as section}
								<div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
									<div class="bg-indigo-600 text-white p-4">
										<h4 class="font-semibold text-lg">{section.name}</h4>
										<div class="flex justify-between mt-1 text-indigo-100 text-sm">
											<span>{section.questions} Questions</span>
											<span>{section.marks} Marks</span>
										</div>
									</div>
								</div>
							{/each}
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<h4 class="font-medium text-gray-800 mb-2">Exam Duration</h4>
								<p class="text-gray-700">{examPattern.paper2.totalTime}</p>
							</div>
							<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<h4 class="font-medium text-gray-800 mb-2">Total Marks</h4>
								<p class="text-gray-700">{examPattern.paper2.totalMarks}</p>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Previous Papers Section -->
			{#if activeSection === 'papers'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">Previous Year Papers</h2>
					
					<div class="space-y-4">
						{#each previousYearPapers as yearData}
							<div class="border border-gray-200 rounded-lg overflow-hidden">
								<button 
									on:click={() => togglePaperYear(yearData.year)}
									class="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-150 text-left"
								>
									<span class="font-medium text-gray-800">JEE Main {yearData.year}</span>
									<FontAwesomeIcon 
										icon={expandedPaperYear === yearData.year ? faChevronUp : faChevronDown} 
										class="h-4 w-4 text-gray-500" 
									/>
								</button>
								
								{#if expandedPaperYear === yearData.year}
									<div class="p-4 bg-white" transition:fade={{ duration: 150 }}>
										{#each yearData.sessions as session}
											<div class="mb-4 last:mb-0">
												<h4 class="font-medium text-gray-700 mb-2">{session.name}</h4>
												<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
													{#each session.papers as paper}
														<div class="border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-150">
															<div class="flex justify-between items-start">
																<div>
																	<h5 class="font-medium text-gray-800">{paper.name}</h5>
																	<div class="flex items-center gap-3 mt-2">
																		<a href={paper.url} class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
																			<FontAwesomeIcon icon={faDownload} class="h-3 w-3" />
																			Download
																		</a>
																		<a href={paper.solutionUrl} class="text-green-600 hover:text-green-800 text-sm flex items-center gap-1">
																			<FontAwesomeIcon icon={faFileAlt} class="h-3 w-3" />
																			Solutions
																		</a>
																	</div>
																</div>
																<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
																	{paper.type}
																</span>
															</div>
														</div>
													{/each}
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Study Materials Section -->
			{#if activeSection === 'materials'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">Study Materials</h2>
					
					<div class="space-y-4">
						{#each studyMaterials as category}
							<div class="border border-gray-200 rounded-lg overflow-hidden">
								<button 
									on:click={() => toggleMaterialCategory(category.category)}
									class="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-150 text-left"
								>
									<span class="font-medium text-gray-800">{category.category}</span>
									<FontAwesomeIcon 
										icon={expandedMaterialCategory === category.category ? faChevronUp : faChevronDown} 
										class="h-4 w-4 text-gray-500" 
									/>
								</button>
								
								{#if expandedMaterialCategory === category.category}
									<div class="p-4 bg-white" transition:fade={{ duration: 150 }}>
										<div class="grid grid-cols-1 gap-4">
											{#each category.materials as material}
												<div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-150">
													<div class="flex justify-between items-start">
														<div>
															<h4 class="font-medium text-gray-800">{material.title}</h4>
															<p class="text-gray-600 text-sm mt-1">{material.description}</p>
															<div class="flex items-center gap-3 mt-3">
																<a href={material.url} class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
																	<FontAwesomeIcon icon={faDownload} class="h-3 w-3" />
																	Download
																</a>
																{#if material.type === 'Video'}
																	<span class="text-gray-500 text-sm">{material.duration}</span>
																{:else}
																	<span class="text-gray-500 text-sm">{material.size}</span>
																{/if}
															</div>
														</div>
														<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
															{material.type}
														</span>
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Latest News Section -->
			{#if activeSection === 'news'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">Latest News & Updates</h2>
					
					<div class="space-y-4">
						{#each latestNews as news}
							<div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150 {news.important ? 'border-amber-300 bg-amber-50 hover:bg-amber-100' : ''}">
								<div class="flex items-start gap-4">
									<div class="flex-shrink-0 {news.important ? 'text-amber-500' : 'text-blue-500'} mt-1">
										<FontAwesomeIcon icon={faBullhorn} class="h-5 w-5" />
									</div>
									<div>
										<h3 class="font-semibold text-gray-800 mb-1">{news.title}</h3>
										<p class="text-gray-600 text-sm mb-2">{news.summary}</p>
										<div class="flex items-center justify-between">
											<span class="text-gray-500 text-xs">{news.date}</span>
											<a href={news.url} class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
												Read More
												<FontAwesomeIcon icon={faExternalLinkAlt} class="h-3 w-3" />
											</a>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- AI Tools Section -->
			{#if activeSection === 'ai-tools'}
				<div class="p-6" transition:fade={{ duration: 200 }}>
					<h2 class="text-2xl font-bold mb-6 text-gray-800">AI-Powered Learning Tools</h2>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						{#each aiTools as tool}
							<div class="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
								<div class="flex items-start gap-4">
									<div class="bg-blue-100 p-3 rounded-full text-blue-600 flex-shrink-0">
										<FontAwesomeIcon icon={tool.icon} class="h-6 w-6" />
									</div>
									<div>
										<h3 class="font-semibold text-gray-800 mb-1">{tool.name}</h3>
										<p class="text-gray-600 text-sm mb-3">{tool.description}</p>
										{#if tool.type === 'chat'}
											<button 
												on:click={toggleAiChat} 
												class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
											>
												<FontAwesomeIcon icon={faQuestion} class="h-3 w-3" />
												Ask a Question
											</button>
										{:else if tool.type === 'search'}
											<button 
												class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
											>
												<FontAwesomeIcon icon={faSearch} class="h-3 w-3" />
												Search Content
											</button>
										{:else}
											<button 
												class="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
											>
												<FontAwesomeIcon icon={faTools} class="h-3 w-3" />
												Use Tool
											</button>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- AI Chat Widget -->
	{#if aiChatVisible}
		<div class="fixed bottom-6 right-6 w-full max-w-md z-50" transition:scale={{ duration: 200, start: 0.9 }}>
			<div class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[500px]">
				<div class="bg-blue-600 text-white p-4 flex justify-between items-center">
					<div class="flex items-center gap-2">
						<FontAwesomeIcon icon={faRobot} class="h-5 w-5" />
						<h3 class="font-semibold">JEE AI Assistant</h3>
					</div>
					<button on:click={toggleAiChat} class="text-white hover:text-blue-200 transition-colors duration-150">
						<FontAwesomeIcon icon={faTimes} class="h-5 w-5" />
					</button>
				</div>
				
				<div class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
					<!-- Welcome message -->
					<div class="flex items-start gap-3">
						<div class="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
							<FontAwesomeIcon icon={faRobot} class="h-5 w-5" />
						</div>
						<div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 max-w-[80%]">
							<p class="text-gray-700">
								Hello! I'm your JEE Main AI Assistant. Ask me anything about JEE Main exam, preparation strategies, or college admissions.
							</p>
						</div>
					</div>
					
					<!-- Chat messages -->
					{#each $messages as message}
						{#if message.role === 'user'}
							<div class="flex items-start gap-3 justify-end">
								<div class="bg-blue-600 p-3 rounded-lg shadow-sm text-white max-w-[80%]">
									<p>{message.content}</p>
								</div>
								<div class="bg-blue-500 p-2 rounded-full text-white flex-shrink-0">
									<FontAwesomeIcon icon={faUser} class="h-5 w-5" />
								</div>
							</div>
						{:else}
							<div class="flex items-start gap-3">
								<div class="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
									<FontAwesomeIcon icon={faRobot} class="h-5 w-5" />
								</div>
								<div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 max-w-[80%]">
									<p class="text-gray-700">{message.content}</p>
								</div>
							</div>
						{/if}
					{/each}
				</div>
				
				<div class="border-t border-gray-200 p-4 bg-white">
					<form on:submit|preventDefault={handleSendMessage} class="flex gap-2">
						<input
							type="text"
							bind:value={userQuestion}
							placeholder="Ask about JEE Main..."
							class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<button 
							type="submit" 
							class="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={!$isConnected || userQuestion.trim() === ''}
						>
							<FontAwesomeIcon icon={faPaperPlane} class="h-5 w-5" />
						</button>
					</form>
					{#if !$isConnected}
						<p class="text-amber-600 text-xs mt-2">Connecting to AI service...</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Floating AI Chat Button -->
	{#if !aiChatVisible}
		<button 
			on:click={toggleAiChat}
			class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105 z-50 flex items-center justify-center"
		>
			<FontAwesomeIcon icon={faRobot} class="h-6 w-6" />
		</button>
	{/if}
</main>