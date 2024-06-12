<template>
  <section class="story__check">
    
    <BlocksNav></BlocksNav>
    <ElementsBackButton></ElementsBackButton>
    <div v-if="currentstory" class="story__detail">
      <div class="story-info">
        <ElementsScrollUp></ElementsScrollUp>
        <date class="story__time">
          <ElementsTagBlock></ElementsTagBlock>
          27.05.2024
        </date>
        <h2>{{ currentstory.title }}</h2>


      </div>

      <article class="story__story">
        <ElementsSentence :text="defaultSentence.content" />
        <template v-for="(sentence, index) in sentences" :key="sentence.id">
          <ElementsSentence
            :text="sentence.content"
            :info="{ job: sentence.job, name: sentence.name }"
            :class="{'bigger-font': index < 2}"
          />
        </template>
      </article>
    </div>

    <div v-else>
      <p>Story still in progress....</p>
    </div>

  </section>
</template>

<script setup lang="ts">
import { documentId } from "firebase/firestore"; 


const route = useRoute();
const currentStoryId = ref<string>(route.params.id)

type  Story = {
  id: string
  title: string;

}
const sentences = ref<Story>([]);
const defaultSentence = {
  name: "Demi",
  job: "Stagiair",
  content: "Er was eens...",
};

const currentstory = ref<Story>(null);

const storiesCollection = collection(db, "stories");
const sentencesCollection = collection(db, "sentences");
// const q = query(sentencesCollection, orderBy("createdAt", "asc"));
const sentencesQuery = query(sentencesCollection, 
  where('storyUID', '==', currentStoryId.value), // Filter op closeddate
  orderBy("createdAt", "asc"));

const stories = ref<Story>([]);
const matchingSentences = ref<any>([]);
// 

// const storiesQuery = query(storiesCollection, orderBy("createdAt", "desc"));
const storiesQuery = query(
  storiesCollection,
  where('closedAt', '!=', null), // Filter op closeddate
  // andWhere(documentId(), '==', currentStoryId.value), // Filter op closeddate
);
onMounted(() => {

  // Get sentences data from query response
  onSnapshot(sentencesQuery, (querySnapshot: QuerySnapshot<Document>) => {
  const fbSentences: Sentence[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const sentence = {
      id: doc.id,
      content: data.content,
      storyUID: data.storyUID,
      name: data.name,
      job: data.job,
    };
    fbSentences.push(sentence);
  });
  sentences.value = fbSentences;
});
  
// Get stroy data from query response
  onSnapshot(storiesQuery, (querySnapshot: QuerySnapshot<Document>) => {
    const fbStories: Story[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('story data bevat:', data)
      console.log({
        data
      })
      const story: Story = {
        id: doc.id,
        title: data.title,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        closedAt: data.closedAt ? data.createdAt.toDate() : null,
      };
      console.log(
        story
      )
      // story.value = story;
      fbStories.push(story);
    });
    stories.value = fbStories;

    currentstory.value = fbStories.filter( story => story.id === currentStoryId.value );
    currentstory.value = currentstory.value.length > 0 ? currentstory.value[0] : null;

    console.log("de titel is", fbStories.title)
  });
});
const formatDate = (date: Date | null) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
  return date.toLocaleDateString("nl-NL", options);
};
</script>

<style scoped lang="scss">
@import "/scss/vars/_breakpoints.scss";

$component: "story";

.#{$component} {
width: 100vw;
  &__detail{
    max-width: 900px;
    margin: auto;
    @include sm{
      margin: 1rem ;
    }
   
  }
  &__sentence-container {
    cursor: text;
  }

  &__check {
    min-height:100vh ;
    background: linear-gradient(180deg, #fbfefe 0%, #dbf3fa 100%);
    width: 100vw;
    padding-top: 5rem;
   
  }
  &__story {
    &:hover {
      :deep(.sentence) {
        opacity: 1;
        &:not(:hover) {
          opacity: 0.3;
        }
      }
    }
  }
  &__user-sentence,
  &__user-info {
    transition: opacity 0.3s ease;
  }
  &__user-info {
    position: absolute;
    opacity: 0;
    background: #fff;
    box-shadow: 0px 4px 4px 0px #0103091a;
    font-size: 14px;
    border-radius: 4px;
    padding: 8px;

    width: max-content;
  }
  &__time {
    display: flex;
    align-items: baseline;
    padding-top: 1rem;
  }

  &__user-sentence {
    display: inline;
    margin-right: 10px;
  }

}
</style>