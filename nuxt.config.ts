// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    'nuxt-vuefire',
  ],

  imports: {
    dirs: ['types/*.ts', 'store/*.ts', 'types/**/*.ts'],
  },
  
 vuefire: {
    auth: true, // enable Firebase Authentication
    config: {
      // replace with your own credentials from the Firebase console
      apiKey: "AIzaSyChzZfDPbQrNb1Z6MY27hTpWA2W0pr_b6M",
      authDomain: "one-story-e75fa.firebaseapp.com",
      projectId: "one-story-e75fa",
      storageBucket: "one-story-e75fa.appspot.com",
      messagingSenderId: "564570756931",
      appId: "1:564570756931:web:93941811ddab0741f481f6",
    },
  },
});