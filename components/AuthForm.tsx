import {
    Background,
    Border,
    InputBackground,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    VibrantRed,
    WhiteBackground,
} from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type AuthFormProps = {
  type: 'SIGN_IN' | 'SIGN_UP';
  schema?: any; // Placeholder for parity with provided structure
  defaultValues: { email: string; password: string };
  onSubmit: (data: { email: string; password: string }) => Promise<any>;
  onForgotPassword?: () => void;
  onGoogle?: () => void;
  submitting?: boolean;
};

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  defaultValues,
  onSubmit,
  onForgotPassword,
  onGoogle,
  submitting,
}) => {
  const [email, setEmail] = useState(defaultValues.email);
  const [password, setPassword] = useState(defaultValues.password);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    await onSubmit({ email, password });
  };

  return (
    <View style={styles.card}>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color={SecondaryText} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={SecondaryText}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={SecondaryText} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={SecondaryText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={SecondaryText} />
        </TouchableOpacity>
      </View>

      {onForgotPassword && (
        <TouchableOpacity style={styles.forgotPassword} onPress={onForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]} onPress={handleSubmit} disabled={!!submitting}>
        <Text style={styles.primaryButtonText}>{submitting ? (type === 'SIGN_IN' ? 'Signing In...' : 'Creating...') : type === 'SIGN_IN' ? 'Sign In' : 'Sign Up'}</Text>
        {!submitting && <Ionicons name="arrow-forward" size={18} color={WhiteBackground} />}
      </TouchableOpacity>

      {onGoogle && (
        <TouchableOpacity style={styles.googleButton} onPress={onGoogle} disabled={!!submitting}>
          <Ionicons name="logo-google" size={18} color={VibrantRed} />
          <Text style={styles.googleText}>{type === 'SIGN_IN' ? 'Continue with Google' : 'Sign up with Google'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Background,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: InputBackground,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: PrimaryText,
  },
  eyeIcon: { padding: 4 },
  forgotPassword: { alignSelf: 'flex-end' },
  forgotPasswordText: { color: PrimaryBrand, fontSize: 14, fontWeight: '600' },
  primaryButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: WhiteBackground, fontSize: 18, fontWeight: 'bold' },
  googleButton: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: InputBackground,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Border,
    gap: 8,
  },
  googleText: { fontSize: 14, fontWeight: '600', color: PrimaryText },
});

export default AuthForm;


