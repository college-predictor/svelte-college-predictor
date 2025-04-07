import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';

export default defineConfig({
	plugins: [sveltekit()],
		server: {
		https: {
			key: fs.readFileSync('./key.pem'),
			cert: fs.readFileSync('./cert.pem')
		},
		port: 3000
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
