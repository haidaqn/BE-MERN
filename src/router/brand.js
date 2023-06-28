const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

const brandController = require('../app/controllers/brand');
//

router.post('/', [verifyAccessToken, isAdmin], brandController.createBrand); //
router.get('/', brandController.getBrand); //
router.put('/:id', [verifyAccessToken, isAdmin], brandController.updateBrand); //
router.delete('/:id', [verifyAccessToken, isAdmin], brandController.deleteBrand); //

//
module.exports = router;
