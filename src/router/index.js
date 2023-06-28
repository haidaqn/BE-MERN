// import middleware
const { notFoundPath, errHandler } = require('../middlewares/errHandler');
//
const newUser = require('./user');
const newProduct = require('./product');
const newBlog = require('./blog');
const newBlogCategory = require('./blogCategory');
const newProductCategory = require('./productCategory');
const newBrand = require('./brand');
const newCoupon = require('./coupon');
const newOrder = require('./order');
const newInsertData = require('./insert');

//
const initRoutes = (app) => {
    app.use('/api/user', newUser);
    app.use('/api/product', newProduct);
    app.use('/api/prodcategory', newProductCategory);
    app.use('/api/blogcategory', newBlogCategory);
    app.use('/api/blog', newBlog);
    app.use('/api/brand', newBrand);
    app.use('/api/coupon', newCoupon);
    app.use('/api/order', newOrder);
    app.use('/api/insert', newInsertData);

    //err path
    app.use(notFoundPath);
    app.use(errHandler); // hứng lỗi
};

module.exports = initRoutes;
