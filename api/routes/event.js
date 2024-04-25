const express = require('express');
const router = express.Router();

const EventController = require('./../controllers/event');
const CheckAuth = require('../middleware/check-auth');

router.get('/', CheckAuth, EventController.get_allevent);

router.post('/', CheckAuth, EventController.post_event);

router.get('/:eventId', CheckAuth, EventController.get_single_event);

router.patch("/:eventId", CheckAuth, EventController.update_event);

router.delete("/:eventId", CheckAuth, EventController.delete_event);

module.exports = router;
