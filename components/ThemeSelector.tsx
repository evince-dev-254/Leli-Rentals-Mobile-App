import {
    Background,
    Border,
    CardBackground,
    DarkBackground,
    DarkBorder,
    DarkCard,
    DarkSecondaryText,
    DarkText,
    NatureDarkBackground,
    NatureDarkBorder,
    NatureDarkCard,
    NatureDarkSecondaryText,
    NatureDarkText,
    NatureVibrantGreen,
    PrimaryButton,
    PrimaryText,
    SecondaryText,
} from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ThemeSelectorProps {
  onClose?: () => void;
}

export default function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const { theme, themeMode, setThemeMode } = useTheme();

  const themes = [
    {
      id: 'light',
      name: 'Light Theme',
      description: 'Clean and bright',
      icon: 'sunny-outline',
      color: '#fbbf24',
      preview: {
        background: Background,
        card: CardBackground,
        text: PrimaryText,
        secondaryText: SecondaryText,
        border: Border,
        accent: PrimaryButton,
      }
    },
    {
      id: 'dark',
      name: 'Dark Theme',
      description: 'Modern and sleek',
      icon: 'moon-outline',
      color: '#6366f1',
      preview: {
        background: DarkBackground,
        card: DarkCard,
        text: DarkText,
        secondaryText: DarkSecondaryText,
        border: DarkBorder,
        accent: '#ff6b35',
      }
    },
    {
      id: 'nature',
      name: 'Nature Theme',
      description: 'Camping & outdoor vibes',
      icon: 'leaf-outline',
      color: NatureVibrantGreen,
      preview: {
        background: NatureDarkBackground,
        card: NatureDarkCard,
        text: NatureDarkText,
        secondaryText: NatureDarkSecondaryText,
        border: NatureDarkBorder,
        accent: NatureVibrantGreen,
      }
    }
  ];

  const handleThemeSelect = async (themeId: string) => {
    await setThemeMode(themeId as any);
    if (onClose) onClose();
  };

  const getCurrentTheme = () => {
    return themes.find(t => t.id === theme) || themes[0];
  };

  const currentTheme = getCurrentTheme();

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.preview.background }]}>
      <View style={[styles.header, { borderBottomColor: currentTheme.preview.border }]}>
        <Text style={[styles.title, { color: currentTheme.preview.text }]}>
          Choose Theme
        </Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={currentTheme.preview.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.themesGrid}>
        {themes.map((themeOption) => (
          <TouchableOpacity
            key={themeOption.id}
            style={[
              styles.themeGridCard,
              {
                backgroundColor: themeOption.preview.card,
                borderColor: theme === themeOption.id ? themeOption.preview.accent : themeOption.preview.border,
                borderWidth: theme === themeOption.id ? 2 : 1,
              }
            ]}
            onPress={() => handleThemeSelect(themeOption.id)}
            activeOpacity={0.8}
          >
            {/* Icon and Selection Indicator */}
            <View style={styles.themeCardHeader}>
              <View style={[styles.themeIcon, { backgroundColor: themeOption.color }]}>
                <Ionicons name={themeOption.icon as any} size={20} color="#ffffff" />
              </View>
              {theme === themeOption.id && (
                <Ionicons name="checkmark-circle" size={20} color={themeOption.preview.accent} />
              )}
            </View>

            {/* Theme Name - Horizontal Text */}
            <Text style={[styles.themeName, { color: themeOption.preview.text }]} numberOfLines={1}>
              {themeOption.name}
            </Text>

            {/* Theme Description - Horizontal Text */}
            <Text style={[styles.themeDescription, { color: themeOption.preview.secondaryText }]} numberOfLines={2}>
              {themeOption.description}
            </Text>

            {/* Theme Preview */}
            <View style={[styles.themePreview, { backgroundColor: themeOption.preview.background }]}>
              <View style={[styles.previewCard, { backgroundColor: themeOption.preview.card, borderColor: themeOption.preview.border }]}>
                <View style={styles.previewHeader}>
                  <View style={[styles.previewDot, { backgroundColor: themeOption.preview.accent }]} />
                  <View style={[styles.previewDot, { backgroundColor: themeOption.preview.accent }]} />
                  <View style={[styles.previewDot, { backgroundColor: themeOption.preview.accent }]} />
                </View>
                <View style={styles.previewContent}>
                  <View style={[styles.previewLine, { backgroundColor: themeOption.preview.text, width: '80%' }]} />
                  <View style={[styles.previewLine, { backgroundColor: themeOption.preview.secondaryText, width: '60%' }]} />
                </View>
                <View style={[styles.previewButton, { backgroundColor: themeOption.preview.accent }]} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  themeGridCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  themeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  themeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  themeDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  themePreview: {
    borderRadius: 8,
    padding: 8,
    minHeight: 60,
  },
  previewCard: {
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    flex: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 6,
    justifyContent: 'center',
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  previewContent: {
    gap: 3,
    marginBottom: 6,
  },
  previewLine: {
    height: 2,
    borderRadius: 1,
  },
  previewButton: {
    height: 6,
    borderRadius: 3,
    width: '50%',
    alignSelf: 'center',
  },
});
