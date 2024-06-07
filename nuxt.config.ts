// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    'nuxt-vuefire',
  ],
  css: ["../scss/_index.scss"],
  app: {
    head: {
      title: 'One story', 
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Explore captivating stories with our Nuxt.js application. Each story is uniquely highlighted with vibrant colors and enriched with engaging sentences to connect and inspire our community.' }
     
      ],
      htmlAttrs: {
        lang: 'nl', 
      }
    }
  },

  imports: {

    dirs: ['types/*.ts', 'store/*.ts', 'types/**/*.ts'],
    presets: [
      {
        from: '~/firebase',
        imports: ['db']
      },
      {
        from: 'firebase/firestore',
        imports: ['collection', 'onSnapshot', 'addDoc',
          'query',
          'where',
          'orderBy',
          'limit',
          'getDocs',
          'updateDoc',
          'doc',
          'serverTimestamp']
      },
      {
        from: 'vue',
        imports: ['onMounted', 'ref', 'watch', 'defineProps']
      },
    
      {
        from: 'firebase/auth',
        imports: ['signOut', 'EmailAuthProvider', 'getAuth', 'GoogleAuthProvider']
      },
    ]
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