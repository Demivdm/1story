<template>
  <section class="admin-detail">
      <div class="admin-detail__background-wrapper">
    <BlocksNav></BlocksNav>
<div class="admin-detail__date">
  <ElementsTagBlock></ElementsTagBlock>
  <p>{{ createdAt }}</p>
</div>
    <div v-if="isDeadlinePassed" >
      <div class="admin-detail__header-wrapper">
        <div class="admin-detail__intro">
          <h1>Controleer het verhaal en kies een titel</h1>
          <p>Klik op de zinnen om deze te bewerken</p>
        </div>
      <ElementsButton @click="toggleConfirmStory" v-if="!showConfirmStory && isDeadlinePassed && !isStoryClosed">
        Open verhaal bevestiging
      </ElementsButton>
    </div>
      <ElementsScrollUp></ElementsScrollUp>
      <div class="admin-detail__sentence-wrapper">

   
      <span v-for="sentence in sentences" :key="sentence.id"  class="admin-detail__confirm-story-sentence">
        
        <p class="admin-detail__story-sentence" @click="toggleEdit(sentence)">{{ sentence.content }} </p>
          <BlocksModal v-if="sentence.isEditing" class="admin-detail__sentence-popup">
          <button class="admin-detail__close-button" @click="closeEditModal(sentence)">X</button>
       
            <div class="admin-detail__tag-wrapper">
              <div class="admin-detail__tag-block">
                <ElementsTagBlock></ElementsTagBlock>
                <p>{{ sentence.name }}</p>
              </div>
    
              <div class="admin-detail__tag-block">
                <ElementsTagBlock></ElementsTagBlock>
                <p>{{ sentence.job }}</p>
              </div>
            </div>
            <h5 class="admin-detail__input-title">Zin van de week</h5>
            <input class="admin-detail__edit-input" v-model="sentence.content" />
            <ElementsButton class="admin-detail__save-button" @click="toggleEdit(sentence)">
              Opslaan
            </ElementsButton>    
        </BlocksModal>
      </span>
    </div>
    
      <!-- confirm modal -->
      <div class="admin-detail__confirm-story" v-if="showConfirmStory">
        <BlocksModal>
          <button class="admin-detail__close-button" @click="closeConfirmStory">X</button>

        <input v-model="title" placeholder="Voeg een titel voor het verhaal toe" required/>
        <div class="admin-detail__button-wrapper">
          <ElementsButton @click="saveTitle">
        {{ saveButton}}

      </ElementsButton>
        
        <ElementsButton :disabled="!title" @click="closeStory">
        Verhaal verzenden
      </ElementsButton>
      
        </div>
   
      <p v-if="errorMessage" class="admin-detail__error-message">{{ errorMessage }}</p>
    </BlocksModal>
      </div>
   
      <!-- modal -->
  
    </div>

    <div v-else class="admin-detail__admin-deadline">
        <p>De deadline is nog niet verstreken. Je kunt het verhaal vanaf {{ formattedDeadline }} controleren</p>
    </div>

    <div v-if="isStoryClosed" class="admin-detail__succes">
      <p>Bedankt! Het verhaal is succesvol verzonden.</p>
      <ElementsButton @click="returnHome">Keer terug naar home</ElementsButton>
    </div>
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

  const createdAt = ref('')

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
        const timestamp = storyDoc.data().createdAt || '';
        createdAt.value = timestamp ? formatDate(new Date(timestamp.seconds * 1000)) : '';
        currentStoryId.value = storyDoc.id;
        console.log("story doc id is",storyDoc.id)
        title.value = storyDoc.data().title || '';


  // vullen met zinnen met hetzelfde id

        const sentenceQuery = query(sentenceCollection, where("storyUID", "==", currentStoryId.value), orderBy("createdAt", "asc"));
        const sentenceSnapshot = await getDocs(sentenceQuery);
        sentences.value =
         [{ content: 'Er was eens....', id: 'initial', name: 'Demi', job: 'Developer', isEditing: false}, ...sentenceSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, isEditing: false }))];
      }
    } catch (error) {
      console.error("Error fetching story data: ", error);
    }
  };
// datum formatteren
  const formatDate = (date: Date | null) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
  return date.toLocaleDateString("nl-NL", options);
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

$component: "admin-detail";

.#{$component} {
  background: linear-gradient(180deg, #FBFEFE 0%, #DBF3FA 100%);

  &__date{
    display: flex;
    align-items: center;
    top: 10vh;
    position: relative;
    p{
      margin: 0;
      padding: 0;
    }

  }
  &__background-wrapper{
    max-width: 900px;
    min-height: 100vh;
    margin:auto;
  }

  &__tag-block{
    display: flex;
    align-items: center;
    padding-bottom: 1rem;
    
    p{
      margin: 0;
      padding: 0;
      font-size: 20px;
      margin-right: 1rem;
    }
  }
  &__tag-wrapper{
    display: flex;
  }
  &__admin-detail{
    min-height: 100vh;
    width: 100vw;
    margin: auto;
    left: 100%;
    max-width: 900px;

  }

  &__header-wrapper{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: relative;
    top: 10vh;
  }
  &__admin-deadline{
    display: grid;
    height: 100vh;
    place-items: center;
    margin: auto;
    text-align: center;
    // background: red;
  }
  
  &__sentence-popup{
    position: absolute;
    z-index: 1;
  }
  &__story-sentence{
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
  &__error-message{
    color: red;
  }
  &__confirm-story-sentence {
  &:nth-child(-n + 2) {
    font-size: 30px;
    display: block;

    // @include sm {
    //   font-size: 20px;
    // }
  }

}
&__close-button{
  background: transparent;
  border: 0;
  padding: 0;
  font-weight: 900;
  font-size: 20px;
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}
&__input-title{
  padding: 0;
  margin: 0;
  font-size: 14px;  
  opacity: .5;
  position: relative;
  top: .5rem;
}
&__edit-input{
  background: transparent;
  border: 0;
  width: 100%;
  border-bottom: 1px solid black;
  margin-bottom: 2rem;
  font-size: 16px;
  padding: 1rem 0;
}
&__save-button{
  position: absolute;
  right: 4rem;
}
&__button-wrapper{
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  width: 60%;
}
&__confirm-story{
  input{
    background: transparent;
    border: 0;
    border-bottom: 1px solid black;
    font-size: 16px;
    width: 56%;
    padding: .5rem 0;
  }
}
}
  </style>
  