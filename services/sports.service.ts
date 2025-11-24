import { Event, EventsResponse, League, LeaguesResponse, Sport, SportsResponse } from '@/types/sports';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

class SportsService {
  // Get all sports
  async getAllSports(): Promise<Sport[]> {
    try {
      const response = await fetch(`${BASE_URL}/all_sports.php`);
      const data: SportsResponse = await response.json();
      return data.sports || [];
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw new Error('Failed to fetch sports');
    }
  }

  // Get all leagues for a specific sport
  async getLeaguesBySport(sport: string): Promise<League[]> {
    try {
      const response = await fetch(`${BASE_URL}/search_all_leagues.php?s=${encodeURIComponent(sport)}`);
      const data: LeaguesResponse = await response.json();
      return data.leagues || [];
    } catch (error) {
      console.error('Error fetching leagues:', error);
      throw new Error('Failed to fetch leagues');
    }
  }

  // Get events for the next 15 days from a specific league
  async getNext15Events(leagueId: string): Promise<Event[]> {
    try {
      const response = await fetch(`${BASE_URL}/eventsnextleague.php?id=${leagueId}`);
      const data: EventsResponse = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching next events:', error);
      return [];
    }
  }

  // Get past events from a specific league
  async getPastEvents(leagueId: string): Promise<Event[]> {
    try {
      const response = await fetch(`${BASE_URL}/eventspastleague.php?id=${leagueId}`);
      const data: EventsResponse = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching past events:', error);
      return [];
    }
  }

  // Get events for a specific date and sport (for live/today's matches)
  async getEventsByDateAndSport(date: string, sport: string): Promise<Event[]> {
    try {
      const response = await fetch(`${BASE_URL}/eventsday.php?d=${date}&s=${encodeURIComponent(sport)}`);
      const data: EventsResponse = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching events by date:', error);
      return [];
    }
  }

  // Get live scores (simulated - TheSportsDB free tier doesn't have real-time live scores)
  async getLiveScores(sport: string): Promise<Event[]> {
    try {
      // Using today's date to get matches that might be "live"
      const today = new Date().toISOString().split('T')[0];
      const events = await this.getEventsByDateAndSport(today, sport);
      
      // Filter to ensure correct sport
      const filtered = events.filter(event => event.strSport === sport);
      console.log(`Live ${sport} matches:`, filtered.length);
      return filtered;
    } catch (error) {
      console.error('Error fetching live scores:', error);
      return [];
    }
  }

  // Get upcoming matches for a sport
  async getUpcomingMatches(sport: string): Promise<Event[]> {
    try {
      // Get major leagues for the sport and fetch upcoming events
      const leagues = await this.getLeaguesBySport(sport);
      if (!leagues || leagues.length === 0) {
        console.log(`No leagues found for sport: ${sport}`);
        return [];
      }
      
      const majorLeagues = leagues.filter(l => l.strSport === sport).slice(0, 5);
      console.log(`Found ${majorLeagues.length} leagues for ${sport}`);
      
      const eventsPromises = majorLeagues.map(league => 
        this.getNext15Events(league.idLeague)
      );
      
      const eventsArrays = await Promise.all(eventsPromises);
      const allEvents = eventsArrays.flat();
      
      // Filter for future events only and ensure they match the sport
      const now = new Date();
      const filtered = allEvents.filter(event => {
        if (!event.dateEvent) return false;
        const eventDate = new Date(event.dateEvent);
        return eventDate > now && event.strSport === sport;
      }).slice(0, 10);
      
      console.log(`Upcoming ${sport} matches:`, filtered.length);
      return filtered;
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      return [];
    }
  }

  // Get recent matches for a sport
  async getRecentMatches(sport: string): Promise<Event[]> {
    try {
      // Get major leagues for the sport and fetch past events
      const leagues = await this.getLeaguesBySport(sport);
      if (!leagues || leagues.length === 0) {
        console.log(`No leagues found for sport: ${sport}`);
        return [];
      }
      
      const majorLeagues = leagues.filter(l => l.strSport === sport).slice(0, 5);
      console.log(`Found ${majorLeagues.length} leagues for ${sport}`);
      
      const eventsPromises = majorLeagues.map(league => 
        this.getPastEvents(league.idLeague)
      );
      
      const eventsArrays = await Promise.all(eventsPromises);
      const allEvents = eventsArrays.flat();
      
      // Filter to ensure correct sport and sort by date (most recent first)
      const filtered = allEvents
        .filter(event => event.strSport === sport)
        .sort((a, b) => {
          const dateA = new Date(a.dateEvent || 0);
          const dateB = new Date(b.dateEvent || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 10);
      
      console.log(`Recent ${sport} matches:`, filtered.length);
      return filtered;
    } catch (error) {
      console.error('Error fetching recent matches:', error);
      return [];
    }
  }
}

export const sportsService = new SportsService();
