<script lang="ts">
  import { onMount } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faCalculator, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

  // State variables
  let answerSheetLink = '';
  let isValidLink = false;
  let isLoading = false;
  let error = '';
  let result: any = null;

  // Validate the answer sheet link
  $: {
    isValidLink = answerSheetLink.startsWith('https://cdn3.digialm.com/');
    error = answerSheetLink && !isValidLink ? 'Please enter a valid JEE answer sheet link starting with https://cdn3.digialm.com/' : '';
  }

  // Function to redirect to results page
  function redirectToResults() {
    if (!isValidLink) return;
    
    // Create URL with the answer sheet link as a query parameter
    const resultsUrl = `/answer-sheet-results?answerSheetLink=${encodeURIComponent(answerSheetLink)}`;
    
    // Navigate to the results page
    window.location.href = resultsUrl;
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6 mb-8">
  <div class="text-center mb-6">
    <h3 class="text-2xl font-bold text-indigo-700 mb-2">Calculate Your JEE Marks</h3>
    <p class="text-gray-600">Upload your JEE answer sheet link to instantly see correct/incorrect questions</p>
  </div>
  
  <div class="space-y-4">
    <div>
      <label for="answerSheetLink" class="block text-sm font-medium text-gray-700 mb-1">
        Answer Sheet Link
      </label>
      <input
        id="answerSheetLink"
        type="url"
        bind:value={answerSheetLink}
        placeholder="https://cdn3.digialm.com/..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
      />
      {#if error}
        <p class="mt-1 text-sm text-red-600">
          <FontAwesomeIcon icon={faExclamationTriangle} class="mr-1" />
          {error}
        </p>
      {/if}
    </div>
    
    <button
      on:click={redirectToResults}
      disabled={!isValidLink}
      class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-md transition duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
    >
      <FontAwesomeIcon icon={faCalculator} class="mr-2" />
      View Results
    </button>
  </div>
  

</div>

<style>
  /* Add some subtle animations */
  button {
    transition: all 0.2s ease-in-out;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  
  button:active:not(:disabled) {
    transform: translateY(1px);
  }
</style>