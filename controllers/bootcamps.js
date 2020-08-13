//description: Get all bootcamps 
//route: Get /api/v1/bootcamps 
//access: Public 
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show all bootcamps'})
}
//description: Get a bootcamp 
//route: Get /api/v1/bootcamps/1
//access: public 
exports.getBootcamp = (req, res, next) {
    res.status(200).json({success: true, msg: 'Show bootcamp'})
}

//description: Create new bootcamp
//route: Post /api/v1/bootcamps 
//access: private 
exports.createBootcamp = (req, res, next) {
    res.status(200).json({success: true, msg: 'Create a bootcamp'})
}

//description: Update a bootcamp 
//route: Put /api/v1/bootcamps/1
//acces: private 
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Update a bootcamp'})
}

//description: Delete a bootcamp 
//route: Delete /api/v1/bootcamps/1
//access: private 
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Delete a bootcamp'})
}