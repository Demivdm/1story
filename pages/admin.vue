<template>
  <div class="admin">
    <div v-if="isAdmin">
      <h1>Welkom Admin!</h1>
      <p>Het is tijd om het verhaal van de maand te publiceren. Mocht er iets aangepast moeten worden, kun je het nu nog veranderen. Wanneer je helemaal tevreden bent, kun je het verhaal verzenden.</p>
      <ElementsButton to="adminDetail">
        Controleer het verhaal
      </ElementsButton>
    </div>
    <div v-else>
      <p>
        Dit is de admin pagina, ga terug naar de homepage of login als admin
      </p>
     
    </div>
  </div>
  <ElementsBackButton> Terug naar de homepage </ElementsBackButton>
</template>

<script setup lang="ts">
import { getFirestore } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { checkAdmin } from "@/firebase/adminLoginUtil"; 

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
  router.push("/");
  
}
</script>
<style lang="scss" scoped>

 $component: "admin";

 .#{$component}{
height: 100vh;
display: grid;
    place-items: center;
  

 }
</style>
