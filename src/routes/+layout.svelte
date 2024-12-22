<script lang="ts">
    import "../app.css";
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";
  </script>
  
  <div class="flex flex-col min-h-screen mt-16">
    <!-- Navbar -->
    <Navbar />
  
    <!-- Main Content Area -->
    <main class="flex-grow">
      <slot />
    </main>
  
    <!-- Footer -->
    <Footer />
  </div>
  