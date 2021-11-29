const express = require('express')
const {create, home} = require('../handlers/post')
const router = express.Router()



router.post('/create', create)
router.get('/home', home)




module.exports = router