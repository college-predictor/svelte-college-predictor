<script lang="ts">
	import JosaaForm from '$lib/components/JosaaForm.svelte';
	import RecommandationSection from '$lib/components/layout/RecommandationSection.svelte';
	import AiServiceSection from '$lib/components/layout/AIServiceSection.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { goto } from '$app/navigation';
</script>

<section
	class="relative flex items-center justify-center bg-cover bg-center px-6 text-white lg:px-16"
	style="background-image: url('assets/hero-background.webp'); min-height: calc(100vh - 80px);"
>
	<!-- Overlay for better text visibility -->
	<div class="absolute inset-0 bg-black bg-opacity-40"></div>

	<!-- Content Container -->
	<div
		class="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2"
	>
		<!-- Left Side: Text Content -->
		<div class="space-y-6 text-center lg:text-left">
			<h1 class="text-4xl font-extrabold text-white lg:text-6xl">Find Your College with AI</h1>
			<button
				on:click={() => goto('/discussion-forum')}
				class="mt-4 transform rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-indigo-700 transition duration-300 hover:scale-105 hover:bg-yellow-500"
			>
				JEE Mains Exam Discussion
			</button>
			<p class="mt-4 text-lg text-gray-200 lg:text-xl">
				Discover the best college options tailored to your preferences using AI-powered insights.
			</p>
		</div>

		<!-- Right Side: Form Container -->
		<div class="rounded-lg bg-white shadow-lg">
			<JosaaForm />
		</div>
	</div>
</section>

<AiServiceSection />
<RecommandationSection />

<!-- Footer -->
<Footer />

<style>
	/* Add custom styles if necessary */
</style>
