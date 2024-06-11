<template>
  <BlocksNav></BlocksNav>
  <section class="stories">
    <h2 class="stories__story-title">Alle verhalen</h2>

      <BlocksCard></BlocksCard>

    <h2 class="stories__breaker-sentence">
      Zin voor zin, een verhaal van en voor ons allemaal dat ons verbindt en
      inspireert.
    </h2>
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
        closedAt: data.createdAt ? data.createdAt.toDate() : null,

      };
      fbStories.push(story);
    });
    stories.value = fbStories;
  });
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
