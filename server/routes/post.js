const express = require('express')
const {create, home, likeUnlike, postDetail, reply, replies} = require('../handlers/post')
const router = express.Router()



router.post('/create', create)
router.post('/reply', reply)
router.get('/home', home)
router.get('/:id', postDetail)
router.get('/replies/:id', replies)
router.post('/likeunlike', likeUnlike)




module.exports = router