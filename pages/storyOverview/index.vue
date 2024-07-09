<template>
  <BlocksNav></BlocksNav>
  <section class="stories">
    <h2 class="stories__story-title">Alle verhalen</h2>
    <!-- Iterate through stories in chunks of 3 and insert divider sentence every 3 cards -->
    <div v-for="(chunk, chunkIndex) in chunkedStories" :key="chunkIndex" class="stories__row">
      <BlocksCard v-for="story in chunk" :key="story.id" :story="story"></BlocksCard>
      <!-- Insert divider sentence after every chunk -->
     <h2 class="stories__breaker-sentence">Zin voor zin, een verhaal van en voor ons allemaal dat ons verbindt en inspireert.</h2> 
      <h2 v-if="chunkIndex < chunkedStories.length - 1 || chunkIndex == 1" class="stories__breaker-sentence">
        Een verhaal van en voor ons allemaal, geschreven zin voor zin, dat ons verbindt en inspireert.
      </h2>
    </div>
    <div v-if="stories.length === 0">
      Er zijn nog geen verhalen geschreven, kom later terug.
    </div>
  </section>
</template>

<script setup lang="ts">

const stories = ref<Story[]>([]);
const storiesCollection = collection(db, "stories");

interface Story {
  id: string;
  title: string;
  createdAt: Date | null;
  firstSentence?: string;
}


const sentences = ref<Sentence[]>([]);

const sentencesCollection = collection(db, "sentences");

onMounted(() => {
  const storiesQuery = query(
    storiesCollection,
    // geen stories die nog niet gesloten zijn tonen
    where('closedAt', '!=', null), 
    orderBy('createdAt', 'desc')
  );
  const sentencesQuery = query(sentencesCollection, orderBy("createdAt", "asc"));

  onSnapshot(storiesQuery, (querySnapshot: QuerySnapshot) => {
    const fbStories: Story[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const story: Story = {
        id: doc.id,
        title: data.title,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
      };
      fbStories.push(story);
    });
    stories.value = fbStories;
    matchSentences();
  });

  onSnapshot(sentencesQuery, (querySnapshot: QuerySnapshot) => {
    const fbSentences: Sentence[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const sentence = {
        id: doc.id,
        content: data.content,
        storyUID: data.storyUID,
      };
      fbSentences.push(sentence);
    });
    sentences.value = fbSentences;
    matchSentences();
  });
});

const matchSentences = () => {
  stories.value.forEach(story => {
    const firstSentence = sentences.value.find(sentence => sentence.storyUID === story.id);
    if (firstSentence) {
      story.firstSentence = firstSentence.content;
    }
  });
};

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
@import "../scss/mixins/_index.scss";

.#{$component} {
  margin: 2rem auto 5rem;
  padding-top: 5rem;
  max-width: 1152px;
  height: 100%;
  @include sm{
    margin: 0 1rem 0 1rem;
  }
  
  &__story-title {
    margin-left: 2rem;
  }

  &__breaker-sentence {
    text-align: center;
    margin: auto;
    padding: 5rem 0 5rem 0;
  }
  &__row{
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
}
</style>
