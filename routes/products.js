const express = require('express')
const { Sequelize } = require('../models')
const router = express.Router()
const models = require('../models')



function calculateAvgRating(array) {

    const totalRating = array.reduce((average, array) => average + array.rating, 0)
    let avgRating = totalRating/array.length
    if (isNaN(avgRating)) {
        return 0
    } else {
        return avgRating
    }
}
// Average rating appears as 0 but does not get sorted correctly

router.get('/category', (req, res) => {
    if(req.session.user) {
        res.render('category', {log:'Logout'})
    } else {
        res.render('category', {log:'Login'})
    }
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
            product.dataValues.reviewAmt = reviews.length
            return product.dataValues
        })
        // const categories = editedListings.map((listing) => {
        //    return listing.category
        // })
        console.log(category)
 
        if(req.session.user){
            res.render('products', {products: editedListings, category: category, log:'Logout'})
        } else {
            res.render('products', {products: editedListings, category: category, log:'Login'})
        }
    })
})

// Start - Sorting By Price/Ratings *******************************
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
            product.dataValues.reviewAmt = reviews.length
            return product.dataValues
        })

        if(req.session.user){
            res.render('products', {products: editedListings, category: category, log:'Logout'})
        } else {
            res.render('products', {products: editedListings, category: category, log:'Login'})
        }
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
            product.dataValues.reviewAmt = reviews.length
            return product.dataValues
        })
        // Page will not render category if removed from params
        if(req.session.user){
            res.render('products', {products: editedListings, category: category, log:'Logout'})
        } else {
            res.render('products', {products: editedListings, category: category, log:'Login'})
        }
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
            product.dataValues.reviewAmt = reviews.length
            return product.dataValues
        })

        if(req.session.user){
            res.render('products', {products: editedListings, category: category, log:'Logout'})
        } else {
            res.render('products', {products: editedListings, category: category, log:'Login'})
        }

    })
    
})

router.get('/view-all/price-desc', (req, res) => {
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
        order:[
            ['price', 'DESC']
        ]
    })
    .then((listings) => {
        const editedListings = listings.map((product) => {
            const reviews = product.dataValues.reviews
            product.dataValues.avg_rating = calculateAvgRating(reviews).toFixed(2)
            product.dataValues.reviewAmt = reviews.length
            return product.dataValues
        })

        if(req.session.user){
            res.render('all-products', {products: editedListings, log:'Logout'})
        } else {
            res.render('all-products', {products: editedListings, log:'Login'})
        }
    })
    
})

router.get('/view-all/price-aesc', (req, res) => {
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
        order:[
            ['price', 'ASC']
        ]
    })
    .then((listings) => {
        const editedListings = listings.map((product) => {
            const reviews = product.dataValues.reviews
            product.dataValues.avg_rating = calculateAvgRating(reviews).toFixed(2)
            product.dataValues.reviewAmt = reviews.length
            return product.dataValues
        })
        // Page will not render category if removed from params
        if(req.session.user){
            res.render('all-products', {products: editedListings, log:'Logout'})
        } else {
            res.render('all-products', {products: editedListings, log:'Login'})
        }
    })
    
})

router.get('/view-all/rating', (req, res) => {
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
        order:[
            ['reviews', 'rating', 'DESC NULLS LAST']
        ]
    })
    .then((listings) => {
        const editedListings = listings.map((product) => {
            const reviews = product.dataValues.reviews
            product.dataValues.avg_rating = calculateAvgRating(reviews).toFixed(2)
            product.dataValues.reviewAmt = reviews.length
            return product.dataValues
        })

        if(req.session.user){
            res.render('all-products', {products: editedListings, log:'Logout'})
        } else {
            res.render('all-products', {products: editedListings, log:'Login'})
        }

    })
    
})
// End - Sorting By Price/Ratings *******************************

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
            product.dataValues.reviewAmt = reviews.length
            return product.dataValues
            
        })

        if (req.session.user) {
            res.render('all-products', {products: editedListings, log:"Logout"})
        } else {
            res.render('all-products', {products: editedListings, log:"Login"})
        }

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