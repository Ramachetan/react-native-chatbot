import axios from 'axios';
import Constants from 'expo-constants';
import { useSettingsStore } from '../stores/settingsStore';

export type MessagePart = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export const generateResponse = async (messages: MessagePart[]) => {
  const settings = useSettingsStore.getState();
  
  if (!settings.apiKey) {
    throw new Error('Please set your API key in settings before sending messages.');
  }

  const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${settings.modelName}:generateContent`;

  try {
    const response = await axios.post(
      `${BASE_URL}?key=${settings.apiKey}`,
      {
        contents: messages,
        generationConfig: {
          temperature: settings.temperature,
          topK: settings.topK,
          topP: settings.topP,
          maxOutputTokens: settings.maxOutputTokens,
          responseMimeType: settings.responseMimeType,
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('API Error:', error);
    if (error?.response?.status === 403) {
      throw new Error('Invalid API key. Please check your API key in settings.');
    }
    throw new Error('Failed to generate response. Please try again.');
  }
};
