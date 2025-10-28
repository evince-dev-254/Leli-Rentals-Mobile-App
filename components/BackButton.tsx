import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

interface BackButtonProps {
  onPress?: () => void;
  text?: string;
  style?: any;
  textStyle?: any;
}

export default function BackButton({ 
  onPress, 
  text = '← Back', 
  style, 
  textStyle 
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  const defaultStyle = {
    position: 'absolute' as const,
    top: 50,
    left: 20,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  };

  const defaultTextStyle = {
    fontSize: 16,
    color: '#d97706',
    fontWeight: '600' as const,
  };

  return (
    <TouchableOpacity 
      style={[defaultStyle, style]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={[defaultTextStyle, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}