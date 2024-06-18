<template>
  <BlocksNav></BlocksNav>
  <section class="story-container">
    <!-- uitlof knop na overleg toevoegen -->
    <!-- <span v-if="currentUser">
    <ElementsButton @click="logout()">
      Logout
    </ElementsButton>
    <p>{{ logoutMessage }} </p>
    </span> -->
    <div class="story-container__story-wrapper">
      <div v-if="prevSentence && !isDeadlinePassed" class="story-container__info-wrapper">
        <div class="story-container__info-tags">
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
      <div v-if="isDeadlinePassed">
        <p>Oeps de deadline is verstreken. Geen zorgen we sturen je een mailtje als je weer mee kunt doen!</p>
      </div>
      <BlocksModal>
        <section class="story-container__modal-content">
          <div class="story-container__name-function-input">
            <span class="story-container__name-input">
              <label for="name">Mijn naam is</label>
              <div class="story-container__input-container">
                <input
                :disabled="isDeadlinePassed"
                  type="text"
                  :placeholder="currentUser?.displayName || 'Voornaam'"
                  v-model="nameInput"
                  :class="{ 'wrong-input': inputValCheckNameInput, 'disabled-pointer': isDeadlinePassed}"
                  required
                />
                <p
                  v-if="inputValCheckNameInput"
                  class="story-container__error-message"
                >
                  De volgende karakters mogen NIET in je naam worden gebruikt:
                  []{}+=-_|
                </p>
              </div>
            </span>

            <span class="story-container__function-input">
              <label for="functie">en ik werk als</label>
              <div class="story-container__input-container">
                <!-- eerst de class die je wilt toggelen en daarna de functie met de voorwaarden voor true of false erin -->
                <input
                :disabled="isDeadlinePassed"


                  type="text"
                  placeholder="Functie"
                  v-model="functionInput"
                  :class="{ 'wrong-input': inputValCheckFunctionInput,'disabled-pointer': isDeadlinePassed }"
                  required
                />

                <p
                  v-if="inputValCheckFunctionInput"
                  class="story-container__error-message"
                >
                  De volgende karakters mogen NIET in je functie worden
                  gebruikt: []{}+=-_|
                </p>
              </div>
            </span>
          </div>
          <div class="story-container__week-sentence">
            <label for="name">Mijn zin van de week is</label>
            <div class="story-container__week-input-container">
              <textarea
              :disabled="isDeadlinePassed"
              :class="{'disabled-pointer': isDeadlinePassed}"
                v-model="textInput"
                @input="limitCheck"
                cols="60"
                rows="1"
                placeholder="Vul jouw zin in"
                name="sentence"
                required
              ></textarea>
              <p class="story-container__remaining-char">
                {{ remainingChar }} tekens over
              </p>
            </div>
          </div>

          <section class="story-container__button-wrapper">
            <ElementsButton @click="addSentence" :disabled="!isSubmitEnabled">
              Verzenden
            </ElementsButton>
          </section>
        </section>
      </BlocksModal>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useCurrentStory} from '../composable/useCurrentStory';
  import { useDeadline} from '../composable/useDeadline';

  
const { currentStoryId } = useCurrentStory();
const {isDeadlinePassed } = useDeadline();

const currentUser = useCurrentUser();
const charLimit = 100;
const textInput = ref("");
const nameInput = ref("");
const functionInput = ref("");
const auth = getAuth();
const router = useRouter();
const logoutMessage = ref("");
const prevSentence = ref(null);

// const inputValCheck = ref(false);
const inputValCheckFunctionInput = ref(false);
const inputValCheckNameInput = ref(false);



// aanpassen om evoor te zogen dat input niet standaard disabled is.  
const isSubmitEnabled = computed(() => {
  return !isDeadlinePassed.value && textInput.value !== "" && nameInput.value !== "" && functionInput.value !== "";
});
console.log('deadline passed is',isDeadlinePassed.value)

// console.log('is submit enabled',isSubmitEnabled.value)
// const disabled = computed(
//   () =>
//     textInput.value !== "" &&
//     nameInput.value !== "" &&
//     functionInput.value !== "" &&
//     deadline.value < new Date()

// );

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
    
    // storyuid matchen met die van currentstory
    // storyUID: "vq7I23zQK8iszSCXbMsj",
    // perhaps i shoudl fill with currentStoryid.
    storyUID: currentStoryId.value,


  })
  console.log('current story id is',currentStoryId.value)

    .then(() => {
      textInput.value = "";
      nameInput.value = "";
      functionInput.value = "";

      router.push("confirm");
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
      router.push("/");
      logoutMessage.value = "";
    }, 5000);
  } catch (error) {
    console.error("Error signing out: ", error);
    router.push("/404");
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
        ...doc.data(),
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
watchEffect(() => {
  inputValCheckFunctionInput.value = invalidChars.test(functionInput.value);
  inputValCheckNameInput.value = invalidChars.test(nameInput.value);
  console.log("functie input waarde", inputValCheckFunctionInput.value);
  console.log("naam input waarde", inputValCheckNameInput.value);
});
</script>

<style scoped lang="scss">
@import "/scss/vars/_breakpoints.scss";

$component: "story-container";

.#{$component} {
  min-height: 100vh;
  position: relative;
  width: 100vw;
  background: #f6f7fe;

  @include sm {
    padding-top: 5rem;
    width: 100vw;
  }
  h2 {
    margin: 0 0 2rem 0;
  }

  &__story-wrapper {
    max-width: 1296px;
    position: relative;
    left: 50%;
    transform: translate(-50%, -10%);
    padding-top: 8rem;
    background: transparent;
  }

  &__info-wrapper {
    @include sm {
      // padding-left:1.5rem;
      padding: 0 2rem 0 2rem;
    }
  }

  &__info-tags {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 10px;
    text-transform: uppercase;
    padding-top: 5rem;
    @include sm {
      padding-top: 0;
    }
  }
  &__info-tags p {
    padding-right: 20px;
  }
  label {
    font-size: 28px;

    @include md {
      font-size: 25px;
    }
  }
  &__modal-content {
    display: inline;

    max-width: 1152px;
  }

  input,
  textarea {
    background: transparent;
    border: 0;
    border-bottom: 1px solid black;
    font-size: 20px;
    padding: 1rem 0 1rem 0;
    font-family: "syne";

    @include sm {
      width: 100%;
      margin: 0;
      margin-bottom: 1rem;
    }
  }
  input {
    @include sm {
      width: 90%;
      margin: 0;
      margin-right: 1rem;
    }
    @include md {
      margin: 0;
      width: 100%;
    }

    @include lg {
      width: 100%;
    }
    @include xl {
      width: 100%;

      margin: 0;
    }
    @include xxl {
      width: 100%;

      margin: 0;
    }
  }
  textarea {
    position: relative;
    @include sm {
      margin: 0;
    }
  }
  &__week-input-container {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    flex-grow: 2;
    @include sm {
      width: 90%;
    }
    @include md {
      width: 100%;
    }
  }
  &__input-container {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    flex-grow: 2;
    @include sm {
      width: 100%;
    }
    @include md {
      width: 100%;
    }
  }
  &__remaining-char {
    text-align: right;
  }
  &__input-wrapper {
    display: flex;
    flex-direction: column;
  }
  &__week-sentence {
    display: flex;
    align-items: baseline;
    padding-top: 5rem;

    @include sm {
      flex-direction: column;
      padding-top: 3rem;
    }
    @include md {
      flex-direction: column;
    }
  }

  &__button-wrapper {
    display: flex;
    position: relative;
    justify-content: flex-end;
    @include sm {
      bottom: 3rem;
      left: 1rem;
    }
  }
  &__wrong-input {
    width: inherit;
    height: max-content;

    color: red;
    width: 90%;
    z-index: 1;

    margin: 0;
    font-size: 20px;
  }
  &__error-message {
    max-width: 300px;
    color: red;
    position: absolute;
    width: 100%;
    top: 100px;
    p {
      margin: 0;
    }
    @include sm {
      position: relative;
      top: 0;
    }
    @include md {
      position: relative;
      top: 0;
    }
  }
  &__name-function-input {
    display: flex;

    @include sm {
      flex-direction: column;
    }
    @include md {
      flex-direction: column;
    }
  }

  &__name-input,
  &__function-input {
    display: flex;
    align-items: baseline;
    width: 100%;
    label {
      min-width: fit-content;
    }
    @include sm {
      flex-direction: column;
    }
  }
  &__function-input {
    &__error-message {
      @include sm {
        margin-top: 1rem;
      }
    }

    @include md {
      margin-top: 3rem;
    }
  }
  &__buttons {
    margin: 2rem 2rem 0 0;
    @include sm {
      width: 100%;
    }
  }

}
.disabled-pointer {
    cursor: not-allowed;
  }
</style>
