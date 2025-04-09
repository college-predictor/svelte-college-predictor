<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';  // Correct import for FontAwesomeIcon

  export let title;
  export let description;
  export let icon;
  export let link = "#";
</script>

<a href="{link}" class="block group">
  <div class="relative bg-gradient-to-br from-blue-50/95 via-blue-100/90 to-blue-200/85 backdrop-blur-lg rounded-xl shadow-xl p-8 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:bg-gradient-to-br group-hover:from-blue-100/98 group-hover:via-blue-200/95 group-hover:to-blue-300/90 mx-4 border border-white/30 overflow-hidden hover:border-blue-200/40">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 pointer-events-none group-hover:opacity-25 transition-opacity duration-500"></div>
    <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
    <div class="relative mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
      <FontAwesomeIcon {icon} class="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-lg text-white shadow-lg ring-2 ring-white/50 group-hover:shadow-purple-500/50 transition-shadow duration-500" />
    </div>
    <h3 class="relative text-2xl font-bold mb-4 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-blue-500 group-hover:to-indigo-600 transition-all duration-500">{title}</h3>
    <p class="relative text-gray-600 leading-relaxed group-hover:text-blue-900/80 transition-colors duration-500">{description}</p>
  </div>
</a>
