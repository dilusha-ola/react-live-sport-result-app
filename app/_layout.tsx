import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { FavoritesProvider } from '@/context/favorites-context';
import { ThemeProvider as AppThemeProvider, useTheme } from '@/context/theme-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  // Don't set initial route here, we'll handle it in the navigation guard
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isDarkMode } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 100);
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to app if authenticated
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
    }
  }, [isAuthenticated, segments, isLoading]);

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
