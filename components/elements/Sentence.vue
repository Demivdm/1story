<template>
    <div class="sentence" ref="sentenceRef">
        <!-- dit zijn de zinnnen  -->
        <span @mouseover="showInfo" @mouseleave="hideInfo">{{ props.text }}</span>
            <!-- dit is de user info -->
        
        <div class="sentence__user-info-container" :style="infoPos" ref="infoListRef" v-if="props.info">
        <ul class="sentence__user-info-list">
        <li class="user-info" v-if="props.info?.name">
             {{ props.info.name }}
        </li>
        <li v-if="props.info?.job">{{ props.info.job }}
        </li>
        </ul>
        </div>
        </div>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

type Sentence = {
  text: string;
  info?: UserData;
};

type UserData = {
  name: string;
  job: string;
};

const props = defineProps<Sentence>();

const sentenceRef = ref<HTMLElement | null>(null);
const infoListRef = ref<HTMLElement | null>(null);
const isHovered = ref(false);

const infoPos = computed(() => {
  if (sentenceRef.value && infoListRef.value) {
    const sentence = sentenceRef.value.getBoundingClientRect();
    const infoList = infoListRef.value.getBoundingClientRect();
    console.log(sentence)

    if (infoList.width > window.innerWidth) {
      return {
        left: +`${sentence.width}px`,
        right: 'auto',
        transform: isHovered.value ? 'translateY(0)' : 'translateY(10px)',
        opacity: isHovered.value ? 1 : 0,
      };
    } else {
      return {
        right: -`${sentence.width}px`,
        left: 'auto',
        opacity: isHovered.value ? 1 : 0,
        transform: isHovered.value ? 'translateY(0)' : 'translateY(10px)',
      };
    }
  }
  return {};
});

const showInfo = () => {
  isHovered.value = true;
};

const hideInfo = () => {
  isHovered.value = false;
};


</script>

<style scoped lang="scss">
$component: 'sentence';

.#{$component} {
  position: relative;
  display: inline;
  margin-right: 4px;

  &__user-info-container {
    position: absolute;
    bottom: 0;
    right: 0;
    width: max-content;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  &__user-info-list {
 
    li {
      list-style-type: none;
      background: hotpink;
      border: 3px solid red;
    }
    padding: 0;
  }
}
</style>
