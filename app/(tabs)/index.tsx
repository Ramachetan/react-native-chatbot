import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  Pressable, 
  ActivityIndicator,
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

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingDots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  // Animation for typing indicator
  useEffect(() => {
    if (isLoading) {
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
  }, [isLoading]);

  const clearChat = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClear = () => {
    setMessages([]);
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
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    Keyboard.dismiss();
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Convert chat messages to API format
      const apiMessages: MessagePart[] = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      // Add current message
      apiMessages.push({
        role: 'user',
        parts: [{ text: inputText }],
      });

      const response = await generateResponse(apiMessages);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      // Handle error - add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
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

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[chatStyles.messageRow, item.isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
      {!item.isUser && renderAvatar(item.isUser)}
      <View style={[chatStyles.messageBubble, item.isUser ? chatStyles.userMessage : chatStyles.botMessage]}>
        <Text style={[
          chatStyles.messageText,
          item.isUser ? chatStyles.userMessageText : chatStyles.botMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          chatStyles.timestamp,
          item.isUser ? chatStyles.userTimestamp : chatStyles.botTimestamp
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
      {item.isUser && renderAvatar(item.isUser)}
    </View>
  );

  const renderTypingIndicator = () => {
    if (!isLoading) return null;
    
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
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={chatStyles.messageList}
        contentContainerStyle={{ paddingVertical: 10 }}
        inverted={false}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderTypingIndicator}
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