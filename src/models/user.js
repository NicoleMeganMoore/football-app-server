const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    leagues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team"
      }
    ]
  },
  { timestamps: true }
);

userSchema.plugin(autoIncrement.plugin, { model: "User", field: "id" });

module.exports = mongoose.model("User", userSchema);
