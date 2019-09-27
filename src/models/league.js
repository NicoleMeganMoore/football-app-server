const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

const leagueSchema = new Schema(
  {
    league_name: {
      type: String,
      required: true
    },
    user_list: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    opponent: {
      type: String,
      required: true
    },
    settings: {
      pts_per_passing_yd: {
        type: Number,
        required: true
      },
      pts_per_passing_td: {
        type: Number,
        required: true
      },
      pts_per_passing_int: {
        type: Number,
        required: true
      },
      pts_per_rushing_yd: {
        type: Number,
        required: true
      },
      pts_per_rushing_td: {
        type: Number,
        required: true
      },
      pts_per_receiving_yd: {
        type: Number,
        required: true
      },
      pts_per_receiving_td: {
        type: Number,
        required: true
      },
      pts_per_return_td: {
        type: Number,
        required: true
      },
      pts_per_two_pt_conversion: {
        type: Number,
        required: true
      },
      pts_per_fumble: {
        type: Number,
        required: true
      },
      pts_per_reception: {
        type: Number,
        required: true
      }
    }
  },
  { timestamps: true }
);

leagueSchema.plugin(autoIncrement.plugin, { model: "League", field: "id" });

module.exports = mongoose.model("League", leagueSchema);
