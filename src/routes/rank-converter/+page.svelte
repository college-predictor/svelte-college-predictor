<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  // Form state
  let generalRank = '';
  let loading = false;
  let results: { OBC: number; SC: number; ST: number; EWS: number } | null = null;
  let error: string | null = null;

  // Convert rank function
  async function convertRank() {
    if (!generalRank || isNaN(Number(generalRank)) || Number(generalRank) <= 0) {
      error = 'Please enter a valid rank';
      return;
    }

    try {
      loading = true;
      error = null;

      // Using the API endpoint with GET request
      const url = `https://api.collegepredictor.in/api/convert-rank?gen_rank=${Number(generalRank)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      results = await response.json();
      console.log('API Response:', results);
    } catch (err) {
      console.error('Error converting rank:', err);
      error = 'Failed to convert rank. Please try again later.';
      results = null;
    } finally {
      loading = false;
    }
  }

  // Format the rank with commas
  function formatRank(rank: number): string {
    return rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
</script>

<svelte:head>
  <title>Category Rank Converter | College Predictor</title>
  <meta name="description" content="Convert your JEE general category rank to OBC, SC, ST, and EWS category ranks to better understand your admission chances across different reservation categories." />
  <meta name="keywords" content="JEE rank conversion, category rank, OBC rank, SC rank, ST rank, EWS rank, JEE counselling, reservation category" />
  
  <!-- Open Graph / Social Media Meta Tags -->
  <meta property="og:title" content="Category Rank Converter | College Predictor" />
  <meta property="og:description" content="Convert your JEE general category rank to OBC, SC, ST, and EWS category ranks." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://collegepredictor.in/rank-converter" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://collegepredictor.in/rank-converter" />
</svelte:head>

<div class="bg-gray-50 py-8 sm:py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="mb-6 text-center">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Category Rank Converter</h1>
      <p class="text-gray-600 max-w-3xl mx-auto">Convert your JEE general category rank to equivalent ranks for OBC, SC, ST, and EWS categories to better understand your admission chances.</p>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-4xl mx-auto">
      <!-- Card Container -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-200">
        <!-- Card Header -->
        <div class="bg-blue-600 py-3 px-5">
          <h2 class="text-lg font-semibold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
            </svg>
            Rank Conversion Tool
          </h2>
        </div>
        
        <!-- Form -->
        <div class="p-6">
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-4">Enter your General Category JEE rank to convert it to equivalent ranks for other categories.</p>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <label for="generalRank" class="block text-sm font-medium text-gray-700 mb-1">General Category Rank</label>
                <input
                  type="number"
                  id="generalRank"
                  bind:value={generalRank}
                  class="block w-full p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700"
                  placeholder="Enter your rank"
                  min="1"
                />
              </div>
              
              <div class="sm:self-end">
                <button
                  on:click={convertRank}
                  class="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {#if loading}
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Converting...
                  {:else}
                    Convert Rank
                  {/if}
                </button>
              </div>
            </div>
            
            {#if error}
              <div class="mt-3 text-red-600 text-sm">{error}</div>
            {/if}
          </div>
          
          <!-- Results Section -->
          {#if results}
            <div class="mt-6 border-t border-gray-200 pt-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Equivalent Category Ranks</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- OBC Rank -->
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div class="text-sm text-blue-700 font-medium">OBC-NCL</div>
                  <div class="text-2xl font-bold text-gray-900 mt-1">{formatRank(results.OBC)}</div>
                  <a 
                    href="/college-list?category=OBC-NCL&mains_cat_rank={results.OBC}"
                    class="mt-2 text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                  >
                    View eligible colleges
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </a>
                </div>
                <!-- SC Rank -->
                <div class="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div class="text-sm text-green-700 font-medium">SC</div>
                  <div class="text-2xl font-bold text-gray-900 mt-1">{formatRank(results.SC)}</div>
                  <a 
                    href="/college-list?category=SC&mains_cat_rank={results.SC}"
                    class="mt-2 text-sm text-green-600 hover:text-green-800 inline-flex items-center"
                  >
                    View eligible colleges
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </a>
                </div>
                
                <!-- ST Rank -->
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div class="text-sm text-purple-700 font-medium">ST</div>
                  <div class="text-2xl font-bold text-gray-900 mt-1">{formatRank(results.ST)}</div>
                  <a 
                    href="/college-list?category=ST&mains_cat_rank={results.ST}"
                    class="mt-2 text-sm text-purple-600 hover:text-purple-800 inline-flex items-center"
                  >
                    View eligible colleges
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </a>
                </div>
                
                <!-- EWS Rank -->
                <div class="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div class="text-sm text-amber-700 font-medium">EWS</div>
                  <div class="text-2xl font-bold text-gray-900 mt-1">{formatRank(results.EWS)}</div>
                  <a 
                    href="/college-list?category=EWS&mains_cat_rank={results.EWS}"
                    class="mt-2 text-sm text-amber-600 hover:text-amber-800 inline-flex items-center"
                  >
                    View eligible colleges
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <p class="mt-4 text-sm text-gray-600">These are approximate equivalent ranks based on historical data of jee mains.</p>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Information Section -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div class="bg-indigo-600 py-3 px-5">
          <h2 class="text-lg font-semibold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            About Category Rank Conversion
          </h2>
        </div>
        
        <div class="p-6">
          <div class="space-y-4 text-gray-700">
            <p>
              The Category Rank Converter tool helps JEE aspirants understand how their general category rank translates to equivalent ranks in reserved categories such as OBC-NCL, SC, ST, and EWS.               
            </p>
            <p>
              This conversion is based on historical data patterns and approximate ratios between different category ranks. The actual ratios may vary slightly from year to year based on exam performance and number of candidates in each category.              
            </p>
            <h3 class="font-medium text-gray-900 mt-4">How to use this tool:</h3>
            <ol class="list-decimal list-inside space-y-2 ml-2">
              <li>Enter your General Category JEE Main or Advanced rank</li>
              <li>Click the "Convert Rank" button</li>
              <li>View your approximate equivalent ranks for OBC-NCL, SC, ST, and EWS categories</li>
              <li>Use these ranks to understand your admission chances through different reservation quotas</li>
            </ol>
            <p class="text-sm italic mt-2">
              Note: These conversions are approximations based on historical data and should be used as a reference only. The actual cutoffs may vary based on multiple factors including seat availability, candidate performance, and government policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>