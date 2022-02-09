const express = require('express')
const router = express.Router()
const models = require('../models')
const bcrypt = require('bcrypt')
const formidable = require('formidable')
const res = require('express/lib/response')
const{v4: uuidv4} = require('uuid')

function authenticateMiddleware(req, res, next) {
    if(req.session) {
        if(req.session.user) {
            // send the user to their original request
            next()
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
}


router.get('/dashboard/add-listing', (req,res) => {
    res.render('add-listing')
})

router.get('/dashboard', authenticateMiddleware, (req, res) => {
    const userId = req.session.userId
    models.Product.findAll({
        where: {
            user_id: userId
        },
        include: [
            {
                model: models.User,
                as: "user"
            }
        ]

    })
    .then((listing) => {

        res.render('user-dashboard',{userListings:listing})
    
    })
})

router.get('/dashboard/reviews', authenticateMiddleware, (req, res) => {
    const userId = req.session.userId
    models.Review.findAll({
        where: {
            user_id: userId
        },
        include: [
            {
                model: models.User,
                as: "reviewer"
            }
        ]

    })
    .then((review) => {
        res.render('reviews',{userReviews:review})
    })
})

router.post('/add-listing', (req, res) => {
    
    const userId = req.session.userId
    const title = req.body.titleText
    const description = req.body.descriptionText
    const price = req.body.priceText
    const category = req.body.categoryText

    const product = models.Product.build({
        title: title,
        description: description,
        price: price,
        category: category,
        user_id: userId,
        image: uniqueFilename
    })
    product.save().then(() => {
        res.redirect('/user/dashboard')
    })

})

function uploadFile(req, callback) {

    new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
        uniqueFilename = `${uuidv4()}.${file.name.split('.').pop()}`
        file.name = uniqueFilename
        file.path = __basedir + '/static/uploads/' + file.name
    })
    .on('file', (name, file) => {
        callback(file.name)
    })
}

router.post('/upload', (req, res) => {
    uploadFile(req, (photoURL) => {
        photoURL = `/uploads/${photoURL}`
        res.render('add-listing', {imageURL:photoURL, className:'product-preview-image'})
    })
})

router.post('/listing/delete/:listingId', (req, res) => {
    const listingId = req.params.listingId
    models.Product.destroy({
        where: {
            id : listingId
        }
    }).then(() => {
        res.redirect('/user/dashboard')
    })
})



module.exports = router