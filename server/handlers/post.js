const {prisma } = require('../prisma/connection')
const {isAuthorized} = require('../utils')
const {createPostValidator} = require('../validators/post')
const _ = require('lodash')


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
    let cursor = req.query.cursor

    let posts
    if (cursor.length > 4) {
        posts = await prisma.post.findMany(
            {
                take: 5,
                cursor: {id:  cursor},
                orderBy: {cursorNo: 'asc'},
                include: {likes: {select: {id: true}}}}
        )
    }
    
    else {
        posts = await prisma.post.findMany(
            {
                take: 5,
                orderBy: {cursorNo: 'asc'},
                include: {likes: {select: {id: true}}}}
        )
    }

    if (posts.length === 1) {
        return res.status(404).json({'details': 'fucked up'})
    }

    return res.json(posts).status(200)
}


module.exports = {create, home}