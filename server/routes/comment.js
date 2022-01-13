const express = require('express')
const {create, comments, replies} = require('../handlers/comment')
const router = express.Router()



router.get('/', comments)
router.post('/create', create)
router.get('/replies', replies)


module.exports = router