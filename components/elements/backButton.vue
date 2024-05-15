<template>
    <button @click="goBack">Terug</button>
</template>
<script setup>
const router = useRouter();

const goBack = () => {
  if (window.history.state.back) {
    router.back();
  } else {
    router.push("/index");
  }
};
</script>
