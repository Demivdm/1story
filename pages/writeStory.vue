<template>
<BlocksNav></BlocksNav>
  <section class="story-wrapper">
    <!-- <span v-if="currentUser">
    <ElementsButton @click="logout()">
      Logout
    </ElementsButton>
    <p>{{ logoutMessage }} </p>
    </span> -->

  <div v-if="prevSentence">
    <div class="info-tags">
      <ElementsTagBlock></ElementsTagBlock>
    <p>{{ prevSentence.name }}</p>
    <ElementsTagBlock></ElementsTagBlock>
    <p>{{ prevSentence.job }}</p>
    </div>
 
    <h2>{{ prevSentence.content }}</h2>
  </div>
  <div v-if="!prevSentence">
    <p>oeps geen zin gevonden, probeer het later nog een keer</p>
  </div>
  <BlocksModal>
    <section class="modal-content">
      <span>
        <label for="name">Mijn naam is</label>
        <input type="text" :placeholder="currentUser?.displayName || 'Voornaam'" v-model="nameInput" required/>
        <label for="functie">en ik werk als</label>
        <input type="text" placeholder="Functie" v-model="functionInput" required/>
      </span>
      <span>
  <label for="name">Mijn zin van de week is</label>
  <textarea
    v-model="textInput"
    @input="limitCheck"
    cols="60"
    rows="1"
    placeholder="Vul jouw zin in"
    name="sentence"
    required
  ></textarea>
  
  <p>{{ remainingChar }} tekens over</p>

  <section class="button-wrapper">
<ElementsButton @click="addSentence">
    Verzenden
  </ElementsButton>
    
</section>
</span>
</section>

</BlocksModal>


</section>





      
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
<style lang="scss">
 @import "/scss/vars/_breakpoints.scss";
 h2{

  margin: 0 0 2rem 0;
 }
.story-wrapper{
  /* background-color: #F6F7FE; */
  height: 100vh;
  position: relative;
  background: #F6F7FE;
  padding: 5rem;
  @include sm{
    padding: 7rem 1rem 1rem 1rem;

  }
}

input:required:valid,
textarea:required:valid {
  border-bottom: 1px solid black;
}

input:required:invalid,
textarea:required:invalid {
  border-bottom-color: red;
}
.info-tags{
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 10px;
  text-transform: uppercase;
}
.info-tags p{
  padding-right: 20px;
}
label{
  font-size: 28px;
}
.modal-content{
  padding: 2rem;
  display: flex;
  flex-direction: column;
  @include sm{
  
  padding: 1rem;
}
}

input,
textarea{
  background: transparent;
  border: 0;
  border-bottom: 1px solid black;
  font-size: 20px;
  margin: 0 1rem 0 1rem;
  width: max-content;
  padding: .5rem 0 .5rem 0;
  width: 30%;
@include sm{
  width: 100%;
  margin: 0;
  margin-bottom: 1rem;
}
  
}
textarea{
  position: relative;
  top: 13px;
}
.button-wrapper{
  display: flex;
  position: relative;
  justify-content: flex-end;
  @include sm{
  bottom: 3rem;
  left: 1rem;
}

}

</style>