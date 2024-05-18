const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')
const checkRole = require('../middleware/chekRoleMiddleware')

router.post('/create', productController.create)
router.get('/getall', productController.getAll)
router.get('/:id', productController.getOne)

module.exports = router