<template>
  <section class="buttons">

    <NuxtLink class="custom-link" v-if="to" :to="to">
      <slot></slot>
    </NuxtLink>
  <!-- wat doet blank en self -->
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
    text-align: center;
    @include secondary-button;
  
  }
  button {
    @include secondary-button;
    width: max-content;
  
  }
}

  </style>
  