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


const reply = async (req,res) => {
    let isAuth = await isAuthorized(req.headers.authorization)
    if (isAuth === 401) {
        return res.status(401).json({details: 'Unauthorized'})
    }

    const {content, replyTo} = req.body
    const errors = createPostValidator(req.body)

    if (_.isEmpty(errors)) {
        
        try {
            let reply = await prisma.post.create({
                data: {
                    userId: isAuth.id,
                    isReply: true,
                    replyId: replyTo,
                    content
                }
            })
            return res.status(201).json(reply)
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
                where: {isReply: false},
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
                where: {isReply: false},
                skip: 1,
                cursor: {id: cursor},
                orderBy: {cursorNo: 'desc'},
                include: {
                    _count: {select: {likes: true, replies: true}},
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



const postDetail = async (req, res) => {
    let id  = req.params.id
    try {
        let postItem = await prisma.post.findFirst(
            {where: {id},
            include: {
                _count: {select: {likes: true}},
                user:{select:{username: true, firstname: true, lastname: true}}
            }
        },
            )
        if (postItem === null) {
            
            return res.status(404).json({details: 'Not found'})
        } else {
            return res.json(postItem).status(200)
        }
        
    } catch (e) {
        console.log(e)
    }
    
}


const replies = async (req, res) => {
    let id = req.params.id

    try {
        let replyQuery = await prisma.post.findFirst(
            {where: {id}, select: {replies: {include: {_count: {select: {likes: true, replies: true}}, user: {select: {firstname: true, lastname: true, username: true}}}}}}
        )
        
        if (replyQuery === null) {
            return res.status(404).json({details: 'Not found'})
        } else {
            return res.json(replyQuery).status(200)
        }
        } catch (e) {
            console.log(e)
        }
        
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


module.exports = {create, home, likeUnlike, reply, postDetail, replies}