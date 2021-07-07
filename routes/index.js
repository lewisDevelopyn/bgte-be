const express = require('express');

const user = require('./user');
const events = require('./events');

const router = express.Router();

router.use('/user', user);
router.use('/events', events)

module.exports = router;

