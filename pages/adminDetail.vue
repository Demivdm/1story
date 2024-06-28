<template>
  <section class="admin-detail">

    <BlocksNav></BlocksNav>

    <div v-if="isDeadlinePassed" >
      <div class="header-wrapper">
      <h1>Controleer het verhaal en kies een titel</h1>
      <ElementsButton @click="toggleConfirmStory" v-if="!showConfirmStory && isDeadlinePassed && !isStoryClosed">
        Open verhaal bevestiging
      </ElementsButton>
    </div>
      <ElementsScrollUp></ElementsScrollUp>
      <div class="sentence-wrapper">

   
      <span v-for="sentence in sentences" :key="sentence.id"  class="confirm-story-sentence">
        
        <p class="story-sentence" @click="toggleEdit(sentence)">{{ sentence.content }} </p>
          <BlocksModal v-if="sentence.isEditing" class="sentence-popup">
          <button class="close-button" @click="closeEditModal(sentence)">X</button>
            <h2>Bewerk de zin</h2>
            <ElementsTagBlock></ElementsTagBlock>
            <p>Naam: {{ sentence.name }}</p>
            <ElementsTagBlock></ElementsTagBlock>
            <p>Functie: {{ sentence.job }}</p>
            <input v-model="sentence.content" />
            <ElementsButton @click="toggleEdit(sentence)">
              Opslaan
            </ElementsButton>    
        </BlocksModal>
      </span>
    </div>
    
      <!-- confirm modal -->
      <div class="confirm-story" v-if="showConfirmStory">
        <BlocksModal>
          <button class="close-button" @click="closeConfirmStory">X</button>

        <input v-model="title" placeholder="Voeg een titel voor het verhaal toe" required/>
      <ElementsButton @click="saveTitle">
        {{ saveButton}}

      </ElementsButton>
        
        <ElementsButton :disabled="!title" @click="closeStory">
        Verhaal verzenden
      </ElementsButton>
      
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </BlocksModal>
      </div>
   
      <!-- modal -->
  
    </div>

    <div v-else class="admin-deadline">
        <p>De deadline is nog niet verstreken. Je kunt het verhaal vanaf {{ formattedDeadline }} controleren</p>
    </div>

    <div v-if="isStoryClosed" class="admin-deadline">
      <p>Bedankt! Het verhaal is succesvol verzonden.</p>
      <ElementsButton @click="returnHome">Keer terug naar home</ElementsButton>
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
  const errorMessage = ref('')
  const showConfirmStory = ref(false);

  
  const storyCollection = collection(db, "stories");
  const sentenceCollection = collection(db, "sentences");

  let titleSaved = ref(false);
  let isStoryClosed = ref(false);


  const addPeriod = (text: string, isFirstSentence: boolean) => {
    // standaard zin mag extra punten hebben
    if (isFirstSentence) {
    return text; 
  }
    const trimmedText = text.trim();
    const lastChar = trimmedText.charAt(trimmedText.length - 1);

    if (lastChar !== "." && lastChar !== "!" && lastChar !== "?") {
      return trimmedText + ".";
    }
    return text;
  };

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

        const sentenceQuery = query(sentenceCollection, where("storyUID", "==", currentStoryId.value), orderBy("createdAt", "asc"));
        const sentenceSnapshot = await getDocs(sentenceQuery);
        sentences.value = [{ content: 'Er was eens....', id: 'initial', name: 'Demi', job: 'Developer', isEditing: false}, ...sentenceSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, isEditing: false }))];
      }
    } catch (error) {
      console.error("Error fetching story data: ", error);
    }
  };
  
  // titel op kunnen slaan
  const saveTitle = async () => {
    if (!title.value.trim()) {
    errorMessage.value = 'Titel is verplicht om het verhaal op te slaan.';
    return;
  }
    if (currentStoryId.value) {
      try {
        const storyRef = doc(db, "stories", currentStoryId.value);
        await updateDoc(storyRef, { title: title.value });
        // error message leegmaken als er iets is ingevuld
        errorMessage.value = '';
        titleSaved.value = true;


      } catch (error) {
        console.error("Error saving title: ", error);
      }
    }
  };
  
  // editten en updaten
  const toggleEdit = async (sentence) => {
    sentences.value.forEach(s => {
    if (s !== sentence) {
      s.isEditing = false;
    }
  });
    if (sentence.isEditing) {
      try {
        sentence.content = addPeriod(sentence.content);
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
        isStoryClosed.value = true;

        // Nieuw verhaal beginnen en titel kiezen
        const newStoryRef = await addDoc(storyCollection, { 
          title: null,
          createdAt: serverTimestamp(), 
          closedAt: null, 
        });
        currentStoryId.value = newStoryRef.id;
        title.value = '';
        sentences.value = [{ content: 'Er was eens', id: 'initial', name: 'Demi', job: 'Developer', isEditing: false }];

        // sentences.value = [];
      } catch (error) {
        console.error("Error closing story: ", error);
      }
    }
  };
  
  onMounted(() => {
    fetchStoryData();
  });

  // modal toggles
  const toggleConfirmStory = () => {
  showConfirmStory.value = !showConfirmStory.value;
};

const closeConfirmStory = () => {
  showConfirmStory.value = false;
};

const closeEditModal = (sentence) => {
  sentence.isEditing = false;
};
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
  //         currentStoryId(newStoryRef.id);

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
  const saveButton = computed(() => {
  return titleSaved.value ? 'Titel opgeslagen' : 'Titel opslaan';
});
  </script>
  <style lang="scss" scoped>
  .admin-detail{
    // height: 200vh;
    max-width: 900px;
    margin: auto;
  }
  .header-wrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    top: 10vh;
  }
  .admin-deadline{
    display: grid;
    height: 100vh;
    place-items: center;
    margin: auto;
    text-align: center;
    // background: red;
  }
  
  .sentence-popup{
    position: absolute;
    z-index: 1;
  }
  .story-sentence{
    cursor: pointer;
    display: inline;
    position: relative;
    top: 15vh;
    padding-right: 4px;
    height: max-content;
  }
  button{
    cursor: pointer;
  }
  .error-message{
    color: red;
  }
  .confirm-story-sentence {
  &:nth-child(-n + 2) {
    font-size: 30px;
    display: block;

    // @include sm {
    //   font-size: 20px;
    // }
  }
}
  </style>
  