<template>
  <BlocksNav></BlocksNav>
  <section class="stories">
    <h2 class="story-title">Alle verhalen</h2>

    <NuxtLink to="/storyDetail">

 <BlocksCard></BlocksCard>
  </NuxtLink>

<h2 class="breaker-sentence">Zin voor zin, een verhaal van en voor ons allemaal dat ons verbindt en inspireert.</h2>
<BlocksCard></BlocksCard>

  </section>
</template>

<script setup>
</script>
<style>
.breaker-sentence{
text-align: center;
}
.story-title{
  margin:  5rem 0 1rem 3rem;
}
</style>