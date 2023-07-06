const Order = require('../models/Order');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const exclude = 'title price';

const createOrder = asyncHandler(async (req, res) => {
    // console.log(req.user);
    const id = req.user.id;
    const coupon = req.body.coupon;
    const userCart = await User.findById(id + '')
        .select('cart')
        .populate('cart.product', exclude);
    // console.log(userCart);
    const products = userCart?.cart?.map((item) => ({
        product: item.product._id,
        count: item.quantity,
        color: item.color
    }));
    let total = userCart?.cart?.reduce((sum, item) => item.product.price * item.quantity + sum, 0);
    // console.log(total);
    if (coupon) total = Math.round((total * (1 - +coupon / 100)) / 100) * 100; // 3 số cuối là 0
    const response = await Order.create({
        products: products,
        total: total,
        orderBy: id
    });
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Cannot create order..'
    });
});

const updateStatus = asyncHandler(async (req, res) => {
    const oid = req.params.oid;
    const status = req.body.status;
    if (!status) throw new Error('Missing input....');
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'No update status...'
    });
});
const productExclude = 'title images price totalRatings';
const getOrderByUser = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const response = await Order.find({ orderBy: id }).populate('products.product', productExclude);
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'No get order by user...'
    });
});

const getOrderByAdmin = asyncHandler(async (req, res) => {
    const response = await Order.find();
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'No get order by user...'
    });
});

//
module.exports = {
    createOrder,
    updateStatus,
    getOrderByUser,
    getOrderByAdmin
};
