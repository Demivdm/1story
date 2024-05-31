<template>
    <!-- er zijn verschillende links -->
    <!-- het bij een nuxtlink houden is beter want dan blijf je binnen de applicatie en dit is beter voor de performance -->
    <!-- anders moeten de calls naar de db steeds opnieuw aangeroepen worden -->
    <NuxtLink v-if="to" :to="to">
      <slot></slot>
    </NuxtLink>
  
    <a v-else-if="href" :href="href" :target="target === true ? '_blank': '_self'">
      <slot></slot>
    </a>

    <button v-else>
        <slot></slot>
    </button>
  </template>
  
  <script setup>
  
  
  // Define props with appropriate types
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
  
//   const emit = defineEmits(['click']);
  
//   const handleClick = (event) => {
//     emit('click', event);
//   };
  </script>
  <style lang="scss" scoped>

  @import "../scss/mixins/_index.scss";

  a {
    @include secondary-button;
  
  }
  button {
    @include secondary-button;
    width: max-content;
  
  }
  </style>
  