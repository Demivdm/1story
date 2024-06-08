<template>
  <section class="button">
    <NuxtLink class="custom-link" v-if="to" :to="to">
      <slot></slot>
    </NuxtLink>
    <a
      v-else-if="href"
      :href="href"
      :target="target === true ? '_blank' : '_self'"
    >
      <slot></slot>
    </a>

    <button v-else>
      <slot></slot>
    </button>
  </section>
</template>

<script setup>
// props en types doorgeven
const props = defineProps({
  to: {
    type: String,
    default: "",
  },
  href: {
    type: String,
    default: "",
  },
  target: {
    type: Boolean,
    default: false,
  },
  click: {
    type: String,
    default: "",
  },
});
</script>
<style scoped lang="scss">
@import "../scss/mixins/_index.scss";
$component: "button";

.#{$component} {
  a {
    z-index: 1;
    text-align: center;
    @include secondary-button;
  }
  button{
    @include secondary-button;
  }
}
</style>
