const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

async function hasPassword(password) {
  const result = await bcrypt.hash(password, 10);
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
