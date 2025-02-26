import { View, Text, ScrollView, Pressable, Platform, TextInput } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import { useSettingsStore, ModelName } from '../../stores/settingsStore';
import { theme } from '../../styles/theme';
import { hp } from '../../utils/responsive';
import { settingsStyles } from '../../styles/settings.styles';


const MIN_HEADER_HEIGHT = hp(6);

export default function Settings() {
  const {
    modelName, temperature, topK, topP, maxOutputTokens, responseMimeType, apiKey,
    setModelName, setTemperature, setTopK, setTopP, setMaxOutputTokens, setResponseMimeType, setApiKey
  } = useSettingsStore();

  const models: ModelName[] = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.0-pro-exp-02-05',
    'gemini-2.0-flash-thinking-exp-01-21',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ];

  const renderSectionHeader = (title: string, icon: keyof typeof MaterialIcons.glyphMap) => (
    <View style={settingsStyles.sectionHeader}>
      <MaterialIcons 
        name={icon} 
        size={24} 
        color={theme.colors.primary} 
        style={settingsStyles.sectionIcon} 
      />
      <Text style={settingsStyles.label}>{title}</Text>
    </View>
  );

  return (
    <View style={settingsStyles.container}>
      <Stack.Screen options={{ 
        title: 'Settings',
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        contentStyle: {
          paddingTop: MIN_HEADER_HEIGHT,
        }
      }} />
      <ScrollView style={settingsStyles.scrollView}>
        <View style={settingsStyles.section}>
          {renderSectionHeader('API Configuration', 'vpn-key')}
          <Text style={settingsStyles.label}>API Key</Text>
          <TextInput
            style={settingsStyles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your Gemini API key"
            placeholderTextColor={theme.colors.lightText}
            secureTextEntry
          />
        </View>

        <View style={settingsStyles.section}>
          {renderSectionHeader('Model Selection', 'star')}
          <Picker
            selectedValue={modelName}
            onValueChange={(value) => setModelName(value as ModelName)}
            style={settingsStyles.picker}
          >
            {models.map((model) => (
              <Picker.Item key={model} label={model} value={model} />
            ))}
          </Picker>
        </View>

        <View style={settingsStyles.section}>
          {renderSectionHeader('Generation Parameters', 'tune')}
          <Text style={settingsStyles.label}>
            Temperature <Text style={settingsStyles.value}>{temperature.toFixed(2)}</Text>
          </Text>
          <Slider
            style={settingsStyles.slider}
            value={temperature}
            onValueChange={setTemperature}
            minimumValue={0}
            maximumValue={2}
            step={0.1}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />

          <Text style={[settingsStyles.label, { marginTop: hp(2) }]}>
            Top K <Text style={settingsStyles.value}>{topK}</Text>
          </Text>
          <Slider
            style={settingsStyles.slider}
            value={topK}
            onValueChange={setTopK}
            minimumValue={1}
            maximumValue={2}
            step={0.1}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
          />

          <Text style={[settingsStyles.label, { marginTop: hp(2) }]}>
            Top P <Text style={settingsStyles.value}>{topP.toFixed(2)}</Text>
          </Text>
          <Slider
            style={settingsStyles.slider}
            value={topP}
            onValueChange={setTopP}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
          />

          <Text style={[settingsStyles.label, { marginTop: hp(2) }]}>
            Max Output Tokens <Text style={settingsStyles.value}>{maxOutputTokens}</Text>
          </Text>
          <Slider
            style={settingsStyles.slider}
            value={maxOutputTokens}
            onValueChange={setMaxOutputTokens}
            minimumValue={1}
            maximumValue={8192}
            step={1}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
          />
        </View>

        <View style={settingsStyles.section}>
          {renderSectionHeader('Response Format', 'format-align-left')}
          <View style={settingsStyles.buttonGroup}>
            <Pressable
              style={[
                settingsStyles.button,
                responseMimeType === 'text/plain' && settingsStyles.selectedButton
              ]}
              onPress={() => setResponseMimeType('text/plain')}
            >
              <Text style={[
                settingsStyles.buttonText,
                responseMimeType === 'text/plain' && settingsStyles.selectedButtonText
              ]}>Plain Text</Text>
            </Pressable>
            <Pressable
              style={[
                settingsStyles.button,
                responseMimeType === 'application/json' && settingsStyles.selectedButton
              ]}
              onPress={() => setResponseMimeType('application/json')}
            >
              <Text style={[
                settingsStyles.buttonText,
                responseMimeType === 'application/json' && settingsStyles.selectedButtonText
              ]}>JSON</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}