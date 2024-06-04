<template>
<BlocksNav></BlocksNav>
  <section class="story-container">
    <!-- <span v-if="currentUser">
    <ElementsButton @click="logout()">
      Logout
    </ElementsButton>
    <p>{{ logoutMessage }} </p>
    </span> -->
<div class="story-wrapper">
  <div v-if="prevSentence" class="info-wrapper">
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
        <input type="text" :placeholder="currentUser?.displayName || 'Voornaam'" v-model="nameInput" :class="{'wrong-input': inputValCheckNameInput}" required/>
        <label for="functie">en ik werk als</label>
        <!-- eerst de class die je wilt toggelen en daarna de functie met de voorwaarden voor true of false erin -->
        <input type="text" placeholder="Functie" v-model="functionInput" :class="{'wrong-input': inputValCheckFunctionInput}" required/>
        <p v-if="inputValCheckFunctionInput || inputValCheckNameInput" class="error-message">Oeps je hebt een verkeerd karakter gebruikt. De volgende karakters mogen <strong>niet</strong>gebruikt worden: []{}+=-_|</p>

      </span>
      <span class="week-sentence">
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
</span>
  
  <p>{{ remainingChar }} tekens over</p>

  <section class="button-wrapper">
<ElementsButton @click="addSentence">
    Verzenden
  </ElementsButton>
    
</section>
</section>

</BlocksModal>
</div>

</section>





      
</template>

<script setup lang="ts">


const currentUser = useCurrentUser();
const charLimit = 100;
const textInput = ref("");
const nameInput = ref("");
const functionInput = ref("");
const auth = getAuth();
const router = useRouter();
const logoutMessage = ref('');
const prevSentence = ref(null);
// const inputValCheck = ref(false);
const inputValCheckFunctionInput = ref(false);
const inputValCheckNameInput = ref(false);

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
const invalidChars = /[=+\[\]{}\-|\/]/;


// ik gebruik hier watcheffect omdat ik naar twee verschillende waarden
// misschien kan alles wel in deze watcher?
watchEffect(() => {
  inputValCheckFunctionInput.value = invalidChars.test(functionInput.value);
  inputValCheckNameInput.value = invalidChars.test(nameInput.value);
  console.log("functie input waarde", inputValCheckFunctionInput.value);
  console.log("naam input waarde", inputValCheckNameInput.value);
});


</script>
<style lang="scss">
 @import "/scss/vars/_breakpoints.scss";
 h2{

  margin: 0 0 5rem 0;
 }
.story-container{
  /* background-color: #F6F7FE; */
  min-height:100vh;
  position: relative;
  width: 100vw;
  background: #F6F7FE ;


  @include sm{
    padding-top: 5rem ;
    width: 100vw;

  }
}
.story-wrapper{
  max-width: 1296px;
  position: relative;
  left: 50%;
  transform: translate(-50%,-10%);
  padding-top:8rem ;
  background: transparent;

}


.info-tags{
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 10px;
  text-transform: uppercase;
  padding-top: 5rem;
}
.info-tags p{
  padding-right: 20px;
}
label{
  font-size: 28px;
}
.modal-content{
  display: flex;
  flex-direction: column;
  max-width: 1152px;
  padding-top: 1rem;
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
  padding: .5rem 0 .5rem 0;
  font-family: 'syne';

@include sm{
  width: 100%;
  margin: 0;
  margin-bottom: 1rem;
}
  
}
input{
  width: 380px;
  @include sm{
  width: 100%;
  
}
@include md{
  width: 100%;
  margin: 0;
  
  
}
}
textarea{
  position: relative;
  max-width: 830px;

@include md{

  margin: 0;
 
  
}
}
.week-sentence{
  display: flex;
  align-items: baseline;
  padding-top: 4rem;
  @include sm{
 flex-direction: column;
  
}
  @include md{
 flex-direction: column;
  
}
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
.wrong-input {
  background: red;
  border-bottom: solid red;
  z-index: 1;
}
.error-message{

  position: absolute;
//  margin-bottom: 1rem;


}


</style>