<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { page } from '$app/stores';

	let isMenuOpen = false;
	let isScrolled = false;
	let activeLink = '/';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/study-material', label: 'Study Material' },
		{ href: '/discussion-forum', label: 'Discussion Forum' },
		{ href: '/about', label: 'About' }
	];

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
