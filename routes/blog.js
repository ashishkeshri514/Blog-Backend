const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Blog = mongoose.model("Blog")
const requiredLogin = require('../middleware/requiredLogin')

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

// (GET) GET details of the single blog post (title + author + content)
router.get('/thatblog/:id',(req,res)=>{
    Blog.findOne({_id:req.params.id})
    .populate("author","_id name")
    .then(blog=>{
        res.json({blog})
    })
    .catch(err=>{
        console.log(err);
    })
})

// (PUT) Update an existing blog post
router.post('/update',requiredLogin,(req,res)=>{
    const {title,content,author,_id} = req.body
    const authenticatedUser = {_id:req.user._id,name:req.user.name}
    if(JSON.stringify(authenticatedUser)!=JSON.stringify(author)){
        return res.status(422).json({err:"You are not the author of this blog"})
    }
    if(!title || !content){
        return res.status(422).json({err:"Please add all the fields"})
    }
    Blog.update({_id},{$set:{title,content}}).then((post)=>{
        res.json({message:"Successfully Updated"})
    }).catch((err)=>{
        console.log(err);
    })

})

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

// (GET) Get the filtered list of posts (filter by title)
router.post('/search',requiredLogin,(req,res)=>{
    const {searchtext} = req.body
    Blog.find( { $text: { $search: searchtext } } )
    .populate("author","_id name")
    .then(searchedblog=>{
        res.json({searchedblog})
    })
    .catch(err=>{
        console.log(err)
    })
})



module.exports = router