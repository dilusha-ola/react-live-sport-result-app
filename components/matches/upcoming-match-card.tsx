import { Event } from '@/types/sports';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UpcomingMatchCardProps {
  match: Event;
  onPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export function UpcomingMatchCard({ match, onPress, onFavoritePress, isFavorite = false }: UpcomingMatchCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'TBD';
    return timeString;
  };

  const date = match.dateEvent ? formatDate(match.dateEvent) : 'TBD';
  const time = formatTime(match.strTime);
  const league = match.strLeague || 'League';

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Left border indicator */}
        <View style={styles.leftBorder} />

        {/* Main content */}
        <View style={styles.content}>
          {/* Upcoming badge and favorite */}
          <View style={styles.header}>
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingText}>UPCOMING</Text>
            </View>
            <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
              <Ionicons 
                name={isFavorite ? 'star' : 'star-outline'} 
                size={24} 
                color="#FCD34D" 
              />
            </TouchableOpacity>
          </View>

          {/* Calendar icon and teams */}
          <View style={styles.matchInfo}>
            <Ionicons name="calendar-outline" size={24} color="#6B7280" style={styles.icon} />
            <Text style={styles.teams}>
              {match.strHomeTeam} vs. {match.strAwayTeam}
            </Text>
          </View>

          {/* Date, time and league */}
          <Text style={styles.dateTime}>
            Date: {date} @ {time} EST | {league}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
  },
  leftBorder: {
    width: 4,
    backgroundColor: '#6366F1',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  upcomingBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  upcomingText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '700',
  },
  favoriteButton: {
    padding: 4,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  teams: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  dateTime: {
    fontSize: 14,
    color: '#6B7280',
  },
});
