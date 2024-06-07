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
      <div class="name-function-input">
      <span class="name-input">
        <label for="name">Mijn naam is</label>
        <div class="input-container">
        <input type="text" :placeholder="currentUser?.displayName || 'Voornaam'" v-model="nameInput" :class="{'wrong-input': inputValCheckNameInput}" required/>
        <p v-if="inputValCheckNameInput" class="error-message">De volgende karakters mogen NIET in je naam worden gebruikt: []{}+=-_|</p>
       
      </div>
      </span>

       <span class="function-input">
        <label for="functie">en ik werk als</label>
        <div class="input-container">

<!-- eerst de class die je wilt toggelen en daarna de functie met de voorwaarden voor true of false erin -->
<input type="text" placeholder="Functie" v-model="functionInput" :class="{'wrong-input': inputValCheckFunctionInput}" required/>

<p v-if="inputValCheckFunctionInput" class="error-message">
  De volgende karakters mogen NIET in je functie worden gebruikt: []{}+=-_|
</p>
</div>

       </span>
      
</div>
      <div class="week-sentence">
  <label for="name">Mijn zin van de week is</label>
  <div class="week-input-container">
  <textarea
    v-model="textInput"
    @input="limitCheck"
    cols="60"
    rows="1"
    placeholder="Vul jouw zin in"
    name="sentence"
    required
  ></textarea>
  <p class="remaining-char">{{ remainingChar }} tekens over</p>
</div>
      </div>
  

  <section class="button-wrapper">
<ElementsButton @click="addSentence" :disabled="!disabled">
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

const disabled = computed(() => 
  textInput.value !== '' && nameInput.value !== '' && functionInput.value !== ''
);
console.log(disabled.value)

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

  margin: 0 0 2rem 0;
  @include sm{

  
  
}
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

.info-wrapper{
  @include sm{
  // padding-left:1.5rem;
  padding: 0 2rem 0 2rem;
 }
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

@include md{
  font-size: 25px;
  
  
}
}
.modal-content{
  display: inline;
  // flex-direction: column;
  max-width: 1152px;
//   @include sm{
//   padding: 1rem;

// }


}

input,
textarea{
  background: transparent;
  border: 0;
  border-bottom: 1px solid black;
  font-size: 20px;
  padding: 1rem 0 1rem 0;
  font-family: 'syne';

@include sm{
  width: 100%;
  margin: 0;
  margin-bottom: 1rem;
}
  
}
input{
  // max-width: 400px;

  @include sm{
  width: 90%;
  margin: 0 ;
  margin-right: 1rem;
  
}
@include md{
  margin: 0;
  width: 100%;

}

@include lg{
// min-width: 280px;
width: 100%;

  
}
@include xl{
  // min-width: 350px;
  width: 100%;

  margin: 0;
  
  
}
@include xxl{
  // min-width: 380px;
  width: 100%;

  margin: 0;
  
  
}
}
textarea{
  position: relative;
@include sm{
  // max-width: 270px;

  margin: 0;

 
  
}
}
.week-input-container {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  flex-grow: 2;
  @include sm{
  width: 90%;

}
@include md{
  width: 100%;

}
}
.input-container {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  flex-grow: 2;
  @include sm{
  width: 100%;

}
@include md{
  width: 100%;

}
}
.remaining-char{
  text-align: right;
}
.input-wrapper{
  display: flex;
  flex-direction: column;
}
.week-sentence{
  display: flex;
  align-items: baseline;
  padding-top: 5rem;

  @include sm{
 flex-direction: column;
 padding-top: 3rem;

  
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
// position: absolute;
width: inherit;
height:max-content;// margin: 0;
// padding: 0;
  color: red;
width: 90%;
  z-index: 1;

margin: 0;
    font-size: 20px;

}
.error-message{

  max-width: 300px;
  color:red;
 position: absolute;
width: 100%;
 top: 140px;
  p{
    margin: 0;
  }
  @include sm{
    position: relative;
    top: 0;
  }
  @include md{
    // position: relative;
    // top: 80px;
    position: relative;
    top: 0;

  }
  
}
.name-function-input{

  display: flex;
  
  @include sm{
  flex-direction: column;
  
  
}
  @include md{

  flex-direction: column;
  
  
}
}

.name-input,
.function-input{
  display: flex;
  align-items: baseline;
  width: 100%;
  label{
    min-width: fit-content;
  }
  @include sm{
  flex-direction: column;
  
  
}

}
.function-input{
  .error-message{
    // margin-top: 7rem;
    @include sm{
    margin-top:1rem; 
}
  }
 
@include md{
    margin-top:3rem;
  
  
}
}
.buttons{
 
  margin: 2rem 2rem 0 0;
  @include sm{
    width: 100%;

  
  
}


}


</style>