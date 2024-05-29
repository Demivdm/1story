<template>
    <BlocksNav></BlocksNav>
    <div>
      <h1>Kies de titel</h1>
      <input v-model="title" placeholder="Voeg een titel toe" />
      <button @click="saveTitle">Opslaan Titel</button>
      <h2>Verhaal Zinnen</h2>

      <div v-for="sentence in sentences" :key="sentence.id">
        <input 
          v-if="sentence.isEditing" 
          v-model="sentence.content" 
        />
        
        <p @click="toggleEdit(sentence)">{{ sentence.content }}</p>
        
      </div>
  
      <button @click="closeStory">Verhaal Sluiten</button>
    </div>
  </template>
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { collection, doc, updateDoc, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
  
  const title = ref('');
  const sentences = ref([]);
  const currentStoryId = ref(null);
  
  const storyCollection = collection(db, "stories");
  const sentenceCollection = collection(db, "sentences");


  
  const fetchStoryData = async () => {
    try {
      // verhaal ophalen
      const storyQuery = query(storyCollection, where("closedAt", "==", null));
      const storySnapshot = await getDocs(storyQuery);
  
      if (!storySnapshot.empty) {
        const storyDoc = storySnapshot.docs[0];
        currentStoryId.value = storyDoc.id;
        console.log("story doc id is",storyDoc.id)
        title.value = storyDoc.data().title || '';


  // vullen met zinnen met hetzelfde id
        const sentenceQuery = query(sentenceCollection, where("storyUID", "==", currentStoryId.value));
        const sentenceSnapshot = await getDocs(sentenceQuery);
        console.log("Fetched sentences:", sentenceSnapshot.docs);

        sentences.value = sentenceSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, isEditing: false }));
      }
  
    } catch (error) {
      console.error("Error fetching story data: ", error);
    }
  };
  
  // titel op kunnen slaan
  const saveTitle = async () => {
    if (currentStoryId.value) {
      try {
        const storyRef = doc(db, "stories", currentStoryId.value);
        await updateDoc(storyRef, { title: title.value });
      } catch (error) {
        console.error("Error saving title: ", error);
      }
    }
  };
  
  // editten en updaten
  const toggleEdit = async (sentence) => {
    if (sentence.isEditing) {
      try {
        const sentenceRef = doc(db, "sentences", sentence.id);
        await updateDoc(sentenceRef, { content: sentence.content });
      } catch (error) {
        console.error("Error updating sentence: ", error);
      }
    }
    sentence.isEditing = !sentence.isEditing;
  };
  
  // Verhaal sluiten en een nieuw verhaal beginnen
  const closeStory = async () => {
    if (currentStoryId.value) {
      try {
        const storyRef = doc(db, "stories", currentStoryId.value);
        await updateDoc(storyRef, { closedAt: serverTimestamp() });
  
        // Nieuw verhaal beginnen 
        const newStoryRef = await addDoc(storyCollection, { createdAt: serverTimestamp(), closedAt: null, });
        currentStoryId.value = newStoryRef.id;
        title.value = '';
        sentences.value = [];
      } catch (error) {
        console.error("Error closing story: ", error);
      }
    }
  };
  
  onMounted(() => {
    fetchStoryData();
  });
  </script>
  