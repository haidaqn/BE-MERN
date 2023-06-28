const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

const insertController = require('../app/controllers/insertData');

//

router.post('/cate', insertController.insertCategory);
router.post('/', insertController.insertProduct);

//
module.exports = router;
