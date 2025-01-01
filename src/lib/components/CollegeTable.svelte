<!-- src/components/CollegeTableRedesigned.svelte -->
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
  <div class="flex flex-col bg-gray-100 min-h-screen">
    <!-- Header / Title Bar -->
    <div class="p-2 m-2 bg-gray-800 text-white flex items-center justify-between rounded">
      <h1 class="text-2xl font-bold">{title}</h1>
            <!-- Dropdown for Items Per Page -->
            <select
                bind:value={itemsPerPage}
                on:change={() => goToPage(1)}
                class="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="10">10 Colleges</option>
                <option value="25">25 Colleges</option>
                <option value="50">50 Colleges</option>
                <option value="100">100 Colleges</option>
            </select>
      <input
      type="text"
      placeholder="Search by college or course name..."
      bind:value={searchTerm}
      class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-black"
    />
    </div>
  
    <!-- Table Header -->
    <div class="grid grid-cols-[4fr_6fr_2fr_1fr_1fr_1fr] py-3 px-4 my-3 mx-4 bg-gray-300 font-semibold text-gray-700 gap-2 rounded">
      <!-- Course Name Column -->
      <div
        class="cursor-pointer flex items-center"
        on:click={() => sortData('courseName')}
        tabindex="0"
        role="button"
      >
        Course
        {#if sortBy === 'courseName'}
          <span class="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
        {/if}
      </div>
  
      <!-- College Name Column -->
      <div
        class="cursor-pointer flex items-center"
        on:click={() => sortData('collegeName')}
        tabindex="0"
        role="button"
      >
        College
        {#if sortBy === 'collegeName'}
          <span class="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
        {/if}
      </div>
  
      <!-- Category Column -->
      <div
        class="cursor-pointer flex items-center"
        on:click={() => sortData('category')}
        tabindex="0"
        role="button"
      >
        Category
        {#if sortBy === 'category'}
          <span class="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
        {/if}
      </div>
  
      <!-- Opening Rank -->
      <div
        class="cursor-pointer flex items-center"
        on:click={() => sortData('openingRank')}
        tabindex="0"
        role="button"
      >
        O.R.
        {#if sortBy === 'openingRank'}
          <span class="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
        {/if}
      </div>
  
      <!-- Closing Rank -->
      <div
        class="cursor-pointer flex items-center"
        on:click={() => sortData('closingRank')}
        tabindex="0"
        role="button"
      >
        C.R.
        {#if sortBy === 'closingRank'}
          <span class="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
        {/if}
      </div>
  
      <!-- NIRF Column -->
      <div
        class="cursor-pointer flex items-center"
        on:click={() => sortData('quota')}
        tabindex="0"
        role="button"
      >
        Quota
        {#if sortBy === 'quota'}
          <span class="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
        {/if}
      </div>
    </div>
  
    <!-- Table Rows -->
    {#if paginatedColleges.length === 0}
      <div class="p-4 text-center text-gray-500">No results found.</div>
    {/if}
  
    {#each paginatedColleges as college (college.id)}
      <div class="relative mb-2 px-4">
        <!-- Main Row -->
        <div
          class="grid grid-cols-[4fr_6fr_2fr_1fr_1fr_1fr] items-center bg-white rounded-lg px-4 py-2 shadow cursor-pointer gap-2"
          on:click={() => toggleExpand(college.id)}
          aria-expanded={expandedRow === college.id}
          tabindex="0"
          role="button"
        >
          <div>{college.courseName} ({college.courseType})</div>
          <div class="font-medium">{college.collegeName}</div>
          <div>{college.category}</div>
          <div>{college.openingRank}</div>
          <div>{college.closingRank}</div>
          <div>{college.quota}</div>
        </div>
  
        {#if expandedRow === college.id}
        <!-- Expanded Details -->
        <div
          class="overflow-hidden transition-max-height duration-500 ease-in-out bg-gray-50 rounded-b-lg shadow-lg border-t border-gray-200 -mt-2 z-[-10]"
          style="max-height: {expandedRow === college.id ? 'max-h' : '0'}"
        >
          {#if expandedRow === college.id}
            <div class="p-4 grid grid-cols-1 md:grid-cols-[1fr_2fr_4fr] gap-3">
              <!-- Column 1: Basic Info -->
              <div class="space-y-2">
                <p class="font-semibold text-gray-700">
                  Quota: <span class="font-normal text-gray-600">{college.quota}</span>
                </p>
                <p class="font-semibold text-gray-700">
                  Category: <span class="font-normal text-gray-600">{college.category}</span>
                </p>
                <p class="font-semibold text-gray-700">
                  Type: <span class="font-normal text-gray-600">{college.collegeType}</span>
                </p>
              </div>

              <!-- Column 2: Contact Information -->
              <div>
                <p class="font-semibold text-gray-700 mb-2">Contact Information:</p>
                <div class="space-y-1">
                  <a
                    href={`tel:${college.contactInfo.phone}`}
                    class="flex items-center text-blue-500 hover:underline text-sm"
                  >
                    📞 {college.contactInfo.phone}
                  </a>
                  <a
                    href={`mailto:${college.contactInfo.email}`}
                    class="flex items-center text-blue-500 hover:underline text-sm"
                  >
                    ✉️ {college.contactInfo.email}
                  </a>
                  <span class="flex items-center text-gray-600 text-sm">
                    📍 {college.contactInfo.address}
                  </span>
                </div>
              </div>

              <!-- Column 3: AI Summary -->
              <div>
                <p class="font-semibold text-gray-700 mb-2">AI Summary:</p>
                <p class="text-gray-600 text-sm leading-relaxed">{college.aiSummary}</p>
              </div>
            </div>
          {/if}
        </div>
        {/if}
      </div>
    {/each}
  
    <!-- Pagination (duplicate controls at bottom if desired) -->
    <div class="flex justify-end items-center p-4">
      <button
        class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 mr-2"
        on:click={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <span class="text-sm mr-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        on:click={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        Next
      </button>
    </div>
  </div>
  