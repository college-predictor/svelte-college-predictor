<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { page } from '$app/stores';

	let isMenuOpen = false;
	let isScrolled = false;
	let activeLink = '/';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/exams', label: 'Exams' },
		{ href: '/rank-converter', label: 'Rank Converter' },
		{ href: '/discussion-forum', label: 'Discussion Forum' },
		{ href: '/about', label: 'About' }
	];

	// Exams dropdown data
	const examCategories = [
		{
			name: 'Engineering',
			exams: [
				{ href: '/exams/jee-main', label: 'JEE Main' },
				{ href: '/exams/jee-advanced', label: 'JEE Advanced' },
				{ href: '/exams/gate', label: 'GATE' }
			]
		},
		{
			name: 'Medical',
			exams: [
				{ href: '/exams/neet', label: 'NEET' },
				{ href: '/exams/aiims', label: 'AIIMS' }
			]
		},
		{
			name: 'Management',
			exams: [
				{ href: '/exams/cat', label: 'CAT' },
				{ href: '/exams/mat', label: 'MAT' },
				{ href: '/exams/xat', label: 'XAT' }
			]
		}
	];

	let isExamDropdownOpen = false;
	let isMobileExamExpanded = false;

	function toggleExamDropdown() {
		isExamDropdownOpen = !isExamDropdownOpen;
	}

	let closeTimeout;

	function closeExamDropdown() {
		closeTimeout = setTimeout(() => {
			isExamDropdownOpen = false;
		}, 200);
	}

	function cancelClose() {
		clearTimeout(closeTimeout);
	}

	function toggleMobileExamMenu() {
		isMobileExamExpanded = !isMobileExamExpanded;
	}

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const unsubscribe = page.subscribe(($page) => {
		activeLink = $page.url.pathname;
	});
	onDestroy(unsubscribe);

	const toggleMenu = () => (isMenuOpen = !isMenuOpen);
	const closeMenu = () => (isMenuOpen = false);
</script>

<nav
	class="z-100 fixed left-0 right-0 top-0 h-14 transition-all duration-300 {isScrolled
		? 'bg-white shadow-md'
		: 'bg-blue-900 md:bg-black/50 md:backdrop-blur-sm'}"
>
	<div class="container mx-auto h-full px-4">
		<div class="flex h-full items-center justify-between">
			<!-- Logo -->
			<a href="/" class="group flex items-center">
				<div
					class="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-sm transition-all duration-300 group-hover:shadow-md"
				>
					<img
						src="assets/logo_light.webp"
						alt="College Predictor Logo"
						class="h-5 w-5 transition-transform duration-300 group-hover:scale-105"
					/>
				</div>
				<span
					class="ml-2 text-base font-semibold {isScrolled
						? 'text-indigo-800'
						: 'text-white'} transition-colors duration-300 group-hover:text-blue-300"
				>
					College Predictor
				</span>
			</a>

			<!-- Desktop Menu -->
			<div class="hidden items-center space-x-6 md:flex">
				{#each links as link}
					<!-- Special handling for Exams - show as dropdown -->
					{#if link.label === 'Exams'}
						<div class="relative" on:mouseleave={closeExamDropdown} on:mouseenter={cancelClose}>
							<button
								on:mouseenter={toggleExamDropdown}
								on:click={() => window.location.href = '/exams'}
								class="relative flex items-center text-sm font-medium {isScrolled
									? 'text-gray-700'
									: 'text-white'} {activeLink.startsWith('/exams')
									? 'text-blue-400'
									: ''} transition-colors duration-200 hover:text-blue-400"
							>
								{link.label}
								<svg
									class="ml-1 h-4 w-4 transition-transform duration-200 {isExamDropdownOpen
										? 'rotate-180'
										: ''}"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
								<span
									class="absolute bottom-0 left-0 h-0.5 w-full transform bg-blue-400 transition-transform duration-300 {activeLink.startsWith('/exams')
										? 'scale-x-100'
										: 'scale-x-0'} group-hover:scale-x-100"
								></span>
							</button>
							
							<!-- Dropdown Menu -->
							{#if isExamDropdownOpen}
								<div
									transition:fade={{ duration: 200 }}
									class="absolute left-0 z-50 mt-2 w-64 origin-top-left rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
								>
									{#each examCategories as category}
										<div class="px-4 py-2">
											<h3 class="text-xs font-semibold uppercase tracking-wide text-gray-500">
												{category.name}
											</h3>
											<div class="mt-2 space-y-1">
												{#each category.exams as exam}
													<a
														href={exam.href}
														class="block rounded-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
														on:click={closeExamDropdown}
													>
														{exam.label}
													</a>
												{/each}
											</div>
										</div>
									{/each}
									<div class="mt-2 border-t border-gray-100 pt-2">
										<a
											href="/exams"
											class="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
										>
											View All Exams
										</a>
									</div>
								</div>
							{/if}
						</div>
					{:else}
						<a
							href={link.href}
							class="relative text-sm font-medium {isScrolled
								? 'text-gray-700'
								: 'text-white'} {activeLink === link.href
								? 'text-blue-400'
								: ''} transition-colors duration-200 hover:text-blue-400"
						>
							{link.label}
							<span
								class="absolute bottom-0 left-0 h-0.5 w-full transform bg-blue-400 transition-transform duration-300 {activeLink ===
							link.href
								? 'scale-x-100'
								: 'scale-x-0'} group-hover:scale-x-100"
							></span>
						</a>
					{/if}
				{/each}
				<a
					href="/ai-counsellor"
					class="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700"
				>
					AI Counsellor
					<svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>
			</div>

			<!-- Mobile Menu Button -->
			<button
				on:click={toggleMenu}
				class="rounded-full p-2 md:hidden {isScrolled
					? 'text-gray-700 hover:bg-gray-100'
					: 'text-white hover:bg-blue-800'} transition-colors duration-200"
				aria-label="Toggle menu"
				aria-expanded={isMenuOpen}
			>
				{#if isMenuOpen}
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{:else}
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div
			class="z-100 fixed inset-0 bg-black/60 md:hidden"
			on:click={closeMenu}
			on:keydown={(e) => e.key === 'Escape' && closeMenu()}
			transition:fade={{ duration: 200 }}
		>
			<div
				class="z-100 absolute right-0 top-0 h-full w-64 bg-gray-50 shadow-xl"
				on:click|stopPropagation
				transition:slide={{ duration: 300, axis: 'x' }}
			>
				<div class="flex items-center justify-between border-b border-gray-200 bg-blue-900 p-4">
					<span class="text-base font-semibold text-white">College Predictor</span>
					<button
						on:click={closeMenu}
						class="p-1 text-white hover:text-blue-300"
						aria-label="Close menu"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<nav class="space-y-3 p-4">
					{#each links as link}
						{#if link.label === 'Exams'}
							<div class="mb-1">
								<button
									class="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-blue-100 hover:text-blue-600 {activeLink.startsWith('/exams') ? 'bg-blue-100 text-blue-600' : ''} transition-colors duration-200"
									on:click={toggleMobileExamMenu}
								>
									<span>{link.label}</span>
									<svg
										class="h-4 w-4 transition-transform duration-200 {isMobileExamExpanded ? 'rotate-180' : ''}"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
								
								{#if isMobileExamExpanded}
									<div class="ml-4 mt-1 border-l border-blue-100 pl-2">
										{#each examCategories as category}
											<div class="mb-2">
												<h3 class="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
													{category.name}
												</h3>
												<div class="mt-1 space-y-0.5">
													{#each category.exams as exam}
														<a
															href={exam.href}
															class="block rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
															on:click={closeMenu}
														>
															{exam.label}
														</a>
													{/each}
												</div>
											</div>
										{/each}
										<a
											href="/exams"
											class="mt-1 block px-2 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
											on:click={closeMenu}
										>
											View All Exams
										</a>
									</div>
								{/if}
							</div>
						{:else}
							<a
								href={link.href}
								class="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-blue-100 hover:text-blue-600 {activeLink ===
							link.href
								? 'bg-blue-100 text-blue-600'
								: ''} transition-colors duration-200"
								on:click={closeMenu}
							>
								{link.label}
							</a>
						{/if}
					{/each}
					<a
						href="/ai-counsellor"
						class="block rounded-md bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
						on:click={closeMenu}
					>
						AI Counsellor
					</a>
					<div class="space-y-2 border-t border-gray-300 pt-3">
						<a
							href="/login"
							class="block rounded-md border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
							on:click={closeMenu}
						>
							Login
						</a>
						<a
							href="/signup"
							class="block rounded-md bg-blue-600 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
							on:click={closeMenu}
						>
							Sign Up
						</a>
					</div>
				</nav>
			</div>
		</div>
	{/if}
</nav>
<div class="h-14"></div>

<style>
	.fade-in {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	a,
	button {
		transition: all 0.2s ease;
	}

	/* Mobile-specific adjustments */
	@media (max-width: 767px) {
		nav {
			height: 56px; /* Standard mobile navbar height */
		}
		.h-14 {
			height: 56px; /* Match spacer to navbar height */
		}
	}
</style>
