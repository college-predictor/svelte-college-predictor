<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';  // Correct import for FontAwesomeIcon

  export let title;
  export let description;
  export let icon;
  export let link = "#";
</script>

<a href="{link}">
  <div class="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-2 transition duration-300 mx-4">
    <div class="mb-4">
      <FontAwesomeIcon {icon} class="w-12 h-12 text-blue-600" />  <!-- Directly passing the icon -->
    </div>
    <h3 class="text-xl font-semibold mb-4">{title}</h3>
    <p class="text-gray-600">{description}</p>
  </div>
</a>
