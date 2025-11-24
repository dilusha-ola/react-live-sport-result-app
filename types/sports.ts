// Sport types
export interface Sport {
  idSport: string;
  strSport: string;
  strFormat: string;
  strSportThumb?: string;
  strSportIconGreen?: string;
  strSportDescription?: string;
}

// League types
export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
}

// Event/Match types
export interface Event {
  idEvent: string;
  strEvent: string;
  strEventAlternate?: string;
  strFilename?: string;
  strSport: string;
  idLeague: string;
  strLeague: string;
  strSeason?: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore?: string | null;
  intAwayScore?: string | null;
  strTimestamp?: string;
  dateEvent: string;
  strTime?: string;
  strTimeLocal?: string;
  strStatus?: string;
  strPostponed?: string;
  strThumb?: string;
  strBanner?: string;
  strVideo?: string;
  idHomeTeam: string;
  idAwayTeam: string;
}

// Team types
export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string;
  strAlternate?: string;
  strLeague?: string;
  strSport?: string;
  strTeamBadge?: string;
  strTeamJersey?: string;
  strTeamLogo?: string;
  strStadium?: string;
  strStadiumThumb?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
}

// API Response types
export interface SportsResponse {
  sports: Sport[];
}

export interface LeaguesResponse {
  leagues: League[];
}

export interface EventsResponse {
  events: Event[] | null;
}

export interface TeamsResponse {
  teams: Team[];
}

// App-specific types
export type MatchStatus = 'live' | 'upcoming' | 'recent';
export type SportCategory = 'Soccer' | 'Cricket' | 'Rugby' | 'Basketball' | 'Tennis' | 'All';
