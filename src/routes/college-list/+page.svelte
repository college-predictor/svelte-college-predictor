<!-- src/components/CollegeList.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import CollegeTable from '$lib/components/CollegeTable.svelte';
  
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
      nirfRanking: number;
      placementRating: number;
      collegeLifeRating: number;
      campusRating: number;
      aiSummary: string;
      contactInfo: ContactInfo;
    }
  
    // Initialize college lists as empty arrays
    let iit_colleges: College[] = [];
    let nit_colleges: College[] = [];
    let iiit_colleges: College[] = [];
    let gfti_colleges: College[] = [];
  
    // Filter state
    let filters = {
      nirfRanking: '',
      placementRating: '',
      collegeLifeRating: '',
      campusRating: '',
      quota: ''
    };
  
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
        const filteredQueryParams: Record<string, string | number> = {};
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            filteredQueryParams[key] = value;
          }
        });
  
        console.log('Fetching colleges with parameters:', filteredQueryParams);
  
        // Construct the API URL with query parameters
        const apiUrl = new URL('http://localhost:8000/api/colleges');
        Object.entries(filteredQueryParams).forEach(([key, value]) => {
          apiUrl.searchParams.append(key, value.toString());
        });
  
        // Make the GET request to the FastAPI endpoint
        const response = await fetch(apiUrl.toString());
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
  
        const data = await response.json();
        console.log('API Response:', data);
  
        // Assign data to respective college lists
        iit_colleges = data.iit_colleges;
        nit_colleges = data.nit_colleges;
        iiit_colleges = data.iiit_colleges;
        gfti_colleges = data.gfti_colleges;
      } catch (error) {
        console.error('Error fetching colleges:', error);
        // Optionally, handle errors by showing messages to users
      }
    });
  
    // Apply global filters
    function applyGlobalFilters(college: College): boolean {
      return (
        (filters.nirfRanking === '' || college.nirfRanking <= Number(filters.nirfRanking)) &&
        (filters.placementRating === '' || college.placementRating >= Number(filters.placementRating)) &&
        (filters.collegeLifeRating === '' || college.collegeLifeRating >= Number(filters.collegeLifeRating)) &&
        (filters.campusRating === '' || college.campusRating >= Number(filters.campusRating)) &&
        (filters.quota === '' || college.quota === filters.quota)
      );
    }
  
    // Reset filters
    function resetFilters(): void {
      filters = {
        nirfRanking: '',
        placementRating: '',
        collegeLifeRating: '',
        campusRating: '',
        quota: ''
      };
    }
  </script>
  
  <style>
    /* Optional: Custom styles can be added here */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
  
    .section-title {
      margin-top: 2rem;
    }
  </style>
  
  <div class="container bg-white">
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
  
    <!-- College Tables -->
    {#if iit_colleges.length > 0 || nit_colleges.length > 0 || iiit_colleges.length > 0 || gfti_colleges.length > 0}
      <CollegeTable 
        title="IIT Colleges" 
        colleges={iit_colleges.filter(applyGlobalFilters)} 
      />
      <CollegeTable 
        title="NIT Colleges" 
        colleges={nit_colleges.filter(applyGlobalFilters)} 
      />
      <CollegeTable 
        title="IIIT Colleges" 
        colleges={iiit_colleges.filter(applyGlobalFilters)} 
      />
      <CollegeTable 
        title="GFTI Colleges" 
        colleges={gfti_colleges.filter(applyGlobalFilters)} 
      />
    {:else}
      <p class="text-center text-gray-500">No colleges found with the applied filters.</p>
    {/if}
  </div>
  