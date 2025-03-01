import { useState, useEffect } from 'react';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '../types/ChatMessage';

const useChatFirestore = () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        setIsLoading(true);
        // Get chatId from AsyncStorage or create a new one
        let id = await AsyncStorage.getItem('currentChatId');
        
        if (!id) {
          // Create a new chat document
          id = doc(collection(firestore, 'chats')).id;
          await AsyncStorage.setItem('currentChatId', id);
          await setDoc(doc(firestore, 'chats', id), { 
            messages: [],
            createdAt: new Date()
          });
        }
        
        setChatId(id);
        
        // Subscribe to chat document updates
        const unsubscribe = onSnapshot(doc(firestore, 'chats', id), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && data.messages) {
              // Sort messages by timestamp to ensure proper order
              const chatMessages = [...data.messages];
              chatMessages.sort((a, b) => {
                return a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime();
              });
              setMessages(chatMessages);
            } else {
              setMessages([]);
            }
          } else {
            setMessages([]);
          }
          setIsLoading(false);
        }, (err) => {
          console.error("Error subscribing to chat: ", err);
          setError('Error loading chat history. Please try again.');
          setIsLoading(false);
        });
        
        return () => unsubscribe();
      } catch (err) {
        console.error("Error initializing chat: ", err);
        setError('Error initializing chat. Please try again.');
        setIsLoading(false);
      }
    };
    
    initChat();
  }, []);

  useEffect(() => {
    console.log('useChatFirestore - messages state updated:', messages.length);
  }, [messages]);

  const createNewChat = async (initialMessages: ChatMessage[] = []) => {
    try {
      setIsLoading(true);
      
      // Create new chat document
      const newChatId = doc(collection(firestore, 'chats')).id;
      await setDoc(doc(firestore, 'chats', newChatId), {
        messages: initialMessages,
        createdAt: new Date()
      });
      
      // Update AsyncStorage and state
      await AsyncStorage.setItem('currentChatId', newChatId);
      setChatId(newChatId);
      setMessages(initialMessages);
      setIsLoading(false);
    } catch (err) {
      console.error("Error creating new chat: ", err);
      setError('Error creating new chat. Please try again.');
      setIsLoading(false);
    }
  };

  const updateMessages = async (newMessages: ChatMessage[]) => {
    if (!chatId) return;
    
    try {
      await updateDoc(doc(firestore, 'chats', chatId), {
        messages: newMessages
      });
    } catch (err) {
      console.error("Error updating messages: ", err);
      setError('Error updating messages. Please try again.');
    }
  };

  const addMessage = async (message: ChatMessage) => {
    if (!chatId) return;
    
    try {
      console.log('Adding message to chat:', chatId, message.id);
      // Convert Date to Firestore Timestamp
      const messageWithProperDate = {
        ...message,
        timestamp: message.timestamp // Firestore will convert this
      };
      
      // Use arrayUnion to add the message to the array without replacing existing messages
      await updateDoc(doc(firestore, 'chats', chatId), {
        messages: arrayUnion(messageWithProperDate)
      });
      console.log('Message added successfully');
    } catch (err) {
      console.error("Error adding message: ", err);
      setError('Error adding message. Please try again.');
    }
  };

  return { 
    chatId, 
    messages, 
    isLoading, 
    error, 
    createNewChat, 
    updateMessages, 
    addMessage 
  };
};

export default useChatFirestore;
