<!-- src/lib/components/CollegeTable.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
  
    // Define interfaces
    interface ContactInfo {
      phone: string;
      email: string;
      address: string;
    }
  
    interface College {
      id: string;
      courseName: string;
      courseType: string;
      collegeType: string;
      collegeName: string;
      instituteCode: number;
      state: string;
      gender: string;
      quota: string;
      category: string;
      openingRank: number;
      closingRank: number;
      profileImage: string;
      avgPkg: string;
      placementRating: number;
      collegeLifeRating: number;
      campusRating: number;
      aiSummary: string;
      contactInfo: ContactInfo;
      year: number;
    }
  
    export let title: string;
    export let colleges: College[] = [];
  
    // Sorting
    type SortColumn =
      | 'courseName'
      | 'collegeName'
      | 'category'
      | 'openingRank'
      | 'closingRank'
      | 'quota';
    type SortOrder = 'asc' | 'desc';
  
    let sortBy: SortColumn = 'collegeName';
    let sortOrder: SortOrder = 'asc';
  
    // Expanded row logic
    let expandedRow: string | null = null;
  
    // Pagination
    let currentPage = 1;
    let itemsPerPage = "10";
  
    // Search
    let searchTerm = '';
  
    // On mount, you could fetch data if needed
    onMount(() => {
      // Example: fetchColleges();
    });
  
    // Function to sort data
    function sortData(column: SortColumn): void {
      if (sortBy === column) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy = column;
        sortOrder = 'asc';
      }
    }
  
    // Toggle expanded row
    function toggleExpand(collegeId: string) {
      expandedRow = expandedRow === collegeId ? null : collegeId;
    }
  
    // Derived data: filter, then sort, then slice for pagination
    $: filteredColleges = colleges.filter((college) => {
      if (!searchTerm) return true;
      return (
        college.collegeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  
    $: sortedColleges = [...filteredColleges].sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];
  
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
  
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  
    // Pagination slices
    $: totalItems = sortedColleges.length;
    $: totalPages = Math.ceil(totalItems / Number(itemsPerPage));
  
    $: paginatedColleges = sortedColleges.slice(
      (currentPage - 1) * Number(itemsPerPage),
      currentPage * Number(itemsPerPage)
    );
  
    function goToPage(page: number) {
      if (page < 1 || page > totalPages) return;
      currentPage = page;
      // Close any expanded row when changing pages for a clean experience
      expandedRow = null;
    }
  </script>
  
  <!-- Container -->
  <div class="flex flex-col bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-6">
    <!-- Header / Title Bar -->
    <div class="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold">{title}</h1>
          <p class="text-blue-100 text-sm mt-1">Click on any college to view detailed information</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <!-- Dropdown for Items Per Page -->
          <select
              bind:value={itemsPerPage}
              on:change={() => goToPage(1)}
              class="bg-blue-800/50 text-white p-2.5 rounded-lg border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-white/70 text-sm"
          >
              <option value="10">10 Colleges</option>
              <option value="25">25 Colleges</option>
              <option value="50">50 Colleges</option>
              <option value="100">100 Colleges</option>
          </select>
          
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by college or course..."
              bind:value={searchTerm}
              class="pl-10 border border-blue-500/30 bg-blue-800/50 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/70 w-full sm:w-64 placeholder-blue-200/80"
            />
          </div>
        </div>
      </div>
    </div>
  
    <!-- Mobile Info Banner (only shows on small screens) -->
    <div class="hidden sm:hidden mx-4 my-2 p-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Tap on a college row to see more details. Tap column headers to sort.</span>
      </div>
    </div>
  
    <!-- Table Header - Desktop View -->
    <div class="hidden sm:grid grid-cols-[4fr_6fr_2fr_1fr_1fr_1fr] py-3 px-4 my-3 mx-4 bg-gray-100 shadow-sm font-semibold text-gray-700 gap-2 rounded-lg border border-gray-200">
      <!-- Course Name Column -->
      <div
        class="cursor-pointer flex items-center group transition-colors duration-200 hover:text-blue-600"
        on:click={() => sortData('courseName')}
        tabindex="0"
        role="button"
        aria-label="Sort by course name"
      >
        <span>Course</span>
        {#if sortBy === 'courseName'}
          <span class="ml-1 bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5 text-xs flex items-center">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        {:else}
          <span class="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 text-xs">↕</span>
        {/if}
      </div>
  
      <!-- College Name Column -->
      <div
        class="cursor-pointer flex items-center group transition-colors duration-200 hover:text-blue-600"
        on:click={() => sortData('collegeName')}
        tabindex="0"
        role="button"
        aria-label="Sort by college name"
      >
        <span>College</span>
        {#if sortBy === 'collegeName'}
          <span class="ml-1 bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5 text-xs flex items-center">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        {:else}
          <span class="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 text-xs">↕</span>
        {/if}
      </div>
  
      <!-- Category Column -->
      <div
        class="cursor-pointer flex items-center group transition-colors duration-200 hover:text-blue-600"
        on:click={() => sortData('category')}
        tabindex="0"
        role="button"
        aria-label="Sort by category"
      >
        <span>Category</span>
        {#if sortBy === 'category'}
          <span class="ml-1 bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5 text-xs flex items-center">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        {:else}
          <span class="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 text-xs">↕</span>
        {/if}
      </div>
  
      <!-- Opening Rank -->
      <div
        class="cursor-pointer flex items-center group transition-colors duration-200 hover:text-blue-600"
        on:click={() => sortData('openingRank')}
        tabindex="0"
        role="button"
        aria-label="Sort by opening rank"
      >
        <span>O.R.</span>
        {#if sortBy === 'openingRank'}
          <span class="ml-1 bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5 text-xs flex items-center">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        {:else}
          <span class="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 text-xs">↕</span>
        {/if}
      </div>
  
      <!-- Closing Rank -->
      <div
        class="cursor-pointer flex items-center group transition-colors duration-200 hover:text-blue-600"
        on:click={() => sortData('closingRank')}
        tabindex="0"
        role="button"
        aria-label="Sort by closing rank"
      >
        <span>C.R.</span>
        {#if sortBy === 'closingRank'}
          <span class="ml-1 bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5 text-xs flex items-center">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        {:else}
          <span class="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 text-xs">↕</span>
        {/if}
      </div>
  
      <!-- Quota Column -->
      <div
        class="cursor-pointer flex items-center group transition-colors duration-200 hover:text-blue-600"
        on:click={() => sortData('quota')}
        tabindex="0"
        role="button"
        aria-label="Sort by quota"
      >
        <span>Quota</span>
        {#if sortBy === 'quota'}
          <span class="ml-1 bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5 text-xs flex items-center">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        {:else}
          <span class="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 text-xs">↕</span>
        {/if}
      </div>
    </div>
    
    <!-- Mobile Sort Controls -->
    <div class="sm:hidden mx-4 my-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
      <div class="mb-2">
        <h3 class="text-sm font-semibold text-gray-700">Sort Colleges By:</h3>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button 
          class={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${sortBy === 'collegeName' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          on:click={() => sortData('collegeName')}
        >
          College {sortBy === 'collegeName' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button 
          class={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${sortBy === 'courseName' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          on:click={() => sortData('courseName')}
        >
          Course {sortBy === 'courseName' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button 
          class={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${sortBy === 'openingRank' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          on:click={() => sortData('openingRank')}
        >
          Opening Rank {sortBy === 'openingRank' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button 
          class={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${sortBy === 'closingRank' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          on:click={() => sortData('closingRank')}
        >
          Closing Rank {sortBy === 'closingRank' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
      </div>
    </div>
  
    <!-- Table Rows -->
    {#if paginatedColleges.length === 0}
      <div class="p-4 text-center text-gray-500">No results found.</div>
    {/if}
  
    {#each paginatedColleges as college (college.id)}
      <div class="relative mb-2 px-4">
        <!-- Main Row - Desktop View -->
        <div
          class="hidden sm:grid grid-cols-[4fr_6fr_2fr_1fr_1fr_1fr] items-center bg-white rounded-lg px-4 py-3 shadow-sm cursor-pointer gap-2 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100 relative"
          on:click={() => toggleExpand(college.id)}
          aria-expanded={expandedRow === college.id}
          tabindex="0"
          role="button"
          class:bg-blue-50={expandedRow === college.id}
          class:border-blue-100={expandedRow === college.id}
        >
          <div class="text-gray-800">
            <span class="font-medium">{college.courseName}</span>
            <span class="text-xs text-gray-500 ml-1">({college.courseType})</span>
          </div>
          <div class="font-medium text-gray-900">{college.collegeName}</div>
          <div><span class="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">{college.category}</span></div>
          <div class="font-mono text-sm">{college.openingRank}</div>
          <div class="font-mono text-sm">{college.closingRank}</div>
          <div><span class="px-2 py-1 bg-blue-100 rounded-full text-xs font-medium text-blue-700">{college.quota}</span></div>
          
          <!-- Expandable indicator -->
          <div class="absolute right-3 text-blue-600 transition-transform duration-200" style="transform: rotate({expandedRow === college.id ? '90deg' : '0deg'})">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
  
        </div>
        
        <!-- Mobile Row View -->
        <div
          class="sm:hidden flex flex-col bg-white rounded-lg px-4 py-3 shadow-sm cursor-pointer gap-2 transition-all duration-200 relative border border-transparent"
          on:click={() => toggleExpand(college.id)}
          aria-expanded={expandedRow === college.id}
          tabindex="0"
          role="button"
          class:bg-blue-50={expandedRow === college.id}
          class:border-blue-100={expandedRow === college.id}
        >
          <!-- College Name (Primary info) -->
          <div class="font-medium text-base text-gray-900">{college.collegeName}</div>
          
          <!-- Course Info Row -->
          <div class="text-sm text-gray-700 font-medium">{college.courseName} <span class="text-xs text-gray-500">({college.courseType})</span></div>
          
          <!-- Stats Row -->
          <div class="flex flex-wrap justify-between items-center gap-2 mt-1">
            <span class="bg-gray-100 px-2.5 py-1 rounded-full text-xs font-medium text-gray-700">{college.category}</span>
            <span class="bg-blue-100 px-2.5 py-1 rounded-full text-xs font-medium text-blue-700">{college.quota}</span>
          </div>
          
          <!-- Ranks info -->
          <div class="flex justify-between bg-gray-50 rounded-lg px-3 py-2 mt-1">
            <div class="text-xs">
              <span class="text-gray-500">Opening Rank:</span> 
              <span class="font-mono font-medium">{college.openingRank}</span>
            </div>
            <div class="text-xs">
              <span class="text-gray-500">Closing Rank:</span> 
              <span class="font-mono font-medium">{college.closingRank}</span>
            </div>
          </div>
          
          <!-- Visual indicator for expandable -->
          <div class="absolute right-3 top-3 text-blue-600 transition-transform duration-200" style="transform: rotate({expandedRow === college.id ? '90deg' : '0deg'})">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        {#if expandedRow === college.id}
        <!-- Expanded Details -->
        <div
          class="overflow-hidden transition-all duration-500 ease-in-out bg-white rounded-b-lg shadow-md border border-blue-100 -mt-2 z-10"
          style="max-height: {expandedRow === college.id ? '1000px' : '0'}"
        >
          {#if expandedRow === college.id}
            <div class="p-4 grid grid-cols-1 md:grid-cols-[1fr_2fr_4fr] gap-4 animate-fadeIn">
              <!-- Basic Info - Optimized for mobile with horizontal layout on small screens -->
              <div class="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-3 pb-2 border-b border-blue-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  College Details
                </h3>
                <div class="flex flex-col gap-3 text-sm">
                  <div class="flex items-center">
                    <span class="w-24 text-gray-600">Institute Code:</span>
                    <span class="font-medium">{college.instituteCode}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-24 text-gray-600">Quota:</span>
                    <span class="font-medium px-2 py-0.5 bg-blue-100 rounded-full text-blue-700">{college.quota}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-24 text-gray-600">Category:</span>
                    <span class="font-medium px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">{college.category}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-24 text-gray-600">Type:</span>
                    <span class="font-medium">{college.collegeType}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-24 text-gray-600">State:</span>
                    <span class="font-medium">{college.state}</span>
                  </div>
                </div>
              </div>

              <!-- Contact Information - Larger touch targets for mobile -->
              <div class="bg-green-50 p-4 rounded-lg shadow-sm border border-green-100">
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-3 pb-2 border-b border-green-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Information
                </h3>
                <div class="flex flex-col gap-3">
                  <a
                    href={`tel:${college.contactInfo.phone}`}
                    class="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base py-2 px-3 rounded-lg hover:bg-white transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {college.contactInfo.phone}
                  </a>
                  <a
                    href={`mailto:${college.contactInfo.email}`}
                    class="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base py-2 px-3 rounded-lg hover:bg-white transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {college.contactInfo.email}
                  </a>
                  <div class="flex items-start text-gray-700 text-sm sm:text-base py-2 px-3 rounded-lg hover:bg-white transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{college.contactInfo.address}</span>
                  </div>
                </div>
              </div>

              <!-- AI Summary - Improved readability -->
              <div class="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-100">
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-3 pb-2 border-b border-purple-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Summary
                </h3>
                <p class="text-gray-700 text-sm sm:text-base leading-relaxed p-2 bg-white rounded-lg border border-purple-50">{college.aiSummary}</p>
              </div>
            </div>
          {/if}
        </div>
        {/if}
      </div>
    {/each}
  
    <!-- Pagination Controls - Redesigned for better UX -->
    <div class="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 rounded-b-xl">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Results Summary -->
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{(currentPage - 1) * Number(itemsPerPage) + 1}</span> to <span class="font-medium">{Math.min(currentPage * Number(itemsPerPage), totalItems)}</span> of <span class="font-medium">{totalItems}</span> colleges
        </div>

        <!-- Mobile Page Size Selector (visible only on mobile) -->
        <div class="sm:hidden w-full">
          <select
            bind:value={itemsPerPage}
            on:change={() => goToPage(1)}
            class="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5">Show 5 per page</option>
            <option value="10">Show 10 per page</option>
            <option value="25">Show 25 per page</option>
            <option value="50">Show 50 per page</option>
          </select>
        </div>
        
        <!-- Pagination Controls -->
        <div class="flex items-center justify-center gap-2">
          <!-- First Page Button -->
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
            on:click={() => goToPage(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Previous Button -->
          <button
            class="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            on:click={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          
          <!-- Page Numbers -->
          <div class="hidden md:flex gap-1">
            {#each Array.from({length: Math.min(5, totalPages)}, (_, i) => {
              // Show pages around current page
              let start = Math.max(1, currentPage - 2);
              let end = Math.min(totalPages, start + 4);
              start = Math.max(1, end - 4);
              return start + i;
            }).filter(p => p <= totalPages) as page}
              <button 
                class="inline-flex items-center justify-center w-9 h-9 border rounded-md text-sm font-medium transition-colors duration-200 {currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}"
                on:click={() => goToPage(page)}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            {/each}
          </div>
          
          <!-- Current Page Indicator (Mobile Only) -->
          <span class="md:hidden inline-flex items-center px-3 py-2 border border-blue-600 rounded-md bg-blue-600 text-sm font-medium text-white">
            {currentPage}
          </span>
          
          <!-- Next Button -->
          <button
            class="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            on:click={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Next page"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Last Page Button -->
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
            on:click={() => goToPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Last page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414zm6 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  