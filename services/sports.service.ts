import { MOCK_DATA } from '@/data/mock-matches';
import { Event, EventsResponse, League, LeaguesResponse } from '@/types/sports';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';
const USE_MOCK_DATA = true; // Set to false to use real API

// Sport name mappings for TheSportsDB API
const SPORT_NAMES = {
  Soccer: 'Soccer',
  Cricket: 'Cricket',
  Rugby: 'Rugby Union',
};

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
    '4446', // International Cricket - Test Matches
    '4447', // International Cricket - ODI
    '4448', // International Cricket - T20
    '4513', // Indian Premier League
    '4514', // Big Bash League
    '4509', // Cricket World Cup
    '4524', // T20 World Cup
    '4480', // County Championship
    '4522', // Caribbean Premier League
    '4521', // Pakistan Super League
  ],
  Rugby: [
    '4391', // Premiership Rugby
    '4393', // Six Nations Championship
    '4481', // Super Rugby
    '4482', // The Rugby Championship
    '4480', // Rugby World Cup
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

  // Get events for a team (useful for finding recent matches)
  private async getEventsByTeam(teamName: string): Promise<Event[]> {
    try {
      const response = await fetch(`${BASE_URL}/searchevents.php?e=${encodeURIComponent(teamName)}`);
      const data: EventsResponse = await response.json();
      return data.events || [];
    } catch (error) {
      console.error(`Error fetching events for team ${teamName}:`, error);
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
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      console.log(`Loading mock live ${sport} matches...`);
      const data = MOCK_DATA[sport as keyof typeof MOCK_DATA]?.live || [];
      console.log(`Returning ${data.length} live matches for ${sport}`);
      return data;
    }

    try {
      console.log(`Fetching live ${sport} matches...`);
      
      const sportName = SPORT_NAMES[sport as keyof typeof SPORT_NAMES];
      const leagueIds = SPORT_LEAGUES[sport as keyof typeof SPORT_LEAGUES] || [];
      if (leagueIds.length === 0) {
        console.log(`No leagues configured for ${sport}`);
        return [];
      }

      // Fetch past events from all leagues for this sport
      const eventsPromises = leagueIds.map(leagueId => this.getPastEvents(leagueId));
      const eventsArrays = await Promise.all(eventsPromises);
      const allEvents = eventsArrays.flat().filter(event => event !== null);

      console.log(`Total events fetched for ${sport}:`, allEvents.length);
      
      // Log sport types for debugging
      if (allEvents.length > 0) {
        const uniqueSports = [...new Set(allEvents.map(e => e.strSport))];
        console.log(`Sport types found:`, uniqueSports);
      }

      // Filter by sport - be more flexible with matching
      const filteredEvents = allEvents.filter(event => {
        if (!event || !event.strSport) return false;
        // Match if the event's sport contains our sport name or vice versa
        const eventSport = event.strSport.toLowerCase();
        const searchSport = sportName.toLowerCase();
        return eventSport.includes(searchSport) || searchSport.includes(eventSport);
      });

      console.log(`Filtered to ${filteredEvents.length} ${sportName} events`);

      // Filter for today's matches (consider them "live")
      const today = new Date().toISOString().split('T')[0];
      const todayMatches = filteredEvents.filter(event => {
        if (!event || !event.dateEvent) return false;
        return event.dateEvent === today;
      });

      console.log(`Found ${todayMatches.length} live ${sport} matches for today (${today})`);
      
      // If no matches today, return recent matches from past 7 days as "live"
      if (todayMatches.length === 0) {
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        const recentMatches = filteredEvents.filter(event => {
          if (!event || !event.dateEvent) return false;
          return event.dateEvent >= sevenDaysAgo;
        }).slice(0, 10);
        console.log(`No matches today, showing ${recentMatches.length} recent ${sport} matches from past 7 days`);
        return recentMatches;
      }
      
      return todayMatches.slice(0, 10);
    } catch (error) {
      console.error('Error fetching live scores:', error);
      return [];
    }
  }

  // Get upcoming matches
  async getUpcomingMatches(sport: string): Promise<Event[]> {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      console.log(`Loading mock upcoming ${sport} matches...`);
      const data = MOCK_DATA[sport as keyof typeof MOCK_DATA]?.upcoming || [];
      console.log(`Returning ${data.length} upcoming matches for ${sport}`);
      return data;
    }

    try {
      console.log(`Fetching upcoming ${sport} matches...`);
      
      const sportName = SPORT_NAMES[sport as keyof typeof SPORT_NAMES];
      const leagueIds = SPORT_LEAGUES[sport as keyof typeof SPORT_LEAGUES] || [];
      if (leagueIds.length === 0) {
        console.log(`No leagues configured for ${sport}`);
        return [];
      }

      // Fetch upcoming events from all leagues for this sport
      const eventsPromises = leagueIds.map(leagueId => this.getNext15Events(leagueId));
      const eventsArrays = await Promise.all(eventsPromises);
      const allEvents = eventsArrays.flat().filter(event => event !== null);

      console.log(`Total upcoming events fetched for ${sport}:`, allEvents.length);
      
      // Log sport types for debugging
      if (allEvents.length > 0) {
        const uniqueSports = [...new Set(allEvents.map(e => e.strSport))];
        console.log(`Sport types found:`, uniqueSports);
      }

      // Filter by sport - be more flexible with matching
      const filteredEvents = allEvents.filter(event => {
        if (!event || !event.strSport) return false;
        const eventSport = event.strSport.toLowerCase();
        const searchSport = sportName.toLowerCase();
        return eventSport.includes(searchSport) || searchSport.includes(eventSport);
      });

      console.log(`Filtered to ${filteredEvents.length} ${sportName} events`);

      // Filter for future events
      const now = new Date();
      const upcomingMatches = filteredEvents.filter(event => {
        if (!event || !event.dateEvent) return false;
        const eventDate = new Date(event.dateEvent);
        return eventDate > now;
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
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      console.log(`Loading mock recent ${sport} matches...`);
      const data = MOCK_DATA[sport as keyof typeof MOCK_DATA]?.recent || [];
      console.log(`Returning ${data.length} recent matches for ${sport}`);
      return data;
    }

    try {
      console.log(`Fetching recent ${sport} matches...`);
      
      const sportName = SPORT_NAMES[sport as keyof typeof SPORT_NAMES];
      const leagueIds = SPORT_LEAGUES[sport as keyof typeof SPORT_LEAGUES] || [];
      if (leagueIds.length === 0) {
        console.log(`No leagues configured for ${sport}`);
        return [];
      }

      // Fetch past events from all leagues for this sport
      const eventsPromises = leagueIds.map(leagueId => this.getPastEvents(leagueId));
      const eventsArrays = await Promise.all(eventsPromises);
      const allEvents = eventsArrays.flat().filter(event => event !== null);

      console.log(`Total past events fetched for ${sport}:`, allEvents.length);
      
      // Log sport types for debugging
      if (allEvents.length > 0) {
        const uniqueSports = [...new Set(allEvents.map(e => e.strSport))];
        console.log(`Sport types found:`, uniqueSports);
      }

      // Filter by sport - be more flexible with matching
      const filteredEvents = allEvents.filter(event => {
        if (!event || !event.strSport) return false;
        const eventSport = event.strSport.toLowerCase();
        const searchSport = sportName.toLowerCase();
        return eventSport.includes(searchSport) || searchSport.includes(eventSport);
      });

      console.log(`Filtered to ${filteredEvents.length} ${sportName} events`);

      // Filter and sort by most recent
      const recentMatches = filteredEvents
        .filter(event => event && event.dateEvent)
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

