<template>
  <section class="scroll-up">
    <div class="scroll-up__wrapper">
      <button v-if="isVisible" @click="scrollToTop">scroll naar boven</button>
    </div>
  </section>
</template>
<script setup>
const isVisible = ref(false);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleScroll = () => {
  isVisible.value = window.scrollY > 300; // Adjust the value as needed
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
<style scoped lang="scss">
$component: "scroll-up";

.#{$component} {
  &__wrapper {
    display: flex;
    justify-content: flex-end;
  }

  button {
    position: fixed;
    background: transparent;
    border: 0;
    cursor: pointer;
    backdrop-filter: blur(5px);
    font-size: 18px;
    font-weight: 700;
    font-family: "syne", "sans-serif";
    ::after {
      content: "↑";
      padding-left: 10px;
    }
  }
}
</style>
