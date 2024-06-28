<template>

  <main class="home-page">
<!-- <ElementsLogout></ElementsLogout> -->

    <BlocksNav></BlocksNav>

    <h2>
      Verbind, creëer en deel samen verhalen - één zin per week, elke maand een
      nieuw avontuur!
    </h2>
    <div class="home-page__buttons">
      <span v-if="currentUser">
        <ElementsButton to="/writeStory"> Deel jouw zin</ElementsButton>
      </span>
      <span v-else>
        <ElementsButton to="/loginPage"> Deel jouw zin</ElementsButton>
      </span>
   
      <ElementsScndButton to="/storyOverview"> Bekijk andere verhalen </ElementsScndButton>
    </div>
  </main>

</template>
<script setup lang="ts">
// onderstaande regel was om te checken of de gebruiker bestaat voordat alles wordt gemount
// definePageMeta({
//   middleware: ["auth"],
// });

// waarom type je hier binnen de ref maar in een functie is het achter de dubbele punt

const sentences = ref(<Sentence[]>[]);
const newSentence = ref<String>("");
const showConfirm = ref<boolean>(false);
const currentUser = useCurrentUser();
console.log(currentUser.value);

// let currentRandomSentence = ref<string>("Loading...");

// nieuwe zinnen aanmaken en verzenden
const addSentence = () => {
  // if statements om af te vangen wanneer de database leeg is
  if (newSentence.value === "") {
    return;
  }
  addDoc(collection(db, "sentences"), {
    content: newSentence.value,
  });
  // input veld legen nadat er iets in vestuurd
  newSentence.value = "";
};

// bevestiging van de zin

// de onderstaande optie is beter omdat het minder code is en precies hetzelfde doet als de 3 regels.
const confirmAddSentence = (): boolean => {
  if (newSentence.value === "") {
    return false;
  }
  addSentence();
  return false;
};
showConfirm.value = confirmAddSentence();

console.log(showConfirm);

// De code hieronder doet niks anders dan showconfirm toggelen

// const confirmAddSentence = () => {
//   showConfirm.value = false;
// }

// const cancelAddSentence = () => {
//   showConfirm.value = false;
// }

// willekeurige zin
// de willekeruig zin blijft nu constant updaten omdat het niet in de onmounted zit
// deze wordt nu aangeroepen binnen de onmounted waardoor het probleem is opgelost
// const getRandomSentence = () => {
//   if (sentences.value.length === 0) {
//     currentRandomSentence.value = "Sorry geen zin gevonden, probeer het later nog een keer";
//     return;
//   }

//   const randomIndex = Math.floor(Math.random() * sentences.value.length);
//   currentRandomSentence.value = sentences.value[randomIndex].content;
// console.log(randomIndex)
// }

// voor het ophalen van de zinnen uit de db
onMounted(() => {
  document.title = 'One story';
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
    // getRandomSentence();
  });
});

</script>
<style lang="scss" scoped>
// @import "../scss/mixins/_index.scss";
@import "../scss/mixins/index";
@import "../scss/vars/breakpoints";

$component: "home-page";

.#{$component}{

  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


 h2{
  width: 70vw;
  text-align: center;
  @include sm{
    font-size: 30px;
  }
}
&__buttons{
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 20px;
  
  @include sm{
    flex-direction: column;
    gap: 0;
    width: 100%;
  }
}

}

</style>