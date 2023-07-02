const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../../util/sendMail');
const crypto = require('crypto');
const makeToken = require('uniqid');

//

const register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, mobile } = req.body;
    if (!email || !password || !lastName || !firstName || !mobile)
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        });
    const user = await User.findOne({ email });
    if (user) throw new Error('User has existed');
    else {
        const token = makeToken();
        res.cookie(
            'dataregister',
            { ...req.body, token },
            {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 5 * 60 * 1000
            }
        );
        const html = `Xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký tài khoản của bạn.Link này sẽ hết hạn sau 5 phút kể từ bây giờ.
                <a href=https://apimern-6pax.onrender.com/api/user/finalregister/${token}>Click here</a>`;
        const subject = 'Xác minh tài khoản mern';
        const data = {
            email,
            html,
            subject
        };
        await sendMail(data);
        return res.json({
            success: true,
            message: 'Please check your email to active account'
        });
    }
});

const finalRegister = asyncHandler(async (req, res) => {
    const token = req.params.token;
    const cookie = req.cookies;
    if (!cookie || cookie?.dataregister?.token !== token) {
        res.clearCookie('dataregister');
        return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
    } else {
        const { tokenRegister, ...data } = cookie?.dataregister;
        const newUser = await User.create(data);
        res.clearCookie('dataregister');
        if (newUser) return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
        return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
    }
});

//login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(200).json({
            success: false,
            message: 'You have entered the wrong email or password...'
        });
    }
    const response = await User.findOne({ email }); // Instance được trả về khi dùng hàm của mongodb
    if (response && (await response.isCorrectPassWord(password))) {
        const { password, role, refreshToken, ...userData } = response.toObject();
        const userId = response._id;
        const accessToken = generateAccessToken(userId, role); // taoj access
        const newRefreshToken = generateRefreshToken(userId); // tao refresh
        //lưu refresh token vào db
        await User.findByIdAndUpdate(userId, { refreshToken: newRefreshToken }, { new: true }); // trả về data new sau khi update data
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 604800000 // thời gian hết hạn 7 ngày
        });
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        });
    } else {
        throw new Error('invalid credentials !');
    }
});
//logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token...'); // tra đăng nhập
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    return res.status(200).json({
        success: true,
        mes: 'logout is done'
    });
});
const getCurrent = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    // console.log(userId);
    const user = await User.findById(userId).select('-refreshToken -password -role');
    // console.log(user);
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    });
});
const refreshToken = asyncHandler(async (req, res) => {
    // Lấy token từ cookies
    const cookie = req.cookies;
    // Check xem có token hay không
    // console.log(cookie);
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies');
    // Check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await User.findOne({ _id: rs.id, refreshToken: cookie.refreshToken });
    // console.log(rs);
    // console.log(response);
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response.id, response.role) : 'Refresh token not matched'
    });
});
//
// reset pw
/* 
    client -> mail -> check mail -> gui link 
           -> click link -> api token -> check api token 
           -> change pw
*/

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new Error('No email');
    const user = await User.findOne({ email });
    if (!user) throw new Error('No user');
    const resetToken = user.createPasswordChangedToken();
    await user.save(); // luu reset token vao db ...
    //
    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ.
                <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`;
    const data = {
        email,
        html
    };
    const response = await sendMail(data);
    return res.status(200).json({
        success: true
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) throw new Error('missing inputs');
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) throw new Error('Invalid reset token');
    user.password = password;
    user.passwordResetExpires = Date.now();
    user.passwordResetToken = undefined;
    user.passwordChangedAt = undefined;

    await user.save();

    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Updated password' : 'Something went wrong'
    });
});

const updateAddress = asyncHandler(async (req, res) => {
    const id = req.user.id;
    if (!req.body.address) throw new Error('Missing input...');
    const response = await User.findByIdAndUpdate(id, { $push: { address: req.body.address } }, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        rs: response ? response : 'No update address in user ...'
    });
});

const updateCart = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const { pid, quantity, color } = req.body;
    if (!pid || !quantity) throw new Error('missing input');
    const user = await User.findById(id);
    const alreadyProduct = user?.cart?.find((item) => item.product.toString() == pid);
    if (alreadyProduct) {
        if (alreadyProduct?.color === color) {
            const response = await User.updateOne(
                { cart: { $elemMatch: alreadyProduct } },
                { $set: { 'cart.$.quantity': quantity } },
                { new: true }
            );
            return res.status(200).json({
                success: response ? true : false,
                response: response ? response : 'No update cart in user ...'
            });
        } else {
            const response = await User.findByIdAndUpdate(
                id,
                { $push: { cart: { product: pid, quantity, color } } },
                { new: true }
            );
            return res.status(200).json({
                success: response ? true : false,
                response: response ? response : 'No update cart in user ...'
            });
        }
    } else {
        const response = await User.findByIdAndUpdate(
            id,
            { $push: { cart: { product: pid, quantity, color } } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            response: response ? response : 'No update cart in user ...'
        });
    }
});

const deleteCart = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const { pid, quantity, color } = req.body;
    if (!pid || !quantity) throw new Error('missing input');
    const response = await User.findByIdAndUpdate(
        id,
        { $pull: { cart: { product: pid, quantity, color } } },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false
    });
});

const updateWishList = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const { pid } = req.body;
    if (!pid) throw new Error('missing input');
    const user = await User.findById(id);
    const alreadyProduct = user?.wishlist?.find((item) => item.product.toString() == pid);
    if (alreadyProduct) {
        return res.status(200).json({
            success: false,
            message: "Can't add products to wishlist ..."
        });
    } else {
        const response = await User.findByIdAndUpdate(id, { $push: { wishlist: { product: pid } } }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            response: response ? response : 'No update wishlist in user ...'
        });
    }
});
const deleteWishList = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const { pid } = req.body;
    if (!pid) throw new Error('missing input');
    const response = await User.findByIdAndUpdate(id, { $pull: { wishlist: { product: pid } } }, { new: true });
    return res.status(200).json({
        success: response ? true : false
    });
});
const exclude = 'title images price';
const getWishlist = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select('wishlist').populate('wishlist.product', exclude);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const wishlist = user.wishlist.map((item) => item.product);

    return res.status(200).json({
        success: true,
        wishlist
    });
});

const getCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('cart.product', {});

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const cart = user.cart.map((item) => {
        return {
            product: item.product,
            quantity: item.quantity,
            color: item.color
        };
    });

    return res.status(200).json({
        success: true,
        cart
    });
});

module.exports = {
    register,
    login,
    logout,
    getCurrent,
    refreshToken,
    forgotPassword,
    resetPassword,
    updateAddress,
    updateCart,
    deleteCart,
    finalRegister,
    updateWishList,
    deleteWishList,
    getWishlist,
    getCart
};
