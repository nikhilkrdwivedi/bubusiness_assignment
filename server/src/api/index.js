var express = require('express');
var router = express.Router();
router.use('/saleEntry', require('./saleEntry').default);
router.use('/buyEntry', require('./buyEntry').default);
router.use('/products', require('./products').default);
router.use('/mail', require('./sendMail').default);
router.use('/inventory', require('./inventory').default);



module.exports = router;