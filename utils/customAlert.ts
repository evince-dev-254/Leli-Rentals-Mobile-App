import { Alert } from 'react-native';

export const customAlert = {
  success: (title: string, message: string, onPress?: () => void) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: onPress,
          style: 'default'
        }
      ],
      {
        cancelable: true,
      }
    );
  },

  error: (title: string, message: string, onPress?: () => void) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: onPress,
          style: 'default'
        }
      ],
      {
        cancelable: true,
      }
    );
  },

  confirm: (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void
  ) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          onPress: onCancel,
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: onConfirm,
          style: 'default'
        }
      ],
      {
        cancelable: true,
      }
    );
  }
};
