<template>
  <section class="admin-detail">

    <BlocksNav></BlocksNav>
    <div v-if="isDeadlinePassed">
      <h1>Controleer het verhaal</h1>
      <ElementsScrollUp></ElementsScrollUp>
      <div v-for="sentence in sentences" :key="sentence.id">
        <p @click="toggleEdit(sentence)">{{ sentence.content }}</p>
        <BlocksModal v-if="sentence.isEditing">

            <h2>Bewerk de zin</h2>
            <p>Naam: {{ sentence.name }}</p>
            <p>Functie: {{ sentence.job }}</p>
            <input v-model="sentence.content" />
            <ElementsButton @click="toggleEdit(sentence)">
              Opslaan
            </ElementsButton>    
        </BlocksModal>
      </div>
   
      <!-- modal -->
      <input v-model="title" placeholder="Voeg een titel voor het verhaal toe" required/>
      <ElementsButton  @click="saveTitle">Titel opslaan</ElementsButton>
     <ElementsButton @click="closeStory">
         Verhaal verzenden
        </ElementsButton>
    </div>
    <div v-else class="admin-deadline">
        <p>De deadline is nog niet verstreken. Je kunt het verhaal vanaf {{ formattedDeadline }} controleren</p>
    </div>
  </section>

  </template>
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { collection, doc, updateDoc, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
  import { useDeadline} from '../composable/useDeadline';
  
  
  const {isDeadlinePassed, formattedDeadline } = useDeadline();

  const title = ref('');
  const sentences = ref([]);
  const currentStoryId = ref();
  
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
  // const closeStory = async () => {
  //   if (currentStoryId.value) {
  //     try {
  //       const storyRef = doc(db, "stories", currentStoryId.value);
  //       await updateDoc(storyRef, { closedAt: serverTimestamp() });
  
  //       // Nieuw verhaal beginnen en titel kiezen
  //       const newStoryRef = await addDoc(storyCollection, { 
  //         title: null,
  //         createdAt: serverTimestamp(), 
  //         closedAt: null, 
  //       });
  //       currentStoryId.value = newStoryRef.id;
  //       title.value = '';
  //       sentences.value = [];
  //     } catch (error) {
  //       console.error("Error closing story: ", error);
  //     }
  //   }
  // };
  
  onMounted(() => {
    fetchStoryData();
  });

  // const closeStory = async () => {
  //     if (currentStoryId.value) {
  //       try {
  //         const storyRef = doc(db, "stories", currentStoryId.value);
  //         await updateDoc(storyRef, { closedAt: serverTimestamp() });

  //         // Nieuw verhaal beginnen en titel kiezen
  //         const newStoryRef = await addDoc(storyCollection, { 
  //           title: null,
  //           createdAt: serverTimestamp(), 
  //           closedAt: null, 
  //         });

  //         // Set new story ID using the composable
  //         setCurrentStoryId(newStoryRef.id);

  //         currentStoryId.value = newStoryRef.id;
  //         title.value = '';
  //         sentences.value = [];
  //       } catch (error) {
  //         console.error("Error closing story: ", error);
  //       }
  //     }
  //   };
  
  // onMounted(() => {
  //   fetchStoryData();
  // });
  </script>
  <style lang="scss" scoped>
  .admin-detail{
    // height: 100vh;
  }
  .admin-deadline{
    display: grid;
    height: 100vh;
    place-items: center;
    margin: auto;
    text-align: center;
    // background: red;
  }
  </style>
  