const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

const categoryController = require('../app/controllers/productCategory');
//

router.post('/', [verifyAccessToken, isAdmin], categoryController.createCategory); //
router.get('/', categoryController.getCategory);
router.put('/:pcid', [verifyAccessToken, isAdmin], categoryController.updateCategory); //
router.delete('/:pcid', [verifyAccessToken, isAdmin], categoryController.deleteCategory); //
// router.put('/')

//
module.exports = router;
