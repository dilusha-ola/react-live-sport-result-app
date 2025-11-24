import { Event, EventsResponse, League, LeaguesResponse } from '@/types/sports';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// Major league IDs for each sport from TheSportsDB
const SPORT_LEAGUES = {
  Soccer: [
    '4328', // English Premier League
    '4335', // Spanish La Liga
    '4331', // German Bundesliga
    '4332', // Italian Serie A
    '4334', // French Ligue 1
  ],
  Cricket: [
    '4420', // International Cricket
    '4421', // IPL
    '4422', // Big Bash League
  ],
  Rugby: [
    '4391', // Super Rugby
    '4392', // Six Nations
    '4393', // Rugby Championship
  ],
};

class SportsService {
  // Get leagues for a specific sport
  private async getLeaguesBySport(sport: string): Promise<League[]> {
    try {
      const response = await fetch(`${BASE_URL}/search_all_leagues.php?s=${encodeURIComponent(sport)}`);
      const data: LeaguesResponse = await response.json();
      return data.leagues || [];
    } catch (error) {
      console.error('Error fetching leagues:', error);
      return [];
    }
  }

  // Get upcoming events for a specific league
  private async getNext15Events(leagueId: string): Promise<Event[]> {
    try {
      const response = await fetch(`${BASE_URL}/eventsnextleague.php?id=${leagueId}`);
      const data: EventsResponse = await response.json();
      return data.events || [];
    } catch (error) {
      console.error(`Error fetching next events for league ${leagueId}:`, error);
      return [];
    }
  }

  // Get past events for a specific league
  private async getPastEvents(leagueId: string): Promise<Event[]> {
    try {
      const response = await fetch(`${BASE_URL}/eventspastleague.php?id=${leagueId}`);
      const data: EventsResponse = await response.json();
      return data.events || [];
    } catch (error) {
      console.error(`Error fetching past events for league ${leagueId}:`, error);
      return [];
    }
  }

  // Get all sports
  async getAllSports() {
    try {
      const response = await fetch(`${BASE_URL}/all_sports.php`);
      const data = await response.json();
      return data.sports || [];
    } catch (error) {
      console.error('Error fetching all sports:', error);
      return [];
    }
  }

  // Get live scores (using past events from today)
  async getLiveScores(sport: string): Promise<Event[]> {
    try {
      console.log(`Fetching live ${sport} matches...`);
      
      const leagueIds = SPORT_LEAGUES[sport as keyof typeof SPORT_LEAGUES] || [];
      if (leagueIds.length === 0) {
        console.log(`No leagues configured for ${sport}`);
        return [];
      }

      // Fetch past events from all leagues for this sport
      const eventsPromises = leagueIds.map(leagueId => this.getPastEvents(leagueId));
      const eventsArrays = await Promise.all(eventsPromises);
      const allEvents = eventsArrays.flat();

      // Filter for today's matches (consider them "live")
      const today = new Date().toISOString().split('T')[0];
      const todayMatches = allEvents.filter(event => {
        if (!event.dateEvent) return false;
        return event.dateEvent === today && event.strSport === sport;
      });

      console.log(`Found ${todayMatches.length} live ${sport} matches`);
      return todayMatches.slice(0, 10);
    } catch (error) {
      console.error('Error fetching live scores:', error);
      return [];
    }
  }

  // Get upcoming matches
  async getUpcomingMatches(sport: string): Promise<Event[]> {
    try {
      console.log(`Fetching upcoming ${sport} matches...`);
      
      const leagueIds = SPORT_LEAGUES[sport as keyof typeof SPORT_LEAGUES] || [];
      if (leagueIds.length === 0) {
        console.log(`No leagues configured for ${sport}`);
        return [];
      }

      // Fetch upcoming events from all leagues for this sport
      const eventsPromises = leagueIds.map(leagueId => this.getNext15Events(leagueId));
      const eventsArrays = await Promise.all(eventsPromises);
      const allEvents = eventsArrays.flat();

      // Filter for future events
      const now = new Date();
      const upcomingMatches = allEvents.filter(event => {
        if (!event.dateEvent) return false;
        const eventDate = new Date(event.dateEvent);
        return eventDate > now && event.strSport === sport;
      });

      console.log(`Found ${upcomingMatches.length} upcoming ${sport} matches`);
      return upcomingMatches.slice(0, 10);
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      return [];
    }
  }

  // Get recent/past matches
  async getRecentMatches(sport: string): Promise<Event[]> {
    try {
      console.log(`Fetching recent ${sport} matches...`);
      
      const leagueIds = SPORT_LEAGUES[sport as keyof typeof SPORT_LEAGUES] || [];
      if (leagueIds.length === 0) {
        console.log(`No leagues configured for ${sport}`);
        return [];
      }

      // Fetch past events from all leagues for this sport
      const eventsPromises = leagueIds.map(leagueId => this.getPastEvents(leagueId));
      const eventsArrays = await Promise.all(eventsPromises);
      const allEvents = eventsArrays.flat();

      // Filter and sort by most recent
      const recentMatches = allEvents
        .filter(event => event.strSport === sport && event.dateEvent)
        .sort((a, b) => {
          const dateA = new Date(a.dateEvent || 0);
          const dateB = new Date(b.dateEvent || 0);
          return dateB.getTime() - dateA.getTime();
        });

      console.log(`Found ${recentMatches.length} recent ${sport} matches`);
      return recentMatches.slice(0, 10);
    } catch (error) {
      console.error('Error fetching recent matches:', error);
      return [];
    }
  }
}

export const sportsService = new SportsService();

