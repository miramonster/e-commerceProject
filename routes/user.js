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

router.post('/add-listing', (req, res) => {
    
    const username = req.session.username
    const userId = req.session.userId
    const title = req.body.titleText
    const body = req.body.bodyText
    const category = req.body.categoryText

    const post = models.Product.build({
        title: title,
        body: body,
        category: category,
        user_id: userId
    })
    post.save().then(() => {
        console.log(username)
        res.redirect('/blog/dashboard')
    })

})





module.exports = router