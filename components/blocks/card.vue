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
           
          <p class="preview-sentence">{{filteredSentences[0].content }}
        </p>
  
  </div>


  </Nuxtlink>

        </div>
    <!-- </div> -->

  </section>
</template>

<script setup>


const stories = ref([]);
const filteredSentences = ref([]);
const sentences = ref([]);

const storiesCollection = collection(db, "stories");
const sentencesCollection = collection(db, "sentences");
const q = query(sentencesCollection, orderBy("createdAt", "asc"));


const storiesQuery = query(storiesCollection, orderBy("createdAt", "desc"));
// stories en titles ophalen
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
// eerste zin ophalen

onSnapshot(q, (querySnapshot) => {
  const fbSentences = [];
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
  justify-content: space-around;
  flex-wrap: wrap;
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
  background: linear-gradient(270deg, #FFFAFE 0%, #FDECFA 100%);
}
.preview-sentence{
  width:300px;
  text-overflow: ellipsis;
  overflow: hidden;
white-space: nowrap;
}
</style>
