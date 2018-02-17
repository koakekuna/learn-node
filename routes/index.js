const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.render('hello' , {
    name: 'kekoa',
    dog: 'ziggy'
  });
});

module.exports = router;
