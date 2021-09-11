const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Blog = mongoose.model("Blog")
const requiredLogin = require('../middleware/requiredLogin')

/**
 * @swagger
 * components:
 *  schemas:
 *      Create-Blog:
 *          type: object
 *          required :
 *              -title
 *              -content
 *          properties:
 *              title:
 *                  type: string
 *                  description: The blog title
 *              content:
 *                  type: string
 *                  description: Content of blog
 *          example:
 *              title: the new blog
 *              content: hi there you are awesome
 *  
 */ 

/**
 * @swagger
 * components:
 *  schemas:
 *      Update-Blog:
 *          type: object
 *          required :
 *              -title
 *              -content
 *              -_id
 *          properties:
 *              title:
 *                  type: string
 *                  description: Updated blog title
 *              content:
 *                  type: string
 *                  description: Updated Content of blog
 *              _id:
 *                  type: string
 *                  description: Id of the blog
 *          example:
 *              title: the new blog
 *              content: hi there you are awesome
 *              _id: 613c73027f422990da815dbf
 *  
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Blog:
 *          type: object
 *          required :
 *              -title
 *              -author
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto generated id of the blog
 *              title:
 *                  type: string
 *                  description: The book title
 *              author:
 *                  type: string
 *                  description: The author of blog
 *          example:
 *              id: 13894738372834
 *              title: the new blog
 *              author: Ashish Keshri
 *  
 */ 

/**
 * @swagger
 * tags:
 *  name: Blogs
 *  description: The Blogs APIS 
 */




/**
 * @swagger
 * /createblog:
 *  post:
 *      summary: Create Blog API
 *      tags: [Blogs]
 *      security:
 *          - jwt: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Create-Blog'
 *      responses:
 *          200:
 *              description: Signup Successfull
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Blog' 
 */


// (POST) Create a new blog post
router.post('/createblog',requiredLogin,(req,res)=>{
    const {title,content} = req.body
    if(!title || !content){
        return res.status(422).json({err:"Please add all the fields"})
    }

    req.user.password = undefined
   
    const blog = new Blog({
        title,
        content,
        author: req.user
    })
    blog.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

/**
 * @swagger
 * /allblog:
 *  get:
 *      summary: Return list of blogs
 *      tags: [Blogs]
 *      responses:
 *          200:
 *              description: The list of all blogs
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Blog' 
 */


// (GET) GET All blog posts (only the titles and author)
router.get('/allblog',(req,res)=>{
    Blog.find()
    .populate("author","_id name")
    .then(blogs=>{

        blogs = blogs.map(blog=>{
            return {title:blog.title,author:blog.author,_id:blog._id}
        })
        res.json({blogs})
    })
    .catch(err=>{
        console.log(err);
    })
})


/**
 * @swagger
 * /myblog:
 *  get:
 *      summary: Return list of blogs by current user
 *      tags: [Blogs]
 *      security:
 *          - jwt: []
 *      responses:
 *          200:
 *              description: The list of all blogs
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Blog' 
 */


// (GET) GET All blog posts of current user(Just for testing)
router.get('/myblog',requiredLogin,(req,res)=>{
    Blog.find({author:req.user._id})
    .populate("author","_id name")
    .then(myblog=>{
        res.json({myblog})
    })
    .catch(err=>{
        console.log(err)
    })
})

/**
 * @swagger
 * /thatblog/{id}:
 *  get:
 *      summary: Search by ID
 *      tags: [Blogs]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The book id
 *      responses:
 *          200:
 *              description: The list of all blogs
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Blog' 
 */

// (GET) GET details of the single blog post (title + author + content)
router.get('/thatblog/:id',(req,res)=>{
    Blog.findOne({_id:req.params.id})
    .populate("author","_id name")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(404).json({error:"No such post exist"})
        }
        res.json({post})
    })
})


/**
 * @swagger
 * /update:
 *  post:
 *      summary: Update Blog API
 *      tags: [Blogs]
 *      security:
 *          - jwt: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Update-Blog'
 *      responses:
 *          200:
 *              description: Signup Successfull
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Blog' 
 */

// (PUT) Update an existing blog post
router.post('/update',requiredLogin,(req,res)=>{
    const {title,content,_id} = req.body
    Blog.findOne({_id})
    .populate("author","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(404).json({error:"No such post exist"})
        }
        if(!title || !content){
            return res.status(422).json({err:"Please add all the fields"})
        }
        if(post.author._id.toString()=== req.user._id.toString()){
            Blog.update({_id},{$set:{title,content}})
            .then((post)=>{
                    res.json({message:"Successfully Updated"})
                })
            .catch(err=>{
                console.log(err);
            })
        } else{
            res.status(422).json({err:"You are not the author of this blog"})
        }
    })

})


/**
 * @swagger
 * /delete/{id}:
 *  delete:
 *      summary: Delete by ID of Blog
 *      tags: [Blogs]
 *      security:
 *          - jwt: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The blog id
 *      responses:
 *          200:
 *              description: Deleted Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Blog' 
 */

// (DELETE) Delete an existing blog post
router.delete('/delete/:id',requiredLogin,(req,res)=>{
    Blog.findOne({_id:req.params.id})
    .populate("author","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(404).json({error:"No such post exist"})
        }
        if(post.author._id.toString()=== req.user._id.toString() || req.user.isAdmin){
            post.remove()
            .then(result=>{
                res.json({message:"Successfully Deleted"})
            }).catch(err=>{
                console.log(err);
            })
        } else{
            res.status(422).json({err:"You are not the author of this blog nor you are a Admin"})
        }
    })
})

/**
 * @swagger
 * /search/{searchtext}:
 *  get:
 *      summary: Search by title
 *      tags: [Blogs]
 *      parameters:
 *          -   in: path
 *              name: searchtext
 *              schema:
 *                  type: string
 *              required: true
 *              description: The book id
 *      responses:
 *          200:
 *              description: The list of all blogs
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Blog' 
 */


// (GET) Get the filtered list of posts (filter by title)
router.get('/search/:searchtext',(req,res)=>{
    Blog.find( { $text: { $search: req.params.searchtext } } )
    .populate("author","_id name")
    .then(searchedblog=>{
        res.json({searchedblog})
    })
    .catch(err=>{
        console.log(err)
    })
})



module.exports = router