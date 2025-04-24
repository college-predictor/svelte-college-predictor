<script lang="ts">
    import { faClipboardList, faUniversity, faUserGraduate, faCalendarAlt, faChartLine, faTimes } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
    import HomeCard from '../HomeCard.svelte';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';

    let showModal = false;
    let selectedData: any = null;
    let selectedTitle = '';
    let activeTab = 0; // Default to Overview tab
    let activeYear = 0; // Default to the most recent year (2023)

    // Available years for the data
    const years = [2023, 2022, 2021, 2020, 2019];

    function handleCardClick(title: string, data: any) {
      selectedTitle = title;
      selectedData = data;
      showModal = true;
    }

    function closeModal() {
      showModal = false;
    }

    // Handle ESC key press to close modal
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape' && showModal) {
        closeModal();
      }
    }

    // Add global keyboard event listener
    onMount(() => {
      window.addEventListener('keydown', handleKeydown);
      return () => {
        window.removeEventListener('keydown', handleKeydown);
      };
    });

    const services = [
      {
        title: 'Overview',
        description: 'Get comprehensive information about JEE and NEET exams.',
        icon: faUserGraduate,
        link: "/overview",
        data: {
          tableData: [
            { parameter: "Exam Name", value: "JEE Main" },
            { parameter: "Conducting Body", value: "National Testing Agency (NTA)" },
            { parameter: "Frequency", value: "Twice a year (January & April)" },
            { parameter: "Mode", value: "Computer Based Test" },
            { parameter: "Duration", value: "3 hours" },
            { parameter: "Total Marks", value: "300" }
          ],
          description: "The Joint Entrance Examination (JEE) Main is an engineering entrance assessment conducted for admission to various engineering colleges in India. It is constituted by two different examinations: JEE Main and the JEE Advanced."
        }
      },
      {
        title: 'Exam Pattern',
        description: 'Understand the structure and format of entrance exams.',
        icon: faChartLine,
        link: "/exam-pattern",
        data: {
          tableData: [
            { section: "Physics", questions: 25, marks: 100, negativeMarking: "-1 for incorrect" },
            { section: "Chemistry", questions: 25, marks: 100, negativeMarking: "-1 for incorrect" },
            { section: "Mathematics", questions: 25, marks: 100, negativeMarking: "-1 for incorrect" }
          ],
          description: "JEE Main Paper 1 consists of 90 questions worth a total of 300 marks. Each subject - Physics, Chemistry, and Mathematics - contains 30 questions. The paper includes both MCQs and numerical value questions."
        }
      },
      {
        title: 'Calendar',
        description: 'Important dates for exams, results, and counseling sessions.',
        icon: faCalendarAlt,
        link: "/calendar",
        data: {
          tableData: [
            { event: "Application Form Release", date: "December 15, 2023" },
            { event: "Last Date to Apply", date: "January 12, 2024" },
            { event: "Admit Card Release", date: "January 20, 2024" },
            { event: "Exam Date (Session 1)", date: "January 24-31, 2024" },
            { event: "Result Declaration", date: "February 12, 2024" },
            { event: "Counselling Starts", date: "June 10, 2024" }
          ],
          description: "The JEE Main exam is conducted in multiple sessions throughout the year. The first session typically occurs in January, while the second session takes place in April. Candidates can appear in either one or both sessions."
        }
      },
      {
        title: 'Eligibility',
        description: 'Check if you meet the criteria for various engineering programs.',
        icon: faClipboardList,
        link: "/eligibility",
        data: {
          tableData: [
            { criteria: "Age Limit", requirement: "No age limit" },
            { criteria: "Qualifying Exam", requirement: "10+2 or equivalent" },
            { criteria: "Minimum Percentage", requirement: "75% (Gen/OBC), 65% (SC/ST)" },
            { criteria: "Subject Requirements", requirement: "Physics, Chemistry, Mathematics" },
            { criteria: "Number of Attempts", requirement: "Maximum 3 attempts" }
          ],
          description: "To be eligible for admission to NITs, IIITs, and CFTIs, candidates must have secured at least 75% marks in their 12th class examination, or be in the top 20 percentile in their qualifying examination. For SC/ST candidates, the qualifying marks are 65%."
        }
      },
      {
        title: 'Cut Off',
        description: 'Only those students who meet the JEE Main qualifying cutoff can appear in JEE Advanced.JEE Main Qualifying Cutoff is released by NTA on the exam’s official website.',
        icon: faUniversity,
        link: "/cutoff",
        data: {
          description: "Cutoff ranks vary each year based on factors like exam difficulty, number of applicants, and available seats. The data provided is approximate and based on previous year trends. Always check the official JOSAA website for the most accurate information.",
          yearData: {
            2023: {
              tableData: [
                { category: "Unreserved (UR)", cutoff: "93.1023262" },
                { category: "Gen-EWS", cutoff: "80.3830119" },
                { category: "OBC-NCL", cutoff: "79.4313582" },
                { category: "SC", cutoff: "61.1526933" },
                { category: "ST", cutoff: "47.9026465" },
                { category: "UR-PwD", cutoff: "0.0079349" }
              ],
              note: "2023 cutoffs were slightly higher due to increased competition."
            },
            2022: {
              tableData: [
                { category: "Unreserved (UR)", cutoff: "88.4121383" },
                { category: "Gen-EWS", cutoff: "76.2212495" },
                { category: "OBC-NCL", cutoff: "75.1145323" },
                { category: "SC", cutoff: "58.1912568" },
                { category: "ST", cutoff: "44.3341223" },
                { category: "UR-PwD", cutoff: "0.0064528" }
              ],
              note: "2022 saw more competitive cutoffs due to higher exam scores overall."
            },
            2021: {
              tableData: [
                { category: "Unreserved (UR)", cutoff: "90.3765432" },
                { category: "Gen-EWS", cutoff: "78.4567891" },
                { category: "OBC-NCL", cutoff: "77.3456789" },
                { category: "SC", cutoff: "59.8765432" },
                { category: "ST", cutoff: "45.6789123" },
                { category: "UR-PwD", cutoff: "0.0071234" }
              ],
              note: "2021 cutoffs were affected by the COVID-19 pandemic and changes in exam pattern."
            },
            2020: {
              tableData: [
                { category: "Unreserved (UR)", cutoff: "91.2345678" },
                { category: "Gen-EWS", cutoff: "79.1234567" },
                { category: "OBC-NCL", cutoff: "78.2345678" },
                { category: "SC", cutoff: "60.3456789" },
                { category: "ST", cutoff: "46.4567891" },
                { category: "UR-PwD", cutoff: "0.0073456" }
              ],
              note: "2020 saw significant changes in admission patterns due to the pandemic."
            },
            2019: {
              tableData: [
                { category: "Unreserved (UR)", cutoff: "89.7654321" },
                { category: "Gen-EWS", cutoff: "77.6543219" },
                { category: "OBC-NCL", cutoff: "76.5432198" },
                { category: "SC", cutoff: "57.6543219" },
                { category: "ST", cutoff: "43.2198765" },
                { category: "UR-PwD", cutoff: "0.0067891" }
              ],
              note: "2019 was the last pre-pandemic year with normal admission patterns."
            }
          },
          tableData: [] // Keep this for backward compatibility
        }
      },
    ];
  </script>

  <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-10 relative overflow-hidden">
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
    <div class="w-full max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 text-center relative z-10">
      <div class="max-w-3xl mx-auto mb-3">
        <h4 class="text-2xl md:text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Exam Information</h4>
        <p class="text-gray-600 text-lg">Empowering your educational journey with cutting-edge AI solutions</p>
      </div>
      <div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-10xl mx-auto">
        {#each services as { title, description, icon, link, data }, index}
          <HomeCard
            {title}
            {description}
            {icon}
            {link}
            {data}
            {index}
            isActive={activeTab === index}
            on:select={({ detail }) => activeTab = detail.index}
          />
        {/each}
      </div>

      <!-- Data Section with Tabs -->
      <div class="mt-5 md:mt-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg w-full max-w-[1800px] mx-auto border border-indigo-100 overflow-hidden">
        <!-- Service Tabs Navigation -->
        <div class="flex overflow-x-auto scrollbar-hide border-b border-indigo-100 bg-indigo-50/50">
          <div class="flex w-full md:justify-center">
            {#each services as service, index}
              <button
                class="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-1"
                class:text-indigo-600={activeTab === index}
                class:text-gray-500={activeTab !== index}
                class:border-b-2={activeTab === index}
                class:border-indigo-500={activeTab === index}
                class:bg-white={activeTab === index}
                class:hover:bg-indigo-50={activeTab !== index}
                on:click={() => activeTab = index}
              >
                {service.title}
              </button>
            {/each}
          </div>
        </div>

        <!-- Year Tabs Navigation (only for services with yearData) -->
        {#if services[activeTab]?.data?.yearData}
          <div class="flex overflow-x-auto scrollbar-hide border-b border-indigo-100 bg-white">
            <div class="flex w-full justify-center">
              {#each years as year, yearIndex}
                {#if services[activeTab].data.yearData[year]}
                  <button
                    class="px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors duration-200 focus:outline-none"
                    class:text-indigo-600={activeYear === yearIndex}
                    class:text-gray-500={activeYear !== yearIndex}
                    class:border-b-2={activeYear === yearIndex}
                    class:border-indigo-500={activeYear === yearIndex}
                    class:font-bold={activeYear === yearIndex}
                    class:hover:bg-indigo-50={activeYear !== yearIndex}
                    on:click={() => activeYear = yearIndex}
                  >
                    {year}
                  </button>
                {/if}
              {/each}
            </div>
          </div>
        {/if}

        <!-- Tab Content -->
        <div class="p-4 sm:p-6 md:p-8">
          {#each services as service, index}
            {#if activeTab === index}
              <div transition:fade={{ duration: 150 }}>
                <h3 class="text-xl sm:text-2xl font-bold text-indigo-800 mb-3 sm:mb-4">{service.title}</h3>

                <!-- Description -->
                <div class="mb-4 sm:mb-6">
                  <p class="text-sm sm:text-base text-gray-700">{service.data.description}</p>
                </div>

                <!-- Year-specific data if available -->
                {#if service.data.yearData}
                  {#each years as year, yearIndex}
                    {#if activeYear === yearIndex && service.data.yearData[year]}
                      <div transition:fade={{ duration: 150 }}>
                        <!-- Year-specific note if available -->
                        {#if service.data.yearData[year].note}
                          <div class="mb-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                            <p class="text-sm text-indigo-700">
                              <span class="font-semibold">{year} Note:</span> {service.data.yearData[year].note}
                            </p>
                          </div>
                        {/if}

                        <!-- Year-specific table data -->
                        {#if service.data.yearData[year].tableData && service.data.yearData[year].tableData.length > 0}
                          <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200 border">
                              <thead class="bg-indigo-50">
                                <tr>
                                  {#each Object.keys(service.data.yearData[year].tableData[0]) as header}
                                    <th class="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                                      {header}
                                    </th>
                                  {/each}
                                </tr>
                              </thead>
                              <tbody class="bg-white divide-y divide-gray-200">
                                {#each service.data.yearData[year].tableData as row}
                                  <tr class="hover:bg-indigo-50/50 transition-colors duration-150">
                                    {#each Object.values(row) as cell}
                                      <td class="px-4 py-3 text-sm text-gray-700">{cell}</td>
                                    {/each}
                                  </tr>
                                {/each}
                              </tbody>
                            </table>
                          </div>
                        {/if}
                      </div>
                    {/if}
                  {/each}
                <!-- Regular table data if no year data is available -->
                {:else if service.data.tableData && service.data.tableData.length > 0}
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 border">
                      <thead class="bg-indigo-50">
                        <tr>
                          {#each Object.keys(service.data.tableData[0]) as header}
                            <th class="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                              {header}
                            </th>
                          {/each}
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        {#each service.data.tableData as row}
                          <tr class="hover:bg-indigo-50/50 transition-colors duration-150">
                            {#each Object.values(row) as cell}
                              <td class="px-4 py-3 text-sm text-gray-700">{cell}</td>
                            {/each}
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Data Modal -->
  {#if showModal}
    <!-- Modal backdrop -->
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      transition:fade={{ duration: 200 }}
      on:click={closeModal}
      on:keydown={() => {}}
      role="presentation"
    ></div>

    <!-- Modal dialog -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
        transition:fade={{ duration: 150, delay: 50 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabindex="-1"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h3 id="modal-title" class="text-xl font-bold text-gray-900">{selectedTitle}</h3>
          <button
            class="text-gray-500 hover:text-gray-700"
            on:click={closeModal}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          {#if selectedData}
            <!-- Description -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-2 text-indigo-700">Description</h4>
              <p class="text-gray-700">{selectedData.description}</p>
            </div>

            <!-- Table Data -->
            {#if selectedData.tableData && selectedData.tableData.length > 0}
              <div>
                <h4 class="text-lg font-semibold mb-2 text-indigo-700">Details</h4>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200 border">
                    <thead class="bg-gray-50">
                      <tr>
                        {#each Object.keys(selectedData.tableData[0]) as header}
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                          </th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      {#each selectedData.tableData as row}
                        <tr class="hover:bg-gray-50">
                          {#each Object.values(row) as cell}
                            <td class="px-4 py-3 text-sm text-gray-700">{cell}</td>
                          {/each}
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  {/if}

<style>
  .bg-grid-pattern {
    background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px),
      linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
    background-size: 20px 20px;
  }
</style>
