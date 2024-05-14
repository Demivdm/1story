<template>
    <BlocksNav></BlocksNav>
    <BlocksForm></BlocksForm>

    <!-- <form action="">
    <BlocksCard></BlocksCard>
    <ElementsTagBlock></ElementsTagBlock>naam vorige schrijver
    <ElementsTagBlock></ElementsTagBlock>functie vorige schrijver

    <p> Mijn naam is</p>
  <ElementsInput></ElementsInput>
  <p> en ik werk als</p>
   <ElementsInput></ElementsInput>
 
   <p> Mijn zin van de week is </p>
  </form> -->
      <textarea v-model="textInput" @input="limitCheck"
 cols="30" rows="10" placeholder="Schrijf je zin" ></textarea>
      <p>{{ remainingChar }} tekens over</p>
      <button @click="() => addSentence()">Verzenden</button>

    
    <!-- <ElementsButton>
      <NuxtLink to="/confirm">
        Doorgaan
      </NuxtLink>
    </ElementsButton> -->

  </template>

<script setup>
import { ref, computed, watch } from 'vue';
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from '~/firebase';




const charLimit = 100;
const textInput = ref('');
const router = useRouter();



// nieuwe zinnen aanmaken en verzenden

const addSentence = () => {
  // if statement to handle when the input field is empty
  if(textInput.value === '') {
    return;
  }

  // Add the sentence to the database
  addDoc(collection(db, "sentences"), {
    content: textInput.value,
  }).then(() => {
    // Clear the input field after sending
    textInput.value = '';
    
    // Navigate to the confirmation page
    router.push({ name: 'confirm' });
  }).catch(error => {
    console.error('Error adding sentence:', error);
  });
};


// chararcter check
const remainingChar = computed(() => {
  return charLimit - textInput.value.length;
});

const limitCheck = (event) => {
  if (textInput.value.length >= charLimit) {
    textInput.value = textInput.value.slice(0, charLimit);
  }
};

watch(textInput, () => {
  limitCheck();
});
</script>




