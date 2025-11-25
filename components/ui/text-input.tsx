import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    StyleSheet,
    Text,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function TextInput({ label, error, style, secureTextEntry, ...props }: CustomTextInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry === true;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <RNTextInput
          style={[
            styles.input,
            error && styles.inputError,
            isPassword && styles.inputWithIcon,
            style,
          ]}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  iconButton: {
    position: 'absolute',
    right: 12,
    top: 16,
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
});
