<!-- src/components/CollegeTable.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    // Define ContactInfo interface
    interface ContactInfo {
      phone: string;
      email: string;
      address: string;
    }
  
    // Define College interface based on your example
    interface College {
      id: number;
      courseName: string;
      courseType: string;
      collegeType: string;
      collegeName: string;
      instituteCode: number;
      state: string;
      gender: string;
      quota: string;
      category: string;
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
  
    export let title: string;
    export let colleges: College[] = [];
  
    type SortColumn = 'courseName' | 'collegeName' | 'category' | 'openingRank' | 'closingRank' | 'nirfRanking';
    type SortOrder = 'asc' | 'desc';
  
    let sortBy: SortColumn = 'collegeName';
    let sortOrder: SortOrder = 'asc';
  
    let expandedRow: number | null = null;
  
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
  
    function toggleExpand(collegeId: number): void {
      expandedRow = expandedRow === collegeId ? null : collegeId;
    }
  </script>
  
  <style>
    /* Add your custom styles here */
    table {
      width: 100%;
      border-collapse: collapse;
    }
  
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
  
    th {
      cursor: pointer;
      background-color: #f9fafb;
    }
  
    th:hover {
      background-color: #f1f5f9;
    }
  
    .expanded-row {
      background-color: #f9fafb;
    }
  
    .sort-indicator {
      margin-left: 0.5rem;
      font-size: 0.8rem;
    }
  
    .expanded-content {
      padding: 1rem;
      background-color: #f1f1f1;
      border-radius: 0 0 0.5rem 0.5rem;
    }
  
    .toggle-button {
      background: none;
      border: none;
      cursor: pointer;
      color: #3182ce;
      font-weight: bold;
    }
  </style>
  
  <h2 class="text-2xl font-bold mb-4">{title}</h2>
  
  <!-- Table Header -->
  <table>
    <thead>
      <tr>
        <th on:click={() => sortData('courseName')}>
          Course Name
          {#if sortBy === 'courseName'}
            <span class="sort-indicator">{sortOrder === 'asc' ? '▲' : '▼'}</span>
          {/if}
        </th>
        <th on:click={() => sortData('collegeName')}>
          College Name
          {#if sortBy === 'collegeName'}
            <span class="sort-indicator">{sortOrder === 'asc' ? '▲' : '▼'}</span>
          {/if}
        </th>
        <th on:click={() => sortData('category')}>
          Category
          {#if sortBy === 'category'}
            <span class="sort-indicator">{sortOrder === 'asc' ? '▲' : '▼'}</span>
          {/if}
        </th>
        <th on:click={() => sortData('openingRank')}>
          O.R.
          {#if sortBy === 'openingRank'}
            <span class="sort-indicator">{sortOrder === 'asc' ? '▲' : '▼'}</span>
          {/if}
        </th>
        <th on:click={() => sortData('closingRank')}>
          C.R.
          {#if sortBy === 'closingRank'}
            <span class="sort-indicator">{sortOrder === 'asc' ? '▲' : '▼'}</span>
          {/if}
        </th>
        <th on:click={() => sortData('nirfRanking')}>
          NIRF
          {#if sortBy === 'nirfRanking'}
            <span class="sort-indicator">{sortOrder === 'asc' ? '▲' : '▼'}</span>
          {/if}
        </th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each colleges as college (college.id)}
        <tr>
          <td>{college.courseName} ({college.courseType})</td>
          <td>{college.collegeName}</td>
          <td>{college.category}</td>
          <td>{college.openingRank}</td>
          <td>{college.closingRank}</td>
          <td>{college.nirfRanking}</td>
          <td>
            <button class="toggle-button" on:click={() => toggleExpand(college.id)}>
              {expandedRow === college.id ? 'Collapse' : 'Expand'}
            </button>
          </td>
        </tr>
        {#if expandedRow === college.id}
          <tr class="expanded-row">
            <td colspan="7">
              <div class="expanded-content">
                <div class="flex flex-col md:flex-row gap-4">
                  <!-- Profile Image -->
                  <div class="flex-shrink-0">
                    <img src={college.profileImage} alt="{college.collegeName} Image" class="rounded-lg w-48 h-36 object-cover" />
                  </div>
                  <!-- College Info -->
                  <div class="flex-1">
                    <a class="font-semibold text-lg mb-2" href="#" target="_blank">{college.collegeName}</a>
                    <div class="mt-4">
                      <p class="font-semibold">Contact Info:</p>
                      <p>📞 {college.contactInfo.phone}</p>
                      <p>✉️ {college.contactInfo.email}</p>
                      <p>📍 {college.contactInfo.address}</p>
                    </div>
                    <div class="mb-2 flex gap-8">
                      <div>
                        <p class="font-semibold">Average Package:</p>
                        <p>{college.avgPkg}</p>
                      </div>
                      <div>
                        <p class="font-semibold">Highest Package:</p>
                        <p>{college.avgPkg}</p> <!-- Ensure this is a different field if applicable -->
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
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
  