import { VibrantPlum } from '@/constants/Colors';
import React from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', onPress: () => {} }],
  onClose,
}) => {
  const handleButtonPress = (button: any) => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  };

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case 'destructive':
        return [styles.button, styles.destructiveButton];
      case 'cancel':
        return [styles.button, styles.cancelButton];
      default:
        return [styles.button, styles.defaultButton];
    }
  };

  const getButtonTextStyle = (style?: string) => {
    switch (style) {
      case 'destructive':
        return [styles.buttonText, styles.destructiveButtonText];
      case 'cancel':
        return [styles.buttonText, styles.cancelButtonText];
      default:
        return [styles.buttonText, styles.defaultButtonText];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
          
          {message && (
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{message}</Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={getButtonStyle(button.style)}
                onPress={() => handleButtonPress(button)}
              >
                <Text style={getButtonTextStyle(button.style)}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Enhanced alert utilities that use the custom alert
export const showCustomAlert = (
  title: string,
  message?: string,
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>
) => {
  // For now, fall back to native alert but with better styling
  // In a full implementation, you'd manage the custom alert state
  Alert.alert(title, message, buttons);
};

export const showPlumSuccessAlert = (
  title: string,
  message?: string,
  onPress?: () => void
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'OK',
        onPress: onPress,
        style: 'default'
      }
    ]
  );
};

export const showPlumErrorAlert = (
  title: string,
  message?: string,
  onPress?: () => void
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'OK',
        onPress: onPress,
        style: 'default'
      }
    ]
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  defaultButton: {
    backgroundColor: VibrantPlum,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  destructiveButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultButtonText: {
    color: '#ffffff',
  },
  cancelButtonText: {
    color: '#374151',
  },
  destructiveButtonText: {
    color: '#ffffff',
  },
});
