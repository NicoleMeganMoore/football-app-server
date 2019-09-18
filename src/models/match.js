const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

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

matchSchema.plugin(autoIncrement.plugin, { model: "Match", field: "id" });

module.exports = mongoose.model("Match", matchSchema);
