import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { FavoritesProvider } from '@/context/favorites-context';
import { ThemeProvider as AppThemeProvider, useTheme } from '@/context/theme-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isDarkMode } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log('Navigation guard:', { isLoading, isAuthenticated, segments });
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    // Handle navigation based on auth state
    setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        // Not authenticated and not in auth group - go to login
        console.log('Redirecting to login...');
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        // Authenticated but in auth group - go to app
        console.log('Redirecting to tabs...');
        router.replace('/(tabs)');
      }
    }, 50);
  }, [isAuthenticated, isLoading, router]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="match-details" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <FavoritesProvider>
          <RootLayoutNav />
        </FavoritesProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
}
