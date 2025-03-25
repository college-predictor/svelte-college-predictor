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
      <div class="w-3/4 p-6 bg-green-800">
        {#if selectedCategory === 'jee'}
          <div class="space-y-6">
            <h1 class="text-3xl font-bold text-black">JEE Main & Advanced</h1>
            <!-- AI Generated Cover Image Section -->
            <div class="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative mb-6">
              <svg class="w-full h-full" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#9333EA;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad1)" />
                <circle cx="650" cy="100" r="80" fill="rgba(255,255,255,0.1)" />
                <path d="M100,300 Q400,100 700,300" stroke="rgba(255,255,255,0.2)" stroke-width="8" fill="none" />
                <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="24" font-family="system-ui">JEE Main & Advanced 2024</text>
                <text x="50%" y="60%" text-anchor="middle" fill="white" font-size="16" font-family="system-ui">Your Gateway to Premier Engineering Institutes</text>
              </svg>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-100 p-4 rounded-lg">
                <h3 class="text-xl font-semibold mb-2 text-gray-800">Important Dates</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-700">
                  <li>Registration Opens: January 2024</li>
                  <li>First Attempt: April 2024</li>
                  <li>Second Attempt: May 2024</li>
                </ul>
              </div>
              <div class="bg-gray-100 p-4 rounded-lg">
                <h3 class="text-xl font-semibold mb-2 text-gray-800">Exam Pattern</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-700">
                  <li>Computer Based Test (CBT)</li>
                  <li>Multiple Choice Questions</li>
                  <li>Numerical Value Questions</li>
                </ul>
              </div>
            </div>
            <div class="bg-gray-100 p-4 rounded-lg">
              <h3 class="text-xl font-semibold mb-2">Preparation Resources</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="#" class="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <h4 class="font-semibold text-blue-600">Study Material</h4>
                  <p class="text-sm text-gray-600">Access comprehensive study materials</p>
                </a>
                <a href="#" class="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <h4 class="font-semibold text-blue-600">Mock Tests</h4>
                  <p class="text-sm text-gray-600">Practice with previous year papers</p>
                </a>
                <a href="#" class="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <h4 class="font-semibold text-blue-600">Video Lectures</h4>
                  <p class="text-sm text-gray-600">Learn from expert faculty</p>
                </a>
              </div>
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