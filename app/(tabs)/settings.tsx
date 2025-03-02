import { View, Text, ScrollView, Pressable, Platform, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
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

  const [showApiKey, setShowApiKey] = useState(false);

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

  const renderParameterTooltip = (title: string) => (
    <MaterialIcons
      name="help-outline"
      size={16}
      color={theme.colors.lightText}
      style={settingsStyles.helpIcon}
    />
  );

  const renderModelSelector = () => (
    <View>
      {models.map((model) => (
        <Pressable 
          key={model}
          style={[
            settingsStyles.modelCard,
            modelName === model && settingsStyles.selectedModelCard
          ]}
          onPress={() => setModelName(model as ModelName)}
        >
          <Text style={settingsStyles.modelName}>{model}</Text>
          {modelName === model && (
            <MaterialIcons
              name="check-circle"
              size={20}
              style={settingsStyles.modelCheckmark}
            />
          )}
        </Pressable>
      ))}
    </View>
  );

  return (
    <View style={settingsStyles.container}>
      <Stack.Screen options={{ 
        title: 'Settings',
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShadowVisible: false,
        contentStyle: {
          paddingTop: MIN_HEADER_HEIGHT,
        }
      }} />
      <ScrollView style={settingsStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={settingsStyles.section}>
          {renderSectionHeader('API Configuration', 'vpn-key')}
          <View style={settingsStyles.inputContainer}>
            <Text style={settingsStyles.label}>API Key</Text>
            <TextInput
              style={settingsStyles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Enter your Gemini API key"
              placeholderTextColor={theme.colors.lightText}
              secureTextEntry={!showApiKey}
            />
            <Pressable 
              style={settingsStyles.inputIcon} 
              onPress={() => setShowApiKey(!showApiKey)}
            >
              <MaterialIcons 
                name={showApiKey ? "visibility-off" : "visibility"} 
                size={20} 
                color={theme.colors.lightText} 
              />
            </Pressable>
          </View>
        </View>

        <View style={settingsStyles.section}>
          {renderSectionHeader('Model Selection', 'smart-toy')}
          {renderModelSelector()}
        </View>

        <View style={settingsStyles.section}>
          {renderSectionHeader('Generation Parameters', 'tune')}
          
          <View style={settingsStyles.sliderContainer}>
            <View style={settingsStyles.parameterLabel}>
              <Text style={settingsStyles.label}>
                Temperature {renderParameterTooltip('temperature')}
              </Text>
              <Text style={settingsStyles.value}>{temperature.toFixed(2)}</Text>
            </View>
            <Slider
              style={settingsStyles.slider}
              value={temperature}
              onValueChange={setTemperature}
              minimumValue={0}
              maximumValue={2}
              step={0.1}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="rgba(0,0,0,0.1)"
              thumbTintColor={theme.colors.primary}
            />
            <View style={settingsStyles.parameterRow}>
              <Text>Conservative</Text>
              <Text>Creative</Text>
            </View>
          </View>

          <View style={[settingsStyles.sliderContainer, { marginTop: hp(2) }]}>
            <View style={settingsStyles.parameterLabel}>
              <Text style={settingsStyles.label}>
                Top K {renderParameterTooltip('topK')}
              </Text>
              <Text style={settingsStyles.value}>{topK}</Text>
            </View>
            <Slider
              style={settingsStyles.slider}
              value={topK}
              onValueChange={setTopK}
              minimumValue={1}
              maximumValue={2}
              step={0.1}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="rgba(0,0,0,0.1)"
              thumbTintColor={theme.colors.primary}
            />
          </View>

          <View style={[settingsStyles.sliderContainer, { marginTop: hp(2) }]}>
            <View style={settingsStyles.parameterLabel}>
              <Text style={settingsStyles.label}>
                Top P {renderParameterTooltip('topP')}
              </Text>
              <Text style={settingsStyles.value}>{topP.toFixed(2)}</Text>
            </View>
            <Slider
              style={settingsStyles.slider}
              value={topP}
              onValueChange={setTopP}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="rgba(0,0,0,0.1)"
              thumbTintColor={theme.colors.primary}
            />
          </View>

          <View style={[settingsStyles.sliderContainer, { marginTop: hp(2) }]}>
            <View style={settingsStyles.parameterLabel}>
              <Text style={settingsStyles.label}>
                Max Output Tokens {renderParameterTooltip('maxTokens')}
              </Text>
              <Text style={settingsStyles.value}>{maxOutputTokens}</Text>
            </View>
            <Slider
              style={settingsStyles.slider}
              value={maxOutputTokens}
              onValueChange={setMaxOutputTokens}
              minimumValue={1}
              maximumValue={8192}
              step={1}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="rgba(0,0,0,0.1)"
              thumbTintColor={theme.colors.primary}
            />
            <View style={settingsStyles.parameterRow}>
              <Text>Short</Text>
              <Text>Long</Text>
            </View>
          </View>
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