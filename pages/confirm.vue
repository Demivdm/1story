  <template >
    <section class="confirm-page">

      <BlocksNav></BlocksNav>
      
      <div class="confirm-msg">
        <h1>Bedankt voor het delen</h1>
      <p>Hieronder kun je nogmaals zien wat je hebt ingevuld. Foutje gemaakt? Geen probleem, je kunt het nu nog aanpassen. Als alles naar wens is, kun je het tabblad sluiten of andere verhalen bekijken.</p>

      </div>
     
      <div
        v-for="sentence in sentences"
        :key="sentence.id"
        class="sentence-container"
      >
    <div class="confirm">

    <BlocksModal>

      <div class="modal-content">

    <span class="recap-field">
      <h5>Mijn naam is</h5>
      <h6>Voornaam</h6>

        <p>{{ sentence.name }}</p>

      <h5>en ik werk als</h5>
      <h6>Functie</h6>
        <p>{{ sentence.job }}</p>
    </span>
    <span class="sentence-recap">
      <h5>Mijn zin van de week</h5>
      <h6>Zin van de week</h6>
      <input
          :disabled="!sentence.isEditing"
          :class="{ disabled: !sentence.isEditing }"
          v-model="sentence.content"
          class="sentence-input"
          @input="limitCheck"
        />
    </span>
  </div>
        

       

  <p>{{ remainingChar(sentence) }} tekens over</p>
  <div class="button-wrapper">
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
      console.log({currentUser, newValue})
      fetchSentences(newValue.uid);
    }
  }, {immediate: true});
  </script>
  <style scoped lang="scss">
 @import "/scss/vars/_breakpoints.scss";

 .confirm-page{
  background: #F6F7FE;

 }

.confirm{
  padding:5rem;
  @include sm{
    padding: 1rem;
  }

}
.confirm-msg{
  padding: 10rem 4rem 0 4rem;
  @include sm{
    padding: 5rem 1rem 1rem 1rem;
  }
}

.modal-content{
  display: flex;
  flex-direction: column;
  width: 1152px;
  padding-top: 3rem;
  @include sm{
  padding: 1rem;
}
}

  .recap-wrapper{
   
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    @include sm{
      flex-direction: column;
    }
   
  }
  .recap-field{
    display: flex;
    align-items: baseline;
    @include sm{
      flex-direction: column;
    }
 
  }
  .recap-field p{
    padding-bottom: .5rem;
    margin: .5rem 0 2rem .5rem;
    flex-wrap: wrap;
    width:380px;
    font-size: 20px;
    border-bottom: 1px solid black;
    @include sm{
     margin: 0;
    }
 

  }

  .recap-field h5{
    padding-right: 1rem;

  }
  .sentence-recap{
    display: flex;
  }
  .sentence-recap input{
    width: 845px;
  background: transparent;
  border: 0;
  border-bottom: 1px solid black;
  font-size:20px ;
  margin-left:1rem;
  color: grey;
  @include sm{
     padding: 0;
    }
  }
  .sentence-recap h6{
  /* width: 680px; */
  white-space: nowrap;
  margin-top: .5rem;
  left: 1rem;

  // padding-bottom: 1rem;
  



  }
  .button-wrapper{
    display: flex;
    gap: 20px;
    position: relative;
    bottom: 1rem;
    justify-content: flex-end;
    
    @include sm{
      bottom: 1rem;
      flex-direction: column;
    }
    button{
      @include sm{
        width: 100%;

    }
      
    }

  
  }
  
  .disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
  h6{
    font-size:12px;
    width: 0;
    position: relative;
    left: .5rem;
    bottom: 1.7rem;
    color: #010309;

    @include sm{
     inset: .2rem 0 0 0;
    }
    
  }
  h5, h6{
    margin: 0;
  }
  
  </style>
