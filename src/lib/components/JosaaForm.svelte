<script lang="ts">
  import { goto } from '$app/navigation';

  // JEE Details Form State
  let gender = 'Gender-Neutral'; // Default value
  let category = 'OPEN';
  let mainsGenRank = '';
  let mainsCatRank = '';
  let showAdvancedRanks = false;
  let advGenRank = '';
  let advCatRank = '';
  let state = 'Rajasthan'; // Default State

  let allStates:String[] = ['Uttarakhand', 'Tamil Nadu', 'Chandigarh', 'Uttar Pradesh', 'Karnataka', 'Chhattisgarh', 'Tripura', 'Odisha', 'Rajasthan', 'Meghalaya', 'Sikkim', 'Haryana', 'Diu', 'Punjab', 'Kerala', 'Himachal Pradesh', 'Mizoram', 'Andhra Pradesh', 'Madhya Pradesh', 'Jharkhand', 'Goa', 'Arunachal Pradesh', 'Nagaland', 'Jammu & Kashmir', 'Maharashtra', 'Gujarat', 'Puducherry', 'Manipur', 'West Bengal', 'Bihar', 'Delhi', 'Assam', 'Telangana']

  // Helper to determine if category is 'OPEN'
  $: isCategoryOpen = category === 'OPEN';

  // Handle JEE Form Submission
  const submitJeeForm = (e: Event) => {
    e.preventDefault();

    // Collect form data with snake_case keys as expected by the API
    const formData: Record<string, string | number | null> = {
      gender,
      category,
      state,
      mains_gen_rank: mainsGenRank ? Number(mainsGenRank) : null,
      mains_cat_rank: !isCategoryOpen && mainsCatRank ? Number(mainsCatRank) : null,
      adv_gen_rank: advGenRank ? Number(advGenRank) : null,
      adv_cat_rank: !isCategoryOpen && advCatRank ? Number(advCatRank) : null,
    };

    const filteredFormData: Record<string, string | number> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        filteredFormData[key] = value;
      }
    });

    // Build query parameters
    const params = new URLSearchParams();
    Object.entries(filteredFormData).forEach(([key, value]) => {
      params.append(key, value.toString());
    });

    console.log('Navigating with query params:', params.toString());

    // Navigate to 'college-list' with query parameters
    goto(`college-list?${params.toString()}`);
  };
</script>

<!-- JEE Details Section -->
<section class="text-black m-2 sm:m-4">
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-md p-6 sm:p-8 bg-gradient-to-r from-blue-200 to-indigo-300">
      
      <!-- JEE Details Header -->
      <div class="bg-yellow-400 text-indigo-700 text-center py-2 rounded-t-lg mb-4">
        <h2 class="text-xl font-semibold">JEE Details</h2>
      </div>
      
      <!-- JEE Details Form -->
      <form on:submit|preventDefault={submitJeeForm} class="space-y-4" id="josaa-form">
        
        <!-- First Row: Gender, Category, and State -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <!-- Gender Selection -->
          <div>
            <label for="inputGenderSelect" class="block text-gray-700 font-medium mb-1">Gender</label>
            <select 
              id="inputGenderSelect" 
              class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              bind:value={gender}
            >
              <option value="Gender-Neutral">Male</option>
              <option value="Female-only (including Supernumerary)">Female</option>
            </select>
          </div>
          
          <!-- Category Selection -->
          <div>
            <label for="inputCategorySelect" class="block text-gray-700 font-medium mb-1">Category</label>
            <select 
              id="inputCategorySelect" 
              class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              bind:value={category}
            >
              <option value="OPEN">OPEN</option>
              <option value="OPEN (PwD)">OPEN (PwD)</option>
              <option value="EWS">EWS</option>
              <option value="EWS (PwD)">EWS (PwD)</option>
              <option value="OBC-NCL">OBC-NCL</option>
              <option value="OBC-NCL (PwD)">OBC-NCL (PwD)</option>
              <option value="SC">SC</option>
              <option value="SC (PwD)">SC (PwD)</option>
              <option value="ST">ST</option>
              <option value="ST (PwD)">ST (PwD)</option>
            </select>
          </div>
          
          <!-- State Dropdown -->
          <div>
            <label for="inputStateSelect" class="block text-gray-700 font-medium mb-1">State</label>
            <select 
              id="inputStateSelect" 
              class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              bind:value={state}
            >
            {#each allStates as s}
              <option value="{s}">{s}</option>
            {/each}
              <!-- Add more states as needed -->
            </select>
          </div>
        </div>
        
        <!-- Second Row: Mains Ranks -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <!-- Mains General Rank -->
          <div>
            <label for="inputMainsGeneralRank" class="block text-gray-700 font-medium mb-1">Mains General Rank</label>
            <input
              id="inputMainsGeneralRank"
              type="number"
              placeholder="Optional"
              class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              bind:value={mainsGenRank}
            />
          </div>
          
          <!-- Mains Category Rank (Visible only if Category is not OPEN) -->
          {#if !isCategoryOpen}
            <div class="fade-in">
              <label for="inputMainsCategoryRank" class="block text-gray-700 font-medium mb-1">Mains Category Rank</label>
              <input
                id="inputMainsCategoryRank"
                type="number"
                placeholder="Optional"
                class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                bind:value={mainsCatRank}
              />
            </div>
          {/if}
        </div>
        
        <hr class="border-gray-300">
        
        <!-- Toggle for Advanced Ranks -->
        <div class="flex items-center">
          <input
            type="checkbox"
            id="toggleAdvanced"
            class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            bind:checked={showAdvancedRanks}
          />
          <label for="toggleAdvanced" class="ml-2 text-gray-700 font-medium">
            Enter Advanced Ranks
          </label>
        </div>
        
        <!-- Third Row: Advanced Ranks (Visible only if Toggle is On) -->
        {#if showAdvancedRanks}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 fade-in">
            
            <!-- Advanced General Rank -->
            <div>
              <label for="inputAdvancedGeneralRank" class="block text-gray-700 font-medium mb-1">Advanced General Rank</label>
              <input
                id="inputAdvancedGeneralRank"
                type="number"
                placeholder="Optional"
                class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                bind:value={advGenRank}
              />
            </div>
            
            <!-- Advanced Category Rank (Visible only if Category is not OPEN) -->
            {#if !isCategoryOpen}
              <div class="fade-in">
                <label for="inputAdvancedCategoryRank" class="block text-gray-700 font-medium mb-1">Advanced Category Rank</label>
                <input
                  id="inputAdvancedCategoryRank"
                  type="number"
                  placeholder="Optional"
                  class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  bind:value={advCatRank}
                />
              </div>
            {/if}
          </div>
        {/if}
        
        <!-- Submit Button -->
        <div class="text-center">
          <button
            type="submit"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
      
    </div>
  </div>
</section>

<style>
  /* Optional: Add any custom styles here */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
