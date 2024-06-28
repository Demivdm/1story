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
    try {
      // Fetch the current story
      const storyQuery = query(storyCollection, where("closedAt", "==", null));
      const storySnapshot = await getDocs(storyQuery);

      if (!storySnapshot.empty) {
        const storyDoc = storySnapshot.docs[0];
        currentStoryId.value = storyDoc.id;
        title.value = storyDoc.data().title || '';

        // Fetch sentences with the same story ID
        const sentenceQuery = query(sentenceCollection, where("storyUID", "==", currentStoryId.value));
        const sentenceSnapshot = await getDocs(sentenceQuery);

        sentences.value = sentenceSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, isEditing: false }));
      }
    } catch (error) {
      console.error("Error fetching story data: ", error);
    }
  };

  onMounted(() => {
    fetchStoryData();
  });

  return {
    currentStoryId,
    title,
    sentences,
    fetchStoryData,
  };
}
