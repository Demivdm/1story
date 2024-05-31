<template>
  <section class="stories">

    <div v-for="story in stories" :key="story.id" class="story-block">
    <Nuxtlink to="/storyDetail">
      <div class="tag-wrapper">
        
      <ElementsTagBlock></ElementsTagBlock>
      <p>{{ formatDate(story.createdAt) }}</p>
      </div>
      <div class="content-wrapper">
        <h5 class="title">{{ story.title }}</h5>
      <!-- <div v-for="sentence in filteredSentences" :key="sentence.id"> -->
        <p>
        Dit is de eerste zin...

        </p>
      </div>
    
        <!-- <span class="sentence">{{ sentence.content }}</span> -->
  </Nuxtlink>

        </div>
    <!-- </div> -->

  </section>
</template>

<script setup>


const stories = ref([]);
const sentences = ref([]);


const storiesCollection = collection(db, "stories");
const sentencesCollection = collection(db, "sentences");

const storiesQuery = query(storiesCollection, orderBy("createdAt", "desc"));

onMounted(() => {
  onSnapshot(storiesQuery, (querySnapshot) => {
    const fbStories = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const story = {
        id: doc.id,
        title: data.title,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
      };
      fbStories.push(story);
    });
    stories.value = fbStories;
  });
});
const formatDate = (date) => {
  if (!date) return '';
  const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
  return date.toLocaleDateString('nl-NL', options);
};
</script>

<style scoped>
.tag-wrapper{
  display: flex;
  align-items: baseline;
}
.content-wrapper{
  /* padding: 40px, 36px, 74px, 36px; */
  padding: 0 1rem 1rem 1rem;

}
.stories {
  margin-top: 2rem;
  display: flex;
  margin: 0 2rem 0 2rem;
}
.story-block{
  background: #FFFFFF;
  border-radius: 20px ;
  width: 360px;
  margin: 1rem;

}
.title{
  margin: 0;
}
.story-block:hover {
  transition: .4s ease-in;
  background: linear-gradient(193deg, rgba(252,235,252,1) 40%, rgba(247,161,232,1) 70%);
}
</style>
