<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen flex-col">
	<!-- Fixed Navbar -->
	<div class="fixed left-0 top-0 z-50 w-full">
		<Navbar />
	</div>

	<!-- Main content area (with padding-top equal to Navbar height) -->
	<main class="flex min-h-0 flex-grow flex-col pt-14">
		<slot />
	</main>

	<!-- Footer (hidden on discussion forum page) -->
	{#if !$page.url.pathname.startsWith('/discussion-forum')}
		<Footer />
	{/if}
</div>
