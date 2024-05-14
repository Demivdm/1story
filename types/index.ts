// data die binnen komt kan alles zijn

export interface FirestoreDocument {
    id: string | any;
    data: () => any; 
  }
//   t is een generiek type parameter
// waarom docs op deze manier getyped en niet zoals bv id?
  export interface FirestoreCollection<T extends FirestoreDocument> {
    docs: T[];
  }
  
  export interface Sentence {
    id: string;
    content: string;
  }
  