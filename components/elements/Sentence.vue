<template>
  <span class="sentence" 
 ref="sentenceRef">
    <span class="sentence__info-hover" ref="textRef" @mouseover="showInfo" @mouseleave="hideInfo">{{ processedText }}</span>
    
    <button class="sentence__dropdown-icon" @click="toggleDropdown" :class="{ 'rotated': isHovered }"></button>
   <!-- het moeten allemaal spans zijn want door block elementen kan de zin lengte niet meer accuraat gedetecteerd worden -->
   <span class="sentence__user-info-container" :style="infoPos" :class="{ 'sentence__user-info-container--hovered': isHovered }" ref="infoListRef" v-if="props.info">
      <ul class="sentence__user-info-list">
        <li class="user-info" v-if="props.info?.name">
        <ElementsTagBlock></ElementsTagBlock>
          {{ props.info.name }}</li>
        <li v-if="props.info?.job">
        <ElementsTagBlock></ElementsTagBlock>
          {{ props.info.job }}</li>
      </ul>
    </span>
</span>


</template>

<script setup lang="ts">
import { ref, computed } from 'vue';


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
const isHovered = ref<Boolean>(false);
const textRef = ref<HTMLElement | null>(null);

// positionering van de user info
const infoPos = computed(() => {
  if (sentenceRef.value && infoListRef.value && textRef.value) {
    const sentence = sentenceRef.value;
    const infoList = infoListRef.value;
 
    const windowWidth = window.innerWidth;

    const sentenceRectList = sentence.getClientRects();
    const infoListRect = infoList.getBoundingClientRect();

    const index = sentenceRectList.length
    const lastRectElement = sentenceRectList[index - 1];

    // Bereken de breedte en de offset.
    let xOffset = windowWidth - (lastRectElement.left + lastRectElement.width + infoListRect.width);
    xOffset > 0 ? xOffset = 0 : xOffset = xOffset - 20;
   
// omdat het userinfo element absoluut is moet ik de 0.0 waarde resetten wanneer er wordt gescrollt dit doe ik door scroll x en y te gebruiken
    return {
      top: `${scrollY + lastRectElement.height + lastRectElement.top}px`,
      left: `${lastRectElement.left + lastRectElement.width + xOffset}px`,
    };
  }
  return {};
});
// toggle voor de hover

const showInfo = () => {
  isHovered.value = true;
};

const hideInfo = () => {
  isHovered.value = false;
  
};
// toevoegen van de punt

const addPeriod = (text: string) => {
  const trimmedText = text.trim();
  const lastChar = trimmedText.charAt(trimmedText.length - 1);

  if (lastChar !== '.' && lastChar !== '!' && lastChar !== '?') {
    return trimmedText + '.';
  }
  return text;
};
const processedText = computed(() => {
  return addPeriod(props.text);
});

// dropdown
const toggleDropdown = () => {
  isHovered.value = !isHovered.value;
};
</script>

<style scoped lang="scss">
 @import "/scss/vars/_breakpoints.scss";


$component: 'sentence';


.#{$component} {
  margin-right: 4px;
  padding-right: 4px;
  @include sm{
    padding: 0;
  }


  &__sentence{
    &--hovered {
    z-index: -1;}
  }

 

  &__user-info-container {
    position: absolute;
    width: max-content;
    z-index: -1;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    &--hovered {
    z-index: 1;
    opacity: 1;
    pointer-events: auto;

  }
  }

  &__user-info-list {
    list-style-type: none;
      background: white;
      display: flex;
      box-shadow: 0px 4px 4px 0px #0103091A;
      border-radius: 4px;
    li {
      display: flex;
      align-items: baseline;
    

    }
    padding:0; 
  }
  &__dropdown-icon{
   display: none;
     background: #A5E1F3;

   height: 15px;
   width: 15px;
   border: none;
   border-radius: 50%;
   position: relative;

   @include sm{
    display: inline-block;
   }
   &.rotated {
      transform: rotate(180deg);
    }

  }
  &__dropdown-icon::after{
    content: '⌄';
    position: relative;
    color: white;
    bottom: 4px;
    right: 2.5px;
  }

}
</style>
