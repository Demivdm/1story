<template>
    <span
      class="sentence__user-info-container"
      :style="infoPos"
      :class="{ 'sentence__user-info-container--hovered': isHovered }"
      ref="infoListRef"
      v-if="props.info"
    >
      <ul class="sentence__user-info-list">
        <li class="user-info" v-if="props.info?.name">
          <ElementsTagBlock></ElementsTagBlock>
          {{ props.info.name }}
        </li>
        <li v-if="props.info?.job">
          <ElementsTagBlock></ElementsTagBlock>
          {{ props.info.job }}
        </li>
      </ul>
    </span>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  // Assuming Sentence is an interface with the shape of your props
  interface Sentence {
    info?: {
      name?: string;
      job?: string;
    };
  }
  
  const props = defineProps<Sentence>();
  
  const isHovered = ref(false);
  const infoListRef = ref<HTMLElement | null>(null);
  const infoPos = computed(() => {
    // Compute your style here based on some logic
    return { top: '10px', left: '20px' }; // Example
  });
  </script>
  
  <style scoped lang="scss">
  $component: 'dropdown';
  
  .#{$component}__icon {
    background: grey;
    border-radius: 50%;
    height: 10px;
    width: 10px;
  }
  </style>
  