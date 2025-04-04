<script lang="ts">
  import { goto } from '$app/navigation';

  let subject = 'Physics';
  let difficultyLevel = 'Easy';
  let question = '';
  let option1 = '';
  let option2 = '';
  let option3 = '';
  let option4 = '';
  let correctAnswer = 'option1';
  let description = '';
  let comments = '';

  let questions: any[] = [];

  function handleNextQuestion() {
    // Save current question
    questions.push({
      subject,
      difficultyLevel,
      question,
      options: [option1, option2, option3, option4],
      correctAnswer,
      description,
      comments
    });

    // Reset form for next question
    question = '';
    option1 = '';
    option2 = '';
    option3 = '';
    option4 = '';
    correctAnswer = 'option1';
    description = '';
    comments = '';
  }

  async function handleSubmit() {
    // Add current question if exists
    if (question) {
      handleNextQuestion();
    }

    console.log('All questions submitted:', questions);
    
    // Redirect to home page after submission
    await goto('/');
  }
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-2xl mx-auto">
    <div class="bg-white p-8 rounded-lg shadow">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">JEE Mains Question Form</h2>
        <p class="mt-2 text-gray-600">Add your JEE Mains questions</p>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
            <select
              id="subject"
              bind:value={subject}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>

          <div>
            <label for="difficultyLevel" class="block text-sm font-medium text-gray-700">Difficulty Level</label>
            <select
              id="difficultyLevel"
              bind:value={difficultyLevel}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label for="question" class="block text-sm font-medium text-gray-700">Question</label>
          <textarea
            id="question"
            bind:value={question}
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your question"
            required
          ></textarea>
        </div>

        <div class="space-y-4">
          <div>
            <label for="option1" class="block text-sm font-medium text-gray-700">Option 1</label>
            <input
              type="text"
              id="option1"
              bind:value={option1}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label for="option2" class="block text-sm font-medium text-gray-700">Option 2</label>
            <input
              type="text"
              id="option2"
              bind:value={option2}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label for="option3" class="block text-sm font-medium text-gray-700">Option 3</label>
            <input
              type="text"
              id="option3"
              bind:value={option3}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label for="option4" class="block text-sm font-medium text-gray-700">Option 4</label>
            <input
              type="text"
              id="option4"
              bind:value={option4}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label for="correctAnswer" class="block text-sm font-medium text-gray-700">Correct Answer</label>
          <select
            id="correctAnswer"
            bind:value={correctAnswer}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
            <option value="option4">Option 4</option>
          </select>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            bind:value={description}
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter solution description"
            required
          ></textarea>
        </div>

        <div>
          <label for="comments" class="block text-sm font-medium text-gray-700">Comments</label>
          <textarea
            id="comments"
            bind:value={comments}
            rows="2"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Additional comments"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            on:click={handleNextQuestion}
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Next Question
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit All
          </button>
        </div>
      </form>
    </div>
  </div>
</div>