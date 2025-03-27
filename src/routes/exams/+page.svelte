<script lang="ts">
  import { examData } from '$lib/data/exams';
  
  let selectedCategory = 'Engineering';
  const categories = ['Engineering', 'Medical', 'Commerce', 'Govt'];

  $: filteredExams = examData.filter(exam => exam.category === selectedCategory);
  $: selectedExam = filteredExams[0];

  function selectCategory(category: string) {
    selectedCategory = category;
  }

  function selectExam(exam: any) {
    selectedExam = exam;
  }
</script>

<div class="min-h-screen bg-gray-100 p-6">
  <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="flex">
      <!-- Left Sidebar - Exam Categories -->
      <div class="w-1/4 bg-white p-4 border-r">
        <div class="flex gap-2 mb-6">
          {#each categories as category}
            <button
              class="px-3 py-1 rounded-full text-sm font-medium transition-colors
                {selectedCategory === category ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
              on:click={() => selectCategory(category)}
            >
              {category}
            </button>
          {/each}
        </div>

        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{selectedCategory}</h2>
          <button 
            class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            aria-label="Filter settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          {#each filteredExams as exam}
            <div class="w-full text-left bg-gray-100 rounded-lg p-4 hover:bg-gray-200 cursor-pointer transition-colors"
              role="listitem"
                 on:click={() => selectExam(exam)}>
              <div class="flex gap-4 items-center mb-3">
                <img src={exam.image} alt={exam.name} class="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <h3 class="font-medium">{exam.name}</h3>
                  <p class="text-sm text-gray-600">{exam.instructor}</p>
                </div>
                <button class="ml-auto p-1 rounded-full hover:bg-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </div>
              <div class="relative w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                <div class="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
                     style="width: {exam.progress}%"></div>
              </div>
              <p class="text-sm text-gray-600 mt-2">{exam.progress}% complete</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Right Content Area -->
      <div class="w-3/4 p-6 bg-[#D3D3D3]">
        <div class="space-y-6">
          <div class="w-full h-48 mb-6 overflow-hidden rounded-lg">
            <img src="/assets/engineering-cover.svg" alt="Exam Cover" class="w-full h-full object-cover">
          </div>
          <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {selectedExam?.name} Overview
            <a
              aria-label="Visit official website"
              href={selectedExam?.official_website}
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-600 hover:text-blue-600 transition-colors"
              title="Visit official website"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </h1>
          
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
                  <span class="font-medium">{selectedExam?.calendar.application_start_date}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Application End</span>
                  <span class="font-medium">{selectedExam?.calendar.application_end_date}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Exam date</span>
                  <span class="font-medium">{selectedExam?.calendar.exam_date}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Result Date</span>
                  <span class="font-medium">{selectedExam?.calendar.result_date}</span>
                </div>
              </div>
            </div>

            <!-- Exam Syllabus Section -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-4">Cut Off</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">General</span>
                  <span class="font-medium">{selectedExam?.cutoff.general_cutoff}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">OBC</span>
                  <span class="font-medium">{selectedExam?.cutoff.obc_cutoff}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">SC</span>
                  <span class="font-medium">{selectedExam?.cutoff.sc_cutoff}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">ST</span>
                  <span class="font-medium">{selectedExam?.cutoff.st_cutoff}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">PWD</span>
                  <span class="font-medium">{selectedExam?.cutoff.pwd_cutoff}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex space-x-4">
            <a href={selectedExam?.syllabus} target="_blank" rel="noopener noreferrer" class="bg-white text-gray-800 px-6 py-2 rounded-lg shadow hover:shadow-md transition-shadow w-full text-center">View syllabus</a>
            <a href={selectedExam?.start_preparation} target="_blank" rel="noopener noreferrer" class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:shadow-md transition-shadow w-full text-center">Start preparation</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>