const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./api-model');
const router = express.Router();

const checkPayload = (req, res, next) => {
  const payload = req.body;
  if(!payload || !payload.username || !payload.password) {
    res.status(401).json({ message: 'Please enter a valid username and password' });
  } else {
    next();
  }
};

const checkUsernameUnique = async (req, res, next) => {
  const payload = req.body;
  try {
    const rows = await User.findBy({ username: payload.username });
    if(!rows.length) {
      next();
    } else {
      res.status(401).json({ message: 'Username already exists!'});
    }
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

const checkUsernameExists = async (req, res, next) => {
  const payload = req.body;
  try {
    const rows = await User.findBy({ username: payload.username });
    if(rows.length) {
      req.userData = rows[0];
      next();
    } else {
      res.status(404).json({ message: 'Username does not exist!'});
    }
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

router.post('/register', checkPayload, checkUsernameUnique, async (req, res) => {
  const payload = req.body;
  try {
    const hash = bcrypt.hashSync(payload.password, 12);
    const newUser = await User.add({ username: payload.username, password: hash });
    res.status(201).json(newUser);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', checkPayload, checkUsernameExists, (req, res) => {
  try {
    const verifies = bcrypt.compareSync(req.body.password, req.userData.password);
    if(verifies) {
      req.session.user = req.userData;
      res.status(200).json({ message: `Welcome back ${req.userData.username}` });
    } else {
      res.status(401).json({ message: 'Bad credentials' });
    }
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const data = await User.getUsers();
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;