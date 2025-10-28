import { useState } from 'react';

export interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    action?: { label: string; onPress: () => void }
  ) => {
    setToast({
      visible: true,
      message,
      type,
      action,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const showSuccess = (message: string, action?: { label: string; onPress: () => void }) => {
    showToast(message, 'success', action);
  };

  const showError = (message: string, action?: { label: string; onPress: () => void }) => {
    showToast(message, 'error', action);
  };

  const showWarning = (message: string, action?: { label: string; onPress: () => void }) => {
    showToast(message, 'warning', action);
  };

  const showInfo = (message: string, action?: { label: string; onPress: () => void }) => {
    showToast(message, 'info', action);
  };

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
