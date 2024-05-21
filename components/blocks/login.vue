<template>
     <div>
    <h2>Login</h2>
    <span v-if="logoutMessage">{{ logoutMessage }} 
        <ElementsButton>
      <NuxtLink to="/allStories">
        Bekijk andere verhalen
      </NuxtLink>
    </ElementsButton>
    
    </span>
    <span v-if="currentUser">
      Welcome {{ currentUser.displayName }}
      <button @click="logout">Logout</button>
    </span>
    <span v-else>
      <div id="firebaseui-auth-container"></div>
    </span>
  </div>

  </template>
  
  <script lang="ts" setup>
  
  import { EmailAuthProvider, GoogleAuthProvider, signOut, getAuth } from 'firebase/auth';
  import * as firebaseui from 'firebaseui'
  import 'firebaseui/dist/firebaseui.css'
  import { useCurrentUser } from 'vuefire';


  const currentUser = useCurrentUser()
  const logoutMessage = ref('');
  const auth = getAuth();
const router = useRouter();

  const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(useFirebaseAuth());  
  const config = {
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      EmailAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl: "/",
    callbacks: {
      signInSuccessWithAuthResult() {
        console.log("Successfully signed in");
        // window.location = "/";
      },
    },
  }
  const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
    logoutMessage.value = "Je bent uitgelogd";
  } catch (error) {
    console.error("Error signing out: ", error);
    router.push('/404');

  }
};

  onMounted(() => {
    ui.start("#firebaseui-auth-container", config);
  })
  
</script>
