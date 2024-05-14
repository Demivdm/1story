<template>
  <main>
  <!-- <div> -->
    <BlocksNav></BlocksNav>
<!-- prevent is er in dit geval voor dat de pagina niet herlaadt elke keer als er iets wordt toegeveoegd -->
<!-- wat moet ik hier neerzetten met de verkorte functie -->
    <!-- <form @submit.prevent="openConfirmation"> -->
      <!-- <input v-model="newSentence" type="text" placeholder="Schrijf je zin"> -->
      <!-- disabled is zodat er niet op verzenden geklikt kan worden wanneer het veld leeg is -->
      <!-- op deze manier kan de db niet gevuld worden met lege velden -->
      <!-- <ElementsButton :disabled="!newSentence">Deel jouw zin</ElementsButton> -->
    <!-- </form> -->
    <h2>Verbind, creëer en deel samen verhalen - één zin per week, elke maand een nieuw avontuur!</h2>
    <ElementsButton>
      <NuxtLink to="/writeStory">
        Deel jouw zin
      </NuxtLink>
    </ElementsButton>
    <ElementsButton>
      <NuxtLink to="/allStories">
        Bekijk andere verhalen
      </NuxtLink>
    </ElementsButton>


    <!-- <h2>Dit zijn alle zinnen</h2> -->
    <!-- werkt in combinatie met de ref beter omdat er niet de hele tijd naar alle elementen hierin gekeken moet worden -->
    <!-- <div v-for="sentence in sentences" :key="sentence.id"> -->

      <!-- <p>{{ sentence.content }}</p> -->
      <!-- <pre>zinnen: {{ sentence.content }}</pre> -->

    <!-- </div> -->

    <!-- <div class="confirm-pop-up" v-if="showConfirm">
      <div class="confirm-pop-up-content">
        <p>Weet je zeker of je deze zin wilt toevoegen?</p> -->
        <!-- BR ERUIT HALEN TIJDENS VORMGEVEN -->
        <!-- {{ newSentence }}<br>
        <button @click="() => confirmAddSentence()">Ja, ik wil mijn zin toevoegen</button>
        <button @click="cancelAddSentence()">Nee, ik wil verder gaan met bewerken</button>
      </div>
    </div>

    <h3>Dit is jouw willekeurige persoonlijke zin</h3>
    <p>{{ currentRandomSentence }}</p>
  </div> -->
</main>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from '~/firebase';


// waarom type je hier binnen de ref maar in een functie is het achter de dubbele punt

const sentences = ref(<Sentence[]>[]);
const newSentence = ref<String>('');
const showConfirm = ref<boolean>(false);
let currentRandomSentence = ref<string>("Loading...");


// nieuwe zinnen aanmaken en verzenden
const addSentence = () => {
  // if statements om af te vangen wanneer de database leeg is
  if(newSentence.value === '') {
    return
  }
  addDoc(collection(db, "sentences"), {
    content: newSentence.value,
  });
  // input veld legen nadat er iets in vestuurd
  newSentence.value = ''; 
}



// bevestiging van de zin

// de onderstaande optie is beter omdat het minder code is en precies hetzelfde doet als de 3 regels.
const confirmAddSentence = ():boolean => {
  if(newSentence.value === '') {
    return false
  }
  addSentence();
  return false;
  
}
showConfirm.value = confirmAddSentence()

console.log(showConfirm)


// De code hieronder doet niks anders dan showconfirm toggelen

// const confirmAddSentence = () => {
//   showConfirm.value = false;
// }

// const cancelAddSentence = () => {
//   showConfirm.value = false;
// }

const openConfirmation = () => {
  showConfirm.value = true;
}


// willekeurige zin
// de willekeruig zin blijft nu constant updaten omdat het niet in de onmounted zit
// deze wordt nu aangeroepen binnen de onmounted waardoor het probleem is opgelost
const getRandomSentence = () => {
  if (sentences.value.length === 0) {
    currentRandomSentence.value = "Sorry geen zin gevonden, probeer het later nog een keer";
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * sentences.value.length);
  currentRandomSentence.value = sentences.value[randomIndex].content;
  // console.log(randomIndex)
}

// voor het ophalen van de zinnen uit de db
onMounted(() => {


  // waarom kan sentence hier niet met <type>
  onSnapshot(collection(db, "sentences"), (querySnapshot) => {
    const fbSentences: Sentence[] = [];
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
    getRandomSentence();
  });
 
  
});

</script>
<style lang="scss" scoped>
@import '../scss/mixins/_index.scss';

main{
  @include main-background;
  height: 100vh;
}
</style>
