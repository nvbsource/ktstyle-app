const express = require("express");

const router = express.Router();

const productRoutes = require('./productRoutes')
const uploadRoute = require('./uploadRoutes')
const categoryRoutes = require('./categoryRoutes')
const libraryRoutes = require('./libraryRoutes')
const colorRoutes = require('./colorRoutes')
const rentalRoutes = require('./rentalRoutes')
const productContentsRoutes = require('./productContentsRoutes')
const topicRoutes = require('./topicRoutes')
const cartRoutes = require('./cartRoutes')
const customerRoutes = require('./customerRoutes')
const transactionRoutes = require('./transactionRoutes')
const orderRoutes = require('./orderRoutes')
const variantRoutes = require('./variantRoutes')
const inventoryRoutes = require('./inventoryRoutes')

router.use('/upload', uploadRoute)
router.use('/cart', cartRoutes)
router.use('/categories', categoryRoutes)
router.use('/libraries', libraryRoutes)
router.use('/colors', colorRoutes)
router.use('/products', productRoutes)
router.use('/contents', productContentsRoutes)
router.use('/topics', topicRoutes)
router.use('/rentals', rentalRoutes)
router.use('/customers', customerRoutes)
router.use('/inventories', inventoryRoutes)
router.use('/transactions', transactionRoutes)
router.use('/orders', orderRoutes)
router.use('/variants', variantRoutes)
router.use('/auth', variantRoutes)

module.exports = router;