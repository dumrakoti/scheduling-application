const express = require('express');
const router = express.Router();

const UtilsController = require('../controllers/utils');

router.get('/holidays', UtilsController.get_holidays);

router.get("/countries", UtilsController.get_countries);

router.get("/languages", UtilsController.get_languages);

module.exports = router;