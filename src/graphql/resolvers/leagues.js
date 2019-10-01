const User = require("../../models/user");
const League = require("../../models/league");
const sgMail = require("@sendgrid/mail");

const { checkAuthAndReturnUser } = require("./helperFunctions");
const { leagueInviteEmail } = require("../../emailTemplates/LeagueInviteEmail");

const { transformLeague, getLeague, getLeagues } = require("./helperFunctions");

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

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("User not found.");
      }

      const league = new League({
        league_name:
          args.leagueInput.league_name || `${user._doc.first_name}'s League`,
        user_list: [user._doc._id],
        matches: [],
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
  cancelLeagueInvitation: async (args, req) => {
    try {
      const user = await checkAuthAndReturnUser(req);

      const league = await League.findOne({ id: args.leagueId });
      if (!league) {
        throw new Error("League not found.");
      }

      const isPendingInvitation = league.user_list.length <= 1;
      if (!isPendingInvitation) {
        throw new Error(
          "League invitation has already been accepted. Unable to delete"
        );
      }

      const isUserOwner = league._doc.user_list.includes(user._id);
      if (!isUserOwner) {
        throw new Error(req.errorName.FORBIDDEN);
      }

      const leagueIndex = user._doc.leagues.indexOf(league._doc._id);
      if (!leagueIndex || leagueIndex === -1) {
        throw new Error("Unable to find league in user object");
      }

      // Delete league id from user first, in case something goes wrong the league is not deleted
      user._doc.leagues.splice(leagueIndex, 1);
      await user.save();

      await League.deleteOne({ id: args.leagueId });

      return true;
    } catch (err) {
      throw err;
    }
  },
  addUserToLeague: async (args, req) => {
    try {
      const user = await checkAuthAndReturnUser(req);
      if (!user) {
        throw new Error("User not found.");
      }

      const league = await League.findById(args.leagueId);
      if (!league) {
        throw new Error("League not found.");
      }

      const isOpponentCreator = league._doc.user_list.includes(user._doc._id);
      if (isOpponentCreator) {
        throw new Error("User invited themself to this league.");
      }

      const userInLeague = league.opponent === user._doc.email;
      if (!userInLeague) {
        throw new Error("You are not part of this league.");
      }

      const leagueFull = league.user_list.length === 2;
      if (leagueFull) {
        throw new Error("This league is already full.");
      }

      league._doc.user_list.push(user);
      await league.save();

      user.leagues.push(league);
      await user.save();

      return transformLeague(league);
    } catch (err) {
      throw err;
    }
  },
  leagues: async (args, req) => {
    try {
      await checkAuthAndReturnUser(req);
      const leagues = await League.find({ user_list: req.userId });
      return leagues.map(league => {
        return transformLeague(league);
      });
    } catch (err) {
      throw err;
    }
  },
  league: async (args, req) => {
    try {
      await checkAuthAndReturnUser(req);
      const league = await League.findById(args.league_id);
      return transformLeague(league);
    } catch (err) {
      throw err;
    }
  }
};
