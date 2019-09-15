const User = require("../../../models/user");
const League = require("../../../models/league");

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

const getUser = userId => {
  return User.findById(userId)
    .then(user => {
      return { ...user._doc };
    })
    .catch(err => {
      throw err;
    });
};

const getUsers = userEmails => {
  return User.find({ email: { $in: userEmails } })
    .then(users => {
      return users.map(user => {
        return { ...user._doc, leagues: getUser.bind(this, user.leagues) };
      });
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = args => {
  // Make sure both users exist in the DB
  return getUsers([
    args.leagueInput.user_email,
    args.leagueInput.opponent_email
  ])
    .then(users => {
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
      return league
        .save()
        .then(result => {
          createdLeague = {
            ...result._doc,
            user_list: getUsers.bind(this, [
              args.leagueInput.user_email,
              args.leagueInput.opponent_email
            ])
          };

          // save league in both users league arrays
          const promises = [];
          promises.push(
            new Promise((res, rej) => {
              return User.findOne({ email: args.leagueInput.user_email })
                .then(user => {
                  user.leagues.push(league);
                  user.save();
                  res();
                })
                .catch(err => {
                  console.log(err);
                  rej();
                });
            })
          );
          promises.push(
            new Promise((res, rej) => {
              return User.findOne({ email: args.leagueInput.opponent_email })
                .then(user => {
                  user.leagues.push(league);
                  user.save();
                  res();
                })
                .catch(err => {
                  console.log(err);
                  rej();
                });
            })
          );
          return Promise.all(promises);
        })
        .then(() => {
          return createdLeague;
        });
    })
    .catch(err => {
      throw new Error(err);
    });
};
