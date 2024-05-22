<template>
  <div>
    <pre>{{  sentences  }}</pre>
    <div v-for="sentence in sentences" :key="sentence.id" class="sentence-container">
      <!-- <p>{{ sentence.content }}</p>
      <p>{{ sentence.content }}</p> -->
      <h2>Mijn naam is</h2>
        <p>{{ sentence.name }}</p>
      <h2>en ik werk als</h2>
        <p>{{ sentence.function }}</p>
      <h2>Mijn zin van de week</h2>
        <p>{{ sentence.content }}</p>
      <input
        :disabled="!sentence.isEditing"
        :class="{ disabled: !sentence.isEditing }"
        v-model="sentence.content"
        class="sentence-input"
      />
      
  

      <button @click="toggleEdit(sentence)">
        {{ sentence.isEditing ? 'Verzenden' : 'Bewerken' }}
      </button>
    </div>
  </div>
  

  <ElementsBackButton>
  </ElementsBackButton>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { collection, onSnapshot, query, where, orderBy, limit, getDocs, updateDoc , serverTimestamp, doc} from 'firebase/firestore';
import { db } from '~/firebase';

const sentences = ref([]);
const name = ref('');
const job = ref('');

const currentUser = useCurrentUser();

const fetchSentences = async (userId) => {
  try {
    const collectionRef = collection(db, "sentences");
    const q2 = query(collectionRef, where("uid", "==", userId), orderBy("createdAt", "desc"), limit(1))

    const querySnapshot = onSnapshot(q2, (snapshot) => {
     

      sentences.value = snapshot.docs.map(doc => {
        const timestamp =  serverTimestamp();
        const data = doc.data()
        return {
          id: doc.id,
          content: data.content,
          isEditing: false,
          uid: data.uid,
          name: data.name,
          function: data.function,
          createdAt: timestamp || null,
          
        }
      }
     );


      
    });
    console.log({sentences})
  } catch (error) {
    console.error("Error fetching sentences: ", error);
  }
};
const toggleEdit = async (sentence) => {
  if (sentence.isEditing) {
    try {
      const sentenceRef = doc(db, "sentences", sentence.id);
      await updateDoc(sentenceRef, {
        content: sentence.content,
      });
    } catch (error) {
      console.error("Error updating sentence: ", error);
    }
    
  }
  sentence.isEditing = !sentence.isEditing;
};

// Watch for changes to currentUser
// ik heb een wachter nodig om te kijen of de waarde van de user veranderd, of de waarde van de uid veranded
watch(currentUser, (newValue) => {
  if (newValue && newValue.uid) {
    fetchSentences(newValue.uid);
  }
});




</script>
<style>

.disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

</style>
