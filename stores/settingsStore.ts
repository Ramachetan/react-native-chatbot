import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ModelName = 
  | 'gemini-2.0-flash'
  | 'gemini-2.0-flash-lite'
  | 'gemini-2.0-pro-exp-02-05'
  | 'gemini-2.0-flash-thinking-exp-01-21'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-pro';

interface SettingsState {
  modelName: ModelName;
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
  responseMimeType: 'application/json' | 'text/plain';
  apiKey: string;
  setModelName: (name: ModelName) => void;
  setTemperature: (value: number) => void;
  setTopK: (value: number) => void;
  setTopP: (value: number) => void;
  setMaxOutputTokens: (value: number) => void;
  setResponseMimeType: (type: 'application/json' | 'text/plain') => void;
  setApiKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  modelName: 'gemini-2.0-pro-exp-02-05',
  temperature: 1,
  topK: 64,
  topP: 0.95,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
  apiKey: '',
  
  setModelName: (name: ModelName) => {
    set({ modelName: name });
    AsyncStorage.setItem('settings-modelName', name);
  },
  setTemperature: (value: number) => {
    set({ temperature: value });
    AsyncStorage.setItem('settings-temperature', value.toString());
  },
  setTopK: (value) => {
    set({ topK: value });
    AsyncStorage.setItem('settings-topK', value.toString());
  },
  setTopP: (value) => {
    set({ topP: value });
    AsyncStorage.setItem('settings-topP', value.toString());
  },
  setMaxOutputTokens: (value) => {
    set({ maxOutputTokens: value });
    AsyncStorage.setItem('settings-maxOutputTokens', value.toString());
  },
  setResponseMimeType: (type) => {
    set({ responseMimeType: type });
    AsyncStorage.setItem('settings-responseMimeType', type);
  },
  setApiKey: (key: string) => {
    set({ apiKey: key });
    AsyncStorage.setItem('settings-apiKey', key);
  },
}));
