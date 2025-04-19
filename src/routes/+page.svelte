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

<!-- AI Counsellor Coming Soon Banner -->
<section class="relative overflow-hidden bg-gradient-to-r from-purple-900 via-fuchsia-800 to-purple-900 py-6 text-white shadow-2xl border border-white/10 duration-300">
	<div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
	<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl animate-pulse"></div>
	
	<div class="container relative z-10 mx-auto px-4">
	  <div class="flex items-center justify-center text-center">
		<div class="max-w-3xl">
		  <div class="mb-2 inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-indigo-900 shadow-lg animate-bounce">
			<FontAwesomeIcon icon={faComments} class="mr-2" />
			COMING SOON - FREE FOR ALL STUDENTS
		  </div>
		  <h2 class="text-2xl font-bold md:text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100 mb-4">
			AI Counsellor - Your 24/7 Education Guide
		  </h2>
		  <p class="text-lg text-indigo-200 mb-6 max-w-2xl mx-auto">
			Get instant, personalized guidance for your academic journey - completely free! Our AI counsellor helps you make informed decisions about your future.
		  </p>
		  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
			<div class="bg-white/10 backdrop-blur-lg rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
			  <h3 class="font-semibold text-yellow-300 mb-2">Personalized Recommendations</h3>
			  <p class="text-indigo-200 text-sm">Get tailored college and course suggestions based on your interests, rank, and career goals.</p>
			</div>
			<div class="bg-white/10 backdrop-blur-lg rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
			  <h3 class="font-semibold text-yellow-300 mb-2">Career Path Analysis</h3>
			  <p class="text-indigo-200 text-sm">Explore potential career paths and understand the opportunities each college choice offers.</p>
			</div>
			<div class="bg-white/10 backdrop-blur-lg rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
			  <h3 class="font-semibold text-yellow-300 mb-2">24/7 Guidance</h3>
			  <p class="text-indigo-200 text-sm">Get instant answers to your questions about colleges, courses, and admission processes anytime.</p>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  <!-- </section> -->
  
  <!-- Answer Sheet Calculator Section -->
  <!-- <section class="relative overflow-hidden bg-gradient-to-r from-purple-900 via-fuchsia-800 to-purple-900 py-6 text-white shadow-xl"> -->
	<!-- <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-400/30 blur-3xl animate-pulse"></div> -->
	<!-- <div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-400/30 blur-3xl animate-pulse"></div> -->
	<!-- <div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-400/30 blur-3xl"></div> -->
	<div class="container relative z-10 mx-auto px-4 mt-10">
	  <div class="flex flex-col items-center justify-between gap-4 lg:flex-row">
		<div class="max-w-xl text-center lg:text-left">
		  <div class="mb-2 inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 text-sm font-bold uppercase tracking-wider text-blue-900 shadow-lg">
			<FontAwesomeIcon icon={faCalculator} class="mr-2" />
			FINAL ANSWER KEY IS NOW LIVE
		  </div>
		  <h2 class="mb-2 text-3xl font-extrabold md:text-4xl">
			Calculate Your JEE Marks with <span class="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-300">Final Answer Key</span>
		  </h2>
		  <p class="text-lg text-blue-100">
			Upload your official JEE answer sheet link to get your accurate final score based on the official answer key.
		  </p>
		</div>
		
		<div class="w-full max-w-md transform transition-all duration-500 ease-in-out lg:w-2/5 hover:scale-105" 
		  class:scale-100={calculatorVisible} 
		  class:opacity-100={calculatorVisible}
		  class:scale-95={!calculatorVisible}
		  class:opacity-0={!calculatorVisible}>
		  <div class="bg-white/10 backdrop-blur-lg rounded-xl p-1 shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300">
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

<AiServiceSection />

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

<Footer />

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

  /* Add glass morphism effect */
  .glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  }
</style>
