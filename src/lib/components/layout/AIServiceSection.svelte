<script lang="ts">
    import { faBookOpen, faClipboardList, faUniversity, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
    import ServiceCard from '../ServiceCard.svelte';
  
    const services = [
      {
        title: 'AI Counsellor',
        description: 'Get expert AI-based counselling to guide your college journey.',
        icon: faUserGraduate,
        link: "/ai-counsellor",
      },
      {
        title: 'Study Materials',
        description: 'Access free study materials for various entrance exams.',
        icon: faBookOpen,
        link: "/study-material",
      },
      {
        title: 'JOSAA Discussion',
        description: 'Join the discussion forum for JOSAA counselling queries and advice.',
        icon: faClipboardList,
        link: "/discussion-forum",
      },
      {
        title: 'Exams',
        description: 'Explore Exams that match your academic profile and preferences.',
        icon: faUniversity,
        link: "/exams",
      },
    ];
  </script>
  
  <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 relative overflow-hidden">
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
    <div class="container mx-auto px-4 text-center relative z-10">
      <div class="max-w-3xl mx-auto mb-16">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Our AI Services</h2>
        <p class="text-gray-600 text-lg">Empowering your educational journey with cutting-edge AI solutions</p>
      </div>
      <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {#each services as { title, description, icon, link }}
          <ServiceCard {title} {description} {icon} {link}/>
        {/each}
      </div>
    </div>
  </section>

<style>
  .bg-grid-pattern {
    background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px),
      linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
    background-size: 20px 20px;
  }
</style>
  