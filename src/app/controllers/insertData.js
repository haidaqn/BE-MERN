const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const slugify = require('slugify');

const data = require('../../../data/data2.json');
const category = require('../../../data/category');

//

const fs = async (product) => {
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + Math.round(Math.random() * 100) + '',
        description: product?.description,
        brand: product?.brand,
        price: Math.round(Number(product?.price.match(/\d/g).join('')) / 100),
        category: product?.category[1],
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find((item) => item.label === 'Color')?.variants[0],
        thumb: product?.thumb,
        totalRatings: 0
    });
};

const insertProduct = asyncHandler(async (req, res) => {
    const promise = [];
    for (let product of data) promise.push(fs(product));
    await Promise.all(promise);
    return res.json('Ok');
});

const fs2 = async (cate) => {
    await ProductCategory.create({
        title: cate?.cate,
        brand: cate?.brand
    });
};

const insertCategory = asyncHandler(async (req, res) => {
    const promise = [];
    // console.log(category);
    for (let cate of category) promise.push(fs2(cate));
    await Promise.all(promise);
    return res.json('Ok');
});

module.exports = { insertProduct, insertCategory };
