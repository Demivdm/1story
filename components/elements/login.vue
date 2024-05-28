<template>
     <div>
    <h2>Login</h2>
        <ElementsButton>
        Bekijk andere verhalen
    </ElementsButton>
      <div id="firebaseui-auth-container"></div>
    
  </div>

  </template>
  <script lang="ts" setup>
  

  import * as firebaseui from 'firebaseui'
  import 'firebaseui/dist/firebaseui.css'
  import { checkAdmin } from '~/firebase/adminLoginUtil';
  import { useIsCurrentUserLoaded } from 'vuefire';

  const isAdmin = ref(false);
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
  const checkisAdmin = async () => {
    const userLoaded = useIsCurrentUserLoaded();
    console.log(userLoaded.value)
    if(userLoaded.value) {
    const currentUser = useCurrentUser();
    console.log(currentUser);
    isAdmin.value = await checkAdmin(db, currentUser.value);

if (isAdmin.value) {
  router.push('/admin');
} else {
  ui.start("#firebaseui-auth-container", config);
}
    }
  }

  onMounted(() => {
    checkisAdmin();
});
  
</script>
