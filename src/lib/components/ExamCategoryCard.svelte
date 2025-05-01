<script lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
    import { createEventDispatcher } from 'svelte';

    export let title: string;
    export let description: string;
    export let icon: any;
    export let link: string = "#";
    export let data: any = null;
    export let isActive: boolean = false;
    export let index: number = 0;

    const dispatch = createEventDispatcher();

    function handleClick(event: MouseEvent) {
      event.preventDefault();
      dispatch('select', { index });
    }
  </script>

  <button
    on:click={handleClick}
    class="block group w-full text-left focus:outline-none"
  >
    <div class="relative bg-gradient-to-r backdrop-blur-lg rounded-md shadow-lg transform transition-all duration-300 border overflow-hidden max-w-xs mx-auto flex items-center gap-3 p-3 {isActive ? 'from-teal-50 to-white border-teal-300 -translate-y-1 shadow-xl' : 'from-white/90 to-white/80 border-white/20 hover:border-teal-200/30 hover:-translate-y-1'}">
      <!-- Background effects -->
      <div class="absolute inset-0 bg-gradient-to-r pointer-events-none transition-opacity duration-300 {isActive ? 'from-teal-500/10 to-sky-600/10 opacity-20' : 'from-teal-500/5 to-sky-600/5 group-hover:opacity-20'}"></div>
      <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-300"></div>

      <!-- Icon -->
      <div class="relative transform transition-all duration-300 flex-shrink-0 {isActive ? 'scale-110' : 'group-hover:scale-110'}">
        <FontAwesomeIcon {icon} class="w-10 h-10 bg-gradient-to-r p-2 rounded-md text-white shadow-md ring-1 transition-shadow duration-300 {isActive ? 'from-teal-600 to-sky-700 ring-teal-400 shadow-teal-500/50' : 'from-teal-500 to-sky-600 ring-white/30 group-hover:shadow-teal-500/30'}" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3 class="relative text-base font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 truncate {isActive ? 'from-teal-600 to-sky-600' : 'from-gray-800 to-gray-600 group-hover:from-teal-600 group-hover:to-sky-600'}">{title}</h3>
        <p class="relative text-xs leading-tight transition-colors duration-300 overflow-hidden {isActive ? 'text-sky-700' : 'text-gray-600 group-hover:text-teal-900/80'}">{description}</p>
      </div>
    </div>
  </button>
