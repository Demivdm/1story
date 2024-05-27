<template>
  <BlocksNav></BlocksNav>
  <ElementsBackButton></ElementsBackButton>
  <span v-if="currentUser">
    <ElementsButton @click="logout()">
      Logout
    </ElementsButton>
    <p>{{ logoutMessage }} </p>
  </span>

  <div v-if="prevSentence">
    <ElementsTagBlock></ElementsTagBlock>
    <p><strong>Name:</strong> {{ prevSentence.name }}</p>
    <ElementsTagBlock></ElementsTagBlock>
    <p><strong>Job:</strong> {{ prevSentence.job }}</p>
    <h2><strong>Jouw zin voor deze week:</strong> {{ prevSentence.content }}</h2>
  </div>
  <div v-if="!prevSentence">
    <p>oeps geen zin gevonden, probeer het later nog een keer</p>
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


const currentUser = useCurrentUser();
const charLimit = 100;
const textInput = ref("");
const nameInput = ref("");
const functionInput = ref("");
const auth = getAuth();
const router = useRouter();
const logoutMessage = ref('');
const prevSentence = ref(null);

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
    storyUID: "vq7I23zQK8iszSCXbMsj",
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

const fetchLastSentence = async () => {
  try {
    const q = query(
      collection(db, "sentences"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      prevSentence.value = {
        id: doc.id,
        ...doc.data()
      };
    } else {
      prevSentence.value = null;
    }
  } catch (error) {
    console.error("Error fetching last sentence: ", error);
  }
};

onMounted(() => {
  if (currentUser.value && currentUser.value.displayName) {
    nameInput.value = currentUser.value.displayName;
  }
  fetchLastSentence();
});
</script>
