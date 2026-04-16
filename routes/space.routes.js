const express = require('express');
const router = express.Router();
const controller = require('../services/controllers/space.controller');

router.post('/', (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.list(req, res));

module.exports = router;