var express = require('express');
var router = express.Router();

router.use('/book', require('./book').default);
router.use('/rental', require('./rental').default);

module.exports = router;