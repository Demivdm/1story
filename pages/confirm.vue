  <template>
    <div>
      <BlocksNav></BlocksNav>
      
      <h1>Bedankt voor het delen</h1>
      <!-- er moet gereload worden voordat de gebruiker de zin kan bewerken fix dit later -->
    
      <div
        v-for="sentence in sentences"
        :key="sentence.id"
        class="sentence-container"
      >
    
        <h2>Mijn naam is</h2>
        <p>{{ sentence.name }}</p>
        <h2>en ik werk als</h2>
        <p>{{ sentence.job }}</p>
        <h2>Mijn zin van de week</h2>
        <p>{{ sentence.content }}</p>
        <input
          :disabled="!sentence.isEditing"
          :class="{ disabled: !sentence.isEditing }"
          v-model="sentence.content"
          class="sentence-input"
          @input="limitCheck"
        />

        <button @click="toggleEdit(sentence)">
          {{ sentence.isEditing ? "Verzenden" : "Bewerken" }}
        </button>
  <p>{{ remainingChar(sentence) }} tekens over</p>

      </div>
    </div>

    <ElementsButton to="allStories"> 
      Bekijk andere verhalen
    </ElementsButton>
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
    console.log(sentence.content.lenght)
  }
};

// Method to calculate remaining characters
const remainingChar = (sentence) => {
  return charLimit - sentence.content.length;
};

  // Watch for changes to currentUser
  // ik heb een wachter nodig om te kijen of de waarde van de user veranderd, of de waarde van de uid veranded
  watch(currentUser, (newValue) => {
    if (newValue && newValue.uid) {
      fetchSentences(newValue.uid);
    }
  });
  </script>
  <style>
  .disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
  </style>
