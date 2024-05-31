<template>

    <a class="back" @click="goBack">Terug naar alle verhalen</a>
</template>
<script setup>
const router = useRouter();

const goBack = () => {
  if (window.history.state.back) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>
<style>
.back{
  font-size: 18px;
 font-family: "Syne", sans-serif;
 font-weight: 700;

}
.back::before{
  content: "←";
}
a:hover{
  cursor: pointer;
}
</style>
