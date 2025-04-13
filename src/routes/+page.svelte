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
		faUniversity
	} from '@fortawesome/free-solid-svg-icons';

	// Scroll to form function
	let formSection: HTMLElement;
</script>

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
		<!-- Left Side: Text Content -->
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

		<!-- Right Side: Form Container -->
		<div bind:this={formSection} class="rounded-xl bg-white p-1 shadow-2xl">
			<div class="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
				<div class="mb-6 text-center">
					<h2 class="text-2xl font-bold text-gray-800">Find Your Ideal College</h2>
					<p class="text-gray-600">Enter your details to get personalized recommendations</p>
				</div>
				<JosaaForm />
			</div>
		</div>
	</div>
</section>

<!-- Answer Sheet Calculator Section -->
<section class="py-16 bg-gray-50">
	<div class="container mx-auto px-4">
		<div class="text-center mb-10">
			<span class="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">
				NEW FEATURE
			</span>
			<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
				Calculate Your JEE Marks Instantly
			</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				Upload your official JEE answer sheet link to see correct/incorrect questions and calculate your
				expected score.
			</p>
		</div>

		<div class="max-w-3xl mx-auto">
			<AnswerSheetCalculator />
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
