const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const upload = require('../config/cloudinary');
//

const BlogController = require('../app/controllers/blog');
//

router.put('/likes/:bid', verifyAccessToken, BlogController.likeBlog); //
router.put('/update/:bid', [verifyAccessToken, isAdmin], BlogController.updateBlog); //
router.put('/uploadimages/:bid', [verifyAccessToken, isAdmin], upload.single('image'), BlogController.uploadImagesBlog); //
router.delete('/delete/:bid', [verifyAccessToken, isAdmin], BlogController.deleteBlog); //
router.get('/one/:bid', BlogController.getBlog); //
router.get('/', BlogController.getBlogs); //
router.post('/', [verifyAccessToken, isAdmin], BlogController.createBlog); //

//

module.exports = router;
