const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const UUID = require("node-uuid");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateChangePWInput = require("../../validation/changepassword");

// Load NodeMailer
const userPasswordResetEmail = require("../../nodeMailer/sendEmail");

const User = require("../../models/User");
const ForgotEmail = require("../../models/ForgotEmail");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users works"
  })
);

// @route   GET api/users/register
// @desc    Register User
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find the user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched

        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/finduserbyxid/:id
// @desc    Get user by xid
// @access  Public
router.get("/finduserbyxid/:id", (req, res) => {
  ForgotEmail.findOne({ token: req.params.id })
    .then(forgotEmail =>
      res.json({
        id: forgotEmail.userId,
        name: forgotEmail.name,
        email: forgotEmail.email
      })
    )
    .catch(err =>
      res.status(404).json({ nouserfound: "No user found with that ID" })
    );
});

// @route   GET api/users/userexists
// @desc    User / Returning message
// @access  Public
router.post("/userexists", (req, res) => {
  const email = req.body.email;

  // Find the user by email.
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      let errors = {};
      errors.success = false;
      errors.email = "User not found";
      return res.status(404).json(errors);
    } else {
      const xid = UUID.v4();
      const data = { email, xid };
      userPasswordResetEmail(data);

      var queryDelete = { userId: user.id };
      ForgotEmail.deleteMany(queryDelete)
        .then(email => {
          if (!email) {
            return res.status(404).json();
          }
        })
        .catch(err => res.status(400).json(err));

      const newForgotEmail = new ForgotEmail({
        userId: user.id,
        name: user.name,
        email,
        token: xid
      });

      newForgotEmail
        .save()
        .then(forgotemail =>
          res.json({ success: true }).catch(err => console.log(err))
        );
    }
  });
});

// @route   POST api/users/userFPC/:id
// @desc    Edit user PW
// @access  Private
router.post("/userFPC", (req, res) => {
  const { errors, isValid } = validateChangePWInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Get fields
  const userFields = {};
  if (req.body.password) userFields.password = req.body.password;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(userFields.password, salt, (err, hash) => {
      if (err) throw err;
      userFields.password = hash;

      User.findOne({ _id: req.body.id })
        .then(user => {
          if (user) {
            // Update
            User.findOneAndUpdate(
              { _id: req.body.id },
              { password: userFields.password },
              { new: true }
            ).then(user =>
              res.json({
                success: true,
                id: user.Id,
                name: user.name,
                email: user.email,
                updatedPW: true,
                test: userFields
              })
            );
          } else {
            res.status(404).json({ nouserfound: "No user found." });
          }
        })
        .catch(err =>
          res.status(404).json({ nouserfound: "No user found with that ID" })
        );
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
