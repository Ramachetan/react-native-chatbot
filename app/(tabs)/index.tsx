import { useState } from 'react';
import { theme } from '../../styles/theme';
import { View, TextInput, FlatList, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

  const clearChat = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClear = () => {
    setMessages([]);
    setInputText('');
    setShowConfirmation(false);
  };

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;
    
    if (!checkApiKey()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

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

  const renderMessage = ({ item }: { item: ChatMessage }) => (
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
  );

  return (
    <View style={chatStyles.container}>
      <ConfirmationModal
        visible={showConfirmation}
        onConfirm={handleConfirmClear}
        onCancel={() => setShowConfirmation(false)}
      />
      <View style={chatStyles.header}>
        <Text style={chatStyles.headerTitle}>AI Assistant</Text>
        <Pressable 
          style={chatStyles.newChatButton} 
          onPress={clearChat}
        >
        <Ionicons name="add" size={24} weight="bold" color={theme.colors.background} />
        </Pressable>
      </View>
      
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={chatStyles.messageList}
        inverted={false}
        showsVerticalScrollIndicator={false}
      />
      
      {isLoading && (
        <View style={chatStyles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}
      
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
          style={[chatStyles.sendButton, isLoading && chatStyles.disabledButton]} 
          onPress={handleSend}
          disabled={isLoading}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
