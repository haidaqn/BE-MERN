const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const upload = require('../config/cloudinary');

const productController = require('../app/controllers/product');
//

router.post('/', [verifyAccessToken, isAdmin], productController.createProduct); //
router.get('/', productController.getProducts);
router.put('/ratings', verifyAccessToken, productController.ratings); //
router.put(
    '/uploadimages/:pid',
    [verifyAccessToken, isAdmin],
    upload.array('images', 10),
    productController.uploadImagesProduct
); ///
router.put('/:pid', [verifyAccessToken, isAdmin], productController.updateProduct); //
router.delete('/:pid', [verifyAccessToken, isAdmin], productController.deleteProduct); //
router.get('/:pid', productController.getProduct);

//
module.exports = router;
