<script lang="ts">
  import { goto } from '$app/navigation'; // Import the goto function

  // JEE Details Form State
  let gender = 'Male'; // Default value
  let category = 'OPEN';
  let mainsGenRank = '';
  let mainsCatRank = '';
  let showAdvancedRanks = false;
  let advGenRank = '';
  let advCatRank = '';
  let year = '2024';
  let margin = '0.1'; // Default 10%
  let state = 'rajasthan'; // Default State

  // Helper to determine if category is 'OPEN'
  $: isCategoryOpen = category === 'OPEN';

  // Handle JEE Form Submission
  const submitJeeForm = (e: any) => {
    e.preventDefault();

    // Collect form data
    const formData = {
      gender,
      category,
      state, // Include state in form data
      mainsGenRank: mainsGenRank || null,
      mainsCatRank: !isCategoryOpen ? (mainsCatRank || null) : null,
      advGenRank: advGenRank || null,
      advCatRank: !isCategoryOpen ? (advCatRank || null) : null,
      year,
      margin,
    };

    console.log('JEE Form Data:', formData);

    // Redirect to the college list page
    goto('/college-list'); // Redirects to /college-list
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
      <form on:submit={submitJeeForm} class="space-y-4">
        
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
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
              <option value="rajasthan">Rajasthan</option>
              <option value="delhi">Delhi</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="tamil_nadu">Tamil Nadu</option>
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
