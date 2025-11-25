import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };

    let isValid = true;

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting sign up...');
      await signUp(formData);
      console.log('Sign up successful, navigating to home...');
      router.replace('/(tabs)');
      alert('Account created successfully! Welcome to ScorePulse.');
    } catch (error) {
      console.error('Sign up error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              <Text style={styles.titleBlue}>Score</Text>
              <Text style={styles.titleBlack}> Pulse</Text>
            </Text>
            <Text style={styles.subtitle}>
              Sign in to track your favorite teams and live scores.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="First Name:"
              placeholder=""
              value={formData.firstName}
              onChangeText={(text) => {
                setFormData({ ...formData, firstName: text });
                setErrors({ ...errors, firstName: '' });
              }}
              error={errors.firstName}
              autoCapitalize="words"
              autoComplete="given-name"
            />

            <TextInput
              label="Last Name:"
              placeholder=""
              value={formData.lastName}
              onChangeText={(text) => {
                setFormData({ ...formData, lastName: text });
                setErrors({ ...errors, lastName: '' });
              }}
              error={errors.lastName}
              autoCapitalize="words"
              autoComplete="family-name"
            />

            <TextInput
              label="Email:"
              placeholder=""
              value={formData.email}
              onChangeText={(text) => {
                setFormData({ ...formData, email: text });
                setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <TextInput
              label="Password:"
              placeholder=""
              value={formData.password}
              onChangeText={(text) => {
                setFormData({ ...formData, password: text });
                setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
            />

            <Button
              title="Sign Up"
              onPress={handleSignUp}
              loading={loading}
              style={styles.signUpButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLoginPress}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  titleBlue: {
    color: '#4F46E5',
  },
  titleBlack: {
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  signUpButton: {
    marginTop: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
  },
});
