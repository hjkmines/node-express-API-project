const express = require('express')
const {
    getBootcamps, 
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp
} = require('../controllers/bootcamps')
const router = express.Router(); 


module.exports = router 