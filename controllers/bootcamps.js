const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../middleware/errorResponse')
const geocoder = require('../utills/geocoder')
const path = require('path')
const asyncHandler = require('../middleware/async')

//description: Get all bootcamps 
//route: Get /api/v1/bootcamps 
//access: Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        
    res.status(200).json(res.advancedResults)
    
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

    const file = req.files.file; 

    //Make sure the image is a photo 
    if(!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400))
    }

    //Check filesize 
    if(file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    //Create custom file name
    file.name =`photo_${bootcamp._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(err); 
            return next(new ErrorResponse('Problem with file upload', 500))
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
    
        res.status(200).json({
            success: true, 
            data: file.name 
        })
    })
})