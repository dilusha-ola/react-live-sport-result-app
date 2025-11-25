import { LiveMatchCard } from '@/components/matches/live-match-card';
import { RecentMatchCard } from '@/components/matches/recent-match-card';
import { UpcomingMatchCard } from '@/components/matches/upcoming-match-card';
import { TopBar } from '@/components/navigation/top-bar';
import { useFavorites } from '@/context/favorites-context';
import { useTheme } from '@/context/theme-context';
import { MOCK_DATA } from '@/data/mock-matches';
import { Event, SportCategory } from '@/types/sports';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const SPORT_FILTERS = [
  { key: 'all' as const, label: 'All' },
  { key: 'Soccer' as SportCategory, label: 'Football' },
  { key: 'Cricket' as SportCategory, label: 'Cricket' },
  { key: 'Rugby' as SportCategory, label: 'Rugby' },
];

export default function SearchScreen() {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<'all' | SportCategory>('all');
  
  const styles = getStyles(isDarkMode);

  // Get all matches from mock data
  const allMatches = useMemo(() => {
    const matches: Event[] = [];
    Object.entries(MOCK_DATA).forEach(([sport, categories]) => {
      matches.push(...categories.live);
      matches.push(...categories.upcoming);
      matches.push(...categories.recent);
    });
    return matches;
  }, []);

  // Filter matches based on search query and sport
  const filteredMatches = useMemo(() => {
    let results = allMatches;

    // Filter by sport
    if (selectedSport !== 'all') {
      results = results.filter(match => match.strSport === selectedSport || 
        (selectedSport === 'Rugby' && match.strSport === 'Rugby Union'));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(match => 
        match.strHomeTeam.toLowerCase().includes(query) ||
        match.strAwayTeam.toLowerCase().includes(query) ||
        match.strLeague.toLowerCase().includes(query) ||
        match.strEvent.toLowerCase().includes(query)
      );
    }

    return results;
  }, [allMatches, searchQuery, selectedSport]);

  const handleMatchPress = (match: Event) => {
    router.push({
      pathname: '/match-details' as any,
      params: { match: JSON.stringify(match) },
    });
  };

  const getMatchStatus = (match: Event): 'live' | 'upcoming' | 'recent' => {
    const today = new Date().toISOString().split('T')[0];
    const matchDate = match.dateEvent;

    if (matchDate === today && match.intHomeScore) {
      return 'live';
    } else if (matchDate && matchDate > today) {
      return 'upcoming';
    } else {
      return 'recent';
    }
  };

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
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={isDarkMode ? '#6B7280' : '#9CA3AF'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search teams, leagues, matches..."
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={isDarkMode ? '#6B7280' : '#9CA3AF'} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sport Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
          style={styles.filtersContainer}
        >
          {SPORT_FILTERS.map((sport) => (
            <TouchableOpacity
              key={sport.key}
              style={[
                styles.filterChip,
                selectedSport === sport.key && styles.filterChipActive,
              ]}
              onPress={() => setSelectedSport(sport.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedSport === sport.key && styles.filterChipTextActive,
                ]}
              >
                {sport.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {searchQuery.trim() === '' && selectedSport === 'all' ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color={isDarkMode ? '#475569' : '#D1D5DB'} />
              <Text style={styles.emptyTitle}>Search for Matches</Text>
              <Text style={styles.emptySubtitle}>
                Enter team names, leagues, or select a sport to find matches
              </Text>
            </View>
          ) : filteredMatches.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={64} color={isDarkMode ? '#475569' : '#D1D5DB'} />
              <Text style={styles.emptyTitle}>No Results Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'} found
                </Text>
              </View>
              <View style={styles.matchesList}>
                {filteredMatches.map(renderMatchCard)}
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
  searchContainer: {
    backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#334155' : '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#334155' : '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: isDarkMode ? '#E2E8F0' : '#1F2937',
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filtersContent: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDarkMode ? '#334155' : '#F3F4F6',
    borderWidth: 1,
    borderColor: isDarkMode ? '#475569' : '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#CBD5E1' : '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#0F172A' : '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#94A3B8' : '#6B7280',
  },
  matchesList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
