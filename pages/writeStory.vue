<template>
  <BlocksNav></BlocksNav>
  <BlocksForm></BlocksForm>

  <textarea
    v-model="textInput"
    @input="limitCheck"
    cols="30"
    rows="10"
    placeholder="Schrijf je zin"
    name="sentence"
    required
  ></textarea>
  <p>{{ remainingChar }} tekens over</p>
  <!-- waarom staat hier een arrow functie voor en kan ik niet gewoon de functie zelf aanroepen -->
  <button @click="() => addSentence()">Verzenden</button>

  <!-- onderstaande oplossing kon niet omdat ik in een kleiner component probeer te komen -->
  <!-- ik heb dit opgelost door vue routes te gebruiker -->
  <!-- <ElementsButton>
      <NuxtLink to="/confirm">
        Doorgaan
      </NuxtLink>
    </ElementsButton> -->
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { db } from "~/firebase";

const charLimit = 100;
const textInput = ref("");
const router = useRouter();

// nieuwe zinnen aanmaken en verzenden

const addSentence = () => {
  // if statement zodat de db niet wordt gevuld als het input veld leeg is.
  if (textInput.value === "") {
    return;
  }

  // zin toevoegen aan de db
  addDoc(collection(db, "sentences"), {
    content: textInput.value,
  })
    .then(() => {
      // inputfield leeg maken als de zin is verstuurd
      textInput.value = "";

      // gebruiker doorsturen naar de confirm pagina
      router.push({ name: "confirm" });
    })
    .catch((error) => {
      console.error("Error adding sentence, please try again later", error);
    });
};

// character check
const remainingChar = computed(() => {
  return charLimit - textInput.value.length;
});
// wat doet de slice?
// deze functie kijkt of de value van text input al meer is dan het character limiet
const limitCheck = () => {
  if (textInput.value.length >= charLimit) {
    textInput.value = textInput.value.slice(0, charLimit);
  }
};
// watcher zodat er altijd wordt gekeken wanneer de gebruiker tekens invult
watch(textInput, () => {
  limitCheck();
});
</script>
