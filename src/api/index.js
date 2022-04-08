const express = require('express');
const hello = require('./hello');
const log = require('./log');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Api Root Path 😈',
  });
});

router.use('/hello', hello);
router.use('/log', log);

module.exports = router;
