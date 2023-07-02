const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

const userController = require('../app/controllers/user');
const adminController = require('../app/controllers/admin');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/login-admin', userController.login);
router.post('/logout', userController.logout);
router.get('/current', verifyAccessToken, userController.getCurrent); //
router.post('/refreshToken', userController.refreshToken); //
router.post('/forgotpassword', userController.forgotPassword);
router.put('/resetpassword', userController.resetPassword);
router.get('/finalregister/:token', userController.finalRegister);
//

router.put('/cart/delete', verifyAccessToken, userController.deleteCart);
router.put('/cart', verifyAccessToken, userController.updateCart);
router.put('/wishlist/delete', verifyAccessToken, userController.deleteWishList);
router.put('/wishlist', verifyAccessToken, userController.updateWishList);
router.put('/current', verifyAccessToken, adminController.updateUser); //
router.put('/current/address/:uid', verifyAccessToken, userController.updateAddress); //

// admin
router.put('/:aid', [verifyAccessToken, isAdmin], adminController.updateByUserAdmin); //
router.get('/', [verifyAccessToken, isAdmin], adminController.getUser); //
router.delete('/', [verifyAccessToken, isAdmin], adminController.deleteUser); //

module.exports = router;
