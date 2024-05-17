<template>
   <div class="wrapper">
      <button v-if="isVisible" @click="scrollToTop" class="scroll-up-button">scroll up</button>

   </div>

</template>
<script setup>

const isVisible = ref(false);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const handleScroll = () => {
  isVisible.value = window.scrollY > 300; // Adjust the value as needed
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
<style>
.wrapper{
   display: flex;
   justify-content: flex-end;
}
.scroll-up-button {
  position: fixed;

}
</style>