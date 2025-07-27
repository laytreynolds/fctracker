// Player interface (matches backend fields)
export interface TPlayer {
  ID: string;
  Name: string;
  Age: string;
  Position: string;
  FunFact: string;
  Goals: number;
  Assists: number;
  GamesPlayed: number;
  ManOfTheMatch: number;
  Active: boolean;
  Created: string;
  TeamID: string;
  TeamName?: string;
}

// Team interface (matches backend fields)
export interface TTeam {
  ID: string;
  Name: string;
  Coach: string;
  Founded: string;
  Created: string;
}

// Location interface
export interface TLocation {
  Latitude: number;
  Longitude: number;
}

// Fixture interface (matches backend fields)
export interface TFixture {
  ID: string;
  Date: string;
  HomeTeam: string;
  AwayTeam: string;
  HomeScore: string;
  AwayScore: string;
  ManOfTheMatchName?: string;
  GoalScorersNames?: string[];
  AssistScorersNames?: string[];
  Location?: TLocation;
}

