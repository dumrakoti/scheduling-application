const mongoose = require('mongoose');

const Event = require('./../models/event');

exports.get_allevent = (req, res, next) => {
  Event.find()
    .select('title _id start end description participants create_at updated_at')
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          data: result.map(res => { return res; })
        });
      } else {
        res.status(200).json({ data: [] });
      }
    })
    .catch(error => {
      res.status(500).json({ status: 500, error: error || 'Internal Server Error' });
    });
}

exports.post_event = (req, res, next) => {
  const event = new Event({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    description: req.body.description,
    participants: req.body.participants,
    create_at: new Date(),
    updated_at: new Date()
  });
  event.save().then(result => {
    res.status(201).json({
      status: 201,
      message: 'Event created successfully.',
      data: result
    });
  }).catch(error => {
    res.status(500).json({ status: 500, error: error || 'Internal Server Error' });
  });
}

exports.get_single_event = (req, res, next) => {
  const id = req.params.eventId;
  Event.findById(id)
    .select('title _id start end description participants create_at updated_at')
    .exec()
    .then(data => {
      if (!data) {
        return res.status(404).json({ status: 404, error: 'Event not found.' });
      }
      res.status(200).json({ status: 200, data });
    })
    .catch(error => {
      res.status(500).json({ status: 500, error: error || 'Event does not exits.' });
    });
}

exports.update_event = (req, res, next) => {
  const _id = req.params.eventId;
  const updateOps = {
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    description: req.body.description,
    participants: req.body.participants,
    updated_at: new Date()
  };
  Event.updateOne({ _id }, { $set: updateOps })
    .select('title _id start end description participants create_at updated_at')
    .exec()
    .then(result => {
      res.status(200).json({ status: 200, message: 'Event updated.', data: result });
    })
    .catch(error => {
      res.status(500).json({ status: 500, error: error || 'Internal Server Error' });
    });
}

exports.delete_event = (req, res, next) => {
  const id = req.params.eventId;
  Event.deleteOne({ _id: id })
    .exec().
    then(data => {
      if (data) {
        res.status(200).json({ status: 200, data: 'Event deleted successfully.' });
      } else {
        res.status(404).json({ status: 404, error: 'Not a valid entry found for event ID.' });
      }
    })
    .catch(error => {
      res.status(500).json({ status: 500, error: error || 'Internal Server Error' });
    });
}