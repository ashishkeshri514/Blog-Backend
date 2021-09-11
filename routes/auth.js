const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requiredLogin = require('../middleware/requiredLogin')
/**
 * @swagger
 * components:
 *  schemas:
 *      Auth:
 *          type: object
 *          required :
 *              -name
 *              -email
 *              -password
 *          properties:
 *              name:
 *                  type: string
 *                  description: Name of User
 *              email:
 *                  type: string
 *                  description: Email of User
 *              password:
 *                  type: string
 *                  description: password
 *          example:
 *              name: Ashish
 *              email: ashish@gmail.com
 *              password: "123456"
 *  
 */ 

/**
 * @swagger
 * components:
 *  schemas:
 *      Auth-Signin:
 *          type: object
 *          required :
 *              -email
 *              -password
 *          properties:
 *              email:
 *                  type: string
 *                  description: Email of User
 *              password:
 *                  type: string
 *                  description: password
 *          example:
 *              email: ashish@gmail.com
 *              password: "123456"
 *  
 */ 
/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: The Auth APIS 
 */

/**
 * @swagger
 * /signup:
 *  post:
 *      summary: Signup API
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Auth'
 *      responses:
 *          200:
 *              description: Signup Successfull
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Auth' 
 */
router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body;
    if(!email || !password || !name) {
        return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User Already Exist"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name
            })
            user.save()
            .then(user=>{
                res.json({mesage:"saved successfully"})
            })
            .catch(err=>{
                console.log(err);
            })

        })
        
    })
    .catch(err=>{
        console.log(err);
    })
})


/**
 * @swagger
 * /signin:
 *  post:
 *      summary: Signin API
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Auth-Signin'
 *      responses:
 *          200:
 *              description: Signup Successfull
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Auth-Signin' 
 */

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password) {
        return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"User Loged In Successfully"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token})
            } else {
                return res.status(422).json({error:"Invalid Email or Password"})
            }
        })
    })
    .catch(err=>{
        console.log(err)
    })
})


module.exports = router