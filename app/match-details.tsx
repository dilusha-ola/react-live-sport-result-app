import { Event } from '@/types/sports';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function MatchDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [match, setMatch] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.match) {
      try {
        const matchData = JSON.parse(params.match as string);
        setMatch(matchData);
      } catch (error) {
        console.error('Error parsing match data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [params.match]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'TBD';
    return timeString;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (!match) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Match not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const homeScore = match.intHomeScore || '0';
  const awayScore = match.intAwayScore || '0';
  const hasScore = match.intHomeScore !== null && match.intAwayScore !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonHeader}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Match Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Match Header */}
          <View style={styles.matchHeader}>
            <Text style={styles.sport}>{match.strSport}</Text>
            <Text style={styles.league}>{match.strLeague}</Text>
            {match.strSeason && (
              <Text style={styles.season}>Season: {match.strSeason}</Text>
            )}
          </View>

          {/* Score Section */}
          <View style={styles.scoreSection}>
            <View style={styles.teamSection}>
              <View style={styles.teamBadge}>
                <Ionicons name="home" size={32} color="#4F46E5" />
              </View>
              <Text style={styles.teamName}>{match.strHomeTeam}</Text>
              {hasScore && <Text style={styles.teamScore}>{homeScore}</Text>}
            </View>

            <View style={styles.vsSection}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            <View style={styles.teamSection}>
              <View style={styles.teamBadge}>
                <Ionicons name="airplane" size={32} color="#EF4444" />
              </View>
              <Text style={styles.teamName}>{match.strAwayTeam}</Text>
              {hasScore && <Text style={styles.teamScore}>{awayScore}</Text>}
            </View>
          </View>

          {/* Match Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Match Information</Text>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{formatDate(match.dateEvent)}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="time-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{formatTime(match.strTime)}</Text>
              </View>
            </View>

            {match.strStatus && (
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={styles.infoValue}>{match.strStatus}</Text>
                </View>
              </View>
            )}

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="trophy-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>League</Text>
                <Text style={styles.infoValue}>{match.strLeague || 'N/A'}</Text>
              </View>
            </View>

            {match.strEvent && (
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="football-outline" size={20} color="#6B7280" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Event</Text>
                  <Text style={styles.infoValue}>{match.strEvent}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Final Result Badge */}
          {hasScore && (
            <View style={styles.resultBadge}>
              <Text style={styles.resultText}>
                Final Result: {homeScore} - {awayScore}
              </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButtonHeader: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: 32,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  matchHeader: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  sport: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  league: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  season: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreSection: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  teamSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  teamBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  teamScore: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4F46E5',
  },
  vsSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  vsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  resultBadge: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
