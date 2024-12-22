<script lang="ts">
    import { faGraduationCap, faBookOpen, faClipboardList, faUniversity, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
    import ServiceCard from '../ServiceCard.svelte';
  
    const services = [
      {
        title: 'AI Counsellor',
        description: 'Get expert AI-based counselling to guide your college journey.',
        icon: faUserGraduate,
        link: "/aicounsellor",
      },
      {
        title: 'Course Planner',
        description: 'Plan your course path to ensure optimal learning and career growth.',
        icon: faBookOpen,
        link: "/courseplanner",  // Added a valid link here
      },
      {
        title: 'Exams',
        description: 'Prepare for exams with our tailored guidance and resources.',
        icon: faClipboardList,
        link: "/exams",  // Added a valid link here
      },
      {
        title: 'Colleges',
        description: 'Explore colleges that match your academic profile and preferences.',
        icon: faUniversity,
        link: "/colleges",  // Added a valid link here
      },
    ];
  </script>
  
  <section class="bg-gray-100 py-16">
    <div class="container mx-auto text-center">
      <h2 class="text-4xl font-bold mb-12 text-blue-600">Our AI Services</h2>
      <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {#each services as { title, description, icon, link }}
          <ServiceCard {title} {description} {icon} {link}/>
        {/each}
      </div>
    </div>
  </section>
  