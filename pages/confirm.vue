<template>
  <div v-if="sentence">
    <h2>Bedankt voor het delen</h2>
    <p>Hieronder kun je nogmaals zien wat je hebt ingevuld. Foutje gemaakt? Geen probleem, je kunt het nu nog aanpassen. Als alles naar wens is, kun je het tabblad sluiten of andere verhalen bekijken.</p>
    <span class="name">Naam: {{ name.name }}</span>
    <span class="job">Functie: {{ job.function }}</span>
    <span class="sentence">{{ sentence.content }}</span>

    <template v-if="!editing">
      <span class="sentence">{{ sentence.content }}</span>
      <button @click="toggleEditing">Bewerken</button>
    </template>
    <template v-else>
      <input type="text" v-model="editedContent">
      <button @click="saveEdit">Opslaan</button>
    </template>
    <ElementsButton>
      <NuxtLink to="/allStories">
        Bekijk andere verhalen
      </NuxtLink>
    </ElementsButton>
  </div>
  <div v-else>
   loading.....
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '~/firebase';

// de waarde hiervan is null zodat ik deze later kan vullen met de data die uit de db komt
const sentence = ref(null);
const name = ref(null);
const job = ref(null);
const editing = ref(false);
const editedContent = ref('');


onMounted(() => {
  const sentencesCollection = collection(db, "sentences");
  const q = query(sentencesCollection, orderBy('createdAt', 'asc'));

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // hier vul ik sentence,job en name met de waarden van de laatste zin
      // dit is als het goed is de zin van de gebruiker door de timestamps
      sentence.value = {
        
        content: data.content,
        function: data.function,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
      };
      name.value = {
        name: data.name,

      }
      job.value = {
        function: data.function,

      }
      // Hier breek ik de loop zodat alleen de eerste zin wordt getoond 
      return;
    });
  });
});
// EDITING WERKT NIET, FIX DIT
// function toggleEditing() {
//   editing.value = !editing.value;
//   editedContent.value = sentence.value.content; 
// }

// function saveEdit() {
//   sentence.value.content = editedContent.value;
//   editing.value = false;
// }
</script>

<script>
export default {
  name: 'confirm'
};
</script>
