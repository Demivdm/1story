<template>
  <section class="check">
    <BlocksNav></BlocksNav>
   
    
    <div class="story-info">
      <ElementsBackButton></ElementsBackButton>
    <ElementsScrollUp></ElementsScrollUp>
      <time>
      <ElementsTagBlock></ElementsTagBlock>
      <!-- {{ formatDate(story.createdAt) }} -->
      27-05-2024
    </time>
    <h2>Het verhaal</h2>
    </div>
   
    <section class="story">
      <p>{{ defaultSentence.content }}</p>
      <div v-for="sentence in filteredSentences" :key="sentence.id">
        <p class="user-info" v-if="sentence.hover">
          <ElementsTagBlock></ElementsTagBlock>
          {{ sentence.name }}
          <ElementsTagBlock></ElementsTagBlock>
          
          {{ sentence.job }} </p>
    
        <span class="user-sentence" @mouseover="toggleHover(sentence)" @mouseleave="toggleHover(sentence)">{{ sentence.content }}
          {{ addPeriod(sentence.content) }}

        </span>
      </div>
    </section>
  </section>
</template>

<script setup>

// Define reactive variables
const sentences = ref([]);
const filteredSentences = ref([]);
const defaultSentence = {
  name: "Demi",
  job: "Stagiair",
  content: "Er was eens"
};

onMounted(() => {
  const sentencesCollection = collection(db, "sentences");
  const q = query(sentencesCollection, orderBy("createdAt", "asc"));

  onSnapshot(q, (querySnapshot) => {
    const fbSentences = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const sentence = {
        id: doc.id,
        content: data.content,
        name: data.name,
        job: data.job,
        storyUID: data.storyUID,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
      };
      fbSentences.push(sentence);
    });
    sentences.value = fbSentences;
    filterSentences(); 
  });
});

// functie om zinnen te filteren op story id
const filterSentences = () => {
  // dit is welke de huidige is, dit kan ik later nog aanpassen zodat het reageert op wat de admin sluit.
  const storyId = "vq7I23zQK8iszSCXbMsj"; 
  filteredSentences.value = sentences.value.filter(
    (sentence) => sentence.storyUID === storyId
  );
};
const toggleHover = (sentence) => {
  sentence.hover = !sentence.hover;
};
const formatDate = (date) => {
  if (!date) return '';
  const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
  return date.toLocaleDateString('nl-NL', options);
};
const addPeriod = (content) => {
// check of de zin een punt bevat
  if (content.trim().charAt(content.trim().length - 1) !== '.') {
    // voeg punt toe
    return '.';
  }
  return '';
};
</script>

<style lang="scss">

// $component: "story-detail";

// .#{$component} {


.check {
  height: 300vh;
  background: linear-gradient(180deg, #FBFEFE 0%, #DBF3FA 100%);
  // padding: 0 20rem 0 20rem;
  width: 100vw;

}

.story {
  // overflow-x: hidden;
  display: flex;
  flex-wrap: wrap;
  white-space: nowrap;
  align-items: baseline;



}
.story, 
.story-info{
  width: 49rem;
  margin: auto;
}

.story-info{
  padding-top: 5rem;
}

.user-sentence {
  display: inline;
  margin-right: 10px;
}
.user-info {
  position: absolute; 
  display: flex;
  align-items: baseline;
  text-transform: uppercase;
  opacity: 1;
  transition: opacity 0.3s;
  background: #fff;

  border-radius: 4px;
  width: max-content;
  padding: 8px;
}

.user-sentence:hover {
  opacity: 1;
}
time{
  display: flex;
  align-items: baseline;
  position: relative;
  top: 2rem;
}
// }
</style>
