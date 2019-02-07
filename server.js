'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jsonParser = bodyParser.json();

// Port
const PORT = process.env.PORT || 8080;

// Logging
const morgan = require('morgan');
app.use(morgan('common'));

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Welcome to the api!'})
})

// POST method route
app.post('/compute/:request_id', jsonParser, function (req, res) {

    const requiredFields = ['timestamp', 'data'];
    const missingField = requiredFields.find(field => !(field in req.body));
  
    if (missingField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      });
    }
  
    // return error if no values were provided
    const { data } = req.body;
    if (data.length < 2) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Two arrays must be present',
            location: "data"
        });
    }

    const firstArr = req.body.data[0].values;
    const secondArr = req.body.data[1].values;
    // Return error if no values were in either of the arrays
    if (!firstArr || firstArr.length === 0) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing Array',
            location: 'Array 1'
          });
    }

    if (!secondArr ||secondArr.length === 0) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing Array',
            location: 'Array 2'
          });
    }


    const resultsArr = firstArr.map((value, ind) => {
        // use 0 for subtracting if second array element isn't presentt (if first array has more elements than second array)
        const secondVal = secondArr[ind] ? secondArr[ind] : 0;
        return firstArr[ind] - secondVal;
    });

    return res.status(200).json({
        request_id: req.params.request_id,
        timestamp: req.body.timestamp,
        result: {
            title: "Result",
            values: resultsArr
        }
    });
  })

app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
});

// Start the API
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});

// Export API server for testing if needed
module.exports = app;