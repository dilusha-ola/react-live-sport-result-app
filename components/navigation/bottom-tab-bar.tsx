import { useTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
  name: string;
  label: string;
  icon: IconName;
  iconOutline: IconName;
}

const TAB_CONFIGS: Record<string, TabConfig> = {
  index: {
    name: 'index',
    label: 'Home',
    icon: 'home',
    iconOutline: 'home-outline',
  },
  favourites: {
    name: 'favourites',
    label: 'Favourites',
    icon: 'star',
    iconOutline: 'star-outline',
  },
  search: {
    name: 'search',
    label: 'Search',
    icon: 'search',
    iconOutline: 'search-outline',
  },
  settings: {
    name: 'settings',
    label: 'Settings',
    icon: 'settings',
    iconOutline: 'settings-outline',
  },
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIGS[route.name] || TAB_CONFIGS.index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              <Ionicons
                name={isFocused ? config.icon : config.iconOutline}
                size={24}
                color={isFocused ? (isDarkMode ? '#818CF8' : '#4F46E5') : (isDarkMode ? '#6B7280' : '#9CA3AF')}
              />
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? (isDarkMode ? '#818CF8' : '#4F46E5') : (isDarkMode ? '#6B7280' : '#9CA3AF') },
                ]}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? '#334155' : '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
