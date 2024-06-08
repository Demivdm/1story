<template>
  <section class="button">
    <!-- er zijn verschillende links -->
    <!-- het bij een nuxtlink houden is beter want dan blijf je binnen de applicatie en dit is beter voor de performance -->
    <!-- anders moeten de calls naar de db steeds opnieuw aangeroepen worden -->
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

    <button v-else :disabled="disabled">
      <slot></slot>
    </button>
  </section>
</template>

<script setup lang="ts">
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
  disabled: {
    type: Boolean,
    required: false,
  },
});
</script>
<style scoped lang="scss">
@import "../scss/mixins/_index.scss";
$component: "button";

.#{$component} {

  @include sm{
    width: 100%;
  }
  a {
    z-index: 1;
    text-align: center;
    padding: 1rem;
    @include primary-button;
  }
  button {
    @include primary-button;
    // width: max-content;
    &:disabled {
      opacity: 0.5;
    }
  }

}
</style>
