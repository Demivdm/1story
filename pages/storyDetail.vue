<template>
    <BlocksNav></BlocksNav>
  <ElementsBackButton></ElementsBackButton>
  <ElementsScrollUp></ElementsScrollUp>
  <ElementsTagBlock></ElementsTagBlock> 
  <time>27-02-2024</time>

  <BlocksUserTag></BlocksUserTag>
  <h2>Dit zijn alle zinnen</h2>
  <!-- werkt in combinatie met de ref beter omdat er niet de hele tijd naar alle elementen hierin gekeken moet worden -->
  <div v-for="sentence in sentences" :key="sentence.id">
    <p>{{ sentence.content }}</p>
  </div>
</template>
<script setup>
import { collection, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "~/firebase";


const sentences = ref([]);
// alle zinnen in een collectie gooien zodat deze gesorteerd kan worden
const sentencesCollection = collection(db, 'sentences');
// query om de zinnen op timestamp te sorteren
const q = query(sentencesCollection, orderBy('createdAt'));
console.log(sentencesCollection)


onMounted(() => {
  // waarom kan sentence hier niet met <type>
  onSnapshot(collection(db, "sentences"), (querySnapshot) => {
    const fbSentences = [];
    querySnapshot.forEach((doc) => {
      
      const sentence = {
        id: doc.id,
        content: doc.data().content,
        createdAt: serverTimestamp(),
      };
      fbSentences.push(sentence);
    });
    sentences.value = fbSentences;
    // getrandom sentence wordt in ontmounted pas aangeroepen zodat de random zin niet elke keer update
    // wanneer er iets wordt getypt in de input
console.log(fbSentences)


  });

});

</script>
