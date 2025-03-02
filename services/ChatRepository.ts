import { firestore } from '../firebase/firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  updateDoc,
  DocumentReference 
} from 'firebase/firestore';
import { ChatMessage } from '../types/ChatMessage';

// This defines the Firestore collection name
// Full path to documents will be: /chats/{chatId}
const CHATS_COLLECTION = 'chats';

// Define interfaces for the data structure
interface ChatData {
  chatId: string;  // This is stored in the document and matches the document ID
  messageHistory: string; // JSON string of ChatMessage[]
  createdAt: any; // FirebaseFirestore.Timestamp
  updatedAt: any; // FirebaseFirestore.Timestamp
}

interface ParsedChatData extends Omit<ChatData, 'messageHistory'> {
  messageHistory: ChatMessage[];
}

class ChatRepository {
  /**
   * Creates a new chat in Firestore
   * @param chatId - Unique identifier for the chat (becomes the document ID in Firestore at /chats/{chatId})
   * @param messageHistory - Initial message history
   * @returns Promise resolving to the created document reference
   */
  static async createChat(chatId: string, messageHistory: ChatMessage[] = []): Promise<DocumentReference> {
    try {
      // Creates a reference to document at path /chats/{chatId}
      const chatRef = doc(firestore, CHATS_COLLECTION, chatId);
      await setDoc(chatRef, {
        chatId: chatId, // Redundantly stores the ID inside the document for easier queries
        messageHistory: JSON.stringify(messageHistory),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Chat created with ID: ${chatId}`);
      return chatRef;
    } catch (error) {
      console.error("Error creating chat: ", error);
      throw error;
    }
  }
  

  /**
   * Updates the message history for a specific chat
   * @param chatId - Unique identifier for the chat
   * @param messageHistory - Updated message history
   * @returns Promise resolving when update completes
   */
  static async updateChatHistory(chatId: string, messageHistory: ChatMessage[]): Promise<void> {
    try {
      const chatRef = doc(firestore, CHATS_COLLECTION, chatId);
      
      // Check if document exists first
      const chatSnap = await getDoc(chatRef);
      
      if (chatSnap.exists()) {
        // Document exists, update it
        await updateDoc(chatRef, {
          messageHistory: JSON.stringify(messageHistory),
          updatedAt: serverTimestamp()
        });
        console.log(`Chat ${chatId} updated successfully`);
      } else {
        // Document doesn't exist, create it
        console.log(`Chat ${chatId} doesn't exist. Creating new chat document.`);
        await setDoc(chatRef, {
          chatId: chatId,
          messageHistory: JSON.stringify(messageHistory),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log(`Chat ${chatId} created successfully`);
      }
    } catch (error) {
      console.error("Error updating chat history: ", error);
      throw error;
    }
  }

  /**
   * Retrieves a chat by its ID
   * @param chatId - Document ID for the chat (path becomes /chats/{chatId})
   * @returns Promise resolving to the chat data or null if not found
   */
  static async getChat(chatId: string): Promise<ParsedChatData | null> {
    try {
      // References document at path /chats/{chatId}
      const chatRef = doc(firestore, CHATS_COLLECTION, chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (chatSnap.exists()) {
        const chatData = chatSnap.data() as ChatData;
        return {
          ...chatData,
          messageHistory: JSON.parse(chatData.messageHistory || '[]')
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting chat: ", error);
      throw error;
    }
  }

  /**
   * Gets all chats, ordered by most recent update
   * @returns Promise resolving to array of chat objects
   */
  static async getAllChats(): Promise<ParsedChatData[]> {
    try {
      const chatsQuery = query(
        collection(firestore, CHATS_COLLECTION),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(chatsQuery);
      const chats: ParsedChatData[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ChatData;
        chats.push({
          ...data,
          messageHistory: JSON.parse(data.messageHistory || '[]')
        });
      });
      
      return chats;
    } catch (error) {
      console.error("Error getting chats: ", error);
      throw error;
    }
  }

  /**
   * Gets document by its full path - alternative method for direct path access
   * @param fullPath - Complete document path like '/chats/qJZSRdS2M5raQRAzFObE'
   * @returns Promise resolving to the chat data or null if not found
   */
  static async getChatByFullPath(fullPath: string): Promise<ParsedChatData | null> {
    try {
      // Extract collection and document ID from path
      const pathSegments = fullPath.split('/').filter(segment => segment.length > 0);
      if (pathSegments.length !== 2 || pathSegments[0] !== CHATS_COLLECTION) {
        throw new Error(`Invalid path format: ${fullPath}. Expected format: /${CHATS_COLLECTION}/{documentId}`);
      }
      
      const documentId = pathSegments[1];
      return this.getChat(documentId);
    } catch (error) {
      console.error("Error getting chat by path: ", error);
      throw error;
    }
  }
}

export default ChatRepository;
