import { Alert } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';
import { router } from 'expo-router';

export const checkApiKey = (): boolean => {
  const apiKey = useSettingsStore.getState().apiKey;
  
  if (!apiKey) {
    Alert.alert(
      'API Key Required',
      'Please set your Gemini API key in the settings to continue.',
      [
        {
          text: 'Go to Settings',
          onPress: () => router.push('/settings')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
    return false;
  }
  
  return true;
};
