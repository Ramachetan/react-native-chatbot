export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date | FirestoreTimestamp | any; // Include FirestoreTimestamp type
}

// Add this interface for Firestore Timestamp
interface FirestoreTimestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}