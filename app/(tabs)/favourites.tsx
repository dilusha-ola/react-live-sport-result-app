import { TopBar } from '@/components/navigation/top-bar';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FavouritesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.title}>Favourites</Text>
          <Text style={styles.subtitle}>Your favorite teams and matches will appear here</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholder: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
