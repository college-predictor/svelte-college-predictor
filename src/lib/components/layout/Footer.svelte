<script>
  import { faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';
  import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  const currentYear = new Date().getFullYear();

  // Footer navigation links
  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'About Us', href: '/about' },
    { title: 'Services', href: '/services' },
    { title: 'Blog', href: '/blog' },
    { title: 'Contact', href: '/contact' },
  ];

  // Resources links
  const resourceLinks = [
    { title: 'JEE Resources', href: '/resources/jee' },
    { title: 'NEET Resources', href: '/resources/neet' },
    { title: 'College Rankings', href: '/rankings' },
    { title: 'Counselling Guide', href: '/guide' },
    { title: 'FAQ', href: '/faq' },
  ];

  // Social media links
  const socialLinks = [
    { icon: faFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: faTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: faInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: faLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: faYoutube, href: 'https://youtube.com', label: 'YouTube' },
  ];
</script>

<footer class="bg-gradient-to-b from-indigo-900 to-blue-950 text-white">
  <!-- Main Footer Content -->
  <div class="container mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Company Info -->
      <div class="space-y-4">
        <div class="flex items-center">
          <div class="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 shadow-sm transition-all duration-300 hover:shadow-md">
            <img src="assets/logo_light.webp" alt="College Predictor Logo" class="h-7 w-7 transition-transform duration-300 hover:scale-105" />
          </div>
          <h3 class="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200">College Predictor</h3>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">
          Empowering students to make informed decisions about their academic future through AI-powered guidance and personalized recommendations.
        </p>
        <div class="flex space-x-4 pt-2">
          {#each socialLinks as { icon, href, label }}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors duration-300"
              aria-label={label}
            >
              <FontAwesomeIcon {icon} class="h-5 w-5" />
            </a>
          {/each}
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h4 class="text-lg font-semibold mb-4 text-indigo-300">Quick Links</h4>
        <ul class="space-y-2">
          {#each navLinks as { title, href }}
            <li>
              <a
                {href}
                class="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center"
              >
                <span class="mr-2 text-xs">›</span> {title}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Resources -->
      <div>
        <h4 class="text-lg font-semibold mb-4 text-indigo-300">Resources</h4>
        <ul class="space-y-2">
          {#each resourceLinks as { title, href }}
            <li>
              <a
                {href}
                class="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center"
              >
                <span class="mr-2 text-xs">›</span> {title}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Contact Info -->
      <div>
        <h4 class="text-lg font-semibold mb-4 text-indigo-300">Contact Us</h4>
        <ul class="space-y-3">
          <li class="flex items-start">
            <FontAwesomeIcon icon={faMapMarkerAlt} class="h-5 w-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" />
            <span class="text-sm text-gray-300">123 Education Street, Knowledge City, India - 110001</span>
          </li>
          <li class="flex items-center">
            <FontAwesomeIcon icon={faPhone} class="h-4 w-4 text-indigo-400 mr-3 flex-shrink-0" />
            <a href="tel:+911234567890" class="text-sm text-gray-300 hover:text-white transition-colors duration-300">+91 123 456 7890</a>
          </li>
          <li class="flex items-center">
            <FontAwesomeIcon icon={faEnvelope} class="h-4 w-4 text-indigo-400 mr-3 flex-shrink-0" />
            <a href="mailto:info@collegepredictor.com" class="text-sm text-gray-300 hover:text-white transition-colors duration-300">info@collegepredictor.com</a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Footer Bottom -->
  <div class="border-t border-blue-800/50">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-400">&copy; {currentYear} College Predictor. All rights reserved.</p>
        <div class="mt-4 md:mt-0 flex space-x-6">
          <a href="/privacy" class="text-xs text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
          <a href="/terms" class="text-xs text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
          <a href="/sitemap" class="text-xs text-gray-400 hover:text-white transition-colors duration-300">Sitemap</a>
        </div>
      </div>
    </div>
  </div>
</footer>
