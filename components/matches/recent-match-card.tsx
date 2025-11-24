import { Event } from '@/types/sports';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecentMatchCardProps {
  match: Event;
  onPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export function RecentMatchCard({ match, onPress, onFavoritePress, isFavorite = false }: RecentMatchCardProps) {
  const homeScore = match.intHomeScore || '0';
  const awayScore = match.intAwayScore || '0';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const date = match.dateEvent ? formatDate(match.dateEvent) : 'N/A';
  const status = 'Final';

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
          {/* Recent badge and favorite */}
          <View style={styles.header}>
            <View style={styles.recentBadge}>
              <Text style={styles.recentText}>FINAL</Text>
            </View>
            <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
              <Ionicons 
                name={isFavorite ? 'star' : 'star-outline'} 
                size={24} 
                color="#FCD34D" 
              />
            </TouchableOpacity>
          </View>

          {/* Teams and icon */}
          <View style={styles.matchInfo}>
            <Ionicons name="people-outline" size={24} color="#6B7280" style={styles.teamIcon} />
            <Text style={styles.teams}>
              {match.strHomeTeam} vs. {match.strAwayTeam}
            </Text>
          </View>

          {/* Date and status */}
          <Text style={styles.dateStatus}>
            Date: {date} | {status}
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>
            {homeScore} - {awayScore}
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
    backgroundColor: '#10B981',
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
  recentBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  recentText: {
    color: '#10B981',
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
  teamIcon: {
    marginRight: 8,
  },
  teams: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  dateStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreContainer: {
    justifyContent: 'center',
    paddingRight: 16,
  },
  score: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
});
