<template>
  <BlocksNav></BlocksNav>
  <ElementsBackButton></ElementsBackButton>
  <!-- <h2>
      Welcome {{ currentUser.displayName }}
        </h2>
      <button @click="logout">Logout</button>
       -->
       <span v-if="currentUser">
      <ElementsButton @click="logout()">
        Logout
      </ElementsButton>
        <p>{{ logoutMessage }} </p>
       </span>
    
     
<label for="name">Mijn naam is</label>
  <input type="text"  :placeholder="currentUser?.displayName || 'Vul hier je naam in'" v-model="nameInput"/>
  <label for="functie">en ik werk als</label>
  <input type="text"  placeholder="vul hier je functie in" v-model="functionInput"/>
  <label for="name">Mijn zin van de week is</label>
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
  
import { EmailAuthProvider, GoogleAuthProvider,} from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "~/firebase";
import { useCurrentUser } from 'vuefire';
import { signOut, getAuth } from 'firebase/auth';


  const currentUser = useCurrentUser()
const charLimit = 100;
const textInput = ref("");
const nameInput = ref("");
const functionInput = ref("");
const auth = getAuth();
const router = useRouter();
const logoutMessage = ref('');



// nieuwe zinnen aanmaken en verzenden

const addSentence = () => {
  // if statement zodat de db niet wordt gevuld als het input veld leeg is.
  if (textInput.value === "") {
    return;
  }

  
  // zin toevoegen aan de db
  addDoc(collection(db, "sentences"), {
    uid: currentUser.value.uid,
    content: textInput.value,
    name: nameInput.value,
    function: functionInput.value,
    createdAt: serverTimestamp(),
    used: false
  })
    .then(() => {
      // inputfield leeg maken als de zin is verstuurd
      textInput.value = "";
      nameInput.value = "";
      functionInput.value = "";


      // gebruiker doorsturen naar de confirm pagina
      router.push('confirm');
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
const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
    logoutMessage.value = "Logging out";
    setTimeout(() => {
      router.push('/');
      logoutMessage.value = ''; 
    }, 5000);
  } catch (error) {
    console.error("Error signing out: ", error);
    router.push('/404');
  }
};
// naam automatisch invullen wanneer deze beschikbaar is
onMounted(() => {
  if (currentUser.value && currentUser.value.displayName) {
    nameInput.value = currentUser.value.displayName;
  }
});
</script>
