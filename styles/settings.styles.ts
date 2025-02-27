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
    padding: wp(5),
  },
  section: {
    marginBottom: hp(3),
    backgroundColor: '#ffffff',
    borderRadius: sp(16),
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: hp(1.5),
  },
  sectionIcon: {
    marginRight: wp(3),
    backgroundColor: 'rgba(83, 134, 255, 0.1)',
    padding: wp(2.5),
    borderRadius: sp(10),
  },
  label: {
    fontSize: sp(16),
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: hp(1),
    letterSpacing: 0.2,
  },
  value: {
    fontSize: sp(14),
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: wp(2),
  },
  picker: {
    backgroundColor: 'rgba(83, 134, 255, 0.05)',
    borderRadius: sp(12),
    marginTop: hp(1),
    height: hp(6),
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: wp(3),
    marginTop: hp(2),
  },
  button: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: sp(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    height: hp(6),
  },
  selectedButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    fontSize: sp(14),
    fontWeight: '600',
    color: theme.colors.text,
  },
  selectedButtonText: {
    color: '#fff',
  },
  slider: {
    marginTop: hp(1),
    marginBottom: hp(1),
    height: hp(4),
    width: '100%',
  },
  sliderContainer: {
    backgroundColor: 'rgba(83, 134, 255, 0.05)',
    borderRadius: sp(12),
    padding: wp(4),
    marginTop: hp(1),
    overflow: 'hidden',
  },
  customThumbStyle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTrackStyle: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  parameterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: 'rgba(83, 134, 255, 0.05)',
    borderRadius: sp(12),
    borderWidth: 0,
    padding: wp(4),
    fontSize: sp(14),
    color: theme.colors.text,
    marginTop: hp(1),
    height: hp(6),
  },
  inputContainer: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    right: wp(3),
    top: hp(2.5),
    zIndex: 1,
  },
  parameterLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helpIcon: {
    marginLeft: wp(2),
  },
  modelCard: {
    padding: wp(3),
    borderRadius: sp(10),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedModelCard: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(83, 134, 255, 0.05)',
  },
  modelName: {
    flex: 1,
    fontSize: sp(14),
    fontWeight: '500',
  },
  modelCheckmark: {
    color: theme.colors.primary,
  }
});