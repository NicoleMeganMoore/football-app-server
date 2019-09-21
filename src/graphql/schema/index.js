const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type User {
    _id: ID!
    id: Int!
    email: String!
    password: String
    first_name: String!
    last_name: String!
    leagues: [League]!
    updatedAt: String!
    createdAt: String!
  }

  type Settings {
    pts_per_passing_yd: Float!
    pts_per_passing_td: Int!
    pts_per_passing_int: Int!
    pts_per_rushing_yd: Float! 
    pts_per_rushing_td: Int!
    pts_per_receiving_yd: Float!
    pts_per_receiving_td: Int!
    pts_per_return_td: Int!
    pts_per_two_pt_conversion: Int!
    pts_per_fumble: Int!
    pts_per_reception: Float!
  }

  type League {
    _id: ID!
    id: Int!
    league_name: String!
    user_list: [User!]!
    settings: Settings!
    updatedAt: String!
    createdAt: String!
  }

  type Match {
    _id: ID!
    id: Int!
    week: Int!
    league: League!
    teams: [Team!]!
    winner: User
    updatedAt: String!
    createdAt: String!
  }

  type Team {
    _id: ID!
    id: Int!
    team_name: String!
    team_photo_url: String
    owner: User!
    league: League!
    match: Match!
    players: [String]!
    total_points: Float!
    is_winner: Boolean
    updatedAt: String!
    createdAt: String!
  }

  input UserInput {
    email: String!
    password: String!
    first_name: String!
    last_name: String!
  }

  input LeagueInput {
    league_name: String
    opponent_email: String!
    user_email: String!
    pts_per_passing_yd: Float
    pts_per_passing_td: Int
    pts_per_passing_int: Int
    pts_per_rushing_yd: Float
    pts_per_rushing_td: Int
    pts_per_receiving_yd: Float
    pts_per_receiving_td: Int
    pts_per_return_td: Int
    pts_per_two_pt_conversion: Int
    pts_per_fumble: Int
    pts_per_reception: Float
  }

  input MatchInput {
    week: Int!
    league_id: Int!
  }

  input TeamInput {
    team_name: String!
    team_photo_url: String
    league_id: Int!
    match_id: Int!
  }

  type RootQuery {
    users: [User!]!
    teams: [Team!]!
    leagues: [League!]!
    matches: [Match!]!
  }

  type RootMutation {
    createUser(userInput: UserInput): User
    createLeague(leagueInput: LeagueInput): League
    addUserToLeague(leagueId: ID!, userEmail: String!): League
    createMatch(matchInput: MatchInput): Match
    createTeam(teamInput: TeamInput): Team
    deleteLeague(leagueId: ID!): Boolean
    deleteMatch(matchId: ID!): Boolean
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
