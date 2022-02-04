const express = require('express')
const router = express.Router()
const models = require('../models')
const bcrypt = require('bcrypt')

function authenticateMiddleware(req, res, next) {
    if(req.session) {
        if(req.session.user) {
            // send the user to their original request
            next()
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }
}



router.get('/dashboard', authenticateMiddleware, (req, res) => {
    const username = req.session.username
    models.User.findOne({
        where: {
            username: username
        }

    })
    .then((user) => {
        res.render('user-dashboard',{userInfo:user})
    })
})





module.exports = router