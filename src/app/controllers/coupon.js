const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');

//

const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expire } = req.body;
    if (!name || !discount || !expire) throw new Error("missing input..");
    const response = await Coupon.create({
        ...req.body,
        expire: Date.now() + expire * 24 * 60 * 60 * 1000
    });
    return res.json({
        success: response ? true : false,
        Coupon : response ? response : "Cannot create coupon.."
    });
});

const getCoupons = asyncHandler(async (req, res) => {
    const response = await Coupon.find();
    return res.status(200).json({
        success: response ? true : false,
        coupon : response ? response : "No coupon..."
    });
});

const updateCoupon = asyncHandler(async (req, res) => {
    const id = req.params.cid;
    if (Object.keys(req.body).length === 0) throw new Error("Missing input");
    if (req.body.expire) req.body.expire = Date.now() + +expire * 24 * 60 * 60 * 1000;
    const response = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        couponUpdate : response ? response : "Cannot update coupon..."
    });
 });

const deleteCoupon = asyncHandler(async (req, res) => { 
    const id = req.params.cid;
    const response = await Coupon.findByIdAndDelete(id);
    return res.status(200).json({
        success: response ? true : false,
    });
});

// 
module.exports = {
    createCoupon, getCoupons,
    updateCoupon, deleteCoupon
}