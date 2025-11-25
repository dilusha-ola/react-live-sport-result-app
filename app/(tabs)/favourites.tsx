import { LiveMatchCard } from '@/components/matches/live-match-card';
import { RecentMatchCard } from '@/components/matches/recent-match-card';
import { UpcomingMatchCard } from '@/components/matches/upcoming-match-card';
import { TopBar } from '@/components/navigation/top-bar';
import { useFavorites } from '@/context/favorites-context';
import { useTheme } from '@/context/theme-context';
import { Event, MatchStatus } from '@/types/sports';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const MATCH_TABS: { key: MatchStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'live', label: 'LIVE' },
  { key: 'upcoming', label: 'UPCOMING' },
  { key: 'recent', label: 'RECENT' },
];

export default function FavouritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite, isFavorite, loading } = useFavorites();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<MatchStatus | 'all'>('all');
  
  const styles = getStyles(isDarkMode);

  const handleMatchPress = (match: Event) => {
    router.push({
      pathname: '/match-details' as any,
      params: { match: JSON.stringify(match) },
    });
  };

  const getMatchStatus = (match: Event): MatchStatus => {
    const today = new Date().toISOString().split('T')[0];
    const matchDate = match.dateEvent;

    if (matchDate === today) {
      return 'live';
    } else if (matchDate && matchDate > today) {
      return 'upcoming';
    } else {
      return 'recent';
    }
  };

  const filteredFavorites = activeTab === 'all' 
    ? favorites 
    : favorites.filter(match => getMatchStatus(match) === activeTab);

  const renderMatchCard = (match: Event) => {
    const status = getMatchStatus(match);
    const isMatchFavorite = isFavorite(match.idEvent);

    if (status === 'live') {
      return (
        <LiveMatchCard
          key={match.idEvent}
          match={match}
          isFavorite={isMatchFavorite}
          onPress={() => handleMatchPress(match)}
          onFavoritePress={() => toggleFavorite(match)}
        />
      );
    } else if (status === 'recent') {
      return (
        <RecentMatchCard
          key={match.idEvent}
          match={match}
          isFavorite={isMatchFavorite}
          onPress={() => handleMatchPress(match)}
          onFavoritePress={() => toggleFavorite(match)}
        />
      );
    } else {
      return (
        <UpcomingMatchCard
          key={match.idEvent}
          match={match}
          isFavorite={isMatchFavorite}
          onPress={() => handleMatchPress(match)}
          onFavoritePress={() => toggleFavorite(match)}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {MATCH_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Favorites List */}
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={isDarkMode ? '#818CF8' : '#4F46E5'} />
              <Text style={styles.loadingText}>Loading favorites...</Text>
            </View>
          ) : filteredFavorites.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="star-outline" size={64} color={isDarkMode ? '#475569' : '#D1D5DB'} />
              <Text style={styles.emptyTitle}>No Favorites Yet</Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'all' 
                  ? 'Tap the star icon on any match to add it to your favorites'
                  : `No ${activeTab} matches in your favorites`}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>
                  {activeTab === 'all' ? 'All Favorites' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Favorites`}
                </Text>
                <Text style={styles.count}>{filteredFavorites.length} matches</Text>
              </View>
              <View style={styles.matchesList}>
                {filteredFavorites.map(renderMatchCard)}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#0F172A' : '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#334155' : '#E5E7EB',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: isDarkMode ? '#818CF8' : '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#64748B' : '#9CA3AF',
  },
  tabTextActive: {
    color: isDarkMode ? '#818CF8' : '#4F46E5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: isDarkMode ? '#F1F5F9' : '#1F2937',
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#94A3B8' : '#6B7280',
  },
  matchesList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: isDarkMode ? '#94A3B8' : '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '700',
    color: isDarkMode ? '#F1F5F9' : '#1F2937',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: isDarkMode ? '#94A3B8' : '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
