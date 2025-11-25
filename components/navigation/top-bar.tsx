import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export function TopBar() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      // If we have both first and last name, show full name
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.username) {
      return user.username;
    }
    return 'dilap';
  };

  const displayName = getDisplayName();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            <Text style={styles.logoBlue}>Score</Text>
            <Text style={styles.logoBlack}>Pulse</Text>
          </Text>
        </View>

        {/* User Profile */}
        <View style={styles.userContainer}>
          <Text style={styles.userName}>{displayName}</Text>
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={20} color={isDarkMode ? '#818CF8' : '#4F46E5'} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#334155' : '#E5E7EB',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
  },
  logoBlue: {
    color: isDarkMode ? '#818CF8' : '#4F46E5',
  },
  logoBlack: {
    color: isDarkMode ? '#F1F5F9' : '#000000',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: isDarkMode ? '#E2E8F0' : '#1F2937',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: isDarkMode ? '#334155' : '#E5E7EB',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: isDarkMode ? '#312E81' : '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
