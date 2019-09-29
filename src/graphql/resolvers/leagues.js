const User = require("../../models/user");
const League = require("../../models/league");
const sgMail = require("@sendgrid/mail");

const { checkAuthAndReturnUser } = require("./helperFunctions");
const { leagueInviteEmail } = require("../../emailTemplates/LeagueInviteEmail");

const {
  transformLeague,
  getUsersByEmails,
  getLeague,
  getLeagues
} = require("./helperFunctions");

const defaultLeagueSettings = {
  pts_per_passing_yd: 0.04,
  pts_per_passing_td: 4,
  pts_per_passing_int: -1,
  pts_per_rushing_yd: 0.1,
  pts_per_rushing_td: 6,
  pts_per_receiving_yd: 0.1,
  pts_per_receiving_td: 6,
  pts_per_return_td: 6,
  pts_per_two_pt_conversion: 2,
  pts_per_fumble: -1,
  pts_per_reception: 0
};

module.exports = {
  createLeague: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    // Make sure both users exist in the DB
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("User not found.");
      }

      const league = new League({
        league_name:
          args.leagueInput.league_name || `${user._doc.first_name}'s League`,
        user_list: [user._doc._id],
        owner: user._doc._id,
        opponent: args.leagueInput.opponent,
        settings: {
          pts_per_passing_yd: defaultLeagueSettings.pts_per_passing_yd || 0.04,
          pts_per_passing_td: defaultLeagueSettings.pts_per_passing_td || 4,
          pts_per_passing_int: defaultLeagueSettings.pts_per_passing_int || -1,
          pts_per_rushing_yd: defaultLeagueSettings.pts_per_rushing_yd || 0.1,
          pts_per_rushing_td: defaultLeagueSettings.pts_per_rushing_td || 6,
          pts_per_receiving_yd:
            defaultLeagueSettings.pts_per_receiving_yd || 0.1,
          pts_per_receiving_td: defaultLeagueSettings.pts_per_receiving_td || 6,
          pts_per_return_td: defaultLeagueSettings.pts_per_return_td || 6,
          pts_per_two_pt_conversion:
            defaultLeagueSettings.pts_per_two_pt_conversion || 2,
          pts_per_fumble: defaultLeagueSettings.pts_per_fumble || -1,
          pts_per_reception: defaultLeagueSettings.pts_per_reception || 0
        }
      });

      let createdLeague;
      const result = await league.save();

      if (!result) {
        throw new Error("Unable to save league");
      }

      createdLeague = {
        ...result._doc,
        user_list: [user]
      };

      // Save league in both users league arrays
      user._doc.leagues.push(league);
      await user.save();

      // Send invitation to opponent
      const msg = {
        to: args.leagueInput.opponent,
        from: {
          email: "draftwarsapp@gmail.com",
          name: "DraftWars"
        },
        subject: "You've been invited to join a DraftWars league!",
        // text: "and easy to do anywhere, even with Node.js",
        html: leagueInviteEmail(
          `${user._doc.first_name} ${user._doc.last_name}`,
          `http://localhost:3003/invite/${createdLeague._id}`
        )
      };
      await sgMail.send(msg);

      return createdLeague;
    } catch (err) {
      throw new Error(err);
    }
  },
  deleteLeague: async args => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    try {
      await League.deleteOne({ _id: args.leagueId });
      // ALSO DELETE ALL TEAMS AND MATCHES TIED TO THIS LEAGUE
      // DO WE REALLY WANT TO DO THIS?
      // const newLeagueList = League.find()
      return true;
    } catch (err) {
      throw err;
    }
  },
  addUserToLeague: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    try {
      const league = getLeague(args.league_id);

      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("User not found.");
      }

      // Change this to check if user is the opponent in the league
      const userInLeague = await league._doc.user_list.findById(req.userId);
      if (!userInLeague) {
        throw new Error("You are not part of this league.");
      }

      // These 2 probably wont happen if we are checking for the opponent, but just in case...
      // throw error if there are already 2 users in the league
      // throw error if the new user email is the same as the exising email user

      league._doc.user_list.push(user);
      await league.save();

      return transformLeague(league);
    } catch (err) {
      throw err;
    }
  },
  leagues: async (args, req, res) => {
    try {
      await checkAuthAndReturnUser(req, res);
      const leagues = await League.find({ user_list: req.userId });
      return leagues.map(league => {
        return transformLeague(league);
      });
    } catch (err) {
      throw err;
    }
  },
  league: async (args, req, res) => {
    try {
      await checkAuthAndReturnUser(req, res);
      const league = await League.findById(args.league_id);
      return transformLeague(league);
    } catch (err) {
      throw err;
    }
  },
  userLeagues: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error("User not found!");
    }

    return getLeagues(req.userId);
  }
};
