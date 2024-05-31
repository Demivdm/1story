<template>
   <div class="wrapper">
      <button v-if="isVisible" @click="scrollToTop" class="scroll-up-button">scroll naar boven</button>

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
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
 font-family: "syne" , "sans-serif";


}
.scroll-up-button::after {
  content: "↑";
  padding-left: 10px;


}
</style>