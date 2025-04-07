<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { page } from '$app/stores';
</script>

<div class="flex flex-col min-h-screen">
  <!-- Fixed Navbar -->
  <div class="fixed top-0 left-0 w-full z-50">
    <Navbar />
  </div>

  <!-- Main content area (with padding-top equal to Navbar height) -->
  <main class="flex-grow flex flex-col pt-16 min-h-0">
    <slot />
  </main>

  <!-- Footer (hidden on discussion forum page) -->
  {#if !$page.url.pathname.startsWith('/discussion-forum')}
    <Footer />
  {/if}
</div>
