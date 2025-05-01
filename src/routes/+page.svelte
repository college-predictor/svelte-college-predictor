<script lang="ts">
	import JosaaForm from '$lib/components/JosaaForm.svelte';
	import RecommandationSection from '$lib/components/layout/RecommandationSection.svelte';
	import AiHomeSection from '$lib/components/layout/AIHomeSection.svelte';
	import ResultInfoSection from '$lib/components/layout/ResultInfoSection.svelte';
	import AnswerSheetCalculator from '$lib/components/AnswerSheetCalculator.svelte';
	// Footer is imported in the layout
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

<!-- AI Counsellor Coming Soon Banner -->
<section class="relative overflow-hidden bg-gradient-to-r from-purple-900 via-fuchsia-800 to-purple-900 py-2 text-white shadow-2xl border-y border-white/10 duration-300">
	<div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl animate-pulse hidden sm:block"></div>
	<div class="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl animate-pulse hidden sm:block"></div>

	<div class="container relative z-10 mx-auto px-3">
	  <div class="flex items-center justify-center text-center">
		<div class="max-w-4xl">
		  <div class="mb-1 inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-900 shadow-lg animate-bounce">
			<FontAwesomeIcon icon={faComments} class="mr-1" />
			COMING SOON - FREE FOR ALL STUDENTS
		  </div>
		  <h2 class="text-x1 font-bold md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100 mb-3">
			AI Counsellor - Solution To All Your Confusions
		  </h2>
		  <p class="text-s text-indigo-100 mb-3 max-w-2xl mx-auto">
			Get instant, personalized guidance from our highly trustworthy AI solution - guiding you from exam preparation to finding the college that suits you best, completely free!
		  </p>
		  <div class="grid grid-cols-3 gap-1 text-left max-w-5xl mx-auto">
			<div class="bg-white/10 backdrop-blur-lg rounded-lg p-1.5 transform hover:scale-105 transition-all duration-300">
			  <h3 class="font-semibold text-yellow-300 mb-0.5 text-xs">Trusted AI Guidance</h3>
			  <p class="text-indigo-200 text-[10px]">Get highly accurate college suggestions from our trusted AI system.</p>
			</div>
			<div class="bg-white/10 backdrop-blur-lg rounded-lg p-1.5 transform hover:scale-105 transition-all duration-300">
			  <h3 class="font-semibold text-yellow-300 mb-0.5 text-xs">Exam to College</h3>
			  <p class="text-indigo-200 text-[10px]">Complete guidance from exam preparation to final admission.</p>
			</div>
			<div class="bg-white/10 backdrop-blur-lg rounded-lg p-1.5 transform hover:scale-105 transition-all duration-300">
			  <h3 class="font-semibold text-yellow-300 mb-0.5 text-xs">Perfect Match</h3>
			  <p class="text-indigo-200 text-[10px]">Find the college that perfectly suits your goals and preferences.</p>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  </section>

  <!-- Answer Sheet Calculator Section -->
  <section class="relative overflow-hidden bg-gradient-to-r from-purple-900 via-fuchsia-800 to-purple-900 py-3 text-white shadow-xl border-b border-white/10">
	<div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-fuchsia-400/30 blur-3xl animate-pulse hidden sm:block"></div>
	<div class="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-400/30 blur-3xl animate-pulse hidden sm:block"></div>
	<div class="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-400/30 blur-3xl hidden sm:block"></div>
	<div class="container relative z-10 mx-auto px-3 mt-3">
	  <div class="flex flex-col lg:flex-row items-center justify-center gap-2 max-w-5xl mx-auto">
		<div class="max-w-lg text-center lg:text-left lg:pr-3">
		  <div class="mb-1 inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-900 shadow-lg">
			<FontAwesomeIcon icon={faCalculator} class="mr-1" />
			FINAL ANSWER KEY LIVE
		  </div>
		  <h2 class="mb-1 text-xl font-extrabold md:text-2xl">
			Calculate Your JEE Marks with <span class="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-300">Final Answer Key</span>
		  </h2>
		  <p class="text-xs sm:text-sm text-blue-100">
			Upload your official JEE answer sheet link to get your accurate final score with our trusted AI-powered analysis system.
		  </p>
		</div>

		<div class="transform transition-all duration-500 ease-in-out hover:scale-105 lg:flex-shrink-0"
		  class:scale-100={calculatorVisible}
		  class:opacity-100={calculatorVisible}
		  class:scale-95={!calculatorVisible}
		  class:opacity-0={!calculatorVisible}>
		  <div class="bg-white/10 backdrop-blur-lg rounded-xl p-1 shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 border border-white/20 ring-1 ring-blue-500/10">
			<AnswerSheetCalculator />
		  </div>
		</div>
	  </div>
	</div>
  </section>

<!-- Hero Section with Form -->
<section
	class="relative flex min-h-[calc(100vh-100px)] items-center justify-center bg-cover bg-center px-4 text-white lg:px-8"
	style="background-image: url('assets/hero-background.webp');"
>
	<div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-[2px]"></div>

	<div
		class="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 py-8 lg:grid-cols-2"
	>
		<div bind:this={formSection} class="rounded-xl bg-white/10 p-1 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:shadow-blue-500/20">
			<div class="rounded-lg bg-gradient-to-br from-white/95 to-white/90 p-4">
				<div class="mb-4 text-center">
					<h2 class="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Find Your Ideal College</h2>
					<p class="text-gray-600 mt-1">Enter your details to get personalized recommendations</p>
				</div>
				<JosaaForm />
			</div>
		</div>

		<div class="space-y-4 text-center lg:text-left">
			<div>
				<span
					class="inline-block rounded-full bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm px-4 py-1 text-sm font-bold uppercase tracking-wider text-white shadow-lg"
				>
					JEE & NEET Students
				</span>
				<h1 class="mt-3 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
					Navigate Your <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">College Journey</span> With Confidence
				</h1>
			</div>

			<p class="text-lg text-gray-200 leading-relaxed">
				Get personalized college recommendations based on your rank, preferences, and career goals.
				Make informed decisions with our AI-powered platform designed specifically for JEE and NEET
				aspirants.
			</p>

			<div
				class="flex flex-wrap items-center justify-center gap-4 pt-3 text-base text-gray-300 lg:justify-start"
			>
				<div class="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5 transition-all duration-300 hover:bg-black/30">
					<FontAwesomeIcon icon={faGraduationCap} class="text-blue-400 text-lg" />
					<span>100+ Top Colleges</span>
				</div>
				<div class="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5 transition-all duration-300 hover:bg-black/30">
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

<AiHomeSection />

<ResultInfoSection />

<!-- Recommendation Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
  <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
  <div class="container mx-auto px-4 relative z-10">
    <div class="max-w-3xl mx-auto text-center mb-8">
      <h2 class="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Recommended For You</h2>
      <p class="text-lg text-gray-600">Discover top colleges and programs tailored to your profile</p>
    </div>
    <RecommandationSection />
  </div>
</section>

<!-- Footer is already included in the layout -->

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
