<!-- src/components/CollegeList.svelte -->
<script lang="ts">

    interface ContactInfo {
      phone: string;
      email: string;
      address: string;
    }

    interface College {
      id: number;
      courseName: string;
      courseType: string;
      collegeName: string;
      seatType: string;
      openingRank: number;
      closingRank: number;
      profileImage: string;
      avgPkg: string;
      nirfRanking: number;
      placementRating: number;
      collegeLifeRating: number;
      campusRating: number;
      aiSummary: string;
      contactInfo: ContactInfo;
    }

    let colleges: College[] = [
      {
        id: 1,
        courseName: 'Computer Science',
        courseType: 'B.Tech',
        collegeName: 'Indian Institute of Technology Delhi',
        seatType: 'Open',
        openingRank: 5,
        closingRank: 250,
        profileImage: 'https://placehold.co/300x300',
        avgPkg: '12 LPA',
        nirfRanking: 3,
        placementRating: 4.5,
        collegeLifeRating: 4.2,
        campusRating: 4.7,
        aiSummary: 'IIT Delhi is renowned for its excellent academic environment and robust placement opportunities, offering state-of-the-art facilities and a vibrant campus life.',
        contactInfo: {
          phone: '+91-11-12345678',
          email: 'admissions@iitd.ac.in',
          address: 'Hauz Khas, New Delhi, Delhi 110016',
        },
      },
      {
        id: 2,
        courseName: 'Mechanical Engineering',
        courseType: 'B.Tech',
        collegeName: 'Indian Institute of Technology Bombay',
        seatType: 'Open',
        openingRank: 10,
        closingRank: 300,
        profileImage: 'https://placehold.co/300x300',
        avgPkg: '11 LPA',
        nirfRanking: 4,
        placementRating: 4.3,
        collegeLifeRating: 4.0,
        campusRating: 4.5,
        aiSummary: 'IIT Bombay offers a dynamic learning atmosphere with strong industry connections, ensuring excellent placement rates and a supportive student community.',
        contactInfo: {
          phone: '+91-22-87654321',
          email: 'admissions@iitb.ac.in',
          address: 'Powai, Mumbai, Maharashtra 400076',
        },
      },
      // Add more college objects here
    ];

    type SortColumn = 'courseName' | 'collegeName' | 'seatType' | 'openingRank' | 'closingRank' | 'nirfRanking';

    let sortBy: SortColumn = 'collegeName';
    let sortOrder: 'asc' | 'desc' = 'asc';

    function sortData(column: SortColumn): void {
      if (sortBy === column) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy = column;
        sortOrder = 'asc';
      }

      colleges = [...colleges].sort((a, b) => {
        let valA: any = a[column];
        let valB: any = b[column];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    let expandedRow: number | null = null;

    function toggleExpand(collegeId: number): void {
      expandedRow = expandedRow === collegeId ? null : collegeId;
    }

    // Filtering
    let filters = {
      nirfRanking: '',
      placementRating: '',
      collegeLifeRating: '',
      campusRating: '',
      seatType: '',
    };

    function applyFilters(college: College): boolean {
      return (
        (filters.nirfRanking === '' || college.nirfRanking <= Number(filters.nirfRanking)) &&
        (filters.placementRating === '' || college.placementRating >= Number(filters.placementRating)) &&
        (filters.collegeLifeRating === '' || college.collegeLifeRating >= Number(filters.collegeLifeRating)) &&
        (filters.campusRating === '' || college.campusRating >= Number(filters.campusRating)) &&
        (filters.seatType === '' || college.seatType === filters.seatType)
      );
    }

    function resetFilters(): void {
      filters = {
        nirfRanking: '',
        placementRating: '',
        collegeLifeRating: '',
        campusRating: '',
        seatType: '',
      };
    }

    // New Fields
    let year = '2024'; // Default Year
    let margin = '0.1'; // Default Margin
</script>


<!-- src/components/CollegeList.svelte -->
<div class="bg-white">
    <div class="container mx-auto p-6">
        <!-- Header -->
        <div class="flex p-2 px-6 font-bold rounded-lg shadow-md justify-between items-center" style="background: #5d5d5b;">
            <h1 class="text-2xl font-bold text-white">NIT Colleges</h1>
        </div>
      
        <!-- Filter Section -->
        <div class="my-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-2">Filter Colleges</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

                <!-- Year Selection -->
                <div>
                    <label for="inputYearSelect" class="block text-sm font-medium text-gray-700">Year</label>
                    <select 
                    id="inputYearSelect" 
                    bind:value={year} 
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    </select>
                </div>
            
                <!-- Rank Margin -->
                <div>
                    <label for="inputMarginSelect" class="block text-sm font-medium text-gray-700">Rank Margin</label>
                    <select 
                    id="inputMarginSelect" 
                    bind:value={margin} 
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                    <option value="0.05">5%</option>
                    <option value="0.1">10% (Default)</option>
                    <option value="0.15">15%</option>
                    <option value="0.2">20%</option>
                    <option value="0.25">25%</option>
                    <option value="0.3">30%</option>
                    </select>
                </div>

                <!-- NIRF Ranking Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Max NIRF Ranking</label>
                    <input
                        type="number"
                        bind:value={filters.nirfRanking}
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 50"
                    />
                </div>
                <!-- Placement Rating Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Min Placement Rating</label>
                    <select bind:value={filters.placementRating} class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Any</option>
                        <option value="4">4+</option>
                        <option value="4.5">4.5+</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <!-- College Life Rating Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Min College Life Rating</label>
                    <select bind:value={filters.collegeLifeRating} class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Any</option>
                        <option value="4">4+</option>
                        <option value="4.5">4.5+</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <!-- Campus Rating Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Min Campus Rating</label>
                    <select bind:value={filters.campusRating} class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Any</option>
                        <option value="4">4+</option>
                        <option value="4.5">4.5+</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <!-- Seat Type Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Seat Type</label>
                    <select bind:value={filters.seatType} class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Any</option>
                        <option value="Open">Open</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                    </select>
                </div>
                <!-- Reset Filters Button -->
                <div class="flex items-end">
                    <button
                        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                        on:click={resetFilters}
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Table Header -->
        <div class="grid grid-cols-[5fr_5fr_2fr_2fr_2fr_1fr] py-3 px-4 rounded-lg font-semibold my-4 bg-gray-200">
            <!-- Course Name Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('courseName')}
                role="button"
                tabindex="0"
            >
                Course Name
                <span class="ml-1">
                    {#if sortBy === 'courseName'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>

            <!-- College Name Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('collegeName')}
                role="button"
                tabindex="0"
            >
                College Name
                <span class="ml-1">
                    {#if sortBy === 'collegeName'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>
      
            <!-- Seat Type Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('seatType')}
                role="button"
                tabindex="0"
            >
                Seat Type
                <span class="ml-1">
                    {#if sortBy === 'seatType'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>
      
            <!-- Opening Rank Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('openingRank')}
                role="button"
                tabindex="0"
            >
                O.R.
                <span class="ml-1">
                    {#if sortBy === 'openingRank'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>
      
            <!-- Closing Rank Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('closingRank')}
                role="button"
                tabindex="0"
            >
                C.R.
                <span class="ml-1">
                    {#if sortBy === 'closingRank'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>
      
            <!-- NIRF Ranking Column -->
            <div
                class="flex items-center cursor-pointer"
                on:click={() => sortData('nirfRanking')}
                role="button"
                tabindex="0"
            >
                NIRF
                <span class="ml-1">
                    {#if sortBy === 'nirfRanking'}
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    {/if}
                </span>
            </div>
        </div>
      
        <!-- Table Rows -->
        {#each colleges.filter(applyFilters) as college (college.id)}
            <div class="relative pb-4">
      
                <!-- Main Row -->
                <div
                    class={`grid grid-cols-[5fr_5fr_2fr_2fr_2fr_1fr] bg-white px-4 font-semibold text-black p-2 shadow-md rounded-lg cursor-pointer ${
                        expandedRow === college.id ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                    on:click={() => toggleExpand(college.id)}
                    aria-expanded={expandedRow === college.id}
                    role="button"
                    tabindex="0"
                >
                    <div>{college.courseName} ({college.courseType})</div>
                    <div>{college.collegeName}</div>
                    <div>{college.seatType}</div>
                    <div>{college.openingRank}</div>
                    <div>{college.closingRank}</div>
                    <div>{college.nirfRanking}</div>
                </div>

                <!-- Expanding Details Card -->
                <div
                    class={`overflow-hidden transition-max-height duration-700 ease-in-out ${
                        expandedRow === college.id ? 'max-h-96' : 'max-h-0'
                    }`}
                >
                    <div class="bg-gray-50 p-4 rounded-b-lg shadow-inner">
                        <div class="flex flex-col md:flex-row gap-4">
                            <!-- Profile Image -->
                            <div class="flex-shrink-0">
                                <img src={college.profileImage} alt="{college.collegeName} Image" class="rounded-lg w-48 h-36 object-cover" />
                            </div>
                            <!-- College Info -->
                            <div class="flex-1 gap-8">
                                <a class="font-semibold text-lg mb-2" href="#" target="_blank">{college.collegeName}</a>
                                <div class="mt-4">
                                    <p class="font-semibold">Contact Info:</p>
                                    <a href="{college.contactInfo.phone}">📞</a>
                                    <a href="{college.contactInfo.email}">✉️</a>
                                    <a href="{college.contactInfo.address}">📍</a>
                                </div>
                                <div class="mb-2 flex gap-8">
                                    <div>
                                        <p class="font-semibold">Average Package:</p>
                                        <p>{college.avgPkg}</p>
                                    </div>
                                    <div>
                                        <p class="font-semibold">Highest Package:</p>
                                        <p>{college.avgPkg}</p>
                                    </div>
                                </div>
                            </div>
                            <!-- Ratings and Packages -->
                            <div class="flex-1">
                                <div class="mb-2 flex gap-2">
                                    <p class="font-semibold">Placement:</p>
                                    <div class="flex items-center">
                                        {#each Array(5) as _, i}
                                            <svg
                                                class={`w-5 h-5 ${i < Math.round(college.placementRating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.286 3.973c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.175 0l-3.376 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.973a1 1 0 00-.364-1.118L2.98 9.4c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.973z" />
                                            </svg>
                                        {/each}
                                        <span class="ml-2">{college.placementRating} / 5</span>
                                    </div>
                                </div>
                                <div class="mb-2 flex gap-2">
                                    <p class="font-semibold">College Life:</p>
                                    <div class="flex items-center">
                                        {#each Array(5) as _, i}
                                            <svg
                                                class={`w-5 h-5 ${i < Math.round(college.collegeLifeRating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.286 3.973c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.175 0l-3.376 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.973a1 1 0 00-.364-1.118L2.98 9.4c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.973z" />
                                            </svg>
                                        {/each}
                                        <span class="ml-2">{college.collegeLifeRating} / 5</span>
                                    </div>
                                </div>
                                <div class="mb-2 flex gap-2">
                                    <p class="font-semibold">Campus:</p>
                                    <div class="flex items-center">
                                        {#each Array(5) as _, i}
                                            <svg
                                                class={`w-5 h-5 ${i < Math.round(college.campusRating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.286 3.973c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.175 0l-3.376 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.973a1 1 0 00-.364-1.118L2.98 9.4c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.973z" />
                                            </svg>
                                        {/each}
                                        <span class="ml-2">{college.campusRating} / 5</span>
                                    </div>
                                </div>
                                <div class="mb-2 flex gap-2">
                                    <p class="font-semibold">Department:</p>
                                    <div class="flex items-center">
                                        {#each Array(5) as _, i}
                                            <svg
                                                class={`w-5 h-5 ${i < Math.round(college.campusRating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.286 3.973c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.175 0l-3.376 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.973a1 1 0 00-.364-1.118L2.98 9.4c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.973z" />
                                            </svg>
                                        {/each}
                                        <span class="ml-2">{college.campusRating} / 5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
      </div>
</div>


<style>
  /* Optional: Custom styles can be added here */
</style>
