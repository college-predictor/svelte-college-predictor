<script lang="ts">
  import { scale } from 'svelte/transition'; // Using Svelte's scale transition
  import { writable } from 'svelte/store';
  import JosaaForm from '$lib/components/JosaaForm.svelte';

  // Reactive values for form inputs
  let showForm = false;
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

  // Handle submit (for demo purposes)
  const handleSubmit = () => {
    alert("Form submitted with selected options.");
  };
</script>

<section 
  class="flex flex-col lg:flex-row items-center bg-cover bg-center text-white px-8" 
  style="background-image: url('/assets/hero-background.webp'); min-height: calc(100vh - 80px);"
>
  <!-- Left Side: Text Content -->
  <div class="max-w-lg px-8 mx-8">
    <h1 class="text-5xl font-bold mb-4 text-black">AI Finds Your College</h1>
  </div>
  
  <!-- Right Side: Dynamic Form -->
  <div class="flex-1 flex items-center justify-center">
    <JosaaForm/>
  </div>
</section>

<style>
  button {
      margin: 0;
      padding: 4px;
      padding-inline: 8px;
  }
</style>
