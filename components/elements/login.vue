<template>
  <section class="login__modal">
    <div id="firebaseui-auth-container">
      <h2>Login</h2>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getAuth,
  GoogleAuthProvider,
  EmailAuthProvider,
  getRedirectResult,
} from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { checkAdmin } from "~/firebase/adminLoginUtil";
import {
  useCurrentUser,
  useFirebaseAuth,
  useIsCurrentUserLoaded,
} from "vuefire";

const isAdmin = ref(false);
const router = useRouter();
const auth = getAuth();
const ui =
  firebaseui.auth.AuthUI.getInstance() ||
  new firebaseui.auth.AuthUI(useFirebaseAuth());

const config = {
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult() {
      console.log("Successfully signed in");
      checkIsAdmin();
      return false;
    },
  },
};

const checkIsAdmin = async () => {
  const userLoaded = useIsCurrentUserLoaded();

  if (userLoaded.value) {
    const currentUser = useCurrentUser();
    console.log("Current User:", currentUser.value);
    if (currentUser.value && currentUser.value.uid) {
      try {
        isAdmin.value = await checkAdmin(db, currentUser.value.uid);
        console.log("Is Admin:", isAdmin.value);
        if (isAdmin.value) {
          router.push("/admin");
        } else {
          // stuur door naar login pagina als gebruiker geen admin is
          // dit is waarschijnlijk ook waardoor je niet meer op de homepage kan komen
          router.push("/loginPage"); 
          console.log("geen admin");
        }
       
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    } else {
      ui.start("#firebaseui-auth-container", config); // Start Firebase UI if user not loaded
    }
  }
};

onMounted(() => {
  getRedirectResult(auth)
    .then((result) => {
      if (result.user) {
        console.log("Redirect result user:", result.user);
        checkIsAdmin(); // Re-check admin status after redirect
      } else {
        ui.start("#firebaseui-auth-container", config); // Start Firebase UI if no user from redirect
      }
    })
    .catch((error) => {
      console.error("Error during sign-in redirect:", error);
      ui.start("#firebaseui-auth-container", config); // Start Firebase UI in case of error
    });
});
</script>

<style lang="scss">
@import "/scss/mixins/_index.scss";

$component: "login-modal";

#{component} {
  height: 100vh;
  width: 100vw;
}
#firebaseui-auth-container {
  height: 50vh;
  width: 30vw;
  border-radius: 24px;
  display: flex;
  align-items: center;
  position: relative;
  margin: auto;
  flex-direction: column;
  justify-content: center;
  @include primary-gradient;
}
</style>
