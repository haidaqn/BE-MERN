const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

const orderController = require('../app/controllers/order');

router.get('/status/:oid', [verifyAccessToken, isAdmin], orderController.updateStatus); //
router.post('/', verifyAccessToken, orderController.createOrder);
router.get('/', [verifyAccessToken, isAdmin], orderController.getOrderByAdmin); //
router.get('/', verifyAccessToken, orderController.getOrderByUser); //

//
module.exports = router;
