<template>
  <section class="card">
    <div v-for="story in stories" :key="story.id" class="card__story-block">
      <Nuxtlink to="/storyDetail">
        <div class="card__tag-wrapper">
          <ElementsTagBlock> </ElementsTagBlock>
          <p>{{ formatDate(story.createdAt) }}</p>
        </div>
        <div class="card__content-wrapper">
          <h5 class="card__title">{{ story.title }}</h5>

          <p class="card__preview-sentence">
            {{ filteredSentences[0].content }}
          </p>
        </div>
      </Nuxtlink>
    </div>
  </section>
</template>

<script setup lang="ts">
const stories = ref<Story>([]);
const filteredSentences = ref<Sentence[]>([]);
const sentences = ref<Sentence[]>([]);

const storiesCollection = collection(db, "stories");
const sentencesCollection = collection(db, "sentences");
const q = query(sentencesCollection, orderBy("createdAt", "asc"));

const storiesQuery = query(storiesCollection, orderBy("createdAt", "desc"));

// types importeren
import type { Story, Sentence, FirestoreDocument } from "@/types/index";

// stories en titles ophalen
onMounted(() => {
  onSnapshot(storiesQuery, (querySnapshot: QuerySnapshot<Document>) => {
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
  });
});
const formatDate = (date: Date | null) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
  return date.toLocaleDateString("nl-NL", options);
};
// eerste zin ophalen

onSnapshot(q, (querySnapshot: QuerySnapshot<Document>) => {
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
  filterSentences();
});
const filterSentences = () => {
  // dit is welke de huidige is, dit kan ik later nog aanpassen zodat het reageert op wat de admin sluit.
  const storyId = "vq7I23zQK8iszSCXbMsj";
  filteredSentences.value = sentences.value.filter(
    (sentence) => sentence.storyUID === storyId
  );
};
</script>

<style scoped lang="scss">
@import "/scss/vars/breakpoints";
@import "/scss/vars/colors";

$component: "card";
// kleuren variatie
.#{$component} {
  display: flex;
  gap: 3rem;
  margin: 0 2rem 3rem 2rem;
  @include sm {
    flex-direction: column;
    align-items: center;
  }
  @include md {
    flex-wrap: wrap;
  }

  &__tag-wrapper {
    display: flex;
    align-items: center;
    padding-left: 1rem;
    p {
      padding: 0;
    }
  }

  &__content-wrapper {
    padding: 0 1rem 1rem 1rem;
  }

  &__story-block {
    background: #ffffff;
    border-radius: 20px;
    max-width: 360px;
    height: 254px;
    transition: 1s ease-in-out;
  }
  &__title {
    margin: 0;
  }
  &__story-block:hover {
    background: linear-gradient(270deg, #fffafe 0%, #fdecfa 100%);
  }
  &__preview-sentence {
    max-width: 300px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
