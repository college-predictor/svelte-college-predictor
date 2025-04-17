<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-16">
  <div class="container mx-auto px-4">
    <div class="mx-auto max-w-2xl text-center">
      

      <div class="grid gap-8 md:grid-cols-2">
        
        <!-- UPI Payment Section -->
        <div
          class="rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
          transition:fade
        >
          <div class="mb-4 text-2xl">💸</div>
          <h2 class="mb-3 text-xl font-semibold text-gray-800">UPI Payment</h2>
          <p class="mb-6 text-gray-600">
            Support us directly through UPI payment. Quick and secure!
          </p>
          <div class="flex flex-col items-center space-y-4">
            <div class="rounded-2xl bg-white p-4 shadow-md">
              <img
                src="/assets/qr.jpg"
                alt="UPI QR Code"
                class="h-64 w-64 rounded-lg shadow-sm"
              />
            </div>
            <div class="text-center">
              <p class="mb-2 text-sm text-gray-600">Scan QR code or use UPI ID:</p>
              <div class="inline-flex items-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:shadow-md">
                <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span class="font-mono">rishika.chnn@oksbi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <h3 class="mb-4 text-xl font-semibold text-gray-800">Why Support Us?</h3>
        <div class="grid gap-6 md:grid-cols-3">
          <div class="rounded-lg bg-white p-4 shadow-md">
            <div class="mb-2 text-xl">🚀</div>
            <h4 class="mb-2 font-medium text-gray-800">Keep Us Running</h4>
            <p class="text-sm text-gray-600">Help us maintain and improve our servers and infrastructure.</p>
          </div>
          <div class="rounded-lg bg-white p-4 shadow-md">
            <div class="mb-2 text-xl">✨</div>
            <h4 class="mb-2 font-medium text-gray-800">New Features</h4>
            <p class="text-sm text-gray-600">Enable us to develop new features and tools for students.</p>
          </div>
          <div class="rounded-lg bg-white p-4 shadow-md">
            <div class="mb-2 text-xl">📚</div>
            <h4 class="mb-2 font-medium text-gray-800">Better Content</h4>
            <p class="text-sm text-gray-600">Support us in creating more educational content and resources.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>