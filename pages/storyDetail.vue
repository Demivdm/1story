<template>
  <section class="check">
    <BlocksNav></BlocksNav>
    <ElementsBackButton></ElementsBackButton>
    <ElementsScrollUp></ElementsScrollUp>
    <time>27-02-2024</time>
    <h2>Het verhaal</h2>
    <section class="story">
      <p>{{ defaultSentence.content }}</p>
      <div v-for="sentence in filteredSentences" :key="sentence.id">
        <p>{{ sentence.name }}</p>
        <p>{{ sentence.job }}</p>
        <span class="sentence">{{ sentence.content }}</span>
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
</script>

<style>
.check {
  height: 300vh;
}

.story {
  overflow-x: hidden;
  display: flex;
  flex-wrap: wrap;
  white-space: nowrap;
}

.sentence {
  display: inline;
  margin-right: 8px;
}
</style>
