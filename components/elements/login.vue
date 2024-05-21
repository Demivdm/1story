<template>
     <div>
    <h2>Login</h2>
        <ElementsButton>
        Bekijk andere verhalen
    </ElementsButton>
      <div id="firebaseui-auth-container"></div>
    
  </div>

  </template>
  <style lang="sass" scoped>
  
  </style>
  
  <script lang="ts" setup>
  
  import { EmailAuthProvider, GoogleAuthProvider, signOut, getAuth } from 'firebase/auth';
  import * as firebaseui from 'firebaseui'
  import 'firebaseui/dist/firebaseui.css'
  import { useCurrentUser } from 'vuefire';


  const currentUser = useCurrentUser()
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
        // router.push('/writeStory');
        console.log("Successfully signed in");
     
      },
    },
  }

onMounted(() => {
  if (currentUser.value) {
    router.push('/');
  } else {
    ui.start("#firebaseui-auth-container", config);
  }
});
  
</script>
