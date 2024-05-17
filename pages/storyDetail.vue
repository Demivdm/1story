<template>
    <BlocksNav></BlocksNav>
  <ElementsBackButton></ElementsBackButton>
  <ElementsScrollUp></ElementsScrollUp>
  <ElementsTagBlock></ElementsTagBlock> 
  <time>27-02-2024</time>

  <BlocksUserTag></BlocksUserTag>
  <h2>Dit zijn alle zinnen</h2>
  <!-- werkt in combinatie met de ref beter omdat er niet de hele tijd naar alle elementen hierin gekeken moet worden -->
  <section class="story">
    <div v-for="sentence in sentences" :key="sentence.id">
    <span class="sentence">{{ sentence.content }}</span>

  </div>
  </section>

</template>
<script setup>
import { collection, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "~/firebase";


const sentences = ref([]);


onMounted(() => {
  // collection is een firestore object, om dit makkelijk te kunnen gebruiken maak ik er een variabele van
  const sentencesCollection = collection(db, "sentences");
  // hier binnen maak ik een query van mijn collection en sorteer deze op ingestuurde datum
  const q = query(sentencesCollection, orderBy('createdAt', 'asc')); 


  onSnapshot(q, (querySnapshot) => {
    const fbSentences = [];
    querySnapshot.forEach((doc) => {
      // doc.data in een data variabele zodat ik minder hoef te typen
      const data = doc.data();

      // dit is alles wat ik binnen de sentence nodig heb. 
      const sentence = {
        id: doc.id,
        content: data.content,
        // dit pakt de createdat data uit de db als die er is
        // dan wordt het veranderd naar een date die js kan gebruiken
        // als createdAt niet bestaat dan wordt deze op null gezet
        createdAt: data.createdAt ? data.createdAt.toDate() : null, 
      };
      // sentence wordt hier in de lege fbsentences gegooid
      fbSentences.push(sentence);
    });
    // hier wordt mijn reactive ref geupdate
    sentences.value = fbSentences;

    // check of alles mee is gekomen
    console.log(fbSentences);
  });
});
</script>
<style>
.story{
  display: flex;
}
.sentences{
 width: max-content;
 
}
.sentence {
display: block;
  margin-right: 5px; 
}
</style>
