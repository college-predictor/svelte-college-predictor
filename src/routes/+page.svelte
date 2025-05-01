<script lang="ts">
	import JosaaForm from '$lib/components/JosaaForm.svelte';
	import RecommandationSection from '$lib/components/layout/RecommandationSection.svelte';
	import ExamInfoSection from '$lib/components/layout/ExamInfoSection.svelte';
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
		faCalculator,
		faLightbulb,
		faChartLine,
		faSearch,
		faCheckCircle,
		faStar,
		faRocket
	} from '@fortawesome/free-solid-svg-icons';
	// Scroll to form function
	let formSection: HTMLElement;
	let heroSection: HTMLElement;
	function scrollToForm() {
		formSection?.scrollIntoView({ behavior: 'smooth' });
	}
	// Animation control for new feature highlight
	let calculatorVisible = false;
	import { onMount } from 'svelte';
	onMount(() => {
		setTimeout(() => {
			calculatorVisible = true;
		}, 500);
	});
</script>

<!-- New Yellow Gradient Hero Section -->
<section bind:this={heroSection} class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <!-- Multi-layered gradient background -->
  <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900"></div>
  <!-- Remove other gradient layers to match the Answer Sheet Calculator Section -->
  <!-- Decorative elements -->
  <div class="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-teal-500/20 mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-2000 hidden sm:block"></div>
  <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-sky-500/20 mix-blend-overlay filter blur-3xl opacity-70 animate-blob hidden sm:block"></div>

  <!-- Subtle grid overlay -->
  <div id="heroSection" class="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:40px_40px] z-0"></div>

  <div class="container relative z-10 mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
    <!-- Left side: Hero content -->
    <div class="lg:w-1/2 text-center lg:text-left">
      <div class="inline-flex items-center justify-center px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-teal-400/90 to-sky-500/90 backdrop-blur-sm border border-teal-400/30 text-white font-semibold text-sm shadow-lg">
        <FontAwesomeIcon icon={faStar} class="mr-2 text-white" />
        #1 College Predictor for JEE & NEET
      </div>

      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 text-white leading-tight tracking-tight">
        Design Your <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-sky-300">Perfect</span> Academic Journey
      </h1>

      <p class="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
        Get personalized college recommendations based on your rank, preferences, and career goals with our AI-powered platform designed specifically for JEE and NEET aspirants.
      </p>

      <div class="flex flex-wrap gap-5 mb-10 justify-center lg:justify-start">
        <button
          on:click={scrollToForm}
          class="px-8 py-4 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white font-bold rounded-lg shadow-lg hover:shadow-teal-500/20 transition-all duration-300 flex items-center group"
        >
          Find Your College
          <FontAwesomeIcon icon={faArrowRight} class="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        <a href="/about" class="px-8 py-4 bg-white/40 hover:bg-white/50 backdrop-blur-sm text-white font-semibold rounded-lg border border-teal-200/30 transition-all duration-300 hover:border-teal-300/40 hover:shadow-lg">
          Learn More
        </a>
      </div>

      <div class="flex flex-wrap gap-6 justify-center lg:justify-start">
        <div class="flex items-center bg-white/40 backdrop-blur-sm rounded-full px-5 py-2.5 border border-teal-200/30 hover:bg-white/50 transition-all duration-300 shadow-sm hover:shadow-md">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center shadow-md">
            <FontAwesomeIcon icon={faGraduationCap} class="text-white text-sm" />
          </div>
          <span class="ml-3 text-white font-medium text-sm">100+ Top Colleges</span>
        </div>
        <div class="flex items-center bg-white/40 backdrop-blur-sm rounded-full px-5 py-2.5 border border-teal-200/30 hover:bg-white/50 transition-all duration-300 shadow-sm hover:shadow-md">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center shadow-md">
            <FontAwesomeIcon icon={faCheckCircle} class="text-white text-sm" />
          </div>
          <span class="ml-3 text-white font-medium text-sm">Trusted by 10,000+ Students</span>
        </div>
      </div>
    </div>

    <!-- Right side: Form -->
    <div bind:this={formSection} class="lg:w-1/2 w-full max-w-md mx-auto lg:max-w-none">
      <div class="bg-gradient-to-br from-slate-800 to-slate-700 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-teal-200/50 hover:border-teal-300/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-200/30">
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 border border-teal-100/50">
          <div class="mb-8 text-center">
            <h2 class="text-2xl font-bold text-white mb-3">Find Your Ideal College</h2>
            <p class="text-teal-300">Enter your details to get personalized recommendations</p>
          </div>
          <JosaaForm />
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="bg-gradient-to-br from-slate-100 to-slate-200 py-24 relative overflow-hidden">
  <!-- Decorative elements -->
  <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-300/10 to-sky-300/10 rounded-full blur-3xl"></div>
  <div class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-teal-300/10 to-sky-300/10 rounded-full blur-3xl"></div>

  <div class="container mx-auto px-6 relative z-10">
    <div class="text-center mb-16">
      <div class="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-teal-600 to-sky-600 text-white text-xs font-medium tracking-wider">
        POWERFUL FEATURES
      </div>
      <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose College Predictor?</h2>
      <p class="text-slate-600 max-w-2xl mx-auto text-lg">Our platform offers comprehensive tools to help you make informed decisions about your academic future</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-teal-200 group">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <FontAwesomeIcon icon={faRocket} class="text-2xl text-white" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors duration-300">College Predictor</h3>
        <p class="text-slate-600 mb-6 leading-relaxed">Get instant, personalized guidance from our highly trustworthy AI solution - guiding you from exam preparation to finding the college that suits you best.</p>
        <a href="#heroSection" class="text-teal-600 font-semibold flex items-center group-hover:text-sky-500 transition-colors duration-300">
          <span>Try Now</span>
          <FontAwesomeIcon icon={faArrowRight} class="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>
      <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-teal-200 group">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <FontAwesomeIcon icon={faCalculator} class="text-2xl text-white" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors duration-300">Answer Sheet Calculator</h3>
        <p class="text-slate-600 mb-6 leading-relaxed">Upload your official JEE answer sheet link to get your accurate final score with our trusted AI-powered analysis system.</p>
        <a href="#calculator" class="text-teal-600 font-semibold flex items-center group-hover:text-sky-500 transition-colors duration-300">
          <span>Try Now</span>
          <FontAwesomeIcon icon={faArrowRight} class="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>
      <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-teal-200 group">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <FontAwesomeIcon icon={faLightbulb} class="text-2xl text-white" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">Exam Resources</h3>
        <p class="text-slate-600 mb-6 leading-relaxed">Access comprehensive information about exams, including patterns, eligibility criteria, important dates, and previous years' cutoffs.</p>
        <a href="#exam-info" class="text-indigo-600 font-semibold flex items-center group-hover:text-purple-500 transition-colors duration-300">
          <span>Explore Resources</span>
          <FontAwesomeIcon icon={faArrowRight} class="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Answer Sheet Calculator Section -->
<section id="calculator" class="relative py-24 bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900 overflow-hidden">
  <!-- Decorative elements -->
  <div class="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-teal-500/20 mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-2000 hidden sm:block"></div>
  <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-sky-500/20 mix-blend-overlay filter blur-3xl opacity-70 animate-blob hidden sm:block"></div>

  <!-- Subtle grid overlay -->
  <div class="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:40px_40px] z-0"></div>
  <div class="container relative z-10 mx-auto px-6">
    <div class="flex flex-col lg:flex-row items-center justify-between gap-16 max-w-7xl mx-auto">
      <div class="lg:w-1/2 text-center lg:text-left">
        <div class="inline-flex items-center rounded-full bg-gradient-to-r from-teal-400/90 to-sky-500/90 backdrop-blur-sm px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-white mb-6 shadow-lg">
          <FontAwesomeIcon icon={faCalculator} class="mr-2" />
          FINAL ANSWER KEY LIVE
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Calculate Your JEE Marks with <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-sky-300">Final Answer Key</span>
        </h2>
        <p class="text-slate-300 text-lg mb-8 leading-relaxed max-w-xl">
          Upload your official JEE answer sheet link to get your accurate final score with our trusted AI-powered analysis system.
        </p>
        <ul class="space-y-4 text-slate-300 mb-10">
          <li class="flex items-center bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center shadow-md mr-3">
              <FontAwesomeIcon icon={faCheckCircle} class="text-slate-900 text-sm" />
            </div>
            <span>Instant and accurate results</span>
          </li>
          <li class="flex items-center bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center shadow-md mr-3">
              <FontAwesomeIcon icon={faCheckCircle} class="text-slate-900 text-sm" />
            </div>
            <span>Subject-wise breakdown</span>
          </li>
          <li class="flex items-center bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center shadow-md mr-3">
              <FontAwesomeIcon icon={faCheckCircle} class="text-slate-900 text-sm" />
            </div>
            <span>Percentile estimation</span>
          </li>
        </ul>
      </div>
      <div class="lg:w-1/2 w-full max-w-md mx-auto lg:max-w-none transform transition-all duration-500 ease-in-out hover:scale-105"
        class:scale-100={calculatorVisible}
        class:opacity-100={calculatorVisible}
        class:scale-95={!calculatorVisible}
        class:opacity-0={!calculatorVisible}>
        <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-1.5 shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 border border-white/10 hover:border-white/20">
          <div class="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-xl border border-white/5">
            <AnswerSheetCalculator />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<div id="exam-info">
  <ExamInfoSection />
</div>

<ResultInfoSection />

<!-- Recommendation Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50 py-24">
  <!-- Decorative elements -->
  <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
  <div class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-rose-300/10 to-amber-300/10 rounded-full blur-3xl"></div>

  <!-- Subtle pattern overlay -->
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
  <div class="container mx-auto px-6 relative z-10">
    <div class="max-w-3xl mx-auto text-center mb-16">
      <div class="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium tracking-wider">
        PERSONALIZED RECOMMENDATIONS
      </div>
      <h2 class="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900">Recommended For You</h2>
      <p class="text-lg text-slate-600">Discover top colleges and programs tailored to your profile</p>
    </div>
    <div class="max-w-7xl mx-auto">
      <RecommandationSection />
    </div>
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

  /* Particle animation */
  @keyframes float {
    0% {
      transform: translateY(0) translateX(0) rotate(0) scale(1);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
      transform: translateY(-50px) translateX(50px) rotate(180deg) scale(1.1);
    }
    90% {
      opacity: 0.2;
    }
    100% {
      transform: translateY(-100px) translateX(100px) rotate(360deg) scale(0.8);
      opacity: 0;
    }
  }

  /* Blob animation */
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }

  .animate-blob {
    animation: blob 7s infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }

  .animation-delay-5000 {
    animation-delay: 5s;
  }

  .animation-delay-6000 {
    animation-delay: 6s;
  }

  .animation-delay-7000 {
    animation-delay: 7s;
  }

  section {
    animation: fadeIn 0.8s ease-out;
  }

  .particles-container {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    border-radius: 50%;
    animation: float 15s infinite ease-in-out;
    opacity: 0;
    box-shadow: 0 0 10px 2px rgba(251, 191, 36, 0.2);
  }

  .particle:nth-child(1) {
    bottom: 20%;
    left: 20%;
  }

  .particle:nth-child(2) {
    bottom: 40%;
    left: 60%;
  }

  .particle:nth-child(3) {
    bottom: 60%;
    left: 40%;
  }

  .particle:nth-child(4) {
    bottom: 80%;
    left: 10%;
  }

  .particle:nth-child(5) {
    bottom: 30%;
    left: 80%;
  }

  .particle:nth-child(6) {
    bottom: 70%;
    left: 30%;
  }

  .particle:nth-child(7) {
    bottom: 50%;
    left: 70%;
  }

  .particle:nth-child(8) {
    bottom: 15%;
    left: 50%;
  }
</style>
