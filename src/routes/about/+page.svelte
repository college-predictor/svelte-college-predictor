<script>
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faLinkedin, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

  const team = [
    {
      name: 'Ritambhara Chauhan',
      education: 'B.Tech in Computer Science, IIT Madras',
      linkedin: 'https://www.linkedin.com/in/ritambhara-chauhan/',
      twitter: 'https://twitter.com/ritambhara',
      instagram: 'https://facebook.com/ritambhara'
    },
    {
      name: 'Rishika Chauhan',
      education: 'B.Tech in Electronics and Communication Engineering, NIT Puducherry',
      linkedin: 'https://www.linkedin.com/in/rishika-chauhan/',
      twitter: 'https://twitter.com/rishika',
      instagram: 'https://facebook.com/rishika'
    },
    {
      name: 'Sarvesh Singh Chauhan',
      education: 'B.Tech in Civil Engineering, IIT Madras',
      linkedin: 'https://www.linkedin.com/in/sarvesh-singh-chauhan/',
      twitter: 'https://twitter.com/sarvesh',
      instagram: 'https://facebook.com/sarvesh'
    }
  ];
</script>

<div class="bg-gray-100 min-h-screen flex flex-col items-center py-10">
  <h1 class="text-4xl font-bold text-blue-600 mb-6">About Us</h1>
  <p class="text-lg text-gray-700 text-center px-4 mb-10">
    Welcome to our College Predictor website! We aim to simplify the complex college admission process using AI-driven tools and data analytics. 
    Whether you are a student or a parent, our goal is to provide accurate and reliable predictions to help you make informed decisions.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-20">
    {#each team as person}
      <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">{person.name}</h2>
        <p class="text-sm text-gray-600 mb-4">{person.education}</p>
        <div class="flex space-x-4">
          <a href={person.linkedin} target="_blank" class="text-blue-700">
            <FontAwesomeIcon icon={faLinkedin} class="h-6 w-6" />
          </a>
          <a href={person.twitter} target="_blank" class="text-blue-500">
            <FontAwesomeIcon icon={faTwitter} class="h-6 w-6" />
          </a>
          <a href={person.instagram} target="_blank" class="text-pink-800">
            <FontAwesomeIcon icon={faInstagram} class="h-6 w-6" />
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  @import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
</style>
