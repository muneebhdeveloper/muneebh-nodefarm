const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Email is not valid"],
      unique: true,
      lowercase: true,
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be minimum 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Confirm your password"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password doesn't match",
      },
    },
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

userSchema.methods.changedPasswordAfterToken = (JwtTimestamp) => {
  if (this.passwordChangedAt) {
    const passwordChangedAtInSec = parseInt(
      new Date(this.passwordChangedAt).getTime() / 1000,
      10
    );

    return JwtTimestamp < passwordChangedAtInSec;
  }

  return false;
};

userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
