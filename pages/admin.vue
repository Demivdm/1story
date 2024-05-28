<template>
  <div>
    <div v-if="isAdmin">
      <h1>Welkom Admin!</h1>
    </div>
    <div v-else>
      <p>
        Dit is de admin pagina, ga terug naar de homepage of login als admin
      </p>
     
    </div>
  </div>
  <ElementsBackButton> Terug </ElementsBackButton>
</template>

<script setup lang="ts">
import { getFirestore } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { checkAdmin } from "@/firebase/adminLoginUtil"; // Adjust the path based on your project structure

definePageMeta({
  middleware: ["auth"],
});

const currentUser = useCurrentUser();
const db = getFirestore();
const router = useRouter();
const isAdmin = ref(false);

if (currentUser.value) {
  isAdmin.value = await checkAdmin(db, currentUser.value.uid);
} else {
  // Redirect to login if no user is logged in
  console.log("niet ingelogd");
}
</script>
