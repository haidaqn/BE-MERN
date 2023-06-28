const Blog = require('../models/Blog');
const asyncHandler = require('express-async-handler');

//

const createBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category) throw new Error('missing input..');
    const response = await Blog.create(req.body);
    return res.json({
        success: response ? true : false,
        newBlog: response ? response : 'Cannot create new blog..'
    });
});

const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find();
    return res.status(200).json({
        success: response ? true : false,
        blog: response ? response : 'No blog...'
    });
});

const excludeFields = '-password -role -updatedAt -createdAt -refreshToken';
const exclude = 'lastName firstName email mobile';

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', exclude)
        .populate('disLiked', exclude);
    return res.status(200).json({
        success: response ? true : false,
        blog: response ? response : 'No blog...'
    });
});

const updateBlog = asyncHandler(async (req, res) => {
    const bid = req.params.bid;
    // const { title, description, category } = req.body;
    // if (!title || !description || !category) throw new Error("Missing input");
    if (Object.keys(req.body) === 0) throw new Error('Missing input');
    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        blogUpdate: response ? response : 'Cannot update blog'
    });
});

const deleteBlog = asyncHandler(async (req, res) => {
    const bid = req.params.bid;
    const response = await Blog.findByIdAndDelete(bid);
    return res.status(200).json({
        success: response ? true : false
    });
});

const likeBlog = asyncHandler(async (req, res) => {
    const id = req.user.id; // id người dùng
    const bid = req.params.bid;
    if (!bid) throw new Error('missing input..');
    const blog = await Blog.findById(bid);
    const alreadyLike = blog?.likes?.find((item) => item.toString() == id); // object  : người dùng like
    const alreadyDisLiked = blog?.disLiked?.find((item) => item.toString() == id);
    // console.log(alreadyLike);

    if (alreadyLike) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { likes: id },
                $push: { disLiked: id }
            },
            { new: true }
        );
        return res.json({
            success: response ? true : false,
            response
        });
    } else {
        if (alreadyDisLiked) {
            const response = await Blog.findByIdAndUpdate(
                bid,
                { $push: { likes: id }, $pull: { disLiked: id } },
                { new: true }
            );
            return res.json({
                success: response ? true : false,
                response
            });
        }
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $push: { likes: id }
            },
            { new: true }
        );
        return res.json({
            success: response ? true : false,
            response
        });
    }
});

const uploadImagesBlog = asyncHandler(async (req, res) => {
    const id = req.params.bid;
    if (!req.file) throw new Error('Missing input...');
    const response = await Blog.findByIdAndUpdate(id, { image: req?.file?.path }, { new: true }); // chỉ lấy ra path của ảnh
    // console.log(response);
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'No upload ...'
    });
});

//
module.exports = {
    createBlog,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    getBlogs,
    uploadImagesBlog
};
