import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const validateForm = (): boolean => {
    const newErrors = {
      username: '',
      password: '',
    };

    let isValid = true;

    // Username/Email validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login...');
      await login(formData);
      console.log('Login successful, navigating to home...');
      router.replace('/(tabs)');
      alert('Login successful! Welcome back.');
    } catch (error) {
      console.error('Login error:', error);
      alert(error instanceof Error ? error.message : 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpPress = () => {
    router.push('/(auth)/signup');
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
              <Text style={styles.titleBlack}>Pulse</Text>
            </Text>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to track your favorite teams and live scores.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="Username / Email"
              placeholder="enter@email.com"
              value={formData.username}
              onChangeText={(text) => {
                setFormData({ ...formData, username: text });
                setErrors({ ...errors, username: '' });
              }}
              error={errors.username}
              autoCapitalize="none"
              autoComplete="username"
              keyboardType="email-address"
            />

            <TextInput
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(text) => {
                setFormData({ ...formData, password: text });
                setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />

            <Button
              title="Log In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUpPress}>
                <Text style={styles.signUpLink}>Sign Up</Text>
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
    marginBottom: 24,
    textAlign: 'center',
  },
  titleBlue: {
    color: '#4F46E5',
  },
  titleBlack: {
    color: '#000000',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  loginButton: {
    marginTop: 8,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
  },
});
