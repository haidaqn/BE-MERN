const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
//
const exclude = 'lastName firstName ';
const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body) === 0) throw new Error('Missing input...');
    if (req?.body?.title) req.body.slug = slugify(req.body.title);

    const newProduct = await Product.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        createProduct: newProduct ? newProduct : 'Cannot create product'
    });
});

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!pid) throw new Error('Missing input');
    const response = await Product.findById(pid).populate('ratings', exclude);
    return res.status(200).json({
        success: response ? true : false,
        product: response ? response : 'Get Product missing'
    });
});

const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ['limit', 'page', 'sort', 'fields'];
    excludeFields.forEach((item) => delete queries[item]); // loai bo cac truong

    //format
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (item) => `$${item}`); //chuyển thành $gte $gt
    const formatQueries = JSON.parse(queryString);

    let colorQueryObject = {};
    if (queries?.title) formatQueries.title = { $regex: queries.title, $options: 'i' };
    if (queries?.category) formatQueries.category = { $regex: queries.category, $options: 'i' };
    if (queries?.color) {
        delete formatQueries.color;
        const colorArray = queries.color?.split(',');
        const queryColor = colorArray.map((item) => ({ color: { $regex: item, $options: 'i' } }));
        colorQueryObject = { $or: queryColor };
    }

    const queriesNew = { ...colorQueryObject, ...formatQueries };
    // return res.status(200).json({
    //     queriesNew
    // });
    let queriesCommand = Product.find(queriesNew);
    // return res.status(200).json({
    //     queriesCommand
    // });
    // sorting
    if (req?.query?.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queriesCommand = queriesCommand.sort(sortBy);
    }
    // fields limiting
    if (req?.query?.fields) {
        const fields = req?.query?.fields.split(',').join(' ');
        queriesCommand = queriesCommand.select(fields);
    }
    // pagination -> limit
    //            -> skip

    // +"2" -> 2
    //+"asdasaaaa" -> NaN
    const page = +req?.query?.page || 1; // lay tu req la string -> convert qua int
    const limit = +req?.query?.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queriesCommand.skip(skip).limit(limit);

    //
    try {
        const response = await queriesCommand.exec();
        const count = await Product.find(queriesNew).countDocuments();
        return res.status(200).json({
            success: true,
            count,
            products: response ? response : 'cannot products...'
        });
    } catch (err) {
        throw new Error(err.message);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!pid) throw new Error('Missing input');

    const response = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'No update..'
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!pid) throw new Error('Missing input');
    const response = await Product.findByIdAndDelete(pid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'No delete..'
    });
});

const ratings = asyncHandler(async (req, res) => {
    const id = req.user.id;
    // console.log(id);
    const { star, comment, pid } = req.body;
    // console.log(id,pid);
    if (!star || !pid) throw new Error('Missing required fields');
    const product = await Product.findById(pid);
    if (!product) throw new Error('Product not found');
    const alreadyRated = product?.ratings.find((item) => item.postedBy.toString() === id);
    if (alreadyRated) {
        await Product.updateOne(
            { ratings: { $elemMatch: alreadyRated } },
            {
                $set: {
                    'ratings.$.star': star,
                    'ratings.$.comment': comment
                }
            },
            { new: true }
        );
    } else await Product.findByIdAndUpdate(pid, { $push: { ratings: { star, comment, postedBy: id } } }, { new: true });

    const updateProduct = await Product.findById(pid);

    const ratingsCount = updateProduct.ratings.length;
    // console.log(ratingsCount);
    const sumRatings = updateProduct?.ratings?.reduce((sum, item) => sum + item?.star, 0);
    updateProduct.totalRatings = Math.round((sumRatings * 10) / ratingsCount) / 10;
    await updateProduct.save();

    return res.status(201).json({ success: true, updateProduct });
});

const uploadImagesProduct = asyncHandler(async (req, res) => {
    // console.log(req.files);
    const id = req.params.pid;
    if (!req.files) throw new Error('Missing input...');
    const response = await Product.findByIdAndUpdate(
        id,
        {
            $push: { images: { $each: req.files.map((item) => item.path) } } // chỉ lấy ra path của ảnh
        },
        { new: true }
    );
    // console.log(response);
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'No upload ...'
    });
});

//
module.exports = {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    ratings,
    uploadImagesProduct
};
