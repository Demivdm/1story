// useCurrentStory.js
import { ref, onMounted } from 'vue';
import { collection,query, where, getDocs, } from 'firebase/firestore';

const currentStoryId = ref(null);
const title = ref('');
const sentences = ref([]);

export function useCurrentStory() {
  const storyCollection = collection(db, "stories");
  const sentenceCollection = collection(db, "sentences");

  const fetchStoryData = async () => {
    console.log("fetchStoryData 1")
    try {
      // Fetch the current story
      // const storyQuery = query(storyCollection, where("closedAt", "==", null));
      const storyQuery = query(storyCollection, where("closedAt", "==", null));
      const storySnapshot = await getDocs(storyQuery);
      console.log("fetchStoryData 2")

      if (!storySnapshot.empty) {
        console.log("Story found");
        console.log("fetchStoryData 3")
        const storyDoc = storySnapshot.docs[0];
        currentStoryId.value = storyDoc.id;
        title.value = storyDoc.data().title || '';

        // Fetch sentences with the same story ID
        const sentenceQuery = query(sentenceCollection, where("storyUID", "==", currentStoryId.value));
        const sentenceSnapshot = await getDocs(sentenceQuery);

        sentences.value = sentenceSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, isEditing: false }));
        console.log({
          currentStoryId:currentStoryId.value,
          storyDoc,
          sentences: sentences.value 
        })
      } else {
      console.log("No active story found");
    }
    } catch (error) {
      console.error("Error fetching story data: ", error);
    }
  };

  onMounted(() => {
    console.log("UseCurrentStory mounted")
    fetchStoryData();
  });

  return {
    currentStoryId,
    title,
    sentences,
    fetchStoryData,
  };
}
