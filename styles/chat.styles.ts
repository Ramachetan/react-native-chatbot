import { StyleSheet, Platform, StatusBar } from 'react-native';
import { theme } from './theme';
import { wp, hp, sp } from '../utils/responsive';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;
const MIN_HEADER_HEIGHT = hp(7);
const MAX_HEADER_HEIGHT = hp(9);

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_HEADER_HEIGHT,
    maxHeight: MAX_HEADER_HEIGHT,
    height: Platform.OS === 'ios' ? MIN_HEADER_HEIGHT : MIN_HEADER_HEIGHT + hp(0.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  newChatButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: theme.fontSize.xlarge,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlignVertical: 'center',
    includeFontPadding: false,
    padding: theme.spacing.xs,
  },
  messageList: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(245, 247, 250, 1)',
  },
  messageBubble: {
    maxWidth: wp(75),
    padding: theme.spacing.md,
    borderRadius: sp(16),
    marginVertical: theme.spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: sp(4),
    marginLeft: wp(15),
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: sp(4),
    marginRight: wp(15),
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
    opacity: 0.75,
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(230, 230, 230, 1)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginRight: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(245, 247, 250, 1)',
    borderRadius: sp(24),
    fontSize: theme.fontSize.medium,
    maxHeight: hp(12),
    borderWidth: 1,
    borderColor: 'rgba(230, 230, 230, 1)',
  },
  sendButton: {
    width: sp(48),
    height: sp(48),
    borderRadius: sp(24),
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  loadingContainer: {
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  typingIndicator: {
    flexDirection: 'row',
    padding: theme.spacing.sm,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: theme.colors.lightText,
    marginHorizontal: 2,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    backgroundColor: 'transparent',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.small,
    fontWeight: '600',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: theme.spacing.xs,
  },
  messageContent: {
    maxWidth: wp(68),
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    margin: 10,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyText: {
    color: theme.colors.lightText,
    fontSize: 16,
    textAlign: 'center',
  },
});