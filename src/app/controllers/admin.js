const User = require('../models/User');
const asyncHandler = require('express-async-handler');

//

const getUser = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ['limit', 'page', 'sort', 'fields'];
    excludeFields.forEach((item) => delete queries[item]); // loai bo cac truong

    //format
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (item) => `$${item}`); //chuyển thành $gte $gt
    const formatQueries = JSON.parse(queryString);
    if (queries?.name) formatQueries.name = { $regex: queries.name, $options: 'i' };
    let queriesNameOrEmail = {};
    if (queries?.name) {
        delete formatQueries.name;
        formatQueries['$or'] = [
            { firstName: { $regex: req.query?.name, $options: 'i' } },
            { lastName: { $regex: req.query?.name, $options: 'i' } },
            { email: { $regex: req.query?.name, $options: 'i' } }
        ];
    }

    let queriesCommand = User.find(formatQueries);

    if (req?.query?.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queriesCommand = queriesCommand.sort(sortBy);
    }

    if (req?.query?.fields) {
        const fields = req?.query?.fields.split(',').join(' ');
        queriesCommand = queriesCommand.select(fields);
    }

    const page = +req?.query?.page || 1;
    const limit = +req?.query?.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queriesCommand.skip(skip).limit(limit);
    //
    try {
        const response = await queriesCommand.exec();
        return res.status(200).json({
            success: response ? true : false,
            users: response ? response.filter((user) => +user.role !== 2003) : 'cannot users...'
        });
    } catch (err) {
        throw new Error(err.message);
    }
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
});

//
module.exports = {
    getUser,
    deleteUser,
    updateUser,
    updateByUserAdmin
};
