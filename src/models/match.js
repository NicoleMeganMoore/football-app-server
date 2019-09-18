import mongoose from "mongoose";

const Schema = mongoose.Schema;

const matchSchema = new Schema(
  {
    id: {
      type: Number,
      required: true
    },
    week: {
      type: Number,
      required: true
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team"
      }
    ],
    winner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    league: {
      type: Schema.Types.ObjectId,
      ref: "League"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
