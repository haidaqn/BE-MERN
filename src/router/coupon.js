const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

const couponController = require('../app/controllers/coupon');
//

router.post('/', [verifyAccessToken, isAdmin], couponController.createCoupon); //
router.get('/', couponController.getCoupons); //
router.delete('/:cid', [verifyAccessToken, isAdmin], couponController.deleteCoupon); //
router.put('/:cid', [verifyAccessToken, isAdmin], couponController.updateCoupon); //

//
module.exports = router;
