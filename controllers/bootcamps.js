const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../middleware/errorResponse')
const geocoder = require('../utills/geocoder')
const asyncHandler = require('../middleware/async')

//description: Get all bootcamps 
//route: Get /api/v1/bootcamps 
//access: Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        const bootcamps = await Bootcamp.find(); 

        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps})
    
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
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id); 

        if(!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            )
        }
    res.status(200).json({success: true, data: {} })

})

//description: Get bootcamps within a radius 
//route: Delete /api/v1/bootcamps/radius/:zipcode/:distance 
//access: private 
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