const { HolidayAPI } = require('holidayapi');
const config = require('./../config');

const key = config.holidayApiKey;
const holidayApi = new HolidayAPI({ key });

exports.get_holidays = (req, res, next) => {
  const country = req.query.country;
  // const year = req.query.year;
  // const country = 'US';
  const year = 2023;

  holidayApi.holidays({ country, year })
    .then((holidays) => {
      if (holidays) {
        res.status(200).json({ status: 200, data: holidays.holidays });
      } else {
        res.status(404).json({ status: 404, error: 'Invalid parameters.' });
      }
    }).catch((err) => {
      console.error(err);
      res.status(500).json({ status: 500, error: err || 'Internal Server Error' });
    });
}

exports.get_languages = (req, res, next) => {
  holidayApi.languages()
    .then((languages) => {
      if (languages) {
        res.status(200).json({ status: 200, data: languages.languages });
      } else {
        res.status(404).json({ status: 404, error: 'Invalid parameters.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ status: 500, error: err || 'Internal Server Error' });
    });
}

exports.get_countries = (req, res, next) => {
  holidayApi.countries()
    .then((countries) => {
      if (countries) {
        res.status(200).json({ status: 200, data: countries.countries });
      } else {
        res.status(404).json({ status: 404, error: 'Invalid parameters.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ status: 500, error: err || 'Internal Server Error' });
    });
}
