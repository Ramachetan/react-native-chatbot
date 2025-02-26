import { StyleSheet, Platform, StatusBar } from 'react-native';
import { theme } from './theme';
import { wp, hp, sp } from '../utils/responsive';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: STATUSBAR_HEIGHT,
  },
  scrollView: {
    flex: 1,
    padding: wp(4),
  },
  section: {
    marginBottom: hp(3),
    backgroundColor: '#ffffff',
    borderRadius: sp(12),
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  sectionIcon: {
    marginRight: wp(2),
  },
  label: {
    fontSize: sp(16),
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: hp(1),
  },
  value: {
    fontSize: sp(14),
    color: theme.colors.primary,
    fontWeight: '500',
  },
  picker: {
    backgroundColor: theme.colors.background,
    borderRadius: sp(8),
    marginTop: hp(1),
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: wp(3),
    marginTop: hp(1),
  },
  button: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: sp(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    fontSize: sp(14),
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#fff',
  },
  slider: {
    marginTop: hp(1),
  },
  sliderTrack: {
    height: hp(0.6),
    borderRadius: sp(4),
  },
  sliderThumb: {
    height: hp(2.5),
    width: hp(2.5),
    backgroundColor: theme.colors.primary,
    borderRadius: hp(1.25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: sp(8),
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: wp(3),
    fontSize: sp(14),
    color: theme.colors.text,
    marginTop: hp(1),
  },
});
