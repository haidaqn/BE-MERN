const BlogCategory = require('../models/BlogCategory');
const asyncHandler = require('express-async-handler');

//

const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) throw new Error('Missing input...');
    const response = await BlogCategory.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        category: response ? response : 'not create blog category...'
    });
});

const getCategory = asyncHandler(async (req, res) => {
    const response = await BlogCategory.find().select('title');
    return res.json({
        success: response ? true : false,
        prodCategory: response ? response : 'no blog category ...'
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        categoryUpdate: response ? response : 'No update blog category..'
    });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const response = await BlogCategory.findByIdAndDelete(bcid);
    return res.json({
        success: response ? true : false
    });
});

///

module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
};
