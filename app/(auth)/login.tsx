import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/Colors';

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithEmailOtp, signInWithPhoneOtp } = useAuth();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (method === 'email') {
        await signInWithEmailOtp(email);
      } else {
        await signInWithPhoneOtp(phone);
      }
      router.push({
        pathname: '/(auth)/otp-verification',
        params: { method, contact: method === 'email' ? email : phone }
      });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = method === 'email' ? email.includes('@') : phone.length >= 10;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>
              Enter your {method} to receive a verification code
            </Text>
          </View>

          <View style={styles.methodSelector}>
            <TouchableOpacity
              style={[
                styles.methodButton,
                method === 'email' && styles.methodButtonActive,
              ]}
              onPress={() => setMethod('email')}
            >
              <Text
                style={[
                  styles.methodButtonText,
                  method === 'email' && styles.methodButtonTextActive,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.methodButton,
                method === 'phone' && styles.methodButtonActive,
              ]}
              onPress={() => setMethod('phone')}
            >
              <Text
                style={[
                  styles.methodButtonText,
                  method === 'phone' && styles.methodButtonTextActive,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            {method === 'email' ? (
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.textLight}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            )}
          </View>

          <Button
            title={`Send OTP via ${method === 'email' ? 'Email' : 'SMS'}`}
            onPress={handleSendOTP}
            disabled={!isValid}
            loading={isLoading}
            size="large"
            style={styles.button}
          />

          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.title1,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  methodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  methodButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  methodButtonActive: {
    backgroundColor: Colors.background,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  methodButtonText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
  methodButtonTextActive: {
    color: Colors.primary,
  },
  inputContainer: {
    marginBottom: Spacing.xl,
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.text,
    minHeight: 56,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  disclaimer: {
    ...Typography.small,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});