<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	let isMenuOpen = false;
	let scrollY;
	let isScrolled = false;
	let activeLink = '/';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/study-material', label: 'Free Study Material' },
		{ href: '/discussion-forum', label: 'Discussion Forum' },
		{ href: '/about', label: 'About' }
		// {
		//   href: '/exams',
		//   label: 'Exams',
		//   dropdown: [
		//     { label: 'Engineering', href: '/engineering' },
		//     { label: 'Medical', href: '/engineering' },
		//   ],
		// },
	];

	// Track scroll position to add background when scrolled
	onMount(() => {
		// Set active link based on current path
		activeLink = window.location.pathname;

		// Add scroll event listener
		const handleScroll = () => {
			scrollY = window.scrollY;
			isScrolled = scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
	};

	const closeMenu = () => {
		isMenuOpen = false;
	};
</script>

<nav
	class="fixed left-0 right-0 top-0 z-50 h-16 transition-all duration-300 {isScrolled
		? 'bg-white shadow-lg'
		: 'bg-transparent'}"
>
	<div class="container mx-auto h-full px-4 sm:px-6 lg:px-8">
		<div class="flex h-full items-center justify-between">
			<!-- Logo Section -->
			<div class="flex items-center">
				<a href="/" class="group flex items-center">
					<div
						class="relative overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 p-1.5 shadow-md transition-all duration-300 group-hover:shadow-lg"
					>
						<img
							src="assets/logo_light.webp"
							alt="College Predictor Logo"
							class="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
						/>
					</div>
					<span
						class="ml-2 text-lg font-bold tracking-tight {isScrolled
							? 'text-gray-800'
							: 'text-white'} transition-colors duration-300 group-hover:text-blue-500"
						>College Predictor</span
					>
				</a>
			</div>

			<!-- Search Bar (Optional) -->
			<!-- <div class="hidden md:flex md:items-center md:w-1/3">
        <input
          type="text"
          placeholder="Search for colleges..."
          class="w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Search for colleges"
        />
        <button class="ml-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300" aria-label="Search">
          Search
        </button>
      </div> -->

			<!-- Desktop Menu -->
			<div class="hidden md:flex md:items-center">
				<ul class="flex items-center space-x-1 lg:space-x-2">
					{#each links as link}
						<li class="group relative">
							{#if link.dropdown}
								<a
									href={link.href}
									class="relative flex items-center px-2 py-1 text-sm font-medium {isScrolled
										? 'text-gray-700'
										: 'text-white'} {activeLink === link.href
										? 'text-blue-600'
										: ''} transition-colors duration-200 hover:text-blue-600"
								>
									<span>{link.label}</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="ml-1 h-4 w-4"
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

									<!-- Active indicator -->
									{#if activeLink === link.href}
										<span class="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"></span>
									{/if}
								</a>
								<ul
									class="invisible absolute left-0 z-10 mt-1 w-48 overflow-hidden rounded-md border border-gray-100 bg-white text-gray-800 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100"
								>
									{#each link.dropdown as subLink}
										<li>
											<a
												href={subLink.href}
												class="block px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-50 hover:text-blue-600"
												>{subLink.label}</a
											>
										</li>
									{/each}
								</ul>
							{:else}
								<a
									href={link.href}
									class="relative px-2 py-1 text-sm font-medium {isScrolled
										? 'text-gray-700'
										: 'text-white'} {activeLink === link.href
										? 'text-blue-600'
										: ''} transition-colors duration-200 hover:text-blue-600"
								>
									{link.label}

									<!-- Active indicator -->
									{#if activeLink === link.href}
										<span class="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"></span>
									{/if}
								</a>
							{/if}
						</li>
					{/each}

					<li class="ml-2">
						<a
							href="/ai-counsellor"
							class="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-3 py-1.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-indigo-800 hover:shadow-lg"
						>
							<span class="mr-1">AI Counsellor</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 7l5 5m0 0l-5 5m5-5H6"
								/>
							</svg>
						</a>
					</li>
					<!-- <li>
            <a href="/login" class="text-white hover:text-yellow-300 transition duration-300 font-medium">
              Login
            </a>
          </li>
          <li>
            <a href="/signup">
              <button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 font-medium">
                Sign Up
              </button>
            </a>
          </li> -->
				</ul>
			</div>

			<!-- Mobile Menu Button -->
			<div class="flex items-center md:hidden">
				<button
					id="menu-button"
					on:click={toggleMenu}
					class="rounded-full p-2 {isScrolled
						? 'text-gray-700 hover:bg-gray-100'
						: 'text-white hover:bg-white/10'} transition-colors duration-200 focus:outline-none"
					aria-label="Toggle menu"
					aria-expanded={isMenuOpen}
				>
					{#if isMenuOpen}
						<!-- Close Icon -->
						<svg
							class="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					{:else}
						<!-- Hamburger Icon -->
						<svg
							class="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
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
	</div>

	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div
			id="mobile-menu"
			class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
			on:click={closeMenu}
			on:keydown={(e) => e.key === 'Escape' && closeMenu()}
			role="dialog"
			aria-modal="true"
			aria-label="Navigation menu"
			transition:fade={{ duration: 200 }}
		>
			<div
				class="absolute right-0 top-0 h-full w-3/4 max-w-sm overflow-y-auto bg-white shadow-xl"
				on:click|stopPropagation
				on:keydown|stopPropagation
				role="document"
				transition:slide={{ duration: 300, axis: 'x' }}
			>
				<div class="border-b border-gray-200 p-5">
					<div class="mb-2 flex items-center justify-between">
						<div class="flex items-center">
							<div class="rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 p-2">
								<img src="assets/logo_light.webp" alt="College Predictor Logo" class="h-6 w-6" />
							</div>
							<span class="ml-2 text-lg font-bold text-gray-800">College Predictor</span>
						</div>
						<button
							on:click={closeMenu}
							class="rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none"
							aria-label="Close menu"
						>
							<svg
								class="h-5 w-5"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>

				<nav class="p-5">
					<ul class="space-y-3">
						{#each links as link}
							<li>
								<a
									href={link.href}
									class="flex items-center rounded-md px-3 py-2 text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600 {activeLink ===
									link.href
										? 'bg-blue-50 font-medium text-blue-600'
										: ''}"
									on:click={closeMenu}
								>
									{link.label}
									{#if activeLink === link.href}
										<svg
											class="ml-auto h-5 w-5 text-blue-600"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									{/if}
								</a>
							</li>
						{/each}

						<li class="mt-3 border-t border-gray-200 pt-3">
							<a
								href="/ai-counsellor"
								class="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg"
								on:click={closeMenu}
							>
								<span class="font-medium">AI Counsellor</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									/>
								</svg>
							</a>
						</li>

						<li class="mt-3 border-t border-gray-200 pt-3">
							<div class="flex items-center justify-between space-x-3">
								<a
									href="/login"
									class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 transition-colors duration-200 hover:bg-gray-50"
									on:click={closeMenu}
								>
									Login
								</a>
								<a
									href="/signup"
									class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-white transition-colors duration-200 hover:bg-blue-700"
									on:click={closeMenu}
								>
									Sign Up
								</a>
							</div>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	{/if}
</nav>

<!-- Spacer to prevent content from being hidden under the fixed navbar -->
<div class="h-16"></div>

<style>
	/* Add a semi-transparent overlay behind the navbar when at the top of the page */
	nav:not(.bg-white)::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 100%;
		background: linear-gradient(45deg, rgba(0, 0, 0, 0.5) 0%, rgba(91, 91, 91, 0) 100%);
		pointer-events: none;
		z-index: -1;
	}
</style>
