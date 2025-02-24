<script lang="ts">
  import { writable } from 'svelte/store';

  // Store for active exam category
  const activeCategory = writable('engineering');

  // Exam categories data
  const categories = [
    {
      id: 'engineering',
      title: 'Engineering',
      exams: [
        { name: 'JEE Main', description: 'Joint Entrance Examination for engineering admissions' },
        { name: 'JEE Advanced', description: 'Advanced examination for IIT admissions' },
        { name: 'BITSAT', description: 'Birla Institute of Technology and Science Admission Test' }
      ]
    },
    {
      id: 'medical',
      title: 'Medical',
      exams: [
        { name: 'NEET UG', description: 'National Eligibility cum Entrance Test for medical courses' },
        { name: 'AIIMS', description: 'All India Institute of Medical Sciences Entrance Exam' },
        { name: 'JIPMER', description: 'Jawaharlal Institute of Postgraduate Medical Education & Research Exam' }
      ]
    },
    {
      id: 'management',
      title: 'Management',
      exams: [
        { name: 'CAT', description: 'Common Admission Test for MBA programs' },
        { name: 'XAT', description: 'Xavier Aptitude Test' },
        { name: 'MAT', description: 'Management Aptitude Test' }
      ]
    }
  ];

  // Handle category selection
  function selectCategory(categoryId: string) {
    activeCategory.set(categoryId);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex gap-8">
    <!-- Left Sidebar with Toggle Buttons (25% width) -->
    <div class="w-1/4 space-y-4">
      {#each categories as category}
        <button
          class="w-full px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300
                 {$activeCategory === category.id ? 
                   'bg-blue-600 text-white shadow-lg' : 
                   'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
          on:click={() => selectCategory(category.id)}
        >
          {category.title}
        </button>
      {/each}
    </div>

    <!-- Right Content Section (75% width) -->
    <div class="w-3/4">
      {#each categories as category}
        {#if $activeCategory === category.id}
          <div class="space-y-6 animate-fade-in">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">{category.title} Exams</h1>
            
            <div class="grid gap-6 md:grid-cols-2">
              {#each category.exams as exam}
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                  <h3 class="text-xl font-semibold text-blue-600 mb-2">{exam.name}</h3>
                  <p class="text-gray-600">{exam.description}</p>
                  <a 
                    href="/exams/{exam.name.toLowerCase().replace(' ', '-')}"
                    class="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Learn more →
                  </a>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
