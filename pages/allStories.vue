<template>
  <BlocksNav></BlocksNav>
  <section class="stories">
    <h2 class="stories__story-title">Alle verhalen</h2>
    <!-- Iterate through stories in chunks of 3 and insert divider sentence every 3 cards -->
    <div v-for="(chunk, chunkIndex) in chunkedStories" :key="chunkIndex" class="stories__row">
      <BlocksCard v-for="story in chunk" :key="story.id" :story="story"></BlocksCard>
      <!-- Insert divider sentence after every chunk -->
      <h2 v-if="chunkIndex < chunkedStories.length - 1" class="stories__breaker-sentence">
        Zin voor zin, een verhaal van en voor ons allemaal dat ons verbindt en inspireert.
      </h2>
    </div>
  </section>
</template>

<script setup lang="ts">

const stories = ref<Story[]>([]);
const storiesCollection = collection(db, "stories");

onMounted(() => {
  const q = query(storiesCollection);
  onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const fbStories: Story[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const story: Story = {
        id: doc.id,
        title: data.title,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        // closedAt: data.createdAt ? data.createdAt.toDate() : null,

      };
      fbStories.push(story);
    });
    stories.value = fbStories;
  });
});
const chunkedStories = computed(() => {
  const chunks: Story[][] = [];
  for (let i = 0; i < stories.value.length; i += 6) {
    chunks.push(stories.value.slice(i, i + 6));
  }
  return chunks;
});
</script>
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
