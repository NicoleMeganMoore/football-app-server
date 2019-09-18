const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

const teamSchema = new Schema(
  {
    team_name: {
      type: String,
      required: true
    },
    team_photo_url: {
      type: String
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    league: {
      type: Schema.Types.ObjectId,
      ref: "League"
    },
    match: {
      type: Schema.Types.ObjectId,
      ref: "Match"
    },
    players: [
      {
        type: String
      }
    ],
    total_points: {
      type: Number,
      required: true
    },
    is_winner: {
      type: Boolean
    }
  },
  { timestamps: true }
);

teamSchema.plugin(autoIncrement.plugin, { model: "Team", field: "id" });

module.exports = mongoose.model("Team", teamSchema);
