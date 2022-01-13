const {prisma} = require('../prisma/connection')
const {createCommentValidator} = require('../validators/comment') 
const {isAuthorized} = require('../utils')
const _ = require('lodash')


const create = async (req, res) => {
    let isAuth = await isAuthorized(req.headers.authorization)
    if (isAuth === 401) {
        return res.status(401).json({details: 'Unauthorized'})
    }

    const {content, postId, isReplying, replyTo, isReply} = req.body
    const errors = createCommentValidator(req.body)

    if (_.isEmpty(errors)) {


       
        

        try {
            let comment = await prisma.comment.create({
                data: {
                    userId: isAuth.id,
                    content,
                    postId: isReplying === true? null : postId,
                    isReply: isReplying,
                    replyId: isReplying === true? (
                        replyTo
                    ) : null
                },
                include: {_count: {select: {replies: true}}, user: {select: {firstname: true, lastname: true, username: true}}}
            })
            return res.status(201).json(comment)
        } catch (e) {
            console.log(e)
        }
    } else {
        return res.status(400).json(errors)
    }
}


const comments = async (req, res) => {
    
    let postId = req.query.postId
    let cursor = req.query.cursor


    let comments
    if (cursor === 'null') {
        comments = await prisma.comment.findMany({where: {postId, isReply: false},
            take: 5,
            orderBy: {created: 'desc'},
            include: {_count: {select: {replies: true}}, user: {select: {firstname: true, lastname: true, username: true}}}})
        
    }

    else {
        comments = await prisma.comment.findMany({where: {postId, isReply: false},
           
            take: 5,
            skip: 1,
            cursor: {id: cursor},
            orderBy: {created: 'desc'},
            include: {_count: {select: {replies: true}}, user: {select: {firstname: true, lastname: true, username: true}}}})
        
    }
    
    
    if (comments.length === 0) {
        return res.status(404).json({'details': 'No comments available'})
    } else {
        return res.json(comments).status(200)
    }
    
}




const replies = async (req, res) => {
    let commentId = req.query.commentId

    const replies = await prisma.comment.findMany(
        {where: {replyId: commentId}, include: {_count: {select: {replies:true}},user: {select: {firstname: true, lastname: true, username: true}}}}
        )
    
    if (replies.length === 0) {
        return res.status(404).json({'details': 'No comments available'})
    } else {
        return res.json(replies).status(200)
    }

}



module.exports = {create, comments, replies}