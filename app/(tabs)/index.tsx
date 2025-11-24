import { LiveMatchCard } from '@/components/matches/live-match-card';
import { RecentMatchCard } from '@/components/matches/recent-match-card';
import { UpcomingMatchCard } from '@/components/matches/upcoming-match-card';
import { TopBar } from '@/components/navigation/top-bar';
import { sportsService } from '@/services/sports.service';
import { Event, MatchStatus, SportCategory } from '@/types/sports';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const MATCH_TABS: { key: MatchStatus; label: string }[] = [
  { key: 'live', label: 'LIVE' },
  { key: 'upcoming', label: 'UPCOMING' },
  { key: 'recent', label: 'RECENT' },
];

const SPORT_CATEGORIES: { key: SportCategory; label: string; icon: string }[] = [
  { key: 'Soccer', label: 'Football', icon: 'football-outline' },
  { key: 'Cricket', label: 'Cricket', icon: 'baseball-outline' },
  { key: 'Rugby', label: 'Rugby', icon: 'american-football-outline' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MatchStatus>('live');
  const [activeSport, setActiveSport] = useState<SportCategory>('Soccer');
  const [matches, setMatches] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMatches();
  }, [activeTab, activeSport]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      console.log(`Loading ${activeTab} matches for ${activeSport}`);
      let data: Event[] = [];
      
      switch (activeTab) {
        case 'live':
          data = await sportsService.getLiveScores(activeSport);
          break;
        case 'upcoming':
          data = await sportsService.getUpcomingMatches(activeSport);
          break;
        case 'recent':
          data = await sportsService.getRecentMatches(activeSport);
          break;
      }
      
      console.log(`Loaded ${data.length} matches for ${activeSport}`);
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (matchId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(matchId)) {
        newFavorites.delete(matchId);
      } else {
        newFavorites.add(matchId);
      }
      return newFavorites;
    });
  };

  const handleMatchPress = (match: Event) => {
    router.push({
      pathname: '/match-details',
      params: { match: JSON.stringify(match) },
    });
  };

  const renderMatchCard = (match: Event) => {
    const isFavorite = favorites.has(match.idEvent);
    
    if (activeTab === 'live') {
      return (
        <LiveMatchCard
          key={match.idEvent}
          match={match}
          isFavorite={isFavorite}
          onPress={() => handleMatchPress(match)}
          onFavoritePress={() => toggleFavorite(match.idEvent)}
        />
      );
    } else if (activeTab === 'recent') {
      return (
        <RecentMatchCard
          key={match.idEvent}
          match={match}
          isFavorite={isFavorite}
          onPress={() => handleMatchPress(match)}
          onFavoritePress={() => toggleFavorite(match.idEvent)}
        />
      );
    } else {
      return (
        <UpcomingMatchCard
          key={match.idEvent}
          match={match}
          isFavorite={isFavorite}
          onPress={() => handleMatchPress(match)}
          onFavoritePress={() => toggleFavorite(match.idEvent)}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      
      {/* Main Tabs */}
      <View style={styles.mainTabsContainer}>
        {MATCH_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.mainTab,
              activeTab === tab.key && styles.mainTabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.mainTabText,
                activeTab === tab.key && styles.mainTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sport Category Filters */}
      <View style={styles.sportFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sportFiltersContent}
        >
          {SPORT_CATEGORIES.map((sport) => (
            <TouchableOpacity
              key={sport.key}
              style={[
                styles.sportFilter,
                activeSport === sport.key && styles.sportFilterActive,
              ]}
              onPress={() => setActiveSport(sport.key)}
            >
              <Ionicons
                name={sport.icon as any}
                size={20}
                color={activeSport === sport.key ? '#FFFFFF' : '#6B7280'}
              />
              <Text
                style={[
                  styles.sportFilterText,
                  activeSport === sport.key && styles.sportFilterTextActive,
                ]}
              >
                {sport.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Matches List */}
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeTab === 'live' && `Live ${activeSport} Matches`}
              {activeTab === 'upcoming' && `Upcoming ${activeSport} Matches`}
              {activeTab === 'recent' && `Recent ${activeSport} Matches`}
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.loadingText}>Loading matches...</Text>
            </View>
          ) : matches.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No matches found</Text>
              <Text style={styles.emptySubtext}>
                Check back later for updates
              </Text>
            </View>
          ) : (
            <View style={styles.matchesList}>
              {matches.map(renderMatchCard)}
            </View>
          )}
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
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  mainTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  mainTab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  mainTabActive: {
    borderBottomColor: '#4F46E5',
  },
  mainTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  mainTabTextActive: {
    color: '#4F46E5',
  },
  sportFiltersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  sportFiltersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sportFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sportFilterActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  sportFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  sportFilterTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
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
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#9CA3AF',
  },
});


