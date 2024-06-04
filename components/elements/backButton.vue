<template>
  <a class="back back__desktop" @click="goBack">Terug naar alle verhalen</a>
  <a class="back back__mobile" @click="goBack">verhalen</a>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  if (window.history.state.back) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>

<style scoped lang="scss">
@import "/scss/vars/_breakpoints.scss";

$component: 'back';

.#{$component} {
  
  font-size: 18px;
  font-family: "Syne", sans-serif;
  font-weight: 700;
  position: absolute;
  top: 2.5rem;
  cursor: pointer;

  &:before {
    content: "←";
    margin-right: 0.5rem;
  }

  &__desktop {
    display: block;
    @include sm {
      display: none;
    }
  }

  &__mobile {
    display: none;
    @include sm {
      display: block;
    }
  }
}
</style>
