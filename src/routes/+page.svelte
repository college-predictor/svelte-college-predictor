<script lang="ts">
  import JosaaForm from '$lib/components/JosaaForm.svelte';
  import RecommandationSection from '$lib/components/layout/RecommandationSection.svelte';
  import AiServiceSection from '$lib/components/layout/AIServiceSection.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
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
      <p class="text-lg lg:text-xl text-gray-200">
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

<style>
  /* Add custom styles if necessary */
</style>
