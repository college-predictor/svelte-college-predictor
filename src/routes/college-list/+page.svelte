<!-- src/components/CollegeList.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
	import type { json } from '@sveltejs/kit';
  
    // Define ContactInfo interface
    interface ContactInfo {
      phone: string;
      email: string;
      address: string;
    }
  
    // Define College interface based on your example
    interface College {
      id: number;
      courseName: string;
      courseType: string;
      collegeType: string; // Updated from 'category' to 'collegeType'
      collegeName: string;
      instituteCode: number; // Added instituteCode
      state: string;
      gender: string;
      quota: string;
      category: string;
      openingRank: number;
      closingRank: number;
      profileImage: string;
      avgPkg: string;
      nirfRanking: number;
      placementRating: number;
      collegeLifeRating: number;
      campusRating: number;
      aiSummary: string;
      contactInfo: ContactInfo;
    }
  
    // Initialize colleges as an empty array
    let iit_colleges: College[] = [];
    let nit_colleges: College[] = [];
    let iiit_colleges: College[] = [];
    let gfti_colleges: College[] = [];
  
    type SortColumn = 'courseName' | 'collegeName' | 'category' | 'openingRank' | 'closingRank' | 'nirfRanking';
  
    let sortBy: SortColumn = 'collegeName';
    let sortOrder: 'asc' | 'desc' = 'asc';
  
    function sortData(column: SortColumn): void {
      if (sortBy === column) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy = column;
        sortOrder = 'asc';
      }
  
      nit_colleges = [...nit_colleges].sort((a, b) => {
        let valA: any = a[column];
        let valB: any = b[column];
  
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
  
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
  
    let expandedRow: number | null = null;
  
    function toggleExpand(collegeId: number): void {
      expandedRow = expandedRow === collegeId ? null : collegeId;
    }
  
    // Filtering
    let filters = {
      nirfRanking: '',
      placementRating: '',
      collegeLifeRating: '',
      campusRating: '',
      collegeType: '',
      quota: ''
    };
  
    function applyFilters(college: College): boolean {
      return (
        (filters.nirfRanking === '' || college.nirfRanking <= Number(filters.nirfRanking)) &&
        (filters.placementRating === '' || college.placementRating >= Number(filters.placementRating)) &&
        (filters.collegeLifeRating === '' || college.collegeLifeRating >= Number(filters.collegeLifeRating)) &&
        (filters.campusRating === '' || college.campusRating >= Number(filters.campusRating)) &&
        (filters.collegeType === '' || college.collegeType === filters.collegeType)
      );
    }
  
    function resetFilters(): void {
      filters = {
        nirfRanking: '',
        placementRating: '',
        collegeLifeRating: '',
        campusRating: '',
        collegeType: '',
        quota: ''
      };
    }
  
    // New Fields
    let year = '2024'; // Default Year
    let margin = '0.1'; // Default Margin
  
    // Fetch colleges data from FastAPI
    onMount(async () => {
      try {
        // Access the current page's URL
        const currentPage = get(page);
        const url = new URL(currentPage.url);
        const params = url.searchParams;
  
        // Extract query parameters
        const queryParams: Record<string, string | number | undefined> = {
            mains_gen_rank: params.get('mains_gen_rank') ? Number(params.get('mains_gen_rank')) : undefined,
            mains_cat_rank: params.get('mains_cat_rank') ? Number(params.get('mains_cat_rank')) : undefined,
            adv_gen_rank: params.get('adv_gen_rank') ? Number(params.get('adv_gen_rank')) : undefined,
            adv_cat_rank: params.get('adv_cat_rank') ? Number(params.get('adv_cat_rank')) : undefined,
            margin: params.get('margin') ? parseFloat(params.get('margin') as string) : 0.5,
            category: params.get('category') || 'OPEN',
            gender: params.get('gender') || 'Gender-Neutral',
            state: params.get('state') || undefined,
        };
  
        // Remove undefined values
        Object.keys(queryParams).forEach(key => {
          if (queryParams[key] === undefined) {
            delete queryParams[key];
          }
        });
  
        console.log('Fetching colleges with parameters:', queryParams);
  
        // Construct the API URL with query parameters
        const apiUrl = new URL('http://localhost:8000/api/colleges');
        Object.entries(queryParams).forEach(([key, value]) => {
          apiUrl.searchParams.append(key, value.toString());
        });
  
        // Make the GET request to the FastAPI endpoint
        const response = await fetch(apiUrl.toString());
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
  
        const data = await response.json();
        console.log('API Response:', data);
  
        // Assign nit_colleges to colleges
        iit_colleges = data.iit_colleges;
        nit_colleges = data.nit_colleges;
        iiit_colleges = data.iiit_colleges;
        gfti_colleges = data.gfti_colleges;
        
        // Optionally, sort the data initially
        sortData(sortBy);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    });
  </script>


<!-- src/components/CollegeList.svelte -->
<div class="bg-white">
    <div class="container mx-auto p-6">
      
        <!-- Filter Section -->
        <div class="my-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-2">Filter Colleges</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

                <!-- Rank Margin -->
                <div>
                    <label for="inputMarginSelect" class="block text-sm font-medium text-gray-700">Rank Margin</label>
                    <select 
                    id="inputMarginSelect" 
                    bind:value={margin} 
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                    <option value="0.05">5%</option>
                    <option value="0.1">10% (Default)</option>
                    <option value="0.15">15%</option>
                    <option value="0.2">20%</option>
                    <option value="0.25">25%</option>
                    <option value="0.3">30%</option>
                    </select>
                </div>

                <!-- NIRF Ranking Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Max NIRF Ranking</label>
                    <input
                        type="number"
                        bind:value={filters.nirfRanking}
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 50"
                    />
                </div>
                <!-- Placement Rating Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Min Placement Rating</label>
                    <select bind:value={filters.placementRating} class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Any</option>
                        <option value="4">4+</option>
                        <option value="4.5">4.5+</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <!-- College Life Rating Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Min College Life Rating</label>
                    <select bind:value={filters.collegeLifeRating} class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Any</option>
                        <option value="4">4+</option>
                        <option value="4.5">4.5+</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <!-- Campus Rating Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Min Campus Rating</label>
                    <select bind:value={filters.campusRating} class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Any</option>
                        <option value="4">4+</option>
                        <option value="4.5">4.5+</option>
                        <option value="5">5</option>
                    </select>
                </div>

                <!-- Seat Type Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Seat Type</label>
                    <select bind:value={filters.quota} class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Any</option>
                        <option value="AI">All India</option>
                        <option value="HS">Home State</option>
                    </select>
                </div>
                <!-- Reset Filters Button -->
                <div class="flex items-end">
                    <button
                        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                        on:click={resetFilters}
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- NIT Header -->
        <div class="flex p-2 px-6 font-bold rounded-lg shadow-md justify-between items-center" style="background: #5d5d5b;">
            <h1 class="text-2xl font-bold text-white">NIT Colleges</h1>
        </div>

        <!-- Table Header -->
        <div class="grid grid-cols-[5fr_6fr_2fr_1fr_1fr_1fr] py-3 px-4 rounded-lg font-semibold my-4 bg-gray-200">
            <!-- Course Name Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('courseName')}
                role="button"
                tabindex="0"
            >
                Course Name
                <span class="ml-1">
                    {#if sortBy === 'courseName'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>

            <!-- College Name Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('collegeName')}
                role="button"
                tabindex="0"
            >
                College Name
                <span class="ml-1">
                    {#if sortBy === 'collegeName'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>
      
            <!-- Seat Type Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('category')}
                role="button"
                tabindex="0"
            >
                Category
                <span class="ml-1">
                    {#if sortBy === 'category'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>
      
            <!-- Opening Rank Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('openingRank')}
                role="button"
                tabindex="0"
            >
                O.R.
                <span class="ml-1">
                    {#if sortBy === 'openingRank'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>
      
            <!-- Closing Rank Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('closingRank')}
                role="button"
                tabindex="0"
            >
                C.R.
                <span class="ml-1">
                    {#if sortBy === 'closingRank'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>
      
            <!-- NIRF Ranking Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('nirfRanking')}
                role="button"
                tabindex="0"
            >
                NIRF
                <span class="ml-1">
                    {#if sortBy === 'nirfRanking'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>
        </div>
      
        <!-- Table Rows -->
        {#each nit_colleges.filter(applyFilters) as college (college.id)}
            <div class="relative pb-4">
      
                <!-- Main Row -->
                <div
                    class={`grid grid-cols-[5fr_6fr_2fr_1fr_1fr_1fr] bg-white px-4 text-black p-2 shadow-md rounded-lg cursor-pointer ${
                        expandedRow === college.id ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                    on:click={() => toggleExpand(college.id)}
                    aria-expanded={expandedRow === college.id}
                    role="button"
                    tabindex="0"
                >
                    <div>{college.courseName} ({college.courseType})</div>
                    <div>{college.collegeName}</div>
                    <div>{college.category}</div>
                    <div>{college.openingRank}</div>
                    <div>{college.closingRank}</div>
                    <div>{college.nirfRanking}</div>
                </div>

                <!-- Expanding Details Card -->
                <div
                    class={`overflow-hidden transition-max-height duration-700 ease-in-out ${
                        expandedRow === college.id ? 'max-h-96' : 'max-h-0'
                    }`}
                >
                    <div class="bg-gray-50 p-4 rounded-b-lg shadow-inner">
                        <div class="flex flex-col md:flex-row gap-4">
                            <!-- Profile Image -->
                            <div class="flex-shrink-0">
                                <img src={college.profileImage} alt="{college.collegeName} Image" class="rounded-lg w-48 h-36 object-cover" />
                            </div>
                            <!-- College Info -->
                            <div class="flex-1 gap-8">
                                <a class="font-semibold text-lg mb-2" href="#" target="_blank">{college.collegeName}</a>
                                <div class="mt-4">
                                    <p class="font-semibold">Contact Info:</p>
                                    <a href="{college.contactInfo.phone}">📞</a>
                                    <a href="{college.contactInfo.email}">✉️</a>
                                    <a href="{college.contactInfo.address}">📍</a>
                                </div>
                                <div class="mb-2 flex gap-8">
                                    <div>
                                        <p class="font-semibold">Average Package:</p>
                                        <p>{college.avgPkg}</p>
                                    </div>
                                    <div>
                                        <p class="font-semibold">Highest Package:</p>
                                        <p>{college.avgPkg}</p>
                                    </div>
                                </div>
                            </div>
                            <!-- Ratings and Packages -->
                            <div class="flex-1">
                                <div class="mb-2 flex gap-2">
                                    <p class="font-semibold">Placement:</p>
                                    <div class="flex items-center">
                                        {#each Array(5) as _, i}
                                            <svg
                                                class={`w-5 h-5 ${i < Math.round(college.placementRating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.286 3.973c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.175 0l-3.376 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.973a1 1 0 00-.364-1.118L2.98 9.4c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.973z" />
                                            </svg>
                                        {/each}
                                        <span class="ml-2">{college.placementRating} / 5</span>
                                    </div>
                                </div>
                                <div class="mb-2 flex gap-2">
                                    <p class="font-semibold">College Life:</p>
                                    <div class="flex items-center">
                                        {#each Array(5) as _, i}
                                            <svg
                                                class={`w-5 h-5 ${i < Math.round(college.collegeLifeRating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.286 3.973c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.175 0l-3.376 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.973a1 1 0 00-.364-1.118L2.98 9.4c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.973z" />
                                            </svg>
                                        {/each}
                                        <span class="ml-2">{college.collegeLifeRating} / 5</span>
                                    </div>
                                </div>
                                <div class="mb-2 flex gap-2">
                                    <p class="font-semibold">Campus:</p>
                                    <div class="flex items-center">
                                        {#each Array(5) as _, i}
                                            <svg
                                                class={`w-5 h-5 ${i < Math.round(college.campusRating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.286 3.973c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.175 0l-3.376 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.973a1 1 0 00-.364-1.118L2.98 9.4c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.973z" />
                                            </svg>
                                        {/each}
                                        <span class="ml-2">{college.campusRating} / 5</span>
                                    </div>
                                </div>
                                <div class="mb-2 flex gap-2">
                                    <p class="font-semibold">Department:</p>
                                    <div class="flex items-center">
                                        {#each Array(5) as _, i}
                                            <svg
                                                class={`w-5 h-5 ${i < Math.round(college.campusRating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.286 3.973c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.175 0l-3.376 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.973a1 1 0 00-.364-1.118L2.98 9.4c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.973z" />
                                            </svg>
                                        {/each}
                                        <span class="ml-2">{college.campusRating} / 5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
      </div>
</div>


<style>
  /* Optional: Custom styles can be added here */
</style>
