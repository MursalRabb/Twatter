const express = require('express')
const {create, home, likeUnlike} = require('../handlers/post')
const router = express.Router()



router.post('/create', create)
router.get('/home', home)
router.post('/likeunlike', likeUnlike)




module.exports = router