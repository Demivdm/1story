<template>
  <BlocksNav></BlocksNav>
  <ElementsBackButton></ElementsBackButton>
  <span v-if="currentUser">
    <ElementsButton @click="logout()">
      Logout
    </ElementsButton>
    <p>{{ logoutMessage }} </p>
  </span>

  <div v-if="randomSentence">
    <ElementsTagBlock></ElementsTagBlock>
    <p><strong>Name:</strong> {{ randomSentence.name }}</p>
    <ElementsTagBlock></ElementsTagBlock>
    <p><strong>Job:</strong> {{ randomSentence.job }}</p>
    <h2><strong>Sentence:</strong> {{ randomSentence.content }}</h2>
  </div>
    
  <label for="name">Mijn naam is</label>
  <input type="text" :placeholder="currentUser?.displayName || 'Vul hier je naam in'" v-model="nameInput"/>
  <label for="functie">en ik werk als</label>
  <input type="text" placeholder="vul hier je functie in" v-model="functionInput"/>
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
  <button @click="addSentence">Verzenden</button>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "~/firebase";
import { useCurrentUser } from 'vuefire';
import { signOut, getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';

const currentUser = useCurrentUser();
const charLimit = 100;
const textInput = ref("");
const nameInput = ref("");
const functionInput = ref("");
const auth = getAuth();
const router = useRouter();
const logoutMessage = ref('');
const randomSentence = ref(null);

const fetchRandomSentence = async (userId) => {
  console.log("Fetching random sentence for user:", userId);
  
  try {
    const q = query(
      collection(db, "sentences"),
      where("used", "==", false),
      where("uid", "!=", userId)
    );
    const querySnapshot = await getDocs(q);

    const sentences = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (sentences.length > 0) {
      const randomIndex = Math.floor(Math.random() * sentences.length);
      const selectedSentence = sentences[randomIndex];

      // Mark the sentence as used
      const sentenceRef = doc(db, "sentences", selectedSentence.id);
      await updateDoc(sentenceRef, { used: true });

      randomSentence.value = selectedSentence;
    } else {
      randomSentence.value = null;
    }
  } catch (error) {
    console.error("Error fetching random sentence: ", error);
  }
};

const addSentence = () => {
  if (!currentUser.value || !currentUser.value.uid) {
    console.error("User not authenticated or UID is missing");
    return;
  }

  if (textInput.value === "") {
    return;
  }

  addDoc(collection(db, "sentences"), {
    uid: currentUser.value.uid,
    content: textInput.value,
    name: nameInput.value,
    job: functionInput.value,
    createdAt: serverTimestamp(),
    used: false
  })
  .then(() => {
    textInput.value = "";
    nameInput.value = "";
    functionInput.value = "";

    router.push('confirm');
  })
  .catch((error) => {
    console.error("Error adding sentence, please try again later", error);
  });
};

const remainingChar = computed(() => {
  return charLimit - textInput.value.length;
});

const limitCheck = () => {
  if (textInput.value.length >= charLimit) {
    textInput.value = textInput.value.slice(0, charLimit);
  }
};

watch(textInput, () => {
  limitCheck();
});

const logout = async () => {
  try {
    await signOut(auth);
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

onMounted(() => {
  if (currentUser.value && currentUser.value.displayName) {
    nameInput.value = currentUser.value.displayName;
  }
  if (currentUser.value && currentUser.value.uid) {
    fetchRandomSentence(currentUser.value.uid);
  }
});
</script>
