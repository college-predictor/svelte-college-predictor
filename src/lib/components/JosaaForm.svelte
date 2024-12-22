<script lang="ts">
    import { writable } from 'svelte/store';
  
    // Reactive values for form inputs
    let examType = writable('jee_mains');
    let category = writable('general');
    let gender = writable('male');
    let disability = writable('non_pwd');
    let mainsRank = writable('');
    let mainsCategoryRank = writable('');
    let advanceRank = writable('');
    let advanceCategoryRank = writable('');
    let state = writable('rajasthan');
  
    // Handle reset
    const resetForm = () => {
      examType.set('jee_mains');
      category.set('general');
      gender.set('male');
      disability.set('non_pwd');
      mainsRank.set('');
      mainsCategoryRank.set('');
      advanceRank.set('');
      advanceCategoryRank.set('');
      state.set('rajasthan');
    };
  
    // Handle submit
    const handleSubmit = () => {
      // Add your submit logic here
      console.log({
        examType,
        category,
        gender,
        disability,
        mainsRank,
        mainsCategoryRank,
        advanceRank,
        advanceCategoryRank,
        state,
      });
    };
  </script>
  
  <section class="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold mb-2 text-black">JOSAA College Predictor</h1>
    <p class="text-gray-500 mb-4">No Login Required!!</p>
  
    <!-- Exam Type Toggle -->
    <div class="flex justify-center space-x-4 mb-4">
      <button class="px-4 py-2 rounded-lg bg-black text-white" on:click={() => examType.set('jee_mains')}>JEE Mains</button>
      <button class="px-4 py-2 rounded-lg bg-gray-200" on:click={() => examType.set('jee_mains_adv')}>JEE (Mains Adv.)</button>
      <button class="px-4 py-2 rounded-lg bg-gray-200" on:click={() => examType.set('neet')}>NEET</button>
    </div>
  
    <!-- Category Toggle -->
    <div class="flex justify-center space-x-2 mb-4">
      <button class="px-4 py-2 rounded-lg bg-black text-white" on:click={() => category.set('general')}>General</button>
      <button class="px-4 py-2 rounded-lg bg-gray-200" on:click={() => category.set('obc_ncl')}>OBC-NCL</button>
      <button class="px-4 py-2 rounded-lg bg-gray-200" on:click={() => category.set('sc')}>SC</button>
      <button class="px-4 py-2 rounded-lg bg-gray-200" on:click={() => category.set('st')}>ST</button>
      <button class="px-4 py-2 rounded-lg bg-gray-200" on:click={() => category.set('pwd')}>PwD</button>
    </div>
  
    <!-- Gender Toggle -->
    <div class="flex justify-center space-x-4 mb-4">
      <button class="px-4 py-2 rounded-lg bg-black text-white" on:click={() => gender.set('male')}>Male</button>
      <button class="px-4 py-2 rounded-lg bg-gray-200" on:click={() => gender.set('female')}>Female</button>
    </div>
  
    <!-- Disability Toggle -->
    <div class="flex justify-center space-x-4 mb-4">
      <button class="px-4 py-2 rounded-lg bg-black text-white" on:click={() => disability.set('pwd')}>PwD</button>
      <button class="px-4 py-2 rounded-lg bg-gray-200" on:click={() => disability.set('non_pwd')}>Non-PwD</button>
    </div>
  
    <!-- Input Fields for Ranks -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-gray-700 mb-2">Mains Rank</label>
        <input type="number" bind:value={$mainsRank} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="1000">
      </div>
      <div>
        <label class="block text-gray-700 mb-2">Mains Category Rank</label>
        <input type="number" bind:value={$mainsCategoryRank} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="50000">
      </div>
      <div>
        <label class="block text-gray-700 mb-2">Advance Rank</label>
        <input type="number" bind:value={$advanceRank} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="1000">
      </div>
      <div>
        <label class="block text-gray-700 mb-2">Advance Category Rank</label>
        <input type="number" bind:value={$advanceCategoryRank} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="1000">
      </div>
    </div>
  
    <!-- State Dropdown -->
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">State</label>
      <select bind:value={$state} class="block w-full mt-1 border-gray-300 focus:border-indigo-500 rounded-md shadow-sm">
        <option value="rajasthan">Rajasthan</option>
        <option value="delhi">Delhi</option>
        <option value="maharashtra">Maharashtra</option>
        <option value="tamil_nadu">Tamil Nadu</option>
        <!-- Add more states as needed -->
      </select>
    </div>
  
    <!-- Action Buttons -->
    <div class="flex justify-between items-center">
      <button type="button" class="text-gray-600 font-semibold" on:click={resetForm}>Reset</button>
      <button type="button" class="bg-black text-white px-6 py-2 rounded-lg" on:click={handleSubmit}>PREDICT</button>
    </div>
  </section>
  
  <style>
    /* Additional styles can be added here for responsiveness or further customization */
  </style>
  