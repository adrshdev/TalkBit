const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'talkbit-chat';

router.post('/signup', async(req, res) => {
  const {username, password} = req.body;
  try{
    const userExists = await User.findOne({username});
    if(userExists){
      return res.status(400).json({message: 'User already exists'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({username, password: hashedPassword});
    await newUser.save();
    return res.status(201).json({message: 'User Created'});
  }catch(error){
    return res.status(500).json({message: 'Signup failed'});
  }
});

router.post('/login', async(req, res) => {
  const {username, password} = req.body;
  try{
    const user = await User.findOne({username});
    if(!user){
      return res.status(400).json({message: 'Invalid Credentials'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: 'Invalid Credentials'});
    }
    const token = jwt.sign({username}, JWT_SECRET, {expiresIn: '1d'});
    return res.json({token, username});
  }catch(error){
    return res.status(500).json({message: 'Login Failed'});
  }
});

module.exports = router;