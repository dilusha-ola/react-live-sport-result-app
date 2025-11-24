import { TopBar } from '@/components/navigation/top-bar';
import { useAuth } from '@/context/auth-context';
import { useFavorites } from '@/context/favorites-context';
import { useTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { logout, user } = useAuth();
  const { favorites } = useFavorites();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [liveScoreAlerts, setLiveScoreAlerts] = useState(true);

  const handleLogout = async () => {
    console.log('Handle logout called');
    
    // Use window.confirm for web compatibility
    const confirmed = window.confirm('Are you sure you want to logout?');
    console.log('Confirmation result:', confirmed);
    
    if (!confirmed) {
      console.log('Logout cancelled');
      return;
    }
    
    console.log('Logout confirmed');
    try {
      await logout();
      console.log('Logout completed, navigating to login...');
      router.replace('/(auth)/login');
      alert('You have been logged out successfully.');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear specific cache items (not favorites)
              await AsyncStorage.multiRemove(['@scorepulse_cache', '@scorepulse_settings']);
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear All Favorites',
      `This will remove all ${favorites.length} favorite matches. Are you sure?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@scorepulse_favorites');
              Alert.alert('Success', 'All favorites have been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear favorites');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="person-outline" size={24} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Username</Text>
                  <Text style={styles.settingValue}>{user?.username || 'Not set'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="mail-outline" size={24} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Email</Text>
                  <Text style={styles.settingValue}>{user?.email || 'Not set'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={24} color="#6B7280" />
                <Text style={styles.settingLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                thumbColor={notificationsEnabled ? '#4F46E5' : '#F3F4F6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="flash-outline" size={24} color="#6B7280" />
                <Text style={styles.settingLabel}>Live Score Alerts</Text>
              </View>
              <Switch
                value={liveScoreAlerts}
                onValueChange={setLiveScoreAlerts}
                trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                thumbColor={liveScoreAlerts ? '#4F46E5' : '#F3F4F6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="moon-outline" size={24} color="#6B7280" />
                <Text style={styles.settingLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                thumbColor={isDarkMode ? '#4F46E5' : '#F3F4F6'}
              />
            </View>
          </View>

          {/* Data & Storage Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data & Storage</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="star-outline" size={24} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Favorite Matches</Text>
                  <Text style={styles.settingValue}>{favorites.length} saved</Text>
                </View>
              </View>
              {favorites.length > 0 && (
                <TouchableOpacity onPress={handleClearFavorites}>
                  <Text style={styles.actionText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
              <View style={styles.settingLeft}>
                <Ionicons name="trash-outline" size={24} color="#6B7280" />
                <Text style={styles.settingLabel}>Clear Cache</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Version</Text>
                  <Text style={styles.settingValue}>1.0.0</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="document-text-outline" size={24} color="#6B7280" />
                <Text style={styles.settingLabel}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#6B7280" />
                <Text style={styles.settingLabel}>Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
