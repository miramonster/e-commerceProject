const express = require('express')
const { Sequelize } = require('../models')
const router = express.Router()
const models = require('../models')

function calculateAvgRating(array) {

    const totalRating = array.reduce((average, array) => average + array.rating, 0)
    const avgRating = totalRating/array.length
    return avgRating

}

router.get('/category', (req, res) => {
    res.render('category')
})

router.get('/category/:category', (req, res) => {
    const category = req.params.category
    models.Product.findAll({
        include: [
            {
                model: models.User,
                as: "user",
            },
            {
                model: models.Review,
                as: "reviews",
            }
        ],
        where: [
            {
                category: category
            }
        ]
    })
    .then((listings) => {
        const editedListings = listings.map((product) => {
            const reviews = product.dataValues.reviews
            product.dataValues.avg_rating = calculateAvgRating(reviews).toFixed(2)
            return product.dataValues
        })
        // const categories = editedListings.map((listing) => {
        //    return listing.category
        // })
        console.log(category)
        res.render('products', {products: editedListings, category: category})
    })
})

// Start - Sorting By Price/Ratings
router.get('/category/:category/price-desc', (req, res) => {
    const category = req.params.category
    models.Product.findAll({
        include: [
            {
                model: models.User,
                as: "user",
            },
            {
                model: models.Review,
                as: "reviews",
            }
        ],
        where: [
            {
                category: category
            }
        ],
        order:[
            ['price', 'DESC']
        ]
    })
    .then((listings) => {
        const editedListings = listings.map((product) => {
            const reviews = product.dataValues.reviews
            product.dataValues.avg_rating = calculateAvgRating(reviews).toFixed(2)
            return product.dataValues
        })

        res.render('products', {products: editedListings, category: category})
    })
    
})

router.get('/category/:category/price-aesc', (req, res) => {
    const category = req.params.category
    models.Product.findAll({
        include: [
            {
                model: models.User,
                as: "user",
            },
            {
                model: models.Review,
                as: "reviews",
            }
        ],
        where: [
            {
                category: category
            }
        ],
        order:[
            ['price', 'ASC']
        ]
    })
    .then((listings) => {
        const editedListings = listings.map((product) => {
            const reviews = product.dataValues.reviews
            product.dataValues.avg_rating = calculateAvgRating(reviews).toFixed(2)
            return product.dataValues
        })
        // Page will not render category if removed from params
        res.render('products', {products: editedListings, category: category})
    })
    
})

router.get('/category/:category/rating', (req, res) => {
    const category = req.params.category
    models.Product.findAll({
        include: [
            {
                model: models.User,
                as: "user",
            },
            {
                model: models.Review,
                as: "reviews",
            }
        ],
        where: [
            {
                category: category
            }
        ],
        order:[
            ['reviews', 'rating', 'DESC']
        ]
    })
    .then((listings) => {
        const editedListings = listings.map((product) => {
            const reviews = product.dataValues.reviews
            product.dataValues.avg_rating = calculateAvgRating(reviews).toFixed(2)
            return product.dataValues
        })

        res.render('products', {products: editedListings})
    })
    
})
// End - Sorting By Price/Ratings

router.get('/view-all', (req, res) => {
    models.Product.findAll({
        include: [
            {
                model: models.User,
                as: "user",
            },
            {
                model: models.Review,
                as: "reviews",
            }
        ]
    })
    .then((listings) => {
        const editedListings = listings.map((product) => {
            const reviews = product.dataValues.reviews
            product.dataValues.avg_rating = calculateAvgRating(reviews).toFixed(2)
            return product.dataValues
        })

        res.render('products', {products: editedListings})
    })
})

// Fetching 1 Product, displaying the details
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
                    as: "reviewer",
                }]
            },
            {
                model: models.User,
                as: "user",
            }
        ]
    })
    .then((listing) => {
        // Calculating Average Rating
        const reviews = listing.dataValues.reviews
        listing.dataValues.avgRating = calculateAvgRating(reviews).toFixed(2)
        listing.dataValues.reviewAmt = reviews.length
        res.render('details', listing.dataValues)
    })
    
})


router.post('/detail/:productId/review', (req, res) => {

    const title = req.body.titleText
    const body = req.body.bodyText
    const userId = req.session.userId
    const productId = parseInt(req.params.productId)
    const rating = parseInt(req.body.reviewValue)

    const review = models.Review.build({
        title: title,
        body: body,
        user_id: userId,
        product_id: productId,
        rating: rating
    })
    
    review.save().then(() => {
        res.redirect(`/products/detail/${productId}`)
    })

    
})


module.exports = router