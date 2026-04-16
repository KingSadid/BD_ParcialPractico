const express = require('express');
const router = express.Router();
const controller = require('../services/controllers/reservation.controller');

router.post('/', (req, res) => controller.create(req, res));
router.get('/:id', (req, res) => controller.getStatus(req, res));

module.exports = router;