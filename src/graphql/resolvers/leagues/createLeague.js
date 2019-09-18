const User = require("../../../models/user");
const League = require("../../../models/league");

const { getUsersByEmails } = require("../helperFunctions");

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

module.exports = async args => {
  // Make sure both users exist in the DB
  try {
    const users = await getUsersByEmails([
      args.leagueInput.user_email,
      args.leagueInput.opponent_email
    ]);

    if (!users[0]) {
      throw new Error("User email not found.");
    } else if (!users[1]) {
      throw new Error("Opponent email not found.");
    }

    const league = new League({
      league_name:
        args.leagueInput.league_name || `${users[0].first_name}'s League`,
      user_list: [users[0]._id, users[1]._id],
      pts_per_passing_yd: defaultLeagueSettings.pts_per_passing_yd || 0.04,
      pts_per_passing_td: defaultLeagueSettings.pts_per_passing_td || 4,
      pts_per_passing_int: defaultLeagueSettings.pts_per_passing_int || -1,
      pts_per_rushing_yd: defaultLeagueSettings.pts_per_rushing_yd || 0.1,
      pts_per_rushing_td: defaultLeagueSettings.pts_per_rushing_td || 6,
      pts_per_receiving_yd: defaultLeagueSettings.pts_per_receiving_yd || 0.1,
      pts_per_receiving_td: defaultLeagueSettings.pts_per_receiving_td || 6,
      pts_per_return_td: defaultLeagueSettings.pts_per_return_td || 6,
      pts_per_two_pt_conversion:
        defaultLeagueSettings.pts_per_two_pt_conversion || 2,
      pts_per_fumble: defaultLeagueSettings.pts_per_fumble || -1,
      pts_per_reception: defaultLeagueSettings.pts_per_reception || 0
    });

    let createdLeague;
    const result = await league.save();

    createdLeague = {
      ...result._doc,
      user_list: getUsersByEmails.bind(this, [
        args.leagueInput.user_email,
        args.leagueInput.opponent_email
      ])
    };

    // Save league in both users league arrays
    const user1 = await User.findOne({ email: args.leagueInput.user_email });
    user1.leagues.push(league);
    await user1.save();

    const user2 = await User.findOne({
      email: args.leagueInput.opponent_email
    });
    user2.leagues.push(league);
    await user2.save();

    return createdLeague;
  } catch (err) {
    throw new Error(err);
  }
};
