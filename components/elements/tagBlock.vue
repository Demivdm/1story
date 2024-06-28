<template>
  <section class="tag">
    <div class="tag__tag-blocks">
      <div
        class="tag__tag-block"
        :style="{ backgroundColor: getRandomColor() }"
      ></div>
    </div>
  </section>
</template>
<script setup lang="ts">
const colorArray = [
  "#4C66E6",
  "#90DBEF",
  "#FF9999",
  "#EDEF80",
  "#F7A1E8",
  "#7DE8C1",
];
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colorArray.length);
  return colorArray[randomIndex];
};
</script>

<style scoped lang="scss">
$component: "tag";
@import "/scss/vars/colors";

.#{$component} {
  padding-right: .5rem;
  &__tag-blocks {
    display: flex;
  }
  &__tag-block {
    height: 16px;
    width: 16px;
    margin-right: 5px;
  }
}
</style>
