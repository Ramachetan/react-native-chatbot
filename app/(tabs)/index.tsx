import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  Pressable, 
  Animated,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { ChatMessage } from '../../types/ChatMessage';
import { chatStyles } from '../../styles/chat.styles';
import { generateResponse, MessagePart } from '../../services/gemini';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { checkApiKey } from '../../utils/apiKeyCheck';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import useChatFirestore from '../../hooks/useChatFirestore';
import Markdown from '@ronradtke/react-native-markdown-display';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingDots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  const { 
    chatId,
    messages,
    isLoading: isFirestoreLoading,
    error: firestoreError,
    createNewChat,
    updateMessages,
    addMessage
  } = useChatFirestore();

  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const isLoading = isGeneratingResponse || isFirestoreLoading;

  
  useEffect(() => {
    if (isGeneratingResponse) {
      const animations = typingDots.map((dot, index) => {
        return Animated.sequence([
          Animated.delay(index * 150),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true
          })
        ]);
      });

      const loopAnimation = Animated.loop(
        Animated.parallel(animations)
      );
      
      loopAnimation.start();
      
      return () => {
        loopAnimation.stop();
        typingDots.forEach(dot => dot.setValue(0));
      };
    }
  }, [isGeneratingResponse]);

  const clearChat = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClear = async () => {
    await createNewChat([]);
    setInputText('');
    setShowConfirmation(false);
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;
    
    if (!checkApiKey()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    Keyboard.dismiss();
    const currentText = inputText;
    setInputText('');
    await addMessage(userMessage);
    setIsGeneratingResponse(true);

    try {
      const apiMessages: MessagePart[] = [
        ...messages.map(msg => ({
          role: msg.isUser ? 'user' : 'model' as 'user' | 'model',
          parts: [{ text: msg.text }],
        })),
        {
          role: 'user',
          parts: [{ text: currentText }],
        }
      ];

      const response = await generateResponse(apiMessages);

      const botMessage: ChatMessage = {
        id: uuidv4(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      await addMessage(botMessage);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      await addMessage(errorMessage);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const formatTime = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Unknown time';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const getInitials = (isUser: boolean) => {
    return isUser ? 'You' : 'AI';
  };

  const renderAvatar = (isUser: boolean) => (
    <View style={[chatStyles.avatarContainer, isUser && chatStyles.userAvatar]}>
      {isUser ? (
        <Ionicons name="person" size={18} color={theme.colors.primary} />
      ) : (
        <Text style={chatStyles.avatarText}>AI</Text>
      )}
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={chatStyles.emptyContainer}>
      <Text style={chatStyles.emptyText}>No messages yet. Start a conversation!</Text>
    </View>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    console.log('Rendering message:', item.id, item.text.substring(0, 20) + '...');
    
    let timestamp: Date;
    
    if (item.timestamp instanceof Date) {
      timestamp = item.timestamp;
    } else if (item.timestamp && typeof item.timestamp === 'object' && 'toDate' in item.timestamp) {
      
      timestamp = item.timestamp.toDate();
    } else {
      
      timestamp = new Date();
    }
  
    return (
      <View style={[chatStyles.messageRow, item.isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
        {!item.isUser && renderAvatar(item.isUser)}
        <View style={[chatStyles.messageBubble, item.isUser ? chatStyles.userMessage : chatStyles.botMessage]}>
          {item.isUser ? (
            <Text style={[chatStyles.messageText, chatStyles.userMessageText]}>
              {item.text}
            </Text>
          ) : (
            <Markdown 
              style={{
                body: {
                  ...chatStyles.messageText,
                  ...chatStyles.botMessageText,
                },
                
                code_block: {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  padding: 8,
                  borderRadius: 4,
                },
                code_inline: {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  padding: 2,
                  borderRadius: 2,
                },
                link: {
                  color: theme.colors.primary,
                  textDecorationLine: 'underline',
                }
              }}
            >
              {item.text}
            </Markdown>
          )}
          <Text style={[
            chatStyles.timestamp,
            item.isUser ? chatStyles.userTimestamp : chatStyles.botTimestamp
          ]}>
            {formatTime(timestamp)}
          </Text>
        </View>
        {item.isUser && renderAvatar(item.isUser)}
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isGeneratingResponse) return null;
    
    return (
      <View style={chatStyles.messageRow}>
        {renderAvatar(false)}
        <View style={[chatStyles.messageBubble, chatStyles.botMessage, { paddingVertical: 12, paddingHorizontal: 16 }]}>
          <View style={chatStyles.typingIndicator}>
            {typingDots.map((dot, index) => (
              <Animated.View 
                key={index} 
                style={[
                  chatStyles.typingDot,
                  {
                    transform: [
                      {
                        translateY: dot.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -5]
                        })
                      }
                    ]
                  }
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={chatStyles.container}>
      <ConfirmationModal
        visible={showConfirmation}
        onConfirm={handleConfirmClear}
        onCancel={() => setShowConfirmation(false)}
      />
      <View style={chatStyles.header}>
        <Text style={chatStyles.headerTitle}>AI Assistant</Text>
        <TouchableOpacity 
          style={chatStyles.newChatButton} 
          onPress={clearChat}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {firestoreError && (
        <Text style={[chatStyles.errorText, { textAlign: 'center', margin: 10 }]}>
          {firestoreError}
        </Text>
      )}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={chatStyles.messageList}
        contentContainerStyle={{ paddingVertical: 10, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderTypingIndicator}
        extraData={messages.length} 
      />
      
      <View style={chatStyles.inputContainer}>
        <TextInput
          style={chatStyles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.lightText}
          multiline
          maxLength={1000}
          editable={!isLoading}
        />
        <Pressable 
          style={[chatStyles.sendButton, (!inputText.trim() || isLoading) && chatStyles.disabledButton]} 
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons name="send" size={22} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}