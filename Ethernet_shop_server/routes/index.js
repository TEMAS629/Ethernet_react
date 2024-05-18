const Router = require('express')
const router = new Router()

const categoryRouter = require('./categoryRouter')
const productRouter = require('./productRouter')
const userRouter = require('./userRouter')

router.use('/category', categoryRouter)
router.use('/product', productRouter)
router.use('/user', userRouter)

module.exports = router