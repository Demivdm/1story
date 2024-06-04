<template>
  <section class="buttons">

    <!-- er zijn verschillende links -->
    <!-- het bij een nuxtlink houden is beter want dan blijf je binnen de applicatie en dit is beter voor de performance -->
    <!-- anders moeten de calls naar de db steeds opnieuw aangeroepen worden -->
    <NuxtLink class="custom-link" v-if="to" :to="to">
      <slot></slot>
    </NuxtLink>
  
    <a v-else-if="href" :href="href" :target="target === true ? '_blank': '_self'">
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
      default: ''
    },
    href: {
      type: String,
      default: ''
    },
    target: {
      type: Boolean,
      default: false
    },
    click: {
      type: String,
      default: ""
    }
  });
  </script>
  <style scoped lang="scss" >

  @import "../scss/mixins/_index.scss";
  $component: 'buttons';
  
  .#{$component} {
  a {
    z-index: 1;
    @include primary-button;
  
  }
  button {
    @include primary-button;
    width: max-content;
  
  }
}

  </style>
  