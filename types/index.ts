// types.ts

export interface FirestoreDocument {
  id: string | any;
  data: () => any; 
}

export interface FirestoreCollection<T extends FirestoreDocument> {
  docs: T[];
}

export interface Story extends FirestoreDocument {
  title: string;
  createdAt: Date | null;
}

export interface Sentence extends FirestoreDocument {
  content: string;
}
