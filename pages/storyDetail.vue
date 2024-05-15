<template>
  <BlocksBackBlock></BlocksBackBlock>
  <ElementsBackButton></ElementsBackButton>
  <ElementsScrollUp></ElementsScrollUp>
  <ElementsTagBlock></ElementsTagBlock> 27-02-2024
  <BlocksUserTag></BlocksUserTag>
  <h2>Dit zijn alle zinnen</h2>
  <!-- werkt in combinatie met de ref beter omdat er niet de hele tijd naar alle elementen hierin gekeken moet worden -->
  <div v-for="sentence in sentences" :key="sentence.id">
    <p>{{ sentence.content }}</p>
  </div>
</template>
<script setup>
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "~/firebase";

const sentences = ref([]);
onMounted(() => {
  // waarom kan sentence hier niet met <type>
  onSnapshot(collection(db, "sentences"), (querySnapshot) => {
    const fbSentences = [];
    querySnapshot.forEach((doc) => {
      const sentence = {
        id: doc.id,
        content: doc.data().content,
      };
      fbSentences.push(sentence);
    });
    sentences.value = fbSentences;
    // getrandom sentence wordt in ontmounted pas aangeroepen zodat de random zin niet elke keer update
    // wanneer er iets wordt getypt in de input
  });
});
</script>
