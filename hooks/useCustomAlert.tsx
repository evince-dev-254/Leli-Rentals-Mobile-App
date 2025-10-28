import CustomAlert from '@/components/CustomAlert';
import { useState } from 'react';

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export const useCustomAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    options?: {
      onConfirm?: () => void;
      showCancel?: boolean;
      confirmText?: string;
      cancelText?: string;
    }
  ) => {
    setAlertState({
      visible: true,
      title,
      message,
      type,
      onConfirm: options?.onConfirm,
      showCancel: options?.showCancel || false,
      confirmText: options?.confirmText || 'OK',
      cancelText: options?.cancelText || 'Cancel',
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, visible: false }));
  };

  const AlertComponent = () => (
    <CustomAlert
      visible={alertState.visible}
      title={alertState.title}
      message={alertState.message}
      type={alertState.type}
      onClose={hideAlert}
      onConfirm={alertState.onConfirm}
      showCancel={alertState.showCancel}
      confirmText={alertState.confirmText}
      cancelText={alertState.cancelText}
    />
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
};
