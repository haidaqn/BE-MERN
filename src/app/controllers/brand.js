const Brand = require('../models/Brand');
const asyncHandler = require('express-async-handler');  

//

const createBrand = asyncHandler(async (req, res) => {
    const response = await Brand.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        Brand: response ? response : 'not create brand...'
    });
});

const getBrand = asyncHandler(async (req, res) => {
    const response = await Brand.find().select('title');
    return res.json({
        success: response ? true : false,
        Brand: response ? response : 'no blog brand ...'
    });
});

const updateBrand = asyncHandler(async (req, res) => {
    const brandId = req.params.id;
    const response = await Brand.findByIdAndUpdate(brandId, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        updateBrand: response ? response : 'No update brand..'
    });
});

const deleteBrand = asyncHandler(async (req, res) => {
    const brandId = req.params.id;
    const response = await Brand.findByIdAndDelete(brandId);
    return res.json({
        success: response ? true : false
    });
});

///

module.exports = {
    createBrand,
    getBrand,
    updateBrand,
    deleteBrand
};
