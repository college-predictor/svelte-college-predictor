<script lang="ts">
    import { faBook, faFileAlt, faVideo, faPuzzlePiece, faCalculator } from '@fortawesome/free-solid-svg-icons';
    import ServiceCard from '$lib/components/ServiceCard.svelte';
  
    // Define the available exams with their study materials
    const exams = [
      {
        id: '2025-april',
        title: '2025-April',
        description: 'JEE Main examination April session',
        icon: faCalculator,
        materials: [
          { title: 'JEE Main 2025 - April 2 (Day Shift)', type: 'PDF', url: '/assets/JEE_Main_2025_April_2_Day.pdf' },
          { title: 'JEE Main 2025 - April 2 (Night Shift)', type: 'PDF', url: '/assets/JEE_Main_2025_April_2_Night.pdf' },
          { title: 'JEE Main 2025 - April 3 (Day Shift)', type: 'PDF', url: '/assets/JEE_Main_2025_April_3_Day.pdf' },
          { title: 'JEE Main 2025 - April 3 (Night Shift)', type: 'PDF', url: '/assets/JEE_Main_2025_April_3_Night.pdf' },
          { title: 'JEE Main 2025 - April 4 (Day Shift)', type: 'PDF', url: '/assets/JEE_Main_2025_April_4_Day.pdf' },
          { title: 'JEE Main 2025 - April 4 (Night Shift)', type: 'PDF', url: '/assets/JEE_Main_2025_April_4_Night.pdf' },
          { title: 'JEE Main 2025 - April 7 (Day Shift)', type: 'PDF', url: '/assets/JEE_Main_2025_April_7_Day.pdf' },
          { title: 'JEE Main 2025 - April 7 (Night Shift)', type: 'PDF', url: '/assets/JEE_Main_2025_April_7_Night.pdf' },
          { title: 'JEE Main 2025 - April 8 (Day Shift)', type: 'PDF', url: '/assets/JEE_Main_2025_April_8_Day.pdf' },
          { title: 'JEE Main 2025 - April 8 (Night Shift)', type: 'PDF', url: '/assets/JEE_Main_2025_April_8_Night.pdf' }
        ]
      },
      {
        id: '2025-january',
        title: '2025-January',
        description: 'Advanced examination for IIT admissions',
        icon: faCalculator,
        materials: [
          { title: 'Physics Complete Notes', type: 'PDF', url: '#' },
          { title: 'Chemistry Study Material', type: 'PDF', url: '#' },
          { title: 'Mathematics Problem Solving', type: 'PDF', url: '#' },
          { title: 'Mock Tests', type: 'Interactive', url: '#' },
          { title: 'Video Solutions', type: 'Video', url: '#' }
        ]
      },
      {
        id: 'neet',
        title: 'NEET',
        description: 'National Eligibility cum Entrance Test for medical programs',
        icon: faBook,
        materials: [
          { title: 'Biology Complete Notes', type: 'PDF', url: '#' },
          { title: 'Physics Study Material', type: 'PDF', url: '#' },
          { title: 'Chemistry Revision Notes', type: 'PDF', url: '#' },
          { title: 'Previous Year Papers with Solutions', type: 'PDF', url: '#' },
          { title: 'Video Lectures', type: 'Video', url: '#' }
        ]
      },
      {
        id: 'gate',
        title: 'GATE',
        description: 'Graduate Aptitude Test in Engineering',
        icon: faFileAlt,
        materials: [
          { title: 'Subject-wise Notes', type: 'PDF', url: '#' },
          { title: 'Previous Year Papers', type: 'PDF', url: '#' },
          { title: 'Mock Tests', type: 'Interactive', url: '#' },
          { title: 'Video Tutorials', type: 'Video', url: '#' }
        ]
      },
      {
        id: 'cat',
        title: 'CAT',
        description: 'Common Admission Test for MBA programs',
        icon: faPuzzlePiece,
        materials: [
          { title: 'Quantitative Aptitude', type: 'PDF', url: '#' },
          { title: 'Verbal Ability', type: 'PDF', url: '#' },
          { title: 'Data Interpretation', type: 'PDF', url: '#' },
          { title: 'Logical Reasoning', type: 'PDF', url: '#' },
          { title: 'Mock Tests', type: 'Interactive', url: '#' }
        ]
      },
      {
        id: 'upsc',
        title: 'UPSC',
        description: 'Civil Services Examination',
        icon: faBook,
        materials: [
          { title: 'General Studies Notes', type: 'PDF', url: '#' },
          { title: 'Current Affairs', type: 'PDF', url: '#' },
          { title: 'Optional Subject Materials', type: 'PDF', url: '#' },
          { title: 'Previous Year Papers', type: 'PDF', url: '#' }
        ]
      }
    ];
  
    // State to track which exam is selected
    let selectedExam = null;
  
    // Function to select an exam
    function selectExam(exam) {
      selectedExam = exam;
    }
  
    // Function to go back to exam selection
    function backToExams() {
      selectedExam = null;
    }
  </script>
  
  <section class="bg-gray-50 py-16 min-h-screen">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold text-center text-blue-600 mb-8">Study Materials</h1>
      <p class="text-lg text-center text-gray-600 mb-12">Select an exam to access free study materials and resources</p>
      
      {#if !selectedExam}
        <!-- Exam Selection Grid -->
        <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {#each exams as exam}
            <div on:click={() => selectExam(exam)} class="cursor-pointer">
              <ServiceCard 
                title={exam.title} 
                description={exam.description} 
                icon={exam.icon} 
              />
            </div>
          {/each}
        </div>
      {:else}
        <!-- Study Materials for Selected Exam -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="flex items-center mb-6">
            <button 
              on:click={backToExams} 
              class="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center transition duration-300"
            >
              <span>← Back</span>
            </button>
            <h2 class="text-3xl font-bold text-blue-600">{selectedExam.title} Study Materials</h2>
          </div>
          
          <div class="space-y-6">
            {#each selectedExam.materials as material}
              <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-xl font-semibold">{material.title}</h3>
                    <p class="text-gray-600">Type: {material.type}</p>
                  </div>
                  <a 
                    href={material.url} 
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
                  >
                    Download
                  </a>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </section>
  
  <style>
    /* Add any custom styles here */
  </style>