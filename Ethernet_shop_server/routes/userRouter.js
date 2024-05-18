const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.register)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)

router.get('/get_basket', userController.getBasket);
router.post('/basket', userController.addToBasket);
router.delete('/basket', userController.deleteFromBasket);
router.post('/history', userController.addToHistory);
router.get('/get_history', userController.getHistory);
router.post('/submitbasket', userController.submitBacket);

router.get('/profile', userController.getHistory);
router.post('/profile', userController.addToHistory);

module.exports = router