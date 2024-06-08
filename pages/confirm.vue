<template>
  <section class="confirm-page">
    <BlocksNav></BlocksNav>

    <div class="confirm-page__confirm-msg">
      <h2>Bedankt voor het delen</h2>
      <p class="confirm-page__confirm-intro">
        Hieronder kun je nogmaals zien wat je hebt ingevuld. Foutje gemaakt?
        Geen probleem, je kunt het nu nog aanpassen. Als alles naar wens is, kun
        je het tabblad sluiten of andere verhalen bekijken.
      </p>
    </div>

    <div
      v-for="sentence in sentences"
      :key="sentence.id"
      class="confirm-page__sentence-container"
    >
      <div class="confirm-page__confirm">
        <BlocksModal>
          <div class="confirm-page__modal-content">
            <span class="confirm-page__recap-field">
              <span class="confirm-page__name-recap">
                <h5>Mijn naam is</h5>
                <h6>Voornaam</h6>
                <p>{{ sentence.name }}</p>
              </span>

              <span class="confirm-page__job-recap">
                <h5>en ik werk als</h5>
                <h6>Functie</h6>
                <p>{{ sentence.job }}</p>
              </span>
            </span>
            <span class="confirm-page__sentence-recap">
              <h5>Mijn zin van de week</h5>
              <h6>Zin van de week</h6>
              <input
                :disabled="!sentence.isEditing"
                :class="{ disabled: !sentence.isEditing }"
                v-model="sentence.content"
                class="confirm-page__sentence-input"
                @input="limitCheck"
              />
            </span>
          </div>

          <p>{{ remainingChar(sentence) }} tekens over</p>
          <div class="confirm-page__button-wrapper">
            <ElementsScndButton @click="toggleEdit(sentence)">
              {{ sentence.isEditing ? "Verzenden" : "Bewerken" }}
            </ElementsScndButton>
            <ElementsButton to="allStories">
              Bekijk andere verhalen
            </ElementsButton>
          </div>
        </BlocksModal>
      </div>
    </div>
  </section>
</template>

<script setup>
const sentences = ref([]);
const name = ref("");
const job = ref("");
const charLimit = 100;

const currentUser = useCurrentUser();

const fetchSentences = async (userId) => {
  try {
    const collectionRef = collection(db, "sentences");
    const q2 = query(
      collectionRef,
      where("uid", "==", userId),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    // dit wacht totdat de query opgehaald is, dan wordt er door de sentenes heen gemapt.
    const querySnapshot = await getDocs(q2);
    sentences.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content,
        isEditing: false,
        uid: data.uid,
        name: data.name,
        job: data.job,
        createdAt: data.createdAt || null,
      };
    });
    console.log({ sentences });
  } catch (error) {
    console.error("Error fetching sentences: ", error);
  }
};
const toggleEdit = async (sentence) => {
  if (sentence.isEditing) {
    try {
      const sentenceRef = doc(db, "sentences", sentence.id);
      await updateDoc(sentenceRef, {
        content: sentence.content,
      });
    } catch (error) {
      console.error("Error updating sentence: ", error);
    }
  }
  sentence.isEditing = !sentence.isEditing;
};

const limitCheck = (sentence) => {
  if (sentence.content.length > charLimit) {
    sentence.content = sentence.content.slice(0, charLimit);
    console.log(sentence.content.lenght);
  }
};

// bereken hoeveel karakters er nog zijn
const remainingChar = (sentence) => {
  return charLimit - sentence.content.length;
};

// ik heb een watcher nodig om te kijen of de waarde van de user veranderd, of de waarde van de uid veranded
watch(
  currentUser,
  (newValue) => {
    if (newValue && newValue.uid) {
      console.log({ currentUser, newValue });
      fetchSentences(newValue.uid);
    }
  },
  { immediate: true }
);
</script>
<style scoped lang="scss">
@import "/scss/vars/_breakpoints.scss";

$component: "confirm-page";

.#{$component} {
  background: #f6f7fe;

  &__confirm {
    padding: 1rem;
    @include sm {
      padding: 1rem;
    }
  }
  &__confirm-msg {
    padding: 5rem 4rem 0 5rem;

    @include sm {
      padding: 5rem 1rem 1rem 1rem;
    }

    p {
      width: 50vw;
      @include sm {
        width: 100%;
      }
    }
  }

  &__modal-content {
    display: flex;
    flex-direction: column;
    max-width: 1152px;
    padding-top: 3rem;
    @include sm {
      padding: 1rem;
    }
  }

  &__recap-wrapper {
    flex-direction: row;
    max-width: 380px;

    @include sm {
      flex-direction: column;
    }
    @include md {
      display: block;
    }
  }
  &__recap-field {
    display: flex;
    align-items: baseline;
    max-width: 1152px;

    @include sm {
      flex-direction: column;
    }
    @include md {
      flex-direction: column;
    }
  }

  &__recap-field h6 {
    padding-bottom: 0.5rem;
  }
  &__job-recap,
  &__name-recap {
    display: flex;
    align-items: baseline;
    padding-bottom: 1rem;
    min-width: 400px;

    @include sm {
      flex-direction: column;
      width: 100%;
      min-width: 200px;
    }
    @include md {
      width: 100%;
    }
  }

  &__job-recap {
    @include sm {
      padding-bottom: 2rem;
    }
  }

  &__name-recap {
    @include sm {
      padding-bottom: 2rem;
    }
  }
  &__recap-field p {
    padding-bottom: 0.7rem;
    margin: 0.5rem 1.5rem 2rem 0.5rem;
    flex-wrap: wrap;
    width: 380px;
    font-size: 20px;
    border-bottom: 1px solid black;
    @include sm {
      margin: 0;
      font-size: 16px;
      width: 100%;
    }
  }

  &__recap-field h5 {
    padding-right: 1rem;
    @include sm {
      padding-bottom: 0.5rem;
    }
  }
  &__sentence-recap {
    display: flex;
    align-items: center;
    @include sm {
      flex-direction: column;
      align-items: flex-start;
    }
    h5 {
      @include md {
        padding-right: 2.5rem;
      }
    }
  }
  &__sentence-recap {
    @include sm {
      padding-right: 1rem;
    }
  }
  &__sentence-recap input {
    width: 890px;
    background: transparent;
    border: 0;
    border-bottom: 1px solid black;
    font-size: 20px;
    margin-left: 1rem;
    padding: 1rem 0 1rem 0;
    @include sm {
      padding: 0.5rem 0 1rem 0;
      margin: 0;
      font-size: 16px;
      width: 100%;
    }
  }
  &__sentence-recap h6 {
    /* width: 680px; */
    white-space: nowrap;
    margin-top: 0.5rem;
    left: 1rem;
    text-transform: uppercase;
    padding-bottom: 0.5rem;

    @include sm {
      left: 0;
    }
  }
  &__button-wrapper {
    display: flex;
    gap: 20px;
    position: relative;
    bottom: 1rem;
    justify-content: flex-end;

    @include sm {
      bottom: 1rem;
      flex-direction: column;
    }
  }

  &disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
  h6 {
    font-size: 12px;
    width: 0;
    position: relative;
    left: 0.5rem;
    bottom: 1.7rem;
    color: #010309;
    text-transform: uppercase;

    @include sm {
      inset: 0.2rem 0 0 0;
    }
  }
  h5,
  h6 {
    margin: 0;
  }
}
</style>
