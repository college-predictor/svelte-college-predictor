<script lang="ts">
	import { goto } from '$app/navigation';

	// JEE Details Form State
	let gender = 'Male';
	let category = 'OPEN';
	let mainsGenRank = '';
	let mainsCatRank = '';
	let showAdvancedRanks = false;
	let advGenRank = '';
	let advCatRank = '';
	let state = 'Rajasthan';

	let allStates: string[] = [
		'Uttarakhand',
		'Tamil Nadu',
		'Chandigarh',
		'Uttar Pradesh',
		'Karnataka',
		'Chhattisgarh',
		'Tripura',
		'Odisha',
		'Rajasthan',
		'Meghalaya',
		'Sikkim',
		'Haryana',
		'Diu',
		'Punjab',
		'Kerala',
		'Himachal Pradesh',
		'Mizoram',
		'Andhra Pradesh',
		'Madhya Pradesh',
		'Jharkhand',
		'Goa',
		'Arunachal Pradesh',
		'Nagaland',
		'Jammu & Kashmir',
		'Maharashtra',
		'Gujarat',
		'Puducherry',
		'Manipur',
		'West Bengal',
		'Bihar',
		'Delhi',
		'Assam',
		'Telangana'
	];

	$: isCategoryOpen = category === 'OPEN';

	const submitJeeForm = (e: Event) => {
		e.preventDefault();
		const formData: Record<string, string | number | null> = {
			gender,
			category,
			state,
			mains_gen_rank: mainsGenRank ? Number(mainsGenRank) : null,
			mains_cat_rank: !isCategoryOpen && mainsCatRank ? Number(mainsCatRank) : null,
			adv_gen_rank: advGenRank ? Number(advGenRank) : null,
			adv_cat_rank: !isCategoryOpen && advCatRank ? Number(advCatRank) : null
		};

		const filteredFormData: Record<string, string | number> = {};
		Object.entries(formData).forEach(([key, value]) => {
			if (value !== null && value !== undefined && value !== '') {
				filteredFormData[key] = value;
			}
		});

		const params = new URLSearchParams();
		Object.entries(filteredFormData).forEach(([key, value]) => {
			params.append(key, value.toString());
		});

		console.log('Navigating with query params:', params.toString());
		goto(`college-list?${params.toString()}`);
	};
</script>

<!-- JEE Details Section -->
<section class="m-2 text-black sm:m-4">
	<div class="mx-auto max-w-3xl">
		<div
			class="rounded-lg bg-white bg-gradient-to-br from-blue-50 to-indigo-100 p-4 shadow-lg sm:p-6"
		>
			<!-- Header -->
			<h2 class="mb-4 text-center text-xl font-bold text-indigo-800 sm:text-2xl">
				Enter Your JEE Details
			</h2>

			<!-- Form -->
			<form on:submit|preventDefault={submitJeeForm} class="space-y-4 sm:space-y-6">
				<!-- Basic Info -->
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
					<div>
						<label for="gender" class="mb-1 block text-sm font-medium text-gray-700">Gender</label>
						<select
							id="gender"
							class="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-700 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
							bind:value={gender}
						>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
					</div>
					<div>
						<label for="category" class="mb-1 block text-sm font-medium text-gray-700"
							>Category</label
						>
						<select
							id="category"
							class="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-700 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
							bind:value={category}
						>
							<option value="OPEN">OPEN</option>
							<option value="OPEN (PwD)">OPEN (PwD)</option>
							<option value="EWS">EWS</option>
							<option value="EWS (PwD)">EWS (PwD)</option>
							<option value="OBC-NCL">OBC-NCL</option>
							<option value="OBC-NCL (PwD)">OBC-NCL (PwD)</option>
							<option value="SC">SC</option>
							<option value="SC (PwD)">SC (PwD)</option>
							<option value="ST">ST</option>
							<option value="ST (PwD)">ST (PwD)</option>
						</select>
					</div>
					<div>
						<label for="state" class="mb-1 block text-sm font-medium text-gray-700">Home State</label>
						<select
							id="state"
							class="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-700 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
							bind:value={state}
						>
							{#each allStates as s}
								<option value={s}>{s}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Mains Ranks -->
				<div
					class="grid grid-cols-1 gap-3 rounded-md bg-gray-50 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4"
				>
					<div>
						<label for="mainsGenRank" class="mb-1 block text-sm font-medium text-gray-700"
							>JEE Mains General Rank</label
						>
						<input
							id="mainsGenRank"
							type="number"
							min="1"
							placeholder="e.g., 12345"
							class="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500"
							bind:value={mainsGenRank}
						/>
					</div>
					<div class="fade-in">
						<label for="mainsCatRank" class="mb-1 block text-sm font-medium text-gray-700"
							>JEE Mains Category Rank</label
						>
						<input
							id="mainsCatRank"
							type="number"
							min="1"
							placeholder="e.g., 6789"
							class="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500 {isCategoryOpen ? 'bg-gray-100 cursor-not-allowed' : ''}"
							bind:value={mainsCatRank}
							disabled={isCategoryOpen}
							title={isCategoryOpen ? 'Not applicable for OPEN category' : ''}
							hover="Not applicable for OPEN category"
						/>
					</div>
				</div>

				<!-- Advanced Ranks Toggle -->
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						id="toggleAdvanced"
						class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						bind:checked={showAdvancedRanks}
					/>
					<label for="toggleAdvanced" class="text-sm font-medium text-gray-700"
						>Add JEE Advanced Ranks</label
					>
				</div>

				{#if showAdvancedRanks}
					<div
						class="fade-in grid grid-cols-1 gap-3 rounded-md bg-gray-50 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4"
					>
						<div>
							<label for="advGenRank" class="mb-1 block text-sm font-medium text-gray-700"
								>JEE Advanced General Rank</label
							>
							<input
								id="advGenRank"
								type="number"
								min="1"
								placeholder="e.g., 2345"
								class="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500"
								bind:value={advGenRank}
							/>
						</div>
						<div class="fade-in">
							<label for="advCatRank" class="mb-1 block text-sm font-medium text-gray-700"
								>JEE Advanced Category Rank</label
							>
							<input
								id="advCatRank"
								type="number"
								min="1"
								placeholder="e.g., 890"
								class="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500 {isCategoryOpen ? 'bg-gray-100 cursor-not-allowed' : ''}"
								bind:value={advCatRank}
								disabled={isCategoryOpen}
								title={isCategoryOpen ? 'Not applicable for OPEN category' : ''}
							/>
						</div>
					</div>
				{/if}

				<!-- Submit Button -->
				<div class="text-center">
					<button
						type="submit"
						class="w-full rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					>
						Find Colleges
					</button>
				</div>
			</form>
		</div>
	</div>
</section>

<style>
	.fade-in {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Input and select visuals */
	input,
	select {
		transition: all 0.2s ease;
	}

	input:focus,
	select:focus {
		box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Mobile-specific adjustments */
	@media (max-width: 640px) {
		section {
			margin: 1rem; /* Reduced margin for mobile */
		}
		.max-w-3xl {
			max-width: 100%; /* Full width on mobile */
		}
		.p-4 {
			padding: 1rem; /* Smaller padding */
		}
		h2 {
			font-size: 1.25rem; /* Smaller header */
			margin-bottom: 1rem;
		}
		.space-y-4 {
			space-y: 1rem; /* Tighter spacing */
		}
		.gap-3 {
			gap: 0.75rem; /* Smaller gaps */
		}
		input,
		select {
			padding: 0.625rem; /* Slightly smaller padding for inputs */
			font-size: 0.875rem; /* 14px for readability */
		}
		button {
			padding: 0.625rem 1.5rem; /* Adjusted button size */
			font-size: 0.875rem;
		}
	}
</style>
