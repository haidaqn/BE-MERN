const User = require('../models/User');
const asyncHandler = require('express-async-handler');

//

const getUser = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -password -role');
    return res.status(200).json({
        success: true,
        user: response
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query;
    // console.log(_id);
    if (!_id) throw new Error('missing input.');
    const response = await User.findByIdAndDelete(_id);
    return res.status(200).json({
        success: response ? true : false,
        deletedUser: response ? `User with email ${response.email} deleted` : 'No user delete'
    });
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    if (!id || Object.keys(req.body).length === 0) throw new Error('missing input.');
    const response = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-refreshToken -role -password');
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    });
});

const updateByUserAdmin = asyncHandler(async (req, res) => {
    const { aid } = req.params;
    if (!aid || Object.keys(req.body).length === 0) throw new Error('missing input.');
    const response = await User.findByIdAndUpdate(aid, req.body, { new: true }).select('-role -password -refreshToken');
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    });
    s;
});

//
module.exports = {
    getUser,
    deleteUser,
    updateUser,
    updateByUserAdmin
};
