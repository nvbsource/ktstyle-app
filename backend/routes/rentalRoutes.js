const express = require('express')
const router = express.Router()
const rentalController = require('../controllers/rentalsController')

router.get('/', rentalController.getAllRentals)
router.get('/:id', rentalController.getRentalById)
router.put('/:id', rentalController.updateRental)

module.exports = router
