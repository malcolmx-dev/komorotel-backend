const bcrypt = require('bcryptjs')
const Admin = require('../model/Admin')
const createError = require('../utils/error')
const jwt= require('jsonwebtoken')

const register = async (req, res, next) => {
    try{
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)
        const newAdmin = new Admin({
            username:req.body.username,
            password: hash,
        })
        await newadmin.save()
        res.status(200).send("Admin has been created")
    }catch{
        next()
    }
}
const login = async (req, res, next) => {
    try{
        const admin = await Admin.findOne({ usernamename: req.body.username })
        if(!admin) {
            return next(createError(404, "Admin not found !"))
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password)
        if(!isPasswordCorrect){
            return next(createError(400, "Wrong password or username !"))
        }
        if (req.body.password===process.env.ADMIN_PASS){
            admin.isAdmin= true
            admin.save()
        }
        
        const token= jwt.sign({id: admin._id, isAdmin: admin.isAdmin}, process.env.JWT)



        const {password, ...otherDetails} = admin._doc
        res.cookie('access_token', token, {
            httpOnly: true
        }).status(200).json({...otherDetails, access_token:token })
        
    }catch(err){
        next(err)
    }
}

module.exports= {register, login}