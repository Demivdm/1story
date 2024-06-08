<template>
  <span v-if="currentUser" class="logout">
    <ElementsButton :user="currentUser" @click="logout" class="logout-button">
      Logout
    </ElementsButton>
    <p>{{ logoutMessage }}</p>
  </span>
</template>

<script setup lang="ts">
const auth = getAuth();
const router = useRouter();
const logoutMessage = ref("");
const currentUser = useCurrentUser();

const logout = async () => {
  try {
    await signOut(auth);
    logoutMessage.value = "Logging out";
    setTimeout(() => {
      router.push("/");
      logoutMessage.value = "";
    }, 5000);
  } catch (error) {
    console.error("Error signing out: ", error);
    router.push("/404");
  }
};
</script>
<style scoped lang="scss">
$component: "logout";

#{$component} {
  &__logout-button {
    &__button {
      position: relative;
      border-radius: 0;
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
      height: 2rem;
      width: 100px;
    }
  }
}
</style>
