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
      nirfRanking: number;
      placementRating: number;
      collegeLifeRating: number;
      campusRating: number;
      aiSummary: string;
      contactInfo: ContactInfo;
      year: number;
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

  // Loading state
  let loading: boolean = true;

  // Fetch data function
  async function fetchColleges() {
    try {
      loading = true;

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
        margin: parseFloat(margin),
        category: params.get('category') || 'OPEN',
        gender: params.get('gender') || 'Gender-Neutral',
        state: params.get('state') || undefined,
        year: year,
      };

      // Remove undefined values
      const filteredQueryParams: Record<string, string | number> = {};
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          filteredQueryParams[key] = value;
        }
      });

      console.log('Fetching colleges with parameters:', filteredQueryParams);
      const protocol = window.location.protocol
      // Construct the API URL with query parameters
      const apiUrl = new URL(`${protocol}//api.collegepredictor.in/api/colleges`);
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
    } finally {
      loading = false;
    }
  }

  // Fetch on mount
  onMount(() => {
    fetchColleges();
  });

  // Reactivity: Fetch data when `margin` or `year` changes
  $: if (margin || year) {
    fetchColleges();
  }
  
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
  /* Mobile optimization styles */
  @media (max-width: 768px) {
    .filter-grid {
      grid-template-columns: 1fr !important;
    }
    
    .container-padding {
      padding: 0.75rem !important;
    }
    
    .filter-section {
      padding: 0.75rem !important;
    }
  }
</style>

<div class="bg-gray-50 min-h-screen">
  <div class="container mx-auto py-6 px-4 sm:px-6 container-padding">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">College Predictor</h1>
        <p class="text-gray-600">Find colleges based on your JEE rank with customizable filters.</p>
      </div>
      
      <!-- Filter Section -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6 filter-section border border-gray-200">
        <div class="bg-blue-600 py-3 px-5">
          <h2 class="text-lg font-semibold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
            </svg>
            Customize Your Results
          </h2>
        </div>
        
        <div class="p-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 filter-grid">
            <!-- Rank Margin -->
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200">
              <label for="inputMarginSelect" class="block text-sm font-medium text-gray-700 mb-2">Rank Margin</label>
              <select 
                id="inputMarginSelect" 
                bind:value={margin} 
                class="block w-full p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700"
              >
                <option value="0.05">5%</option>
                <option value="0.1">10% (Default)</option>
                <option value="0.15">15%</option>
                <option value="0.2">20%</option>
                <option value="0.25">25%</option>
                <option value="0.3">30%</option>
              </select>
              <p class="text-xs text-gray-500 mt-2">Adjust the margin to see more or fewer college options</p>
            </div>

            <!-- Year -->
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200">
              <label for="yearSelect" class="block text-sm font-medium text-gray-700 mb-2">Admission Year</label>
              <select 
                id="yearSelect" 
                bind:value={year} 
                class="block w-full p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
              </select>
              <p class="text-xs text-gray-500 mt-2">View historical data from previous years</p>
            </div>
          <!-- NIRF Ranking Filter -->
          <!-- <div>
            <label class="block text-sm font-medium text-gray-700">Max NIRF Ranking</label>
            <input
              type="number"
              bind:value={filters.nirfRanking}
              class="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="e.g., 50"
            />
          </div> -->
          
          <!-- Placement Rating Filter -->
          <!-- <div>
            <label class="block text-sm font-medium text-gray-700">Min Placement Rating</label>
            <select bind:value={filters.placementRating} class="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
              <option value="">Any</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
              <option value="5">5</option>
            </select>
          </div> -->
          
          <!-- College Life Rating Filter -->
          <!-- <div>
            <label class="block text-sm font-medium text-gray-700">Min College Life Rating</label>
            <select bind:value={filters.collegeLifeRating} class="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
              <option value="">Any</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
              <option value="5">5</option>
            </select>
          </div> -->
          
          <!-- Campus Rating Filter -->
          <!-- <div>
            <label class="block text-sm font-medium text-gray-700">Min Campus Rating</label>
            <select bind:value={filters.campusRating} class="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
              <option value="">Any</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
              <option value="5">5</option>
            </select>
          </div> -->
          
          <!-- Seat Type Filter -->
          <!-- <div>
            <label class="block text-sm font-medium text-gray-700">Seat Type</label>
            <select bind:value={filters.quota} class="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
              <option value="">Any</option>
              <option value="AI">All India</option>
              <option value="HS">Home State</option>
            </select>
          </div> -->
          
          <!-- Reset Filters Button -->
          <!-- <div class="flex items-end">
            <button
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
              on:click={resetFilters}
            >
              Reset Filters
            </button>
          </div> -->
          </div>
        </div>
      </div>
    
      <!-- College Tables or Loading Spinner or No Results Message -->
      {#if loading}
        <!-- Loading Spinner with better design -->
        <div class="flex flex-col justify-center items-center py-16 px-4">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <div class="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <p class="text-blue-600 font-medium animate-pulse">Searching for colleges...</p>
          <p class="text-gray-500 text-sm max-w-md text-center mt-2">We're finding the best colleges based on your rank and preferences</p>
        </div>
      {:else if iit_colleges.length > 0 || nit_colleges.length > 0 || iiit_colleges.length > 0 || gfti_colleges.length > 0}
        <!-- Results Summary -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Results Found
          </h2>
          <div class="flex flex-wrap gap-3 text-sm">
            {#if iit_colleges.length > 0}
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {iit_colleges.length} IITs
              </span>
            {/if}
            {#if nit_colleges.length > 0}
              <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                {nit_colleges.length} NITs
              </span>
            {/if}
            {#if iiit_colleges.length > 0}
              <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                {iiit_colleges.length} IIITs
              </span>
            {/if}
            {#if gfti_colleges.length > 0}
              <span class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                {gfti_colleges.length} GFTIs
              </span>
            {/if}
          </div>
          <p class="text-gray-500 text-sm mt-2">Showing colleges that match your rank with {parseInt(margin*100)}% margin. Click on any college for more details.</p>
        </div>

        <!-- College Tables with accordion-style sections -->
        <div class="space-y-6">
          {#if iit_colleges.length > 0}
            <CollegeTable 
              title="IIT Colleges" 
              colleges={iit_colleges.filter(applyGlobalFilters)} 
            />
          {/if}
          {#if nit_colleges.length > 0}
            <CollegeTable 
              title="NIT Colleges" 
              colleges={nit_colleges.filter(applyGlobalFilters)} 
            />
          {/if}
          {#if iiit_colleges.length > 0}
            <CollegeTable 
              title="IIIT Colleges" 
              colleges={iiit_colleges.filter(applyGlobalFilters)} 
            />
          {/if}
          {#if gfti_colleges.length > 0}
            <CollegeTable 
              title="GFTI Colleges" 
              colleges={gfti_colleges.filter(applyGlobalFilters)} 
            />
          {/if}
        </div>
      {:else}
        <!-- No Colleges Found Message with better styling -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-medium text-gray-700 mb-2">No colleges found</h3>
          <p class="text-gray-500 max-w-md mx-auto">Try adjusting your rank margin or changing other filters to see more results.</p>
          <button 
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            on:click={() => margin = '0.3'}
          >
            Increase Rank Margin to 30%
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
