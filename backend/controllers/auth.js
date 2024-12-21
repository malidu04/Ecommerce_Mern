const User = require('../model/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

require('dotenv').config();

exports.signup = async (req, res) => {
    const user = new User(req.body);
    try {
      const data = await user.save();
      if (!data) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
  
      user.salt = undefined;
      user.hashed_password = undefined;
      res.json({
        user,
      });
    } catch (error) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
  };
  

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ error: "User with that mail doesn't exists, Please Signup.", 

            });
        }
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password didn't match"
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        res.cookie('t', token, {expire: new Date() + 9999 });
        const { _id, name, email: userEmail, role } = user;
        return res.json({ token, user: { _id, email: userEmail, name, role } });
    } catch (err) {
        return res.status(400).json({
            error: 'Signin failed. Please try again later.',
        });
    }
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout success'});
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({ error: 'Access Denied'});
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resource! Access Denied',
        });
    }
    next();
};