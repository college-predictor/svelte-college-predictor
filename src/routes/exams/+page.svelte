<script lang="ts">
  let selectedCategory = 'jee';

  const examCategories = [
    { id: 'jee', name: 'JEE Main & Advanced' },
    { id: 'neet', name: 'NEET' },
    { id: 'gate', name: 'GATE' },
    { id: 'cat', name: 'CAT' }
  ];

  function selectCategory(categoryId: string) {
    selectedCategory = categoryId;
  }
</script>

<div class="min-h-screen bg-gray-100 p-6">
  <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="flex">
      <!-- Left Sidebar - Exam Categories -->
      <div class="w-1/4 bg-white p-4 border-r">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Exam Categories</h2>
        <div class="space-y-2">
          {#each examCategories as category}
            <button
              class="w-full text-left px-4 py-2 rounded-lg transition-colors
                {selectedCategory === category.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'}"
              on:click={() => selectCategory(category.id)}
            >
              {category.name}
            </button>
          {/each}
        </div>
      </div>

      <!-- Right Content Area -->
      <div class="w-3/4 p-6 bg-[#D3D3D3]">
        {#if selectedCategory === 'jee'}
          <div class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-800">Engineering Exam Overview</h1>
            
            <!-- Profile Section -->
            <div class="flex items-center space-x-4 mb-6">
              <img src="/assets/image.png" alt="John Doe" class="w-12 h-12 rounded-full">
              <div>
                <h2 class="text-lg font-semibold">John Doe</h2>
                <div class="flex items-center space-x-4 text-sm text-gray-600">
                  <span>1h 30m</span>
                  <span class="flex items-center">
                    <span class="mr-1">4.9/5.0</span>
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex space-x-4">
              <!-- Calendar Section -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 class="text-lg font-semibold mb-4">Calendar</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Application start</span>
                  <span class="font-medium">23/03/24</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Application End</span>
                  <span class="font-medium">30/04/24</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Admit card</span>
                  <span class="font-medium">Exam</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Exam date</span>
                  <span class="font-medium">Placem</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Result Date</span>
                  <span class="font-medium">News</span>
                </div>
              </div>
            </div>

            <!-- Exam Syllabus Section -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-2">Exam Syllabus</h3>
              <p class="text-gray-600 mb-4">Get detailed information about the engineering exam syllabus, topics.</p>
              
            </div>
            </div>
            <div class="flex space-x-4">
              <button class="bg-white text-gray-800 px-6 py-2 rounded-lg shadow hover:shadow-md transition-shadow w-full">View syllabus</button>
              <button class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:shadow-md transition-shadow w-full">Start preparation</button>
            </div>
          </div>
        {:else if selectedCategory === 'neet'}
          <div class="space-y-6">
            <h1 class="text-3xl font-bold text-gray-800">NEET</h1>
            <!-- Add NEET specific content here -->
            <p class="text-gray-600">Content for NEET exam preparation will be available soon.</p>
          </div>
        {:else if selectedCategory === 'gate'}
          <div class="space-y-6">
            <h1 class="text-3xl font-bold text-gray-800">GATE</h1>
            <!-- Add GATE specific content here -->
            <p class="text-gray-600">Content for GATE exam preparation will be available soon.</p>
          </div>
        {:else if selectedCategory === 'cat'}
          <div class="space-y-6">
            <h1 class="text-3xl font-bold text-gray-800">CAT</h1>
            <!-- Add CAT specific content here -->
            <p class="text-gray-600">Content for CAT exam preparation will be available soon.</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>