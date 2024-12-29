        <!-- Table Header -->
        <div class="grid grid-cols-[5fr_6fr_2fr_1fr_1fr_1fr] py-3 px-4 rounded-lg font-semibold my-4 bg-gray-200">
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
                on:click={() => sortData('category')}
                role="button"
                tabindex="0"
            >
                Category
                <span class="ml-1">
                    {#if sortBy === 'category'}
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
        {#each nit_colleges.filter(applyFilters) as college (college.id)}
            <div class="relative pb-4">
      
                <!-- Main Row -->
                <div
                    class={`grid grid-cols-[5fr_6fr_2fr_1fr_1fr_1fr] bg-white px-4 text-black p-2 shadow-md rounded-lg cursor-pointer ${
                        expandedRow === college.id ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                    on:click={() => toggleExpand(college.id)}
                    aria-expanded={expandedRow === college.id}
                    role="button"
                    tabindex="0"
                >
                    <div>{college.courseName} ({college.courseType})</div>
                    <div>{college.collegeName}</div>
                    <div>{college.category}</div>
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