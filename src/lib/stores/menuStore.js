import { writable } from 'svelte/store';

export const isMenuOpen = writable(false);

export const toggleMenu = () => {
  isMenuOpen.update(n => !n);
};
