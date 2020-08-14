const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../middleware/errorResponse')

//description: Get all bootcamps 
//route: Get /api/v1/bootcamps 
//access: Public 
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find(); 

        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps})
    } catch(err) {
        next(err)
    }
}
//description: Get a bootcamp 
//route: Get /api/v1/bootcamps/1
//access: public 
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            )
        }
        
        res.status(200).json({success: true, data: bootcamp})
    } catch(err) {
        next(err)
    }
}

//description: Create new bootcamp
//route: Post /api/v1/bootcamps 
//access: private 
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body) //gives back a promise 
        res.status(201).json({success: true, data: bootcamp})
    } catch(err) {
        next(err)
    }


}

//description: Update a bootcamp 
//route: Put /api/v1/bootcamps/1
//acces: private 
exports.updateBootcamp = async (req, res, next) => {
    try {
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
    } catch(err) {
        next(err)
    }
}

//description: Delete a bootcamp 
//route: Delete /api/v1/bootcamps/1
//access: private 
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id); 

        if(!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            )
        }
    res.status(200).json({success: true, data: {} })
    } catch(err) {
        next(err)
    }

}