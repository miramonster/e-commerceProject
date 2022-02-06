const express = require('express')
const router = express.Router()
const models = require('../models')



router.get('/category', (req, res) => {
    res.render('category')
})

router.get('/view-all', (req, res) => {
    models.Product.findAll({
        include: [
            {
                model: models.User,
                as: "user"
            }
        ]
    })
    .then((listings) => {
        res.render('products', {products:listings})
    })
})


router.get('/detail/:productId', (req, res) => {
    const productId = parseInt(req.params.productId)
    console.log(productId)
    models.Product.findByPk(productId, {
        include: [
            {
                model: models.Review,
                as: "reviews",
                include:[{
                    model:models.User,
                    as: "reviewer"
                }]
            },
            {
                model: models.User,
                as: "user"
            }
        ]
    })
    .then((listing) => {
        console.log(listing.dataValues)
        res.render('details', listing.dataValues)
    })
    
})


router.post('/detail/:productId/review', (req, res) => {

    const title = req.body.titleText
    const body = req.body.bodyText
    const userId = req.session.userId
    const productId = parseInt(req.params.productId)

    const review = models.Review.build({
        title: title,
        body: body,
        user_id: userId,
        product_id: productId
    })
    
    review.save().then(() => {
        res.redirect(`/products/detail/${productId}`)
    })

    
})


module.exports = router