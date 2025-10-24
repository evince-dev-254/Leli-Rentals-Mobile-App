import { Alert } from 'react-native';

// Custom alert function with plum color theme
export const showAlert = (
  title: string,
  message?: string,
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>
) => {
  Alert.alert(title, message, buttons);
};

// Success alert with plum theme
export const showSuccessAlert = (
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

// Error alert with plum theme
export const showErrorAlert = (
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

// Confirmation alert with plum theme
export const showConfirmationAlert = (
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
    ]
  );
};

// Delete confirmation alert with plum theme
export const showDeleteAlert = (
  title: string,
  message: string,
  onDelete: () => void,
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
        text: 'Delete',
        onPress: onDelete,
        style: 'destructive'
      }
    ]
  );
};
