<script lang="ts">
  import JosaaForm from '$lib/components/JosaaForm.svelte';
  import RecommandationSection from '$lib/components/layout/RecommandationSection.svelte';
  import AiServiceSection from '$lib/components/layout/AIServiceSection.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { goto } from '$app/navigation';
</script>

<section 
  class="relative flex items-center justify-center bg-cover bg-center text-white px-6 lg:px-16" 
  style="background-image: url('assets/hero-background.webp'); min-height: calc(100vh - 80px);"
>
  <!-- Overlay for better text visibility -->
  <div class="absolute inset-0 bg-black bg-opacity-40"></div>
  
  <!-- Content Container -->
  <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto w-full">
    
    <!-- Left Side: Text Content -->
    <div class="space-y-6 text-center lg:text-left">
      <h1 class="text-4xl lg:text-6xl font-extrabold text-white">
        Find Your College with AI
      </h1>
      <button
        on:click={() => goto('/jee-discussion')}
        class="mt-4 px-6 py-3 bg-yellow-400 text-indigo-700 font-semibold rounded-lg hover:bg-yellow-500 transition duration-300 transform hover:scale-105"
      >
        JEE Mains Exam Discussion
      </button>
      <p class="text-lg lg:text-xl text-gray-200 mt-4">
        Discover the best college options tailored to your preferences using AI-powered insights.
      </p>
    </div>
    
    <!-- Right Side: Form Container -->
    <div class="bg-white shadow-lg rounded-lg">
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
