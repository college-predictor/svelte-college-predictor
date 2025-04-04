<script>
// @ts-nocheck

  let isMenuOpen = false;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/study-material', label: 'Free Study Material' },
    { href: '/discussion-forum', label: 'Discussion Forum' },
    { href: '/about', label: 'About' },
    // {
    //   href: '/exams',
    //   label: 'Exams',
    //   dropdown: [
    //     { label: 'Engineering', href: '/engineering' },
    //     { label: 'Medical', href: '/engineering' },
    //   ],
    // },
  ];

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };
</script>

<nav class="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
  <div class="container mx-auto px-8">
    <div class="flex justify-between h-16">
      <!-- Logo Section -->
      <div class="flex items-center">
        <a href="/" class="flex items-center text-white">
          <img src="assets/logo_light.webp" alt="College Predictor Logo" class="h-8 w-8 mr-2" />
          <span class="text-2xl font-bold">College Predictor</span>
        </a>
      </div>

      <!-- Search Bar (Optional) -->
      <!-- <div class="hidden md:flex md:items-center md:w-1/3">
        <input
          type="text"
          placeholder="Search for colleges..."
          class="w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Search for colleges"
        />
        <button class="ml-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300" aria-label="Search">
          Search
        </button>
      </div> -->

      <!-- Desktop Menu -->
      <div class="hidden md:flex md:items-center">
        <ul class="flex space-x-2 md:flex md:items-center">
          <li>
            <a href="/ai-counsellor">
              <button class="px-3 py-2 bg-yellow-400 text-indigo-700 rounded-lg hover:bg-yellow-500 transition duration-300 font-medium">
                AI Counsellor
              </button>
            </a>
          </li>
          {#each links as link}
            <li class="relative group">
              {#if link.dropdown}
              <a href="{link.href}" class="bg-indigo-600 px-4 py-2 rounded-lg text-white hover:bg-indigo-700 hover:text-yellow-300 transition duration-300 font-medium">
                {link.label}
              </a>
                <ul class="absolute left-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  {#each link.dropdown as subLink}
                    <li>
                      <a href="{subLink.href}" class="block px-4 py-2 hover:bg-gray-100">{subLink.label}</a>
                    </li>
                  {/each}
                </ul>
              {:else}
              <a href="{link.href}" class="bg-indigo-500 px-4 py-2 rounded-lg text-white hover:bg-indigo-700 hover:text-yellow-300 transition duration-300 font-medium">
                {link.label}
              </a>
              {/if}
            </li>
          {/each}
          <!-- <li>
            <a href="/login" class="text-white hover:text-yellow-300 transition duration-300 font-medium">
              Login
            </a>
          </li>
          <li>
            <a href="/signup">
              <button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 font-medium">
                Sign Up
              </button>
            </a>
          </li> -->
        </ul>
      </div>

      <!-- Mobile Menu Button -->
      <div class="flex items-center md:hidden">
        <button
          id="menu-button"
          on:click="{toggleMenu}"
          class="text-white hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-300"
          aria-label="Toggle menu"
        >
          {#if isMenuOpen}
            <!-- Close Icon -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {:else}
            <!-- Hamburger Icon -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div id="mobile-menu" class="md:hidden bg-gradient-to-r from-blue-500 to-indigo-600">
      <ul class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {#each links as link}
          <li>
            <a href="{link.href}" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700 transition duration-300">
              {link.label}
            </a>
          </li>
        {/each}
        <li>
          <a href="/ai-counsellor" class="block">
            <button class="w-full text-left px-3 py-2 bg-yellow-400 text-indigo-700 rounded-lg hover:bg-yellow-500 transition duration-300 font-medium">
              AI Counsellor
            </button>
          </a>
        </li>
        <li>
          <a href="/login" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700 transition duration-300">
            Login
          </a>
        </li>
        <li>
          <a href="/signup" class="block">
            <button class="w-full text-left px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 font-medium">
              Sign Up
            </button>
          </a>
        </li>
      </ul>
    </div>
  {/if}
</nav>
