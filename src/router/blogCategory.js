const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

const blogCategoryController = require('../app/controllers/blogCategory');
//

router.post('/', [verifyAccessToken, isAdmin], blogCategoryController.createCategory); //
router.get('/', blogCategoryController.getCategory); //
router.put('/:bcid', [verifyAccessToken, isAdmin], blogCategoryController.updateCategory); //
router.delete('/:bcid', [verifyAccessToken, isAdmin], blogCategoryController.deleteCategory); //

//
module.exports = router;
