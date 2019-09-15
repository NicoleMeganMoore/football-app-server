import mongoose from "mongoose";

const Schema = mongoose.Schema;

const teamSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  team_name: {
    type: String,
    required: true
  },
  team_photo_url: {
    type: String,
    required: true
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
});

module.exports = mongoose.model("Team", teamSchema);
