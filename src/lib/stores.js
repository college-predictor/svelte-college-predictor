// src/lib/stores.js
import { writable } from 'svelte/store';
import Cookies from 'js-cookie';

const chatCookie = Cookies.get('chat');
const initialChat = chatCookie ? JSON.parse(chatCookie) : [];

export const chatStore = writable(initialChat);

chatStore.subscribe((value) => {
  Cookies.set('chat', JSON.stringify(value), { expires: 7 });
});
