const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../middleware/errorResponse')
const geocoder = require('../utills/geocoder')
const asyncHandler = require('../middleware/async')

//description: Get all bootcamps 
//route: Get /api/v1/bootcamps 
//access: Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        let query; 

        //Copy req.query 
        const reqQuery = {...req.query}; 

        //Fields to exclude 
        const removeFields = ['select', 'sort', 'page', 'limit'];

        //Loop over removeFields and delete them from reqQuery 
        removeFields.forEach(param => delete reqQuery[param]); 

        //create query string 
        let queryStr = JSON.stringify(reqQuery); 

        //create operators ($gt, $gte, etc.)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`); 

        //Finding resource 
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses'); 

        // Select Fields 
        if(req.query.select) {
            const fields = req.query.select.split(',').join(' ')
            query = query.select(fields)
        }

        //Sort 
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy); 
        } else {
            query = query.sort('-createdAt'); 
        }

        //Pagination 
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 100; 
        const startIndex = (page - 1) * limit; 
        const endIndex = page * limit; 
        const total = await Bootcamp.countDocuments(); 

        query = query.skip(startIndex).limit(limit); 

        //Executing query 
        const bootcamps = await query;  

        //Pagination result 
        const pagination = {}; 

        if (endIndex < total) {
            pagination.next = {
                page: page + 1, 
                limit 
            }
        }

        if(startIndex > 0) {
            pagination.prev = {
                page: page - 1, 
                limit 
            }
        }

        res.status(200).json({success: true, count: bootcamps.length, pagination, data: bootcamps})
    
})
//description: Get a bootcamp 
//route: Get /api/v1/bootcamps/1
//access: public 
exports.getBootcamp = asyncHandler(async (req, res, next) => {

        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            )
        }
        
        res.status(200).json({success: true, data: bootcamp})
    
})

//description: Create new bootcamp
//route: Post /api/v1/bootcamps 
//access: private 
exports.createBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.create(req.body) //gives back a promise 
        res.status(201).json({success: true, data: bootcamp})
})

//description: Update a bootcamp 
//route: Put /api/v1/bootcamps/1
//acces: private 
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true
        })
    
        if(!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            )
        }

        res.status(200).json({success: true, data: bootcamp})
  
})

//description: Delete a bootcamp 
//route: Delete /api/v1/bootcamps/1
//access: private 
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id); 

        if(!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            )
        }

    bootcamp.remove() 

    res.status(200).json({success: true, data: {} })

})

//description: Get bootcamps within a radius 
//route: GET /api/v1/bootcamps/radius/:zipcode/:distance 
//access: Public 
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params; 

    //Get lat/lng from geocoder 
    const loc = await geocoder.geocode(zipcode); 
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    //calc radius using radians 
    //Divide dist by radius of Earth 
    //Earth radius = 3,963 mi / 6,378 km 
    const radius = distance / 3963; 

    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: { $centerSphere: [[lng, lat], radius]}}
    })

    res.status(200).json({
        success: true, 
        count: bootcamps.length, 
        data: bootcamps
    })
})

//description: Upload a photo for bootcamp 
//route: PUT /api/v1/bootcamps/:id/photo 
//access: private 
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id); 

    if(!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        )
    }

    if(!req.files) {
        return next(
            new ErrorResponse(`Please upload a file`, 400)
        )
    }
})