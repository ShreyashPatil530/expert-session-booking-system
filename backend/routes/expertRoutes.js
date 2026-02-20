const express = require('express');
const router = express.Router();
const { getExperts, getExpert } = require('../controllers/expertController');

router.get('/', getExperts);
router.get('/:id', getExpert);

module.exports = router;
