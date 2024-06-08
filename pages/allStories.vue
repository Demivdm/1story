<template>
  <BlocksNav></BlocksNav>
  <section class="stories">
    <h2 class="stories__story-title">Alle verhalen</h2>

    <NuxtLink to="/storyDetail">
      <BlocksCard></BlocksCard>
      <BlocksCard></BlocksCard>
    </NuxtLink>

    <h2 class="stories__breaker-sentence">
      Zin voor zin, een verhaal van en voor ons allemaal dat ons verbindt en
      inspireert.
    </h2>
  </section>
</template>

<script setup></script>
<style scoped lang="scss">
$component: "stories";

.#{$component} {
  margin: 2rem auto 0;
  padding-top: 5rem;
  max-width: 1152px;
  height: 100%;

  &__story-title {
    margin-left: 2rem;
  }

  &__breaker-sentence {
    text-align: center;
    margin: auto;
    padding: 5rem 0 5rem 0;
  }
}
</style>
