const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

async function hasPassword(password) {
  const result = await bcrypt.hash(password, 10);
  return result;
}

async function validatePassword(plainPasswod, hashedPassword) {
  const result = await bcrypt.compare(plainPasswod, hashedPassword);
  return result;
}

exports.signup = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await hasPassword(password);
    const newUser = new User({ email, password: hashedPassword, role: role || 'basic' });
    const accessToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    newUser.accessToken = accessToken;
    await newUser.save();
    res.json({
      data: newUser,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error('Email does not exist'));
    const validPassword = await validatePassword(password);
    if (!validPassword) return next(new Error('Password is not corrent'));
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    await User.findByIdAndUpdate(user.id, { accessToken });
    res.status(200).json({
      data: { email: user.email, role: user.role },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
