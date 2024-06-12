
<template>
    
</template>
<!-- <template>
    <section class="story__check">
      
      <BlocksNav></BlocksNav>
      <ElementsBackButton></ElementsBackButton>
      <div class="story__detail">
  
  
      <div class="story-info">
        <ElementsScrollUp></ElementsScrollUp>
        <date class="story__time">
          <ElementsTagBlock></ElementsTagBlock>
          <p>{{ formatDate(story.createdAt) }}</p>
  
        </date>
  
        <h2>Het verhaal</h2>
      </div>
  
      <article class="story__story">
        <ElementsSentence :text="defaultSentence.content" />
        <template v-for="(sentence, index) in filteredSentences" :key="sentence.id">
          <ElementsSentence
            :text="sentence.content"
            :info="{ job: sentence.job, name: sentence.name }"
            :class="{'bigger-font': index < 2}"
          />
        </template>
      </article>
    </div>
  
    </section>
  </template>
  
  <script setup lang="ts">
  
  const sentences = ref([]);
  const filteredSentences = ref([]);
  const defaultSentence = {
    name: "Demi",
    job: "Stagiair",
    content: "Er was eens...",
  };
  
  onMounted(() => {
    const sentencesCollection = collection(db, "sentences");
    const storiesCollection = collection(db, "stories");
  
    const q = query(sentencesCollection, orderBy("createdAt", "asc"));
  
    onSnapshot(q, (querySnapshot) => {
      const fbSentences = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sentence = {
          id: doc.id,
          content: data.content,
          name: data.name,
          job: data.job,
          storyUID: data.storyUID,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
        };
        if (sentence.createdAt) {
          console.log('Gemaakt op', sentence.createdAt);
        } else {
          console.error(`Missing createdAt for document ID: ${doc.id}`);
        }
        fbSentences.push(sentence);
      });
      sentences.value = fbSentences;
      filterSentences();
    });
  });
  
  // functie om zinnen te filteren op story id
  const filterSentences = () => {
    // dit is welke de huidige is, dit kan ik later nog aanpassen zodat het reageert op wat de admin sluit.
    const storyId = "vq7I23zQK8iszSCXbMsj";
    filteredSentences.value = sentences.value.filter(
      (sentence) => sentence.storyUID === storyId
    );
  };
  
  
  
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return date.toLocaleDateString("nl-NL", options);
  };
  </script>
  
  <style scoped lang="scss">
  @import "/scss/vars/_breakpoints.scss";
  
  $component: "story";
  
  .#{$component} {
  width: 100vw;
    &__detail{
      max-width: 900px;
      margin: auto;
      @include sm{
        margin: 1rem ;
      }
     
    }
    &__sentence-container {
      cursor: text;
    }
  
    &__check {
      min-height:100vh ;
      background: linear-gradient(180deg, #fbfefe 0%, #dbf3fa 100%);
      width: 100vw;
      padding-top: 5rem;
     
    }
    &__story {
      &:hover {
        :deep(.sentence) {
          opacity: 1;
          &:not(:hover) {
            opacity: 0.3;
          }
        }
      }
    }
    &__user-sentence,
    &__user-info {
      transition: opacity 0.3s ease;
    }
    &__user-info {
      position: absolute;
      opacity: 0;
      background: #fff;
      box-shadow: 0px 4px 4px 0px #0103091a;
      font-size: 14px;
      border-radius: 4px;
      padding: 8px;
  
      width: max-content;
    }
    &__time {
      display: flex;
      align-items: baseline;
      padding-top: 1rem;
    }
  
    &__user-sentence {
      display: inline;
      margin-right: 10px;
    }
  
  }
  </style>
   -->