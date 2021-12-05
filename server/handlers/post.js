const {prisma } = require('../prisma/connection')
const {isAuthorized, likedOrNah} = require('../utils')
const {createPostValidator} = require('../validators/post')
const _ = require('lodash')
const { post } = require('../routes/auth')


const create = async (req, res) => {
    let isAuth = await isAuthorized(req.headers.authorization)
    if (isAuth === 401) {
        return res.status(401).json({details: 'Unauthorized'})
    }

    const {content} = req.body
    const errors = createPostValidator(req.body)

    if (_.isEmpty(errors)) {
        try {
            let post = await prisma.post.create({
                data: {
                    userId: isAuth.id,
                    content
    
                }
            })
            return res.status(201).json(post)
        } catch (e) {
            console.log(e)
        }
    } else {
        return res.status(400).json(errors)
    }
}



const home = async (req,res) => {
    let isAuth = await isAuthorized(req.headers.authorization)
    

    let cursor = req.query.cursor

    let posts
    if (cursor === 'null') {
        posts = await prisma.post.findMany(
            {
                take: 5,
                
                orderBy: {cursorNo: 'desc'},
                include: 
                {
                    _count: {select: {likes: true}},
                    user:{select:{username: true, firstname: true, lastname: true}}}
                }
            
        )
    }
    
    else {
        posts = await prisma.post.findMany(
            {
                take: 5,
                skip: 1,
                cursor: {id: cursor},
                orderBy: {cursorNo: 'desc'},
                include: {
                    _count: {select: {likes: true}},
                    user:{select:{username: true, firstname: true, lastname: true}}}
                }
        )
    }

  

    if (posts.length === 0) {
        return res.status(404).json({'details': 'No posts available'})
    }

    let newPosts = await likedOrNah(posts, isAuth)

    return res.json(newPosts).status(200)
}


const likeUnlike = async (req, res) => {

    const {post} = req.body

    let isAuth = await isAuthorized(req.headers.authorization)
    if (isAuth === 401) {
        return res.status(401).json({details: 'Unauthorized'})
    }
    
    let isLiked = await prisma.post.findUnique({where: {id: post}, select: {likes: {where: {id: isAuth.id}}}})
    

    if (isLiked.likes.length === 0) {
        let liked = await prisma.post.update({where: {id: post}, data: {likes: {connect: {id: isAuth.id}}}})
        return res.json({details: 'like added', liked}).status(200)
    } else {
        let disliked = await prisma.post.update({where: {id: post}, data: {likes: {disconnect: {id: isAuth.id}}}})
        return res.json({details: 'liked removed', disliked}).status(200)
    }

    
}


module.exports = {create, home, likeUnlike}