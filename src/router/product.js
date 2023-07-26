const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const upload = require('../config/cloudinary');

const productController = require('../app/controllers/product');
//

router.post(
    '/',
    [verifyAccessToken, isAdmin],
    upload.fields([
        { name: 'thumb', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]),
    productController.createProduct
); //
router.get('/', productController.getProducts);
router.put('/ratings', verifyAccessToken, productController.ratings); //
router.put(
    '/uploadimages/:pid',
    [verifyAccessToken, isAdmin],
    upload.fields([
        { name: 'images', maxCount: 10 },
        {
            name: 'thumb',
            maxCount: 1
        }
    ]),
    productController.uploadImagesProduct
); ///
router.put('/:pid', [verifyAccessToken, isAdmin], productController.updateProduct); //
router.delete('/:pid', [verifyAccessToken, isAdmin], productController.deleteProduct); //
router.get('/:pid', productController.getProduct);

//
module.exports = router;
