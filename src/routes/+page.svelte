<script lang="ts">
	import JosaaForm from '$lib/components/JosaaForm.svelte';
	import RecommandationSection from '$lib/components/layout/RecommandationSection.svelte';
	import AiServiceSection from '$lib/components/layout/AIServiceSection.svelte';
	import AnswerSheetCalculator from '$lib/components/AnswerSheetCalculator.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { goto } from '$app/navigation';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faArrowRight,
		faComments,
		faGraduationCap,
		faUniversity,
		faCalculator
	} from '@fortawesome/free-solid-svg-icons';

	// Scroll to form function
	let formSection: HTMLElement;
	
	// Animation control for new feature highlight
	let calculatorVisible = false;
	onMount(() => {
		setTimeout(() => {
			calculatorVisible = true;
		}, 500);
	});
	import { onMount } from 'svelte';
</script>

<!-- NEW FEATURE: Answer Sheet Calculator Section -->
<section class="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 py-8 text-white">
	<div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl"></div>
	<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl"></div>
	
	<div class="container relative z-10 mx-auto px-4">
		<div class="flex flex-col items-center justify-between gap-6 lg:flex-row">
			<div class="max-w-xl text-center lg:text-left">
				<div class="mb-4 inline-flex animate-pulse items-center rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold uppercase tracking-wider text-blue-900">
					<FontAwesomeIcon icon={faCalculator} class="mr-2" />
					FINAL ANSWER KEY IS NOW LIVE
				</div>
				<h2 class="mb-4 text-3xl font-extrabold md:text-4xl">
					Calculate Your JEE Marks with <span class="text-yellow-300">Final Answer Key</span>
				</h2>
				<p class="text-lg text-blue-100">
					Upload your official JEE answer sheet link to get your accurate final score based on the official answer key.
				</p>
			</div>
			
			<div class="w-full max-w-md transform transition-all duration-500 ease-in-out lg:w-2/5" 
				class:scale-100={calculatorVisible} 
				class:opacity-100={calculatorVisible}
				class:scale-95={!calculatorVisible}
				class:opacity-0={!calculatorVisible}>
				<AnswerSheetCalculator />
			</div>
		</div>
	</div>
</section>

<section
	class="relative flex min-h-[calc(100vh-64px)] items-center justify-center bg-cover bg-center px-6 text-white lg:px-16"
	style="background-image: url('assets/hero-background.webp');"
>
	<!-- Overlay with gradient for better text visibility -->
	<div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

	<!-- Content Container -->
	<div
		class="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2"
	>

		<!-- Left Side: Form Container -->
		<div bind:this={formSection} class="rounded-xl bg-white p-1 shadow-2xl">
			<div class="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
				<div class="mb-6 text-center">
					<h2 class="text-2xl font-bold text-gray-800">Find Your Ideal College</h2>
					<p class="text-gray-600">Enter your details to get personalized recommendations</p>
				</div>
				<JosaaForm />
			</div>
		</div>

		<!-- Right Side: Text Content -->
		<div class="space-y-8 text-center lg:text-left">
			<div>
				<span
					class="inline-block rounded-full bg-blue-600/80 px-4 py-1 text-sm font-medium uppercase tracking-wider text-white"
				>
					JEE & NEET Students
				</span>
				<h1 class="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
					Navigate Your <span class="text-blue-400">College Journey</span> With Confidence
				</h1>
			</div>

			<p class="text-lg text-gray-200 lg:text-xl">
				Get personalized college recommendations based on your rank, preferences, and career goals.
				Make informed decisions with our AI-powered platform designed specifically for JEE and NEET
				aspirants.
			</p>

			<!-- <div class="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 lg:justify-start">
				<button
					on:click={() => goto('/discussion-forum')}
					class="group flex items-center justify-center space-x-2 rounded-lg border-2 border-white/80 bg-transparent px-6 py-3 font-medium text-white backdrop-blur-sm transition duration-300 hover:bg-white/10"
				>
					<span>Join Discussion Forum</span>
					<FontAwesomeIcon
						icon={faComments}
						class="transition-transform duration-300 group-hover:translate-x-1"
					/>
				</button>
			</div> -->

			<div
				class="flex flex-wrap items-center justify-center gap-8 pt-4 text-sm text-gray-300 lg:justify-start"
			>
				<div class="flex items-center space-x-2">
					<FontAwesomeIcon icon={faGraduationCap} class="text-blue-400" />
					<span>100+ Top Colleges</span>
				</div>
				<div class="flex items-center space-x-2">
					<svg
						class="h-5 w-5 text-blue-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						></path>
					</svg>
					<span>Trusted by 10,000+ Students</span>
				</div>
			</div>
		</div>
	</div>
</section>



<AiServiceSection />
<RecommandationSection />

<style>
	/* Add subtle animation for the hero section */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	section {
		animation: fadeIn 0.8s ease-out;
	}
</style>
