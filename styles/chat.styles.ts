import { StyleSheet, Platform, StatusBar } from 'react-native';
import { theme } from './theme';
import { wp, hp, sp } from '../utils/responsive';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;
// Increased minimum height to better accommodate text
const MIN_HEADER_HEIGHT = hp(6); // 6% of screen height
const MAX_HEADER_HEIGHT = hp(8); // 8% of screen height

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    paddingVertical: theme.spacing.sm, // Changed to smaller vertical padding
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center', // Keep this
    justifyContent: 'space-between',
    minHeight: MIN_HEADER_HEIGHT,
    maxHeight: MAX_HEADER_HEIGHT,
    height: Platform.OS === 'ios' ? MIN_HEADER_HEIGHT : MIN_HEADER_HEIGHT + hp(0.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  newChatButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text,
    textAlignVertical: 'center', // Add this for Android
    includeFontPadding: false, // Add this to remove extra padding
    padding: theme.spacing.xs, // Add padding around text
  },
  messageList: {
    flex: 1,
    padding: theme.spacing.md,
  },
  messageBubble: {
    maxWidth: wp(75), // 75% of screen width
    padding: theme.spacing.md,
    borderRadius: sp(20),
    marginVertical: theme.spacing.xs,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    borderTopRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.secondary,
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: theme.fontSize.medium,
    lineHeight: sp(22),
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: theme.fontSize.small,
    marginTop: theme.spacing.xs,
    opacity: 0.6,
  },
  userTimestamp: {
    color: '#FFFFFF',
    alignSelf: 'flex-end',
  },
  botTimestamp: {
    color: theme.colors.lightText,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.secondary,
    borderRadius: sp(24),
    fontSize: theme.fontSize.medium,
    maxHeight: hp(12), // 12% of screen height
  },
  sendButton: {
    width: sp(44),
    height: sp(44),
    borderRadius: sp(22),
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.xlarge,
  },
  loadingContainer: {
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
